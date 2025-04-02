import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeafletMapProps {
  onLocationSelect: (lat: string, lng: string) => void;
  initialLat?: string;
  initialLng?: string;
  readOnly?: boolean;
}

export default function LeafletMap({
  onLocationSelect,
  initialLat,
  initialLng,
  readOnly = false,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Default position (San Francisco)
    const defaultPosition: L.LatLngExpression = [37.7749, -122.4194];
    
    // Use initial position if provided
    const initialPosition = initialLat && initialLng 
      ? [parseFloat(initialLat), parseFloat(initialLng)]
      : defaultPosition;

    leafletMapRef.current = L.map(mapRef.current).setView(
      initialPosition as L.LatLngExpression,
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMapRef.current);

    // Add initial marker if coordinates are provided
    if (initialLat && initialLng) {
      markerRef.current = L.marker(initialPosition as L.LatLngExpression)
        .addTo(leafletMapRef.current)
        .bindPopup("Dog found here")
        .openPopup();
    }

    // Only add click handler if not in readOnly mode
    if (!readOnly) {
      leafletMapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        
        // Remove existing marker
        if (markerRef.current) {
          markerRef.current.remove();
        }
        
        // Add new marker
        markerRef.current = L.marker([lat, lng])
          .addTo(leafletMapRef.current!)
          .bindPopup("Dog found here")
          .openPopup();
        
        // Pass location to parent component
        onLocationSelect(lat.toString(), lng.toString());
      });
    } else {
      // Disable zooming and dragging in readOnly mode
      leafletMapRef.current.dragging.disable();
      leafletMapRef.current.touchZoom.disable();
      leafletMapRef.current.doubleClickZoom.disable();
      leafletMapRef.current.scrollWheelZoom.disable();
      leafletMapRef.current.boxZoom.disable();
      leafletMapRef.current.keyboard.disable();
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [initialLat, initialLng, onLocationSelect, readOnly]);

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Update map and marker
        if (leafletMapRef.current) {
          leafletMapRef.current.setView([latitude, longitude], 15);
          
          // Remove existing marker
          if (markerRef.current) {
            markerRef.current.remove();
          }
          
          // Add new marker
          markerRef.current = L.marker([latitude, longitude])
            .addTo(leafletMapRef.current)
            .bindPopup("Dog found here")
            .openPopup();
          
          // Pass location to parent component
          onLocationSelect(latitude.toString(), longitude.toString());
        }
        
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
  };

  return (
    <div className="space-y-2">
      <div
        ref={mapRef}
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
              <li>Click directly on the map to place a marker</li>
              <li>Use the "Use my current location" button if you're at the location now</li>
              <li>You can zoom in/out using the + and - buttons for more accuracy</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
