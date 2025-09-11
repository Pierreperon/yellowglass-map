import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Agency } from '@/types/agency';

interface MapComponentProps {
  agencies: Agency[];
  selectedAgency: Agency | null;
  onAgencySelect: (agency: Agency) => void;
}

export const MapComponent = ({ agencies, selectedAgency, onAgencySelect }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyA1eGg9p8qYPhfH2v4NanC54Qz88bLykfI", // Demo key - replace with your own
        version: "weekly",
        libraries: ["places"]
      });

      try {
        await loader.load();
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 46.603354, lng: 2.888334 },
            zoom: 6,
            styles: [
              {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#1DB584"}]
              },
              {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{"color": "#f8fafc"}]
              },
              {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#ffffff"}]
              },
              {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{"color": "#e8f5e8"}]
              }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            mapTypeId: 'roadmap'
          });

          setMap(mapInstance);

          // Create markers
          const newMarkers = agencies.map((agency) => {
            const marker = new google.maps.Marker({
              position: { lat: agency.lat, lng: agency.lng },
              map: mapInstance,
              title: agency.name,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="20" fill="#1DB584" stroke="#ffffff" stroke-width="3"/>
                    <text x="22" y="28" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${agency.id}</text>
                  </svg>
                `),
                scaledSize: new google.maps.Size(44, 44),
                anchor: new google.maps.Point(22, 22)
              }
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="padding: 12px; min-width: 220px; font-family: system-ui, -apple-system, sans-serif;">
                  <h3 style="margin: 0 0 8px 0; color: #1DB584; font-size: 18px; font-weight: bold;">${agency.name}</h3>
                  <p style="margin: 4px 0; font-size: 14px; font-weight: 500; color: #374151;">${agency.address}</p>
                  <p style="margin: 4px 0; font-size: 14px; color: #6B7280;">${agency.postalCode} ${agency.city}</p>
                  <div style="margin: 12px 0 0 0; padding: 8px 0; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0; font-size: 14px; color: #1DB584; font-weight: 600;">📞 ${agency.phone}</p>
                  </div>
                </div>
              `
            });

            marker.addListener("click", () => {
              // Close all other info windows
              markers.forEach(m => {
                if ((m as any).infoWindow) {
                  (m as any).infoWindow.close();
                }
              });
              
              infoWindow.open(mapInstance, marker);
              onAgencySelect(agency);
              
              // Add bounce animation
              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(() => marker.setAnimation(null), 1400);
            });

            (marker as any).infoWindow = infoWindow;
            return marker;
          });

          setMarkers(newMarkers);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setIsLoading(false);
      }
    };

    initMap();
  }, [agencies, onAgencySelect]);

  // Handle agency selection from outside the map
  useEffect(() => {
    if (selectedAgency && map) {
      map.panTo({ lat: selectedAgency.lat, lng: selectedAgency.lng });
      map.setZoom(12);
      
      const marker = markers.find(m => m.getTitle() === selectedAgency.name);
      if (marker && (marker as any).infoWindow) {
        // Close all info windows first
        markers.forEach(m => {
          if ((m as any).infoWindow) {
            (m as any).infoWindow.close();
          }
        });
        
        (marker as any).infoWindow.open(map, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 1400);
      }
    }
  }, [selectedAgency, map, markers]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground font-medium">Chargement de la carte...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />
    </div>
  );
};