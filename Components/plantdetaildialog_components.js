import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Droplets, Thermometer, Sprout, Calendar, Plus, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

export default function PlantDetailsDialog({ plant, open, onClose }) {
  const [adding, setAdding] = useState(false);
  const queryClient = useQueryClient();

  if (!plant) return null;

  const handleAddToGarden = async () => {
    setAdding(true);
    try {
      await base44.entities.UserPlant.create({
        plant_id: plant.id,
        plant_name: plant.name,
        plant_category: plant.category,
        planted_date: new Date().toISOString().split('T')[0],
        health_status: 'good',
      });
      
      await queryClient.invalidateQueries({ queryKey: ['userPlants'] });
      
      alert(`${plant.name} has been added to your garden!`);
      onClose();
    } catch (error) {
      console.error('Error adding plant:', error);
      alert('Failed to add plant to garden. Please try again.');
    }
    setAdding(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{plant.name}</DialogTitle>
          {plant.scientific_name && (
            <p className="text-sm text-gray-500 italic">{plant.scientific_name}</p>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {plant.image_url && (
            <img 
              src={plant.image_url} 
              alt={plant.name} 
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          <div>
            <h3 className="font-semibold text-lg mb-2">About</h3>
            <p className="text-gray-700">{plant.description || 'A beautiful plant perfect for your garden.'}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-5 h-5 text-yellow-500" />
                <h4 className="font-semibold">Sunlight</h4>
              </div>
              <p className="text-gray-700 capitalize">
                {plant.sunlight_needs?.replace(/_/g, ' ') || 'Not specified'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold">Water</h4>
              </div>
              <p className="text-gray-700 capitalize">
                {plant.water_frequency?.replace(/_/g, ' ') || 'Not specified'}
              </p>
            </div>

            {plant.ideal_temperature && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold">Temperature</h4>
                </div>
                <p className="text-gray-700">{plant.ideal_temperature}</p>
              </div>
            )}

            {plant.soil_type && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sprout className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold">Soil</h4>
                </div>
                <p className="text-gray-700">{plant.soil_type}</p>
              </div>
            )}

            {plant.growth_season && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold">Growing Season</h4>
                </div>
                <p className="text-gray-700">{plant.growth_season}</p>
              </div>
            )}

            {plant.harvest_time && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <h4 className="font-semibold">Harvest Time</h4>
                </div>
                <p className="text-gray-700">{plant.harvest_time}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {plant.care_difficulty && (
              <Badge className={difficultyColors[plant.care_difficulty]}>
                {plant.care_difficulty} to grow
              </Badge>
            )}
            {plant.category && (
              <Badge variant="outline" className="border-gray-300">
                {plant.category}
              </Badge>
            )}
          </div>

          {plant.characteristics && plant.characteristics.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Characteristics</h3>
              <div className="flex flex-wrap gap-2">
                {plant.characteristics.map((char, idx) => (
                  <Badge key={idx} variant="secondary">
                    {char}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {plant.benefits && plant.benefits.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Benefits</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {plant.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={handleAddToGarden}
              disabled={adding}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {adding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to My Garden
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
