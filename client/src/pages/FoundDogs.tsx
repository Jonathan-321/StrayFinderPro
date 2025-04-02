import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dog } from "@shared/schema";
import DogCard from "@/components/DogCard";
import FiltersBar from "@/components/FiltersBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function FoundDogs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    breed: "",
    city: "",
    query: "",
  });
  const itemsPerPage = 9;

  // Fetch all dogs
  const {
    data: dogs,
    isLoading,
    isError,
    refetch,
  } = useQuery<Dog[]>({
    queryKey: [
      '/api/dogs',
      filters.breed,
      filters.city,
      filters.query,
    ],
  });

  const handleFilterChange = (newFilters: { breed: string; city: string; query: string }) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalDogs = dogs?.length || 0;
  const totalPages = Math.ceil(totalDogs / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDogs = dogs?.slice(startIndex, endIndex) || [];

  // Generate array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Recently Found Dogs</h2>
          <p className="text-gray-600">Browse through dogs that have been found. Is your furry friend here?</p>
        </div>

        <div className="mb-8">
          <FiltersBar onFilterChange={handleFilterChange} />
          
          <div className="mt-3 bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-800">
            <p className="flex items-center">
              <span className="mr-2">💡</span>
              <span>
                <strong>Tip:</strong> Use the filters above to search by breed, city, or keywords. 
                Click on any dog card to view more details and contact information.
              </span>
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
            <p className="text-red-600 mb-4">There was a problem loading the dog listings. Please try again.</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : dogs && dogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentDogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        style={{ opacity: currentPage === 1 ? 0.5 : 1, pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
                      />
                    </PaginationItem>
                    
                    {pageNumbers.map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        style={{ opacity: currentPage === totalPages ? 0.5 : 1, pointerEvents: currentPage === totalPages ? 'none' : 'auto' }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-12 rounded-lg text-center shadow-sm">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Dogs Found</h3>
            <p className="text-gray-600 mb-6">
              {filters.breed || filters.city || filters.query
                ? "No dogs match your search criteria. Try adjusting your filters."
                : "There are no dog listings at this time. Check back later or be the first to report a found dog!"}
            </p>
            <Button asChild>
              <a href="/report-dog">Report a Found Dog</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
