import { Phone, MapPin, Calendar, Clock } from 'lucide-react';
import { Agency } from '@/types/agency';

interface AgencyCardProps {
  agency: Agency;
  isSelected: boolean;
  onClick: (agency: Agency) => void;
}

export const AgencyCard = ({ agency, isSelected, onClick }: AgencyCardProps) => {
  return (
    <div
      className={`agency-card animate-fade-in-up ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(agency)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-lg text-foreground">
          {agency.name}
        </h3>
        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground text-sm font-bold rounded-full">
          {agency.id}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-start text-sm">
          <MapPin size={16} className="mr-2 mt-0.5 text-primary flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground">{agency.address}</p>
            <p className="text-muted-foreground">{agency.postalCode} {agency.city}</p>
          </div>
        </div>
        
        <div className="flex items-center text-sm">
          <Phone size={16} className="mr-2 text-primary flex-shrink-0" />
          <span className="font-medium text-foreground">{agency.phone}</span>
        </div>
        
        <div className="flex items-start text-sm">
          <Clock size={16} className="mr-2 mt-0.5 text-primary flex-shrink-0" />
          <span className="text-xs text-muted-foreground">{agency.hours}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {agency.services.map((service, index) => (
            <span
              key={index}
              className="bg-secondary text-muted-foreground text-xs px-2 py-1 rounded-full"
            >
              {service}
            </span>
          ))}
        </div>
      </div>
      
      <button className="btn-hero text-xs w-full">
        <Calendar size={14} className="mr-1" />
        En savoir plus
      </button>
    </div>
  );
};