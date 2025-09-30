import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Phone, Clock, Search, Navigation2 } from 'lucide-react';
import mapPinIcon from '@/assets/mappin.png';
import { CenterDetailsDrawer } from '@/components/CenterDetailsDrawer';

interface YellowGlassCenter {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  lat: number;
  lng: number;
  hours: string;
  services: string[];
}

const YELLOW_GLASS_CENTERS: YellowGlassCenter[] = [
  {
    id: 1,
    name: "Yellow Glass Rennes",
    address: "3, Rue Jules Corvaisier",
    city: "Combourg",
    postalCode: "35270",
    phone: "02 99 73 12 34",
    lat: 48.4167,
    lng: -1.7500,
    hours: "Lun-Ven: 8h00-18h00, Sam: 8h00-12h00",
    services: ["Remplacement pare-brise", "Réparation impact", "Intervention à domicile"]
  },
  {
    id: 2,
    name: "Yellow Glass Angers",
    address: "ACTIVAPARK, Rue du Pré des Landes",
    city: "Saint-Léger-de-Linières",
    postalCode: "49170",
    phone: "02 41 92 45 67",
    lat: 47.3833,
    lng: -1.0833,
    hours: "Lun-Ven: 8h00-18h00, Sam: 8h00-12h00",
    services: ["Remplacement pare-brise", "Réparation impact", "Intervention à domicile"]
  },
  {
    id: 3,
    name: "Yellow Glass Nice",
    address: "38 Rte de Canta Galet",
    city: "Nice",
    postalCode: "06200",
    phone: "04 93 84 56 78",
    lat: 43.7102,
    lng: 7.2620,
    hours: "Lun-Ven: 8h00-18h00, Sam: 8h00-12h00",
    services: ["Remplacement pare-brise", "Réparation impact", "Intervention à domicile"]
  },
  {
    id: 4,
    name: "Yellow Glass Tourrettes",
    address: "121 CHEMIN DE CAMBARRAS LOT 10",
    city: "Tourrettes",
    postalCode: "83440",
    phone: "04 94 76 89 12",
    lat: 43.5667,
    lng: 6.7500,
    hours: "Lun-Ven: 8h00-18h00, Sam: 8h00-12h00",
    services: ["Remplacement pare-brise", "Réparation impact", "Intervention à domicile"]
  }
];

