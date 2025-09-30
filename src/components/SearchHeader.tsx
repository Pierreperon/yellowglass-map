import { Search, Navigation2 } from 'lucide-react';

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
    <header className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Logo Yellow Glass blanc sur fond noir */}
        <div className="flex justify-center mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-2">
            <span className="text-4xl font-bold text-white">yell</span>
            {/* Logo ovale blanc */}
            <div className="relative mx-2">
              <div className="bg-white rounded-full w-16 h-8 flex items-center justify-center">
                <div className="bg-white w-10 h-3 rounded-full border-2 border-gray-900 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12">
                    <div className="bg-gray-900 w-6 h-1.5 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <span className="text-4xl font-bold text-white">w</span>
            <div className="ml-3">
              <div className="text-2xl font-bold text-white">glass</div>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Trouvez votre centre Yellow Glass
        </h1>
        <p className="text-center text-gray-300 mb-8 text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Spécialiste du remplacement et réparation de pare-brise à domicile
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Ville, Code postal..."
            className="block w-full pl-12 pr-4 py-4 border border-gray-600 rounded-full leading-5 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="text-center mt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button 
            onClick={handleGeolocation}
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full hover:bg-yellow-500 transition-colors font-bold text-lg inline-flex items-center gap-2"
          >
            <Navigation2 size={18} />
            📍 Me géolocaliser
          </button>
        </div>
      </div>
    </header>
  );
};