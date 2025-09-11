import { Search, MapPin, Navigation } from 'lucide-react';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onGeolocation: () => void;
}

export const SearchHeader = ({ searchTerm, onSearchChange, onGeolocation }: SearchHeaderProps) => {
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Position:', position.coords);
          onGeolocation();
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Impossible d\'accéder à votre position. Veuillez autoriser la géolocalisation.');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  return (
    <div className="bg-white shadow-lg relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 animate-fade-in-up">
            Trouvez votre agence
          </h1>
          <div className="text-5xl font-black text-primary mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            123 Pare-Brise
          </div>
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Spécialiste du remplacement et de la réparation de pare-brise
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par ville, code postal..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          {/* Geolocation Button */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button 
              onClick={handleGeolocation}
              className="btn-hero inline-flex items-center"
            >
              <Navigation size={18} className="mr-2" />
              Me géolocaliser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};