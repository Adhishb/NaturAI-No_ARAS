import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { Loader2, Upload, Camera } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";

const healthStatuses = ["excellent", "good", "fair", "poor"];

export default function AddCheckDialog({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    user_plant_id: '',
    plant_name: '',
    health_status: 'good',
    check_date: new Date().toISOString().split('T')[0],
    image_url: '',
    issues_detected: [],
    recommendations: '',
    notes: '',
  });

  const { data: userPlants } = useQuery({
    queryKey: ['userPlantsForCheck'],
    queryFn: () => base44.entities.UserPlant.list(),
    initialData: [],
    enabled: open,
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({...formData, image_url: file_url});
      
      // Auto-analyze the image
      await analyzeImage(file_url);
    } catch (error) {
      console.error('Upload error:', error);
    }
    setUploading(false);
  };

  const analyzeImage = async (imageUrl) => {
    setAnalyzing(true);
    try {
      const prompt = `Analyze this plant photo and provide a detailed health assessment. Include:
1. Overall health status (excellent, good, fair, or poor)
2. Any visible issues (pests, diseases, nutrient deficiencies, etc.)
3. Specific care recommendations based on what you see
4. Any signs of stress or problems

Be specific and helpful for a home gardener.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        file_urls: [imageUrl],
        response_json_schema: {
          type: "object",
          properties: {
            health_status: {
              type: "string",
              enum: ["excellent", "good", "fair", "poor"]
            },
            issues_detected: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "string"
            },
            detailed_analysis: {
              type: "string"
            }
          }
        }
      });

      setFormData(prev => ({
        ...prev,
        health_status: response.health_status || 'good',
        issues_detected: response.issues_detected || [],
        recommendations: response.recommendations || '',
        notes: response.detailed_analysis || '',
      }));
    } catch (error) {
      console.error('Analysis error:', error);
    }
    setAnalyzing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.entities.HealthCheck.create(formData);
      
      // Update the user plant's health status
      if (formData.user_plant_id) {
        const plant = userPlants.find(p => p.id === formData.user_plant_id);
        if (plant) {
          await base44.entities.UserPlant.update(formData.user_plant_id, {
            ...plant,
            health_status: formData.health_status,
          });
        }
      }
      
      onSuccess();
      onClose();
      setFormData({
        user_plant_id: '',
        plant_name: '',
        health_status: 'good',
        check_date: new Date().toISOString().split('T')[0],
        image_url: '',
        issues_detected: [],
        recommendations: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding check:', error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            AI Health Check
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Select Plant *</Label>
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
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a plant" />
              </SelectTrigger>
              <SelectContent>
                {userPlants.map(plant => (
                  <SelectItem key={plant.id} value={plant.id}>
                    {plant.plant_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Upload Photo *</Label>
            <p className="text-sm text-gray-500 mb-2">AI will analyze your plant's health</p>
            <div className="mt-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="health-image"
                required={!formData.image_url}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('health-image')?.click()}
                disabled={uploading || analyzing}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    AI Analyzing Photo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {formData.image_url ? 'Change Photo' : 'Upload Photo'}
                  </>
                )}
              </Button>
              {formData.image_url && (
                <img 
                  src={formData.image_url} 
                  alt="Plant preview" 
                  className="mt-3 rounded-lg max-h-48 object-cover w-full"
                />
              )}
            </div>
          </div>

          {analyzing && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                Our AI is analyzing your plant's health... This may take a few moments.
              </AlertDescription>
            </Alert>
          )}

          {formData.recommendations && !analyzing && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription>
                <p className="font-semibold text-green-800 mb-2">AI Analysis Complete!</p>
                <p className="text-sm text-green-700">{formData.recommendations}</p>
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label>Health Status</Label>
            <Select
              value={formData.health_status}
              onValueChange={(value) => setFormData({...formData, health_status: value})}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {healthStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.issues_detected.length > 0 && (
            <div>
              <Label>Issues Detected</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.issues_detected.map((issue, idx) => (
                  <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    {issue}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label>Additional Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional observations..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.image_url} 
              className="bg-green-600 hover:bg-green-700"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Health Check
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
