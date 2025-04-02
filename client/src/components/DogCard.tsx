import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";
import { Dog } from "@shared/schema";
import { useState } from "react";
import ContactModal from "./ContactModal";

interface DogCardProps {
  dog: Dog;
}

export default function DogCard({ dog }: DogCardProps) {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const getStatusBadge = () => {
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
    <>
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-48">
          <img 
            src={dog.imageUrls[0]} 
            alt={`${dog.breed || 'Dog'}`} 
            className="w-full h-full object-cover" 
          />
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{dog.breed || 'Unknown Breed'}</h3>
            {getStatusBadge()}
          </div>
          <p className="text-gray-600 text-sm mb-2">
            <MapPin className="h-4 w-4 inline mr-1" /> {dog.city}
          </p>
          <p className="text-gray-600 mb-4 flex-grow">
            {truncateText(dog.description, 120)}
          </p>
          
          <div className="flex space-x-2 mt-2">
            <Button
              variant="default"
              className="w-full"
              onClick={() => setContactModalOpen(true)}
            >
              Contact Finder
            </Button>
            <Button
              variant="outline"
              className="flex-shrink-0"
              asChild
            >
              <Link href={`/dog/${dog.id}`}>
                <a>Details</a>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

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
    </>
  );
}
