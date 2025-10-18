import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, AlertCircle, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";

import TaskCalendar from "../components/calendar/TaskCalendar";
import AddTaskDialog from "../components/calendar/AddTaskDialog";

export default function Calendar() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [taskType, setTaskType] = useState("all");
  const [generatingSchedules, setGeneratingSchedules] = useState(false);

  const { data: schedules, refetch } = useQuery({
    queryKey: ['careSchedules'],
    queryFn: () => base44.entities.CareSchedule.list("-scheduled_date"),
    initialData: [],
  });

  const { data: userPlants, refetch: refetchPlants } = useQuery({
    queryKey: ['userPlantsForCalendar'],
    queryFn: () => base44.entities.UserPlant.list(),
    initialData: [],
  });

  const { data: plantLibrary } = useQuery({
    queryKey: ['plantLibraryForSchedule'],
    queryFn: () => base44.entities.Plant.list(),
    initialData: [],
  });

  const filteredSchedules = taskType === "all"
    ? schedules
    : schedules.filter(s => s.task_type === taskType);

  const handleGenerateAllSchedules = async () => {
    if (userPlants.length === 0) return;
    setGeneratingSchedules(true);

    try {
      for (const userPlant of userPlants) {
        const existingSchedules = schedules.filter(s => s.user_plant_id === userPlant.id);
        if (existingSchedules.length > 0) continue;

        const plantInfo = plantLibrary.find(p => 
          p.name.toLowerCase().includes(userPlant.plant_name.toLowerCase()) ||
          userPlant.plant_name.toLowerCase().includes(p.name.toLowerCase())
        );

        const prompt = `Create a detailed 3-month care schedule for ${userPlant.plant_name} (${userPlant.plant_category || 'plant'}).

Plant details:
- Location: ${userPlant.location || 'Not specified'}
- Planted: ${userPlant.planted_date || 'Recently'}
${plantInfo ? `
- Water frequency: ${plantInfo.water_frequency}
- Sunlight needs: ${plantInfo.sunlight_needs}
- Growth season: ${plantInfo.growth_season || 'Year-round'}
- Harvest time: ${plantInfo.harvest_time || 'N/A'}
` : ''}

Generate a complete care schedule with SPECIFIC DATES starting from today (${format(new Date(), 'yyyy-MM-dd')}).`;

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
                    task_type: { type: "string" },
                    scheduled_date: { type: "string" },
                    notes: { type: "string" },
                    recurring: { type: "boolean" },
                    recurrence_days: { type: "number" }
                  },
                  required: ["task_type", "scheduled_date"]
                }
              }
            }
          }
        });

        if (response.tasks && response.tasks.length > 0) {
          for (const task of response.tasks) {
            await base44.entities.CareSchedule.create({
              user_plant_id: userPlant.id,
              plant_name: userPlant.plant_name,
              ...task,
            });
          }

          const wateringTasks = response.tasks.filter(t => t.task_type === "watering");
          if (wateringTasks.length > 0) {
            await base44.entities.UserPlant.update(userPlant.id, {
              ...userPlant,
              next_watering: wateringTasks[0].scheduled_date,
            });
          }
        }
      }

      await refetch();
      await refetchPlants();
      alert(`Successfully generated care schedules for ${userPlants.length} plants!`);
    } catch (error) {
      console.error('Error generating schedules:', error);
      alert('Error generating schedules. Please try again.');
    }

    setGeneratingSchedules(false);
  };

  return (
    <div>
      {/* React UI elements like TaskCalendar, Tabs, and AddTaskDialog */}
    </div>
  );
}

