import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from "date-fns";
import { CheckCircle2, Circle, Droplets, Sun, Scissors, Calendar as CalendarIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Task metadata
const taskIcons = {
  watering: Droplets,
  fertilizing: Sun,
  pruning: Scissors,
  harvesting: CalendarIcon,
  sunlight_check: Sun,
  repotting: CalendarIcon,
};

const taskColors = {
  watering: "bg-blue-100 text-blue-800 border-blue-200",
  fertilizing: "bg-green-100 text-green-800 border-green-200",
  pruning: "bg-purple-100 text-purple-800 border-purple-200",
  harvesting: "bg-orange-100 text-orange-800 border-orange-200",
  sunlight_check: "bg-yellow-100 text-yellow-800 border-yellow-200",
  repotting: "bg-pink-100 text-pink-800 border-pink-200",
};

const taskLabels = {
  watering: "Water",
  fertilizing: "Fertilize",
  pruning: "Prune",
  harvesting: "Harvest",
  sunlight_check: "Sun Check",
  repotting: "Repot",
};

export default function TaskCalendar({ tasks, onUpdate }) {
  const [currentMonth] = React.useState(new Date());

  // Days in month + empty slots
  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const emptyDays = Array(getDay(startOfMonth(currentMonth))).fill(null);

  const getTasksForDay = (day) => tasks.filter(task => isSameDay(new Date(task.scheduled_date), day));

  const handleToggleComplete = async (task) => {
    await base44.entities.CareSchedule.update(task.id, {
      ...task,
      completed: !task.completed,
      completed_date: !task.completed ? format(new Date(), 'yyyy-MM-dd') : null,
    });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <Card className="bg-white p-4 shadow-sm border-green-100">
        <h3 className="font-semibold mb-3 text-gray-900">Task Types</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(taskLabels).map(([type, label]) => {
            const Icon = taskIcons[type];
            return (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${taskColors[type]} border`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
        <h2 className="text-xl font-bold mb-4">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {emptyDays.map((_, i) => <div key={`empty-${i}`} className="min-h-24" />)}
          {days.map(day => {
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());
            return (
              <Card key={day.toISOString()} className={`min-h-24 ${isToday ? 'ring-2 ring-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                <CardContent className="p-2">
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-green-600' : 'text-gray-700'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0,3).map(task => {
                      const Icon = taskIcons[task.task_type];
                      return (
                        <div key={task.id} className={`text-xs px-1.5 py-1 rounded flex items-center gap-1 ${taskColors[task.task_type]} border ${task.completed ? 'opacity-50' : ''}`}
                             title={`${taskLabels[task.task_type]}: ${task.plant_name}`}>
                          <Icon className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate flex-1">{task.plant_name}</span>
                          {task.completed && <CheckCircle2 className="w-3 h-3 flex-shrink-0" />}
                        </div>
                      );
                    })}
                    {dayTasks.length > 3 && <div className="text-xs text-gray-500 px-1.5">+{dayTasks.length-3} more</div>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upcoming Tasks List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
        <h2 className="text-xl font-bold mb-4">All Upcoming Tasks</h2>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No scheduled tasks</p>
          ) : (
            tasks.map(task => {
              const Icon = taskIcons[task.task_type];
              return (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <Button size="sm" variant="ghost" onClick={() => handleToggleComplete(task)}
                            className={task.completed ? "text-green-600" : "text-gray-400"}>
                      {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </Button>

                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${taskColors[task.task_type]} border`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.plant_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(task.scheduled_date), 'MMM d, yyyy')} • {taskLabels[task.task_type]}
                      </p>
                      {task.notes && <p className="text-xs text-gray-400 mt-1">{task.notes}</p>}
                    </div>

                    <Badge className={`${taskColors[task.task_type]} border`}>{taskLabels[task.task_type]}</Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
