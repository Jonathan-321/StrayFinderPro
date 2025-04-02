import { useQuery, useMutation } from "@tanstack/react-query";
import { Dog } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusBadgeColor } from "@/lib/utils";
import { AlertCircle, ArrowUpDown, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export default function Admin() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDogDetails, setCurrentDogDetails] = useState<Dog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Dog;
    direction: "ascending" | "descending";
  }>({
    key: "createdAt",
    direction: "descending",
  });

  const {
    data: dogs,
    isLoading,
    isError,
    refetch,
  } = useQuery<Dog[]>({
    queryKey: ['/api/dogs'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: string;
    }) => apiRequest('PATCH', `/api/admin/dogs/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dogs'] });
      toast({
        title: "Status updated successfully",
        description: "The dog's status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error instanceof Error ? error.message : "There was a problem updating the status.",
        variant: "destructive",
      });
    },
  });

  const requestSort = (key: keyof Dog) => {
    let direction: "ascending" | "descending" = "ascending";
    
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    
    setSortConfig({ key, direction });
  };

  const sortedDogs = () => {
    if (!dogs) return [];
    
    const sortableDogs = [...dogs];
    
    sortableDogs.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      if (sortConfig.key === "createdAt") {
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        
        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      }
      
      const comparison = aValue < bValue ? -1 : 1;
      
      return sortConfig.direction === "ascending" ? comparison : -comparison;
    });
    
    return sortableDogs;
  };

  const filteredDogs = sortedDogs().filter((dog) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      dog.breed?.toLowerCase().includes(searchValue) ||
      dog.color.toLowerCase().includes(searchValue) ||
      dog.description.toLowerCase().includes(searchValue) ||
      dog.city.toLowerCase().includes(searchValue) ||
      dog.finderName.toLowerCase().includes(searchValue) ||
      dog.finderEmail.toLowerCase().includes(searchValue) ||
      dog.status.toLowerCase().includes(searchValue)
    );
  });

  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const openDogDetails = (dog: Dog) => {
    setCurrentDogDetails(dog);
    setIsDetailsOpen(true);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Dog Listings</CardTitle>
          <CardDescription>
            Manage and update the status of found dog listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by breed, color, city, or finder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {isLoading ? (
            <div className="text-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading dog listings...</p>
            </div>
          ) : isError ? (
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
              <p className="text-red-600 mb-4">There was a problem loading the dog listings.</p>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          ) : filteredDogs.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No dogs match your search criteria.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("breed")}>
                        Breed
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("city")}>
                        Location
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("createdAt")}>
                        Date Reported
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Finder</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDogs.map((dog) => (
                    <TableRow key={dog.id}>
                      <TableCell className="font-medium">{dog.id}</TableCell>
                      <TableCell>{dog.breed || "Unknown"}</TableCell>
                      <TableCell>{dog.city}</TableCell>
                      <TableCell>{formatDate(dog.createdAt.toString())}</TableCell>
                      <TableCell>{dog.finderName}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            getStatusBadgeColor(dog.status).bg
                          } ${
                            getStatusBadgeColor(dog.status).text
                          }`}
                        >
                          {dog.status.charAt(0).toUpperCase() + dog.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDogDetails(dog)}
                            className="h-8 px-2"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            value={dog.status}
                            onValueChange={(value) => handleStatusChange(dog.id, value)}
                          >
                            <SelectTrigger className="h-8 w-[110px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="claimed">Claimed</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Dog Details (ID: {currentDogDetails?.id})</DialogTitle>
            <DialogDescription>
              Complete information about the reported dog
            </DialogDescription>
          </DialogHeader>
          
          {currentDogDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <div className="rounded-lg overflow-hidden mb-4">
                  <img
                    src={currentDogDetails.imageUrls[0]}
                    alt={currentDogDetails.breed || "Dog"}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <p><strong>Breed:</strong> {currentDogDetails.breed || "Unknown"}</p>
                  <p><strong>Color:</strong> {currentDogDetails.color}</p>
                  <p><strong>Description:</strong> {currentDogDetails.description}</p>
                  <p><strong>Found At:</strong> {currentDogDetails.address}, {currentDogDetails.city}</p>
                  <p><strong>Date Found:</strong> {currentDogDetails.dateFound}</p>
                  <p><strong>Time Found:</strong> {currentDogDetails.timeFound}</p>
                </div>
                
                <div className="mt-4">
                  <Button asChild variant="outline">
                    <Link href={`/dog/${currentDogDetails.id}`}>
                      <a target="_blank" rel="noopener noreferrer">View Public Listing</a>
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Finder Information</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {currentDogDetails.finderName}</p>
                  <p><strong>Email:</strong> {currentDogDetails.finderEmail}</p>
                  <p><strong>Phone:</strong> {currentDogDetails.finderPhone}</p>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Status</h3>
                  <Select
                    value={currentDogDetails.status}
                    onValueChange={(value) => handleStatusChange(currentDogDetails.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="claimed">Claimed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    <p><strong>Active:</strong> The dog is still looking for its owner</p>
                    <p><strong>Claimed:</strong> The dog has been reunited with its owner</p>
                    <p><strong>Archived:</strong> The listing is no longer active</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Listing Details</h3>
                  <p><strong>Report Date:</strong> {formatDate(currentDogDetails.createdAt.toString())}</p>
                  <p><strong>ID:</strong> {currentDogDetails.id}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
