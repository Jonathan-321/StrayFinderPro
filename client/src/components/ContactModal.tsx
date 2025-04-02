import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User } from "lucide-react";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  dogInfo: {
    id: number;
    breed: string;
  };
}

export default function ContactModal({
  open,
  onOpenChange,
  contact,
  dogInfo,
}: ContactModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Information</DialogTitle>
          <DialogDescription>
            Contact the person who found the {dogInfo.breed.toLowerCase()} (ID: {dogInfo.id})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-500 mr-2" />
            <span className="font-medium mr-2">Name:</span>
            <span>{contact.name}</span>
          </div>
          
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-gray-500 mr-2" />
            <span className="font-medium mr-2">Phone:</span>
            <a 
              href={`tel:${contact.phone}`} 
              className="text-primary hover:underline"
            >
              {contact.phone}
            </a>
          </div>
          
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-500 mr-2" />
            <span className="font-medium mr-2">Email:</span>
            <a 
              href={`mailto:${contact.email}`} 
              className="text-primary hover:underline"
            >
              {contact.email}
            </a>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              window.location.href = `mailto:${contact.email}?subject=Regarding%20Found%20Dog%20(ID:%20${dogInfo.id})`;
            }}
          >
            Email Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
