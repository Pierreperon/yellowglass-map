import { useState } from 'react';
import { AGENCIES, Agency } from '@/types/agency';
import { SearchHeader } from '@/components/SearchHeader';
import { AgencyCard } from '@/components/AgencyCard';
import { MapComponent } from '@/components/MapComponent';

const Index = () => {
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAgencyClick = (agency: Agency) => {
    setSelectedAgency(agency);
  };

  const handleGeolocation = () => {
    // For demo purposes, just show a message
    // In a real app, you'd find the nearest agency
    alert('Fonctionnalité de géolocalisation en cours de développement');
  };

  const filteredAgencies = AGENCIES.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.postalCode.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <SearchHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onGeolocation={handleGeolocation}
      />

      <div className="flex h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <div className="w-96 bg-white/80 backdrop-blur-sm border-r border-border/50 overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Nos agences ({filteredAgencies.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Cliquez sur une agence pour la localiser
              </p>
            </div>
            
            <div className="space-y-4">
              {filteredAgencies.map((agency, index) => (
                <div 
                  key={agency.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <AgencyCard
                    agency={agency}
                    isSelected={selectedAgency?.id === agency.id}
                    onClick={handleAgencyClick}
                  />
                </div>
              ))}
            </div>
            
            {filteredAgencies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune agence trouvée pour "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 p-4">
          <MapComponent
            agencies={filteredAgencies}
            selectedAgency={selectedAgency}
            onAgencySelect={handleAgencyClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