const Index: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<YellowGlassCenter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024);

  // Fonction pour obtenir le zoom adaptatif selon la taille d'écran (plus large)
  const getResponsiveZoom = () => {
    const width = window.innerWidth;
    if (width < 768) return 4.8; // Mobile - zoom beaucoup plus large
    if (width < 1024) return 5.2; // Tablette - zoom plus large
    return 6.2; // Desktop - zoom normal
  };

  // Fonction pour obtenir le centre adaptatif
  const getResponsiveCenter = () => {
    const width = window.innerWidth;
    if (width < 768) {
      return { lat: 46.8566, lng: 2.8522 }; // Mobile - légèrement décalé à l'est
    }
    return { lat: 46.8566, lng: 2.3522 }; // Desktop/Tablette - centre normal
  };

  // Fonction pour forcer le redimensionnement de la carte avec zoom adaptatif
  const resizeMap = () => {
    if (map && window.google && window.google.maps) {
      setTimeout(() => {
        window.google.maps.event.trigger(map, 'resize');
        const newCenter = getResponsiveCenter();
        const newZoom = getResponsiveZoom();
        map.setCenter(newCenter);
        map.setZoom(newZoom);
      }, 100);
    }
  };

  // Écouter les changements de taille de fenêtre
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
      resizeMap();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map]);

  // Forcer le redimensionnement après le chargement initial
  useEffect(() => {
    if (map && !isLoading) {
      const timer = setTimeout(() => {
        resizeMap();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [map, isLoading]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyA1eGg9p8qYPhfH2v4NanC54Qz88bLykfI",
        version: "weekly",
        libraries: ["places"]
      });

      try {
        await loader.load();
        
        if (mapRef.current) {
          const initialCenter = getResponsiveCenter();
          const initialZoom = getResponsiveZoom();

          const mapInstance = new google.maps.Map(mapRef.current, {
            center: initialCenter,
            zoom: initialZoom,
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
            fullscreenControl: false
          });

          setMap(mapInstance);

          const newMarkers = YELLOW_GLASS_CENTERS.map((center) => {
            const marker = new google.maps.Marker({
              position: { lat: center.lat, lng: center.lng },
              map: mapInstance,
              title: center.name,
              icon: {
                url: mapPinIcon,
                scaledSize: new google.maps.Size(50, 65),
                anchor: new google.maps.Point(25, 65)
              }
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="
                  padding: 20px; 
                  max-width: 340px; 
                  max-height: 60vh;
                  overflow-y: auto;
                  font-family: 'Red Hat Display', sans-serif;
                ">
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="background: #FFD700; width: 35px; height: 20px; border-radius: 10px; margin-right: 12px; display: flex; align-items: center; justify-content: center; border: 2px solid #333;">
                      <div style="background: #333; width: 12px; height: 2px; border-radius: 1px; transform: rotate(15deg);"></div>
                    </div>
                    <h3 style="margin: 0; color: #333; font-size: 18px; font-weight: 700;">${center.name}</h3>
                  </div>
                  <div style="margin-bottom: 8px;">
                    <p style="margin: 0; font-size: 14px; color: #555; font-weight: 500;">${center.address}</p>
                    <p style="margin: 0; font-size: 14px; color: #555;">${center.postalCode} ${center.city}</p>
                  </div>
                  <div style="margin-bottom: 8px;">
                    <p style="margin: 0; font-size: 14px; color: #FFD700; font-weight: 600;">📞 ${center.phone}</p>
                  </div>
                  <div style="margin-bottom: 12px;">
                    <p style="margin: 0; font-size: 13px; color: #666;"><strong>Horaires:</strong> ${center.hours}</p>
                  </div>
                  <button style="background: #FFD700; color: #333; border: none; padding: 10px 20px; border-radius: 25px; font-weight: 700; cursor: pointer; font-size: 14px; font-family: 'Red Hat Display', sans-serif;">
                    En savoir plus
                  </button>
                </div>
              `,
              maxWidth: 360,
              pixelOffset: new google.maps.Size(0, -10)
            });

            marker.addListener("click", () => {
              const isSmall = window.innerWidth < 1024;
              
              // Close all info windows
              markers.forEach(m => {
                if ((m as any).infoWindow) {
                  (m as any).infoWindow.close();
                }
              });
              
              setSelectedCenter(center);
              
              if (isSmall) {
                // Small screen: open drawer and adjust map
                setDrawerOpen(true);
                const zoom = window.innerWidth < 768 ? 10 : 11;
                mapInstance.setZoom(zoom);
                mapInstance.panTo({ lat: center.lat, lng: center.lng });
                setTimeout(() => {
                  const panOffset = Math.round(window.innerHeight * 0.22);
                  mapInstance.panBy(0, panOffset);
                }, 100);
              } else {
                // Desktop: open info window and pan to reveal it
                infoWindow.open(mapInstance, marker);
                setTimeout(() => {
                  mapInstance.panBy(0, -120);
                }, 100);
              }
            });

            (marker as any).infoWindow = infoWindow;
            return marker;
          });

          setMarkers(newMarkers);
          setIsLoading(false);

          // Forcer le redimensionnement après l'initialisation avec zoom adaptatif
          setTimeout(() => {
            window.google.maps.event.trigger(mapInstance, 'resize');
            mapInstance.setCenter(initialCenter);
            mapInstance.setZoom(initialZoom);
          }, 1000);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de Google Maps:", error);
        setIsLoading(false);
      }
    };

    initMap();
  }, []);

  const handleCenterClick = (center: YellowGlassCenter) => {
    setSelectedCenter(center);
    
    if (map) {
      const marker = markers.find(m => m.getTitle() === center.name);
      
      // Close all info windows first
      markers.forEach(m => {
        if ((m as any).infoWindow) {
          (m as any).infoWindow.close();
        }
      });
      
      if (isSmallScreen) {
        // Small screen: open drawer
        setDrawerOpen(true);
        const zoom = window.innerWidth < 768 ? 10 : 11;
        map.setZoom(zoom);
        map.panTo({ lat: center.lat, lng: center.lng });
        setTimeout(() => {
          const panOffset = Math.round(window.innerHeight * 0.22);
          map.panBy(0, panOffset);
        }, 100);
      } else {
        // Desktop: open info window
        const focusZoom = 12;
        map.setZoom(focusZoom);
        map.panTo({ lat: center.lat, lng: center.lng });
        
        if (marker && (marker as any).infoWindow) {
          (marker as any).infoWindow.open(map, marker);
          setTimeout(() => {
            map.panBy(0, -120);
          }, 100);
        }
      }
    }
  };

  const resetView = () => {
    setSelectedCenter(null);
    setDrawerOpen(false);
    if (map) {
      const resetCenter = getResponsiveCenter();
      const resetZoom = getResponsiveZoom();
      map.panTo(resetCenter);
      map.setZoom(resetZoom);
      markers.forEach(m => {
        if ((m as any).infoWindow) {
          (m as any).infoWindow.close();
        }
      });
    }
  };

  const filteredCenters = YELLOW_GLASS_CENTERS.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.postalCode.includes(searchTerm)
  );

  return (
    <div className="bg-gray-50 min-h-screen" style={{ fontFamily: "'Red Hat Display', sans-serif" }}>
      {/* Layout unifié responsive */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Sidebar - Toujours visible */}
        <div className="w-full lg:w-96 bg-white shadow-lg overflow-y-auto order-2 lg:order-1">
          <div className="p-4 lg:p-6">
            {/* Section recherche */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Nos centres ({YELLOW_GLASS_CENTERS.length})
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Choisissez un centre pour le localiser
              </p>
              
              {/* Barre de recherche */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ville, Code postal..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Bouton géolocalisation */}
              <button className="w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-semibold text-sm flex items-center justify-center gap-2">
                📍 Me géolocaliser
              </button>
            </div>

            {/* Bouton retour vue générale */}
            {selectedCenter && (
              <button
                onClick={resetView}
                className="mb-4 text-yellow-600 hover:text-yellow-700 flex items-center gap-2 font-semibold text-sm"
              >
                <Navigation2 size={16} />
                Voir tous les centres
              </button>
            )}

            {/* Liste des centres */}
            <div className="space-y-4">
              {filteredCenters.map((center) => (
                <div
                  key={center.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    selectedCenter?.id === center.id
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                  onClick={() => handleCenterClick(center)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {center.name}
                    </h3>
                    <span className="bg-yellow-400 text-gray-800 text-xs px-2 py-1 rounded-full font-bold">
                      {center.id}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0 text-yellow-600" />
                      <div>
                        <p className="font-medium">{center.address}</p>
                        <p>{center.postalCode} {center.city}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="flex-shrink-0 text-yellow-600" />
                      <span className="font-medium">{center.phone}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Clock size={14} className="mt-0.5 flex-shrink-0 text-yellow-600" />
                      <span className="text-xs">{center.hours}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {center.services.map((service, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full bg-yellow-400 text-gray-800 text-sm px-4 py-2 rounded-full hover:bg-yellow-500 transition-colors font-bold">
                    En savoir plus
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container - Toujours visible avec forçage du redimensionnement */}
        <div className="flex-1 relative order-1 lg:order-2" style={{ height: '320px' }} data-mobile-height="320px" data-desktop-height="100vh">
          {isLoading && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium text-sm">Chargement de la carte...</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" style={{ minHeight: '320px' }} />
        </div>
        
      </div>

      {/* Drawer for mobile/tablet */}
      <CenterDetailsDrawer
        center={selectedCenter}
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) {
            setSelectedCenter(null);
          }
        }}
      />
    </div>
  );
};

export default Index;
