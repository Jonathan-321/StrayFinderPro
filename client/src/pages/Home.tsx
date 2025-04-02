import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="h-64 md:h-96 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Reunite Lost Dogs with Their Families</h1>
              <p className="text-xl text-white mb-8">Report a found dog or search for your missing furry friend</p>
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Button asChild size="lg" className="bg-primary hover:bg-blue-600">
                  <Link href="/report-dog">
                    Report Found Dog
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white hover:bg-gray-100 text-gray-900">
                  <Link href="/found-dogs">
                    Find Your Dog
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Welcome banner */}
        <div className="bg-blue-50 border-t border-b border-blue-100 py-3">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex justify-center md:justify-start mb-2 md:mb-0">
                <span className="font-medium text-blue-600 text-base md:text-lg">Welcome to PawFinder!</span>
              </div>
              <div className="text-center md:text-left text-xs md:text-sm text-blue-700 mb-3 md:mb-0">
                Over 150,000 dogs are reunited with their families each year!
              </div>
              <div className="flex justify-center md:justify-end">
                <Link href="#how-it-works">
                  <span className="inline-block text-xs md:text-sm px-3 py-1 leading-none border rounded text-blue-600 border-blue-600 hover:border-transparent hover:text-white hover:bg-blue-600 cursor-pointer">
                    Learn How
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="how-it-works">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">PawFinder helps reunite lost dogs with their owners through community reporting and searching.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="flex justify-center mb-4">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Take a Photo</h3>
              <p className="text-gray-600">Snap a clear picture of the dog you've found to help owners identify their pet.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="flex justify-center mb-4">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Share Location</h3>
              <p className="text-gray-600">Mark where you found the dog to help narrow down the search area.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="flex justify-center mb-4">
                <UserPlus className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">Help owners get in touch with you to reclaim their lost pet.</p>
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <div className="bg-gray-50 py-12" id="about">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About PawFinder</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                We're dedicated to reuniting lost dogs with their loving families through the power of community.
                Our platform makes it easy to report found dogs and helps owners search for their missing pets.
              </p>
            </div>
            
            <div className="mt-10 text-center">
              <Button asChild size="lg" className="bg-primary hover:bg-blue-600">
                <Link href="/found-dogs">
                  Browse Found Dogs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
