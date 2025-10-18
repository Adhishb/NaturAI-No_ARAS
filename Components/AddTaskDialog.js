import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { base44 } from "@/api/base44Client";
import { Loader2, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

const taskTypes = ["watering", "fertilizing", "pruning", "harvesting", "sunlight_check", "repotting"];

export default function AddTaskDialog({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [generatingSchedule, setGeneratingSchedule] = useState(false);
  const [formData, setFormData] = useState({
    plant_name: '',
    user_plant_id: '',
    task_type: '',
    scheduled_date: '',
    notes: '',
    recurring: false,
    recurrence_days: 7,
  });

  const { data: userPlants } = useQuery({
    queryKey: ['userPlantsForTask'],
    queryFn: () => base44.entities.UserPlant.list(),
    initialData: [],
    enabled: open,
  });

  const { data: plantLibrary } = useQuery({
    queryKey: ['plantLibraryForSchedule'],
    queryFn: () => base44.entities.Plant.list(),
    initialData: [],
    enabled: open,
  });

  const handleGenerateSchedule = async () => {
    if (!formData.user_plant_id) {
      alert('Please select a plant first');
      return;
    }

    setGeneratingSchedule(true);
    try {
      const selectedPlant = userPlants.find(p => p.id === formData.user_plant_id);
      const plantInfo = plantLibrary.find(p => 
        p.name.toLowerCase().includes(selectedPlant?.plant_name.toLowerCase()) ||
        selectedPlant?.plant_name.toLowerCase().includes(p.name.toLowerCase())
      );

      const prompt = `Create a complete care schedule for a ${selectedPlant?.plant_name} (${selectedPlant?.plant_category}). 
      
Plant details:
- Location: ${selectedPlant?.location || 'Not specified'}
- Planted date: ${selectedPlant?.planted_date || 'Unknown'}
${plantInfo ? `
- Care difficulty: ${plantInfo.care_difficulty}
- Sunlight needs: ${plantInfo.sunlight_needs}
- Water frequency: ${plantInfo.water_frequency}
- Growth season: ${plantInfo.growth_season}
` : ''}

Generate a personalized care schedule for the next 3 months. Include:
- Watering schedule (with frequency)
- Fertilizing recommendations
- Pruning if needed
- Harvesting dates if applicable
- Any seasonal care tips

Provide dates starting from today (${format(new Date(), 'yyyy-MM-dd')}).`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  task_type: { type: "string", enum: taskTypes },
                  scheduled_date: { type: "string" },
                  notes: { type: "string" },
                  recurring: { type: "boolean" },
                  recurrence_days: { type: "number" }
                }
              }
            }
          }
        }
      });

      if (response.tasks && response.tasks.length > 0) {
        // Create all tasks
        for (const task of response.tasks) {
          await base44.entities.CareSchedule.create({
            user_plant_id: formData.user_plant_id,
            plant_name: selectedPlant.plant_name,
            ...task,
          });
        }
        
        alert(`Successfully created ${response.tasks.length} care tasks for ${selectedPlant.plant_name}!`);
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error generating schedule:', error);
      alert('Could not generate schedule. Please create tasks manually.');
    }
    setGeneratingSchedule(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.entities.CareSchedule.create(formData);
      onSuccess();
      onClose();
      setFormData({
        plant_name: '',
        user_plant_id: '',
        task_type: '',
        scheduled_date: '',
        notes: '',
        recurring: false,
        recurrence_days: 7,
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Care Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Select Plant</Label>
            <Select
              value={formData.user_plant_id}
              onValueChange={(value) => {
                const plant = userPlants.find(p => p.id === value);
                setFormData({
                  ...formData,
                  user_plant_id: value,
                  plant_name: plant?.plant_name || '',
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a plant" />
              </SelectTrigger>
              <SelectContent>
                {userPlants.map(plant => (
                  <SelectItem key={plant.id} value={plant.id}>
                    {plant.plant_name} ({plant.plant_category || 'Plant'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.user_plant_id && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-green-700 hover:text-green-800 hover:bg-green-100"
                  onClick={handleGenerateSchedule}
                  disabled={generatingSchedule}
                >
                  {generatingSchedule ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating AI care schedule...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Care Schedule
                    </>
                  )}
                </Button>
                <p className="text-xs text-green-600 text-center mt-1">
                  Let AI create a complete care schedule for this plant
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or add manually</span>
            </div>
          </div>

          <div>
            <Label>Task Type *</Label>
            <Select
              value={formData.task_type}
              onValueChange={(value) => setFormData({...formData, task_type: value})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                {taskTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, ' ').charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Scheduled Date *</Label>
            <Input
              type="date"
              value={formData.scheduled_date}
              onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              checked={formData.recurring}
              onCheckedChange={(checked) => setFormData({...formData, recurring: checked})}
            />
            <Label htmlFor="recurring" className="text-sm font-normal">
              Recurring task
            </Label>
          </div>

          {formData.recurring && (
            <div>
              <Label>Repeat every (days)</Label>
              <Input
                type="number"
                min="1"
                value={formData.recurrence_days}
                onChange={(e) => setFormData({...formData, recurrence_days: parseInt(e.target.value)})}
              />
            </div>
          )}

          <div>
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
