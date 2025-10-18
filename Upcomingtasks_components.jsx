import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Droplets, Sun, Scissors, Calendar, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";

const taskIcons = {
  watering: Droplets,
  fertilizing: Sun,
  pruning: Scissors,
  harvesting: Calendar,
  sunlight_check: Sun,
  repotting: Calendar,
};

const taskColors = {
  watering: "text-blue-500",
  fertilizing: "text-green-500",
  pruning: "text-purple-500",
  harvesting: "text-orange-500",
  sunlight_check: "text-yellow-500",
  repotting: "text-pink-500",
};

export default function UpcomingTasks({ tasks }) {
  const queryClient = useQueryClient();

  const handleComplete = async (task) => {
    await base44.entities.CareSchedule.update(task.id, {
      ...task,
      completed: true,
      completed_date: format(new Date(), 'yyyy-MM-dd'),
    });
    queryClient.invalidateQueries({ queryKey: ['upcomingTasks'] });
  };

  return (
    <Card className="bg-white shadow-sm border-green-100">
      <CardHeader className="border-b border-green-100">
        <CardTitle className="text-lg font-bold">Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming tasks</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const Icon = taskIcons[task.task_type] || Calendar;
              return (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg bg-white ${taskColors[task.task_type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{task.plant_name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {task.task_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(task.scheduled_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleComplete(task)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
