import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, Sun, Droplets } from "lucide-react";
import PlantDetailsDialog from "./PlantDetailsDialog";

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

export default function PlantGrid({ plants, isLoading }) {
  const [selectedPlant, setSelectedPlant] = useState(null);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">No plants found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <Card
            key={plant.id}
            className="overflow-hidden hover:shadow-xl transition-all cursor-pointer bg-white border-green-100 hover:border-green-300"
            onClick={() => setSelectedPlant(plant)}
          >
            <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-200 relative">
              {plant.image_url ? (
                <img src={plant.image_url} alt={plant.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf className="w-16 h-16 text-green-500 opacity-50" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-1 text-gray-900">{plant.name}</h3>
              {plant.scientific_name && (
                <p className="text-sm text-gray-500 italic mb-2">{plant.scientific_name}</p>
              )}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {plant.description || "A wonderful plant for your garden"}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {plant.care_difficulty && (
                  <Badge className={difficultyColors[plant.care_difficulty]}>
                    {plant.care_difficulty}
                  </Badge>
                )}
                {plant.category && (
                  <Badge variant="outline" className="border-gray-200">
                    {plant.category}
                  </Badge>
                )}
              </div>

              <div className="flex gap-4 text-sm text-gray-600">
                {plant.sunlight_needs && (
                  <div className="flex items-center gap-1">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    <span className="capitalize">{plant.sunlight_needs.replace(/_/g, " ")}</span>
                  </div>
                )}
                {plant.water_frequency && (
                  <div className="flex items-center gap-1">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="capitalize">{plant.water_frequency.replace(/_/g, " ")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PlantDetailsDialog
        plant={selectedPlant}
        open={!!selectedPlant}
        onClose={() => setSelectedPlant(null)}
      />
    </>
  );
}
