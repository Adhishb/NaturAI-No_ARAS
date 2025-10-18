// PlantCard.jsx

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Sun, Calendar, MoreVertical, Loader2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { base44 } from "@/api/base44Client";

const healthColors = {
  excellent: "bg-green-100 text-green-800 border-green-200",
  good: "bg-blue-100 text-blue-800 border-blue-200",
  fair: "bg-yellow-100 text-yellow-800 border-yellow-200",
  poor: "bg-red-100 text-red-800 border-red-200",
};

export default function PlantCard({ plant, onUpdate }) {
  const [watering, setWatering] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  
  const daysPlanted = plant.planted_date 
    ? differenceInDays(new Date(), new Date(plant.planted_date))
    : 0;

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${plant.plant_name}?`)) {
      return;
    }
    
    setDeleting(true);
    try {
      await base44.entities.UserPlant.delete(plant.id);
      await onUpdate();
    } catch (error) {
      console.error('Error deleting plant:', error);
      alert('Failed to delete plant. Please try again.');
    }
    setDeleting(false);
  };

  const handleWater = async () => {
    setWatering(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      await base44.entities.UserPlant.update(plant.id, {
        ...plant,
        last_watered: today,
      });
      await onUpdate();
    } catch (error) {
      console.error('Error watering plant:', error);
      alert('Failed to update watering. Please try again.');
    }
    setWatering(false);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-green-100">
      <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-200 relative overflow-hidden">
        {plant.image_url ? (
          <img src={plant.image_url} alt={plant.plant_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sun className="w-16 h-16 text-green-500 opacity-50" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full bg-white/90 backdrop-blur">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600" disabled={deleting}>
                {deleting ? 'Removing...' : 'Remove Plant'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{plant.plant_name}</h3>
            {plant.plant_category && (
              <p className="text-sm text-gray-500 capitalize">{plant.plant_category}</p>
            )}
          </div>
          <Badge className={`${healthColors[plant.health_status || 'good']} border`}>
            {plant.health_status || 'good'}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {plant.last_watered && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>Watered {format(new Date(plant.last_watered), 'MMM d')}</span>
            </div>
          )}
          {plant.planted_date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-green-500" />
              <span>{daysPlanted} days growing</span>
            </div>
          )}
          {plant.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sun className="w-4 h-4 text-yellow-500" />
              <span>{plant.location}</span>
            </div>
          )}
        </div>

        <Button 
          onClick={handleWater} 
          className="w-full bg-blue-500 hover:bg-blue-600"
          size="sm"
          disabled={watering}
        >
          {watering ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Watering...
            </>
          ) : (
            <>
              <Droplets className="w-4 h-4 mr-2" />
              Water Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
