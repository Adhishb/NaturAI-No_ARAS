// market_pages.js
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Eye, EyeOff } from "lucide-react";
import MarketGrid from "../components/market/MarketGrid";
import AddListingDialog from "../components/market/AddListingDialog";

export default function Market() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [hiddenListings, setHiddenListings] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = localStorage.getItem("hiddenMarketListings");
    if (stored) setHiddenListings(JSON.parse(stored));
  }, []);

  const { data: listings, refetch } = useQuery({
    queryKey: ["marketListings"],
    queryFn: () =>
      base44.entities.MarketListing.filter(
        { status: "available" },
        "-created_date"
      ),
    initialData: [],
  });

  const handleListingUpdate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["marketListings"] });
    await refetch();
  };

  const handleHideListing = (listingId) => {
    const newHidden = [...hiddenListings, listingId];
    setHiddenListings(newHidden);
    localStorage.setItem("hiddenMarketListings", JSON.stringify(newHidden));
  };

  const handleUnhideListing = (listingId) => {
    const newHidden = hiddenListings.filter((id) => id !== listingId);
    setHiddenListings(newHidden);
    localStorage.setItem("hiddenMarketListings", JSON.stringify(newHidden));
  };

  const visibleListings = showHidden
    ? listings.filter((l) => hiddenListings.includes(l.id))
    : listings.filter((l) => !hiddenListings.includes(l.id));

  const hiddenCount = listings.filter((l) => hiddenListings.includes(l.id))
    .length;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: "var(--warm-bg)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Farmer Market</h1>
            <p className="text-gray-600">
              Buy and sell plants, seeds, and produce in your local community
            </p>
          </div>
          <div className="flex gap-2">
            {hiddenCount > 0 && (
              <Button
                onClick={() => setShowHidden(!showHidden)}
                variant="outline"
                className="border-gray-300"
              >
                {showHidden ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Show Active ({listings.length - hiddenCount})
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Show Hidden ({hiddenCount})
                  </>
                )}
              </Button>
            )}
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Listing
            </Button>
          </div>
        </div>

        {visibleListings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-green-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {showHidden ? "No Hidden Listings" : "No Listings Yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {showHidden
                ? "You haven't hidden any listings yet."
                : "Be the first to list plants or seeds in your community!"}
            </p>
            {!showHidden && (
              <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Listing
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                🌱 <strong>{visibleListings.length} {showHidden ? "hidden" : "active"} listings</strong> from community members. Contact sellers directly to arrange pickup or delivery.
              </p>
            </div>
            <MarketGrid 
              listings={visibleListings} 
              onUpdate={handleListingUpdate}
              onHide={handleHideListing}
              onUnhide={handleUnhideListing}
              showingHidden={showHidden}
            />
          </>
        )}

        <AddListingDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSuccess={handleListingUpdate}
        />
      </div>
    </div>
  );
}
