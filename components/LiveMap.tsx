import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { LatLng } from '../types';
import { loadGoogleMapsScript } from '../services/googleMapsService';
import MapMarker from './MapMarker';

interface LiveMapProps {
  center?: LatLng | null;
  pickup?: LatLng | null;
  dropoff?: LatLng | null;
  carLocation?: LatLng | null;
  routePath?: google.maps.LatLng[];
}

// Custom map styles for dark mode
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];


const LiveMap: React.FC<LiveMapProps> = ({ center, pickup, dropoff, carLocation, routePath }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<google.maps.Map | null>(null);
  const routePolyline = useRef<google.maps.Polyline | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const handleThemeChange = () => {
        const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setTheme(newTheme);
    };
    
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    handleThemeChange(); // Initial check
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        if (mapRef.current && !googleMap.current) {
          googleMap.current = new window.google.maps.Map(mapRef.current, {
            center: center || { lat: 37.7749, lng: -122.4194 },
            zoom: 14,
            disableDefaultUI: true,
            styles: theme === 'dark' ? mapStyles : [],
          });
        }
        setIsMapReady(true);
      })
      .catch(err => console.error(err));
  }, [center, theme]);

  useEffect(() => {
    if (googleMap.current) {
        googleMap.current.setOptions({ styles: theme === 'dark' ? mapStyles : [] });
    }
  }, [theme]);

  // Update map bounds or center based on props
  useEffect(() => {
    if (!googleMap.current) return;
    
    if (pickup && dropoff) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(pickup);
        bounds.extend(dropoff);
        googleMap.current.fitBounds(bounds, 100);
    } else if (center) {
        googleMap.current.setCenter(center);
        googleMap.current.setZoom(15);
    }
    
    if (carLocation) {
      googleMap.current.panTo(carLocation);
    }

  }, [isMapReady, center, pickup, dropoff, carLocation]);


  // Draw route
  useEffect(() => {
    if (!googleMap.current || !routePath || routePath.length === 0) {
      if (routePolyline.current) {
        routePolyline.current.setMap(null); // Clear old route
      }
      return;
    }

    if (!routePolyline.current) {
      routePolyline.current = new window.google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: theme === 'dark' ? '#06B6D4' : '#0891B2',
        strokeOpacity: 0.8,
        strokeWeight: 5,
      });
    } else {
      routePolyline.current.setPath(routePath);
    }
    routePolyline.current.setMap(googleMap.current);
  }, [isMapReady, routePath, theme]);

  return (
    <div ref={mapRef} className="w-full h-full bg-gray-200 dark:bg-gray-800">
      {!isMapReady && (
        <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">Loading map...</p>
        </div>
      )}
      {isMapReady && googleMap.current && (
        <>
            {/* Home Screen marker */}
            {center && !pickup && <MapMarker map={googleMap.current} position={center} type="current" />}
            
            {/* Trip Screen markers */}
            {pickup && <MapMarker map={googleMap.current} position={pickup} type="pickup" />}
            {dropoff && <MapMarker map={googleMap.current} position={dropoff} type="dropoff" />}
            {carLocation && <MapMarker map={googleMap.current} position={carLocation} type="car" />}
        </>
      )}
    </div>
  );
};

export default LiveMap;
