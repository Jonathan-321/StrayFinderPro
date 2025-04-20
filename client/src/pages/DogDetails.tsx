import { useQuery } from "@tanstack/react-query";
import { Dog } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import LeafletMap from "@/components/LeafletMap";
import ContactModal from "@/components/ContactModal";
import { useState } from "react";
import { Link } from "wouter";

interface DogDetailsProps {
  id: string;
}

export default function DogDetails({ id }: DogDetailsProps) {
  const { toast } = useToast();
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const { data: dog, isLoading, isError, error } = useQuery<Dog>({
    queryKey: [`/api/dogs/${id}`],
    onError: (err) => {
      toast({
        title: "Error fetching dog details",
        description: err instanceof Error ? err.message : "There was a problem loading the dog details.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Skeleton className="h-96 w-full rounded-lg mb-4" />
              <div className="grid grid-cols-3 gap-2 mb-6">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
              
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          
          <div>
            <Skeleton className="h-64 w-full rounded-lg mb-4" />
            <Skeleton className="h-10 w-full rounded-lg mb-6" />
            
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !dog) {
    return (
      <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Dog Details</CardTitle>
            <CardDescription>
              There was a problem loading the information for this dog.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error instanceof Error ? error.message : "Unable to fetch data"}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/found-dogs">
              <Button variant="outline">Return to Found Dogs</Button>
            </Link>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (dog.status === "claimed") {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Claimed</Badge>;
    }
    
    const today = new Date();
    const dogDate = new Date(dog.createdAt);
    const diffDays = Math.floor((today.getTime() - dogDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Found today</Badge>;
    } else if (diffDays === 1) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Found yesterday</Badge>;
    } else if (diffDays < 7) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Found {diffDays} days ago</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Found {formatDate(dog.createdAt.toString())}</Badge>;
    }
  };

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/found-dogs">
          <Button variant="outline" className="mb-4 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all dogs
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{dog.breed || "Unknown Breed"}</h1>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">{dog.city}</span>
          {getStatusBadge()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {/* Main Image */}
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={dog.imageUrls[0]}
                  alt={dog.breed || "Dog"}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              {dog.imageUrls.length > 1 && (
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {dog.imageUrls.map((url, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      <img
                        src={url}
                        alt={`${dog.breed || "Dog"} - image ${index + 1}`}
                        className="w-full h-20 object-cover cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{dog.description}</p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <span className="text-sm text-gray-500 block">Date Found</span>
                    <span className="font-medium">{dog.dateFound}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <span className="text-sm text-gray-500 block">Time Found</span>
                    <span className="font-medium">{dog.timeFound}</span>
                  </div>
                </div>
                
                {dog.color && (
                  <div className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-primary mr-2"></div>
                    <div>
                      <span className="text-sm text-gray-500 block">Primary Color</span>
                      <span className="font-medium">{dog.color}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Where this dog was found</CardDescription>
              </CardHeader>
              <CardContent>
                <LeafletMap
                  initialLat={dog.latitude}
                  initialLng={dog.longitude}
                  readOnly={true}
                  onLocationSelect={() => {}}
                />
                <p className="mt-2 text-sm text-gray-700">
                  <strong>Address:</strong> {dog.address}
                </p>
              </CardContent>
            </Card>
            
            <Button className="w-full" onClick={() => setContactModalOpen(true)}>
              Contact Finder
            </Button>
            
            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p>
                    <span className="text-gray-500">Report Date:</span>{" "}
                    {formatDate(dog.createdAt.toString())}
                  </p>
                  <p>
                    <span className="text-gray-500">Status:</span>{" "}
                    <span className="capitalize">{dog.status}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Report ID:</span> {dog.id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <ContactModal
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
        contact={{
          name: dog.finderName,
          email: dog.finderEmail,
          phone: dog.finderPhone
        }}
        dogInfo={{
          id: dog.id,
          breed: dog.breed || 'Unknown Breed'
        }}
      />
    </div>
  );
}
