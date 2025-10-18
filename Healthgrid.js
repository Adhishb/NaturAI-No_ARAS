import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Leaf } from "lucide-react";

const healthColors = {
  excellent: "bg-green-100 text-green-800 border-green-200",
  good: "bg-blue-100 text-blue-800 border-blue-200",
  fair: "bg-yellow-100 text-yellow-800 border-yellow-200",
  poor: "bg-red-100 text-red-800 border-red-200",
};

export default function HealthGrid({ checks }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {checks.map(check => (
        <Card key={check.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-green-100">
          <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-200 relative">
            {check.image_url ? (
              <img src={check.image_url} alt={check.plant_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Leaf className="w-16 h-16 text-green-500 opacity-50" />
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{check.plant_name}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(check.check_date), 'MMM d, yyyy')}
                </p>
              </div>
              <Badge className={`${healthColors[check.health_status]} border`}>
                {check.health_status}
              </Badge>
            </div>

            {check.issues_detected && check.issues_detected.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Issues:</p>
                <div className="flex flex-wrap gap-1">
                  {check.issues_detected.map((issue, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {issue}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {check.recommendations && (
              <p className="text-sm text-gray-600 line-clamp-3">{check.recommendations}</p>
            )}

            {check.notes && (
              <p className="text-sm text-gray-500 mt-2 italic">{check.notes}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
