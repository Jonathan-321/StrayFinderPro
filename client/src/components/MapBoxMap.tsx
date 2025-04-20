import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxSdk from "@mapbox/mapbox-sdk";
import mapboxGeocodingClient from "@mapbox/mapbox-sdk/services/geocoding";

// We'll initialize the token and clients inside the component to ensure it's available
// Set up a placeholder for the geocoding service that will be initialized in the component
let geocodingService: ReturnType<typeof mapboxGeocodingClient> | null = null;

interface MapBoxMapProps {
  onLocationSelect: (lat: string, lng: string, address?: string, city?: string) => void;
  initialLat?: string;
  initialLng?: string;
  readOnly?: boolean;
}

export default function MapBoxMap({
  onLocationSelect,
  initialLat,
  initialLng,
  readOnly = false,
}: MapBoxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  
  // Default position (San Francisco)
  const defaultLat = 37.7749;
  const defaultLng = -122.4194;
  
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get address from coordinates using Mapbox Geocoding API
  const getAddressFromCoordinates = useCallback(async (lat: number, lng: number) => {
    try {
      if (!geocodingService) {
        console.error("Geocoding service not initialized");
        return null;
      }
      
      const response = await geocodingService.reverseGeocode({
        query: [lng, lat],
        types: ["address", "place", "locality"],
        limit: 1
      }).send();
      
      if (response && response.body.features.length > 0) {
        const feature = response.body.features[0];
        const placeInfo = {
          address: feature.place_name?.split(',')[0] || "",
          city: feature.context?.find((item: any) => item.id.startsWith('place'))?.text || 
                feature.context?.find((item: any) => item.id.startsWith('locality'))?.text || 
                feature.context?.find((item: any) => item.id.startsWith('district'))?.text || "",
        };
        
        return placeInfo;
      }
      return null;
    } catch (error) {
      console.error("Error getting address:", error);
      return null;
    }
  }, []);

  // Initialize MapBox services
  useEffect(() => {
    async function initializeMapBox() {
      try {
        // Fetch the MapBox token from our API
        const response = await fetch('/api/config/mapbox');
        const data = await response.json();
        
        if (!response.ok || !data.token) {
          throw new Error("Failed to get MapBox token");
        }
        
        const token = data.token;
        
        // Set the token for MapBox GL
        mapboxgl.accessToken = token;
        
        // Initialize the MapBox SDK and geocoding service
        const client = mapboxSdk({ accessToken: token });
        geocodingService = mapboxGeocodingClient(client);
      } catch (error) {
        console.error("Error initializing MapBox:", error);
        setLocationError("Map service is not properly configured.");
      }
    }
    
    initializeMapBox();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !mapboxgl.accessToken) return;
    
    // Initial position
    const initialPosition = {
      lat: initialLat ? parseFloat(initialLat) : defaultLat,
      lng: initialLng ? parseFloat(initialLng) : defaultLng
    };
    
    // Create new map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialPosition.lng, initialPosition.lat],
      zoom: 13,
      interactive: !readOnly
    });
    
    // Add navigation controls if not in readOnly mode
    if (!readOnly) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }
    
    // Add initial marker if coordinates are provided
    if (initialLat && initialLng) {
      marker.current = new mapboxgl.Marker()
        .setLngLat([parseFloat(initialLng), parseFloat(initialLat)])
        .addTo(map.current);
    }
    
    // Add click handler if not in readOnly mode
    if (!readOnly) {
      map.current.on('click', async (e) => {
        const { lng, lat } = e.lngLat;
        
        // Remove existing marker
        if (marker.current) {
          marker.current.remove();
        }
        
        // Add new marker
        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current!);
        
        // Get address from coordinates
        const placeInfo = await getAddressFromCoordinates(lat, lng);
        
        // Pass location to parent component
        onLocationSelect(
          lat.toString(), 
          lng.toString(),
          placeInfo?.address,
          placeInfo?.city
        );
      });
    }
    
    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialLat, initialLng, readOnly, onLocationSelect, getAddressFromCoordinates, defaultLat, defaultLng]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update map
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15
          });
          
          // Remove existing marker
          if (marker.current) {
            marker.current.remove();
          }
          
          // Add new marker
          marker.current = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current);
        }
        
        // Get address from coordinates
        const placeInfo = await getAddressFromCoordinates(latitude, longitude);
        
        // Pass location to parent component
        onLocationSelect(
          latitude.toString(),
          longitude.toString(),
          placeInfo?.address,
          placeInfo?.city
        );
        
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = "Failed to get your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get your location timed out";
            break;
        }
        
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [getAddressFromCoordinates, onLocationSelect]);

  return (
    <div className="space-y-2">
      <div 
        ref={mapContainer}
        className="h-60 rounded-lg overflow-hidden border border-gray-200"
      ></div>
      
      {locationError && (
        <p className="text-sm text-red-500">{locationError}</p>
      )}
      
      {!readOnly && (
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
            className="text-xs flex items-center"
          >
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {isLoadingLocation ? "Getting location..." : "Use my current location"}
          </Button>
        </div>
      )}
      
      <div className="bg-gray-50 p-2 rounded-md border border-gray-200 mt-1">
        {readOnly ? (
          <p className="text-xs text-gray-700">
            <span className="font-medium">📍 Location:</span> This map shows where the dog was found
          </p>
        ) : (
          <div className="space-y-1">
            <p className="text-xs text-gray-700">
              <span className="font-medium">📍 How to mark location:</span>
            </p>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
              <li>Click directly on the map to place a marker and populate address</li>
              <li>Use the "Use my current location" button if you're at the location now</li>
              <li>You can zoom in/out using the + and - buttons for more accuracy</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}