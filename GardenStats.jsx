// GardenStats.jsx

import React from 'react';
import { Card } from "@/components/ui/card";

const colorClasses = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  cyan: "from-cyan-500 to-cyan-600",
  orange: "from-orange-500 to-orange-600",
  purple: "from-purple-500 to-purple-600",
};

export default function GardenStats({ title, value, icon: Icon, color = "green" }) {
  return (
    <Card className="bg-white p-6 shadow-sm border-green-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}
