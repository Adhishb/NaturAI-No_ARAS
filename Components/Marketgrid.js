import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Leaf, User, Trash2, Loader2, EyeOff, Eye } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function MarketGrid({ listings, onUpdate, onHide, onUnhide, showingHidden }) {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      setCurrentUserEmail(user.email);
    }).catch(() => {
      setCurrentUserEmail(null);
    });
  }, []);

  const handleContact = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleDelete = async (listing) => {
    if (!confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      return;
    }
    
    setDeletingId(listing.id);
    try {
      await base44.entities.MarketListing.delete(listing.id);
      await onUpdate();
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing: ' + (error.message || 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map(listing => {
        const isOwner = currentUserEmail && currentUserEmail === listing.created_by;
        const isDeleting = deletingId === listing.id;
        
        return (
          <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-green-100">
            <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-200 relative">
              {listing.image_url ? (
                <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf className="w-16 h-16 text-green-500 opacity-50" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                {!isOwner && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 backdrop-blur hover:bg-white"
                    onClick={() => showingHidden ? onUnhide(listing.id) : onHide(listing.id)}
                  >
                    {showingHidden ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                )}
                {isOwner && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="shadow-md"
                    onClick={() => handleDelete(listing)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{listing.title}</h3>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {listing.plant_category}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-green-600">${listing.price}</p>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {listing.description}
              </p>

              <div className="space-y-2 mb-4">
                {listing.quantity && (
                  <p className="text-sm text-gray-500">
                    Available: {listing.quantity} units
                  </p>
                )}
                {listing.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {listing.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  Listed by {listing.created_by}
                </div>
              </div>

              <Button
                onClick={() => handleContact(listing.contact_email || listing.created_by)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
