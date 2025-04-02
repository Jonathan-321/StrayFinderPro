import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Dog } from "@shared/schema";

interface FiltersBarProps {
  onFilterChange: (filters: { breed: string; city: string; query: string }) => void;
}

export default function FiltersBar({ onFilterChange }: FiltersBarProps) {
  const [filters, setFilters] = useState({
    breed: "all_breeds",
    city: "all_locations",
    query: "",
  });

  // Get all dogs to extract unique breeds and cities
  const { data: dogs } = useQuery<Dog[]>({
    queryKey: ['/api/dogs'],
  });

  // Extract unique breeds and cities
  const uniqueBreeds = Array.from(
    new Set(dogs?.map((dog) => dog.breed).filter(Boolean))
  );
  
  const uniqueCities = Array.from(
    new Set(dogs?.map((dog) => dog.city))
  );

  // Apply filters
  const handleApplyFilters = () => {
    onFilterChange({
      breed: filters.breed === "all_breeds" ? "" : filters.breed,
      city: filters.city === "all_locations" ? "" : filters.city,
      query: filters.query
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      breed: "all_breeds",
      city: "all_locations",
      query: "",
    });
    onFilterChange({
      breed: "",
      city: "",
      query: "",
    });
  };

  // Handle search on enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApplyFilters();
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="col-span-1 md:col-span-1">
          <Input
            type="text"
            placeholder="Search dogs..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onKeyDown={handleKeyDown}
            className="w-full text-sm"
          />
        </div>
        
        <div className="col-span-1 md:col-span-1">
          <Select
            value={filters.breed}
            onValueChange={(value) => setFilters({ ...filters, breed: value })}
          >
            <SelectTrigger className="text-sm h-9">
              <SelectValue placeholder="All Breeds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_breeds">All Breeds</SelectItem>
              {uniqueBreeds.map((breed) => (
                <SelectItem key={breed} value={breed || "unknown"}>
                  {breed || "Unknown"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-1 md:col-span-1">
          <Select
            value={filters.city}
            onValueChange={(value) => setFilters({ ...filters, city: value })}
          >
            <SelectTrigger className="text-sm h-9">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_locations">All Locations</SelectItem>
              {uniqueCities.map((city) => (
                <SelectItem key={city} value={city || "unknown_city"}>
                  {city || "Unknown"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-1 md:col-span-1 flex gap-2">
          <Button onClick={handleApplyFilters} className="w-1/2 md:w-full text-sm h-9">
            Filter
          </Button>
          {(filters.breed !== "all_breeds" || filters.city !== "all_locations" || filters.query) && (
            <Button variant="outline" onClick={handleResetFilters} className="w-1/2 md:w-auto text-sm h-9">
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
