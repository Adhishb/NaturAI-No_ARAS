import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FilterDialog({ open, onClose, filters, setFilters }) {
  const handleReset = () => {
    setFilters({});
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Plants</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Care Difficulty</Label>
            <Select
              value={filters.difficulty || ""}
              onValueChange={(value) => setFilters({...filters, difficulty: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sunlight Needs</Label>
            <Select
              value={filters.sunlight || ""}
              onValueChange={(value) => setFilters({...filters, sunlight: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any sunlight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_sun">Full Sun</SelectItem>
                <SelectItem value="partial_sun">Partial Sun</SelectItem>
                <SelectItem value="shade">Shade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
