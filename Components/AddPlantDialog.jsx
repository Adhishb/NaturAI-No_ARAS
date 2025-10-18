// AddPlantDialog.jsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { Loader2, Upload } from "lucide-react";
import { format } from "date-fns";

const categories = [
  "fruit",
  "flower",
  "vegetable",
  "herb",
  "succulent",
  "tree",
  "shrub",
  "vine",
];

export default function AddPlantDialog({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    plant_name: "",
    plant_category: "",
    planted_date: format(new Date(), "yyyy-MM-dd"),
    location: "",
    notes: "",
    health_status: "good",
    image_url: "",
  });

  const resetForm = () => {
    setFormData({
      plant_name: "",
      plant_category: "",
      planted_date: format(new Date(), "yyyy-MM-dd"),
      location: "",
      notes: "",
      health_status: "good",
      image_url: "",
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData((prev) => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.plant_name.trim()) {
      alert("Please enter a plant name");
      return;
    }

    setLoading(true);
    try {
      const plantData = {
        plant_name: formData.plant_name.trim(),
        plant_category: formData.plant_category || null,
        planted_date: formData.planted_date,
        location: formData.location.trim() || null,
        notes: formData.notes.trim() || null,
        health_status: formData.health_status,
        image_url: formData.image_url || null,
      };

      const newPlant = await base44.entities.UserPlant.create(plantData);

      resetForm();
      setLoading(false);
      onClose();
      await onSuccess();
    } catch (error) {
      console.error("Error adding plant:", error);
      alert("Failed to add plant: " + (error.message || "Unknown error"));
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && !uploadingImage) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Plant to Your Garden</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="plant_name">Plant Name *</Label>
            <Input
              id="plant_name"
              value={formData.plant_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, plant_name: e.target.value }))
              }
              placeholder="e.g., My Tomato Plant"
              required
              disabled={loading || uploadingImage}
            />
          </div>

          <div>
            <Label htmlFor="plant_category">Category</Label>
            <Select
              value={formData.plant_category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, plant_category: value }))
              }
              disabled={loading || uploadingImage}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category (optional)" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="planted_date">Planted Date</Label>
            <Input
              id="planted_date"
              type="date"
              value={formData.planted_date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, planted_date: e.target.value }))
              }
              disabled={loading || uploadingImage}
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="e.g., Balcony, Garden, Indoor"
              disabled={loading || uploadingImage}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Any special notes about this plant..."
              rows={3}
              disabled={loading || uploadingImage}
            />
          </div>

          <div>
            <Label>Upload Photo (Optional)</Label>
            <div className="mt-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="plant-image"
                disabled={loading || uploadingImage}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  document.getElementById("plant-image")?.click()
                }
                disabled={uploadingImage || loading}
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {formData.image_url ? "Change Photo" : "Upload Photo"}
                  </>
                )}
              </Button>
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Plant preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading || uploadingImage}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading || uploadingImage || !formData.plant_name.trim()
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Plant...
                </>
              ) : (
                "Add Plant"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
