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
            center: { lat: 46.8566, lng: 2.3522 }, // Centre de la France
            zoom: 6.2, // Zoom plus serré sur la France
            restriction: {
              latLngBounds: {
                north: 51.5,
                south: 41.0,
                west: -5.5,
                east: 10.0,
              },
              strictBounds: false,
            },
            styles: [
              {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#4a90e2"}]
              },
              {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{"color": "#f8f9fa"}]
              },
              {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#ffffff"}]
              },
              {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{"color": "#f0f0f0"}]
              },
              {
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#cccccc"}, {"weight": 1}]
              }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            mapTypeId: 'roadmap'
          });

          setMap(mapInstance);

          // Create markers with custom Yellow Glass pins
          const newMarkers = agencies.map((agency) => {
            const marker = new google.maps.Marker({
              position: { lat: agency.lat, lng: agency.lng },
              map: mapInstance,
              title: agency.name,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="60" height="80" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <filter id="shadow${agency.id}" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
                      </filter>
                    </defs>
                    <!-- Pin shape -->
                    <path d="M30 5 C40 5, 50 15, 50 25 C50 35, 30 65, 30 65 C30 65, 10 35, 10 25 C10 15, 20 5, 30 5 Z" fill="#FFD700" stroke="#333" stroke-width="2" filter="url(#shadow${agency.id})"/>
                    <!-- Yellow Glass logo inside -->
                    <rect x="15" y="15" width="30" height="15" rx="7.5" fill="#333333"/>
                    <rect x="18" y="18" width="24" height="9" rx="4.5" fill="#FFD700"/>
                    <rect x="20" y="20" width="8" height="2" rx="1" fill="#333333" transform="rotate(15 24 21)"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(60, 80),
                anchor: new google.maps.Point(30, 65)
              }
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="padding: 15px; min-width: 280px; font-family: 'Red Hat Display', sans-serif;">
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="background: #FFD700; width: 35px; height: 20px; border-radius: 10px; margin-right: 12px; display: flex; align-items: center; justify-content: center; border: 2px solid #333;">
                      <div style="background: #333; width: 12px; height: 2px; border-radius: 1px; transform: rotate(15deg);"></div>
                    </div>
                    <h3 style="margin: 0; color: #333; font-size: 18px; font-weight: 700;">${agency.name}</h3>
                  </div>
                  <div style="margin-bottom: 8px;">
                    <p style="margin: 0; font-size: 14px; color: #555; font-weight: 500;">${agency.address}</p>
                    <p style="margin: 0; font-size: 14px; color: #555;">${agency.postalCode} ${agency.city}</p>
                  </div>
                  <div style="margin-bottom: 8px;">
                    <p style="margin: 0; font-size: 14px; color: #FFD700; font-weight: 600;">📞 ${agency.phone}</p>
                  </div>
                  <div style="margin-bottom: 12px;">
                    <p style="margin: 0; font-size: 13px; color: #666;"><strong>Horaires:</strong> ${agency.hours}</p>
                  </div>
                  <button style="background: #FFD700; color: #333; border: none; padding: 10px 20px; border-radius: 25px; font-weight: 700; cursor: pointer; font-size: 14px; font-family: 'Red Hat Display', sans-serif;">
                    En savoir plus
                  </button>
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
    } else if (!selectedAgency && map) {
      // Reset view when no agency is selected
      map.panTo({ lat: 46.8566, lng: 2.3522 }); // Centre France
      map.setZoom(6.2); // Zoom France
      markers.forEach(m => {
        if ((m as any).infoWindow) {
          (m as any).infoWindow.close();
        }
      });
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