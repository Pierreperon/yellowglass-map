import React from 'react';
import { MapPin, Phone, X, Mail } from 'lucide-react';
import mapPinLogo from '@/assets/MapPin.png';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

interface YellowGlassCenter {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  url: string;
  lat: number;
  lng: number;
}

interface CenterDetailsDrawerProps {
  center: YellowGlassCenter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export const CenterDetailsDrawer: React.FC<CenterDetailsDrawerProps> = ({
  center,
  open,
  onOpenChange,
}) => {
  if (!center) return null;

  const phoneNumber = center.phone.replace(/\s/g, '');

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent 
        className="h-[75vh] md:h-[70vh] lg:hidden"
        aria-labelledby="drawer-title"
      >
        <div className="overflow-y-auto overscroll-contain h-full">
          <DrawerHeader className="relative border-b pb-4">
            <DrawerClose className="absolute right-4 top-4" asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                data-testid="close-drawer"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
            
            <div className="flex items-center gap-3 pr-12">
              <img src={mapPinLogo} alt="Yellow Glass" className="w-10 h-12 flex-shrink-0" />
              <DrawerTitle id="drawer-title" className="text-xl font-bold text-left">
                {center.name}
              </DrawerTitle>
            </div>
            <DrawerDescription className="sr-only">
              Details for {center.name}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-6 space-y-6">
            {/* Address Section */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{center.address}</p>
                  <p className="text-gray-600">
                    {center.postalCode} {center.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <a
                  href={`tel:${phoneNumber}`}
                  className="font-semibold text-yellow-600 hover:text-yellow-700 transition-colors"
                  data-testid="phone-link"
                >
                  {center.phone}
                </a>
              </div>
            </div>

            {/* Email Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <a
                  href={`mailto:${center.email}`}
                  className="font-semibold text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  {center.email}
                </a>
              </div>
            </div>

            {/* CTA Button */}
            <a 
              href={center.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full py-6"
                data-testid="learn-more-cta"
              >
                En savoir plus
              </Button>
            </a>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
