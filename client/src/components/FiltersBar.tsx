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
    breed: "",
    city: "",
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
    onFilterChange(filters);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      breed: "",
      city: "",
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
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4">
      <div className="flex-grow md:w-1/3">
        <Input
          type="text"
          placeholder="Search by breed, color, location..."
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          onKeyDown={handleKeyDown}
          className="w-full"
        />
      </div>
      
      <div className="md:w-1/4">
        <Select
          value={filters.breed}
          onValueChange={(value) => setFilters({ ...filters, breed: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Breeds" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Breeds</SelectItem>
            {uniqueBreeds.map((breed) => (
              <SelectItem key={breed} value={breed || ""}>
                {breed || "Unknown"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:w-1/4">
        <Select
          value={filters.city}
          onValueChange={(value) => setFilters({ ...filters, city: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Locations</SelectItem>
            {uniqueCities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleApplyFilters} className="w-full md:w-auto">
          Filter
        </Button>
        {(filters.breed || filters.city || filters.query) && (
          <Button variant="outline" onClick={handleResetFilters} className="w-full md:w-auto">
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
