import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dogReportSchema, type InsertDog } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import LeafletMap from "@/components/LeafletMap";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ReportDog() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submittedDogId, setSubmittedDogId] = useState<number | null>(null);

  const form = useForm<InsertDog>({
    resolver: zodResolver(dogReportSchema),
    defaultValues: {
      breed: "Unknown",
      color: "",
      description: "",
      imageUrls: [],
      address: "",
      city: "",
      latitude: "",
      longitude: "",
      dateFound: new Date().toISOString().split("T")[0],
      timeFound: new Date().toTimeString().slice(0, 5),
      finderName: "",
      finderPhone: "",
      finderEmail: "",
    },
  });

  const reportDogMutation = useMutation({
    mutationFn: (data: InsertDog) => apiRequest('POST', '/api/dogs', data),
    onSuccess: async (response) => {
      const dog = await response.json();
      setSubmittedDogId(dog.id);
      setShowSuccessDialog(true);
      queryClient.invalidateQueries({ queryKey: ['/api/dogs'] });
    },
    onError: (error) => {
      toast({
        title: "Error submitting report",
        description: error instanceof Error ? error.message : "There was a problem submitting your report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertDog) => {
    reportDogMutation.mutate(data);
  };

  const handleViewDog = () => {
    if (submittedDogId) {
      navigate(`/dog/${submittedDogId}`);
    }
  };

  const handleLocationSelect = (lat: string, lng: string) => {
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
    form.clearErrors(["latitude", "longitude"]);
  };

  const handleImageUpload = (urls: string[]) => {
    form.setValue("imageUrls", urls);
    form.clearErrors("imageUrls");
  };

  return (
    <section className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Report a Found Dog</h2>
          <p className="text-gray-600">
            Please provide as much information as possible to help reunite the dog with its owner.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <div>
              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Upload Dog Photos</FormLabel>
              <ImageUpload 
                onImageUpload={handleImageUpload}
                existingImages={form.getValues().imageUrls}
              />
              {form.formState.errors.imageUrls && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.imageUrls.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed (if known)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "Unknown"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select breed or 'Unknown'" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                        <SelectItem value="Labrador">Labrador</SelectItem>
                        <SelectItem value="German Shepherd">German Shepherd</SelectItem>
                        <SelectItem value="Golden Retriever">Golden Retriever</SelectItem>
                        <SelectItem value="Beagle">Beagle</SelectItem>
                        <SelectItem value="Poodle">Poodle</SelectItem>
                        <SelectItem value="Husky">Husky</SelectItem>
                        <SelectItem value="Bulldog">Bulldog</SelectItem>
                        <SelectItem value="Rottweiler">Rottweiler</SelectItem>
                        <SelectItem value="Boxer">Boxer</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Brown, Black, White" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please describe the dog (size, distinctive features, collar, behavior, etc.)" 
                      className="resize-none" 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Where was the dog found?</FormLabel>
              <LeafletMap onLocationSelect={handleLocationSelect} />
              {(form.formState.errors.latitude || form.formState.errors.longitude) && (
                <p className="text-sm text-red-500 mt-1">Please mark the location on the map</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address/Landmark</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address or nearby landmark" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dateFound"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Found</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeFound"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approximate Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your Contact Information</h3>
              <p className="text-sm text-gray-500 mb-4">This information will be shared with the dog owner when they claim their pet.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="finderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="finderPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="finderEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600"
                >
                  I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </label>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={reportDogMutation.isPending}
              >
                {reportDogMutation.isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Form>

        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Report Submitted Successfully!</AlertDialogTitle>
              <AlertDialogDescription>
                Thank you for your report. Your contribution helps reunite lost dogs with their owners.
                Your report is now live and searchable by pet owners.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleViewDog}>View Your Report</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}
