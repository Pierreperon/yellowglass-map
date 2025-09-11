import { Phone, MapPin, Calendar } from 'lucide-react';
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
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-foreground mb-1">
            {agency.name}
          </h3>
          <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground text-sm font-bold rounded-full">
            {agency.id}
          </span>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-start text-sm text-muted-foreground">
          <MapPin size={16} className="mr-2 mt-0.5 text-primary flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground">{agency.address}</p>
            <p>{agency.postalCode} {agency.city}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-primary">
          <Phone size={16} className="mr-2" />
          <span className="font-semibold text-sm">{agency.phone}</span>
        </div>
        <button className="btn-hero text-xs">
          <Calendar size={14} className="mr-1" />
          Rendez-vous
        </button>
      </div>
    </div>
  );
};