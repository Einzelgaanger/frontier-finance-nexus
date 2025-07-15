import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Search, Plus } from 'lucide-react';

interface CountrySelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label: string;
}

interface MarketSelectorProps {
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
  placeholder?: string;
  label: string;
}

// List of all countries
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

export const CountrySelector = ({ value, onChange, placeholder = "Search countries...", label }: CountrySelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCountries([]);
    } else {
      const filtered = COUNTRIES.filter(country =>
        country.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10);
      setFilteredCountries(filtered);
    }
  }, [searchTerm]);

  const handleAddCountry = (country: string) => {
    if (!value.includes(country)) {
      onChange([...value, country]);
    }
    setSearchTerm('');
    setFilteredCountries([]);
    setIsOpen(false);
  };

  const handleRemoveCountry = (country: string) => {
    onChange(value.filter(c => c !== country));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      {/* Selected countries */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((country) => (
            <Badge
              key={country}
              variant="secondary"
              className="bg-blue-100 text-blue-700 border-blue-200"
            >
              {country}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 hover:bg-blue-200"
                onClick={() => handleRemoveCountry(country)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10"
          />
        </div>

        {/* Dropdown */}
        {isOpen && filteredCountries.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country}
                type="button"
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => handleAddCountry(country)}
              >
                {country}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const MarketSelector = ({ value, onChange, placeholder = "Search countries and set percentages...", label }: MarketSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [percentage, setPercentage] = useState('');

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCountries([]);
    } else {
      const filtered = COUNTRIES.filter(country =>
        country.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !Object.keys(value).includes(country)
      ).slice(0, 10);
      setFilteredCountries(filtered);
    }
  }, [searchTerm, value]);

  const handleAddMarket = (country: string, percentageValue: number) => {
    const currentTotal = getTotalPercentage();
    const newTotal = currentTotal + percentageValue;
    
    if (percentageValue > 0 && percentageValue <= 100 && newTotal <= 100) {
      const newValue = { ...value, [country]: percentageValue };
      onChange(newValue);
      setSearchTerm('');
      setSelectedCountry('');
      setPercentage('');
      setFilteredCountries([]);
      setIsOpen(false);
    }
  };

  const handleRemoveMarket = (country: string) => {
    const newValue = { ...value };
    delete newValue[country];
    onChange(newValue);
  };

  const getTotalPercentage = () => {
    return Object.values(value).reduce((sum, val) => sum + val, 0);
  };

  const canAddMarket = (percentageValue: number) => {
    const currentTotal = getTotalPercentage();
    return percentageValue > 0 && percentageValue <= 100 && (currentTotal + percentageValue) <= 100;
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      {/* Selected markets with percentages */}
      {Object.keys(value).length > 0 && (
        <div className="space-y-2">
          {Object.entries(value).map(([country, percentage]) => (
            <div key={country} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <span className="text-sm font-medium text-gray-700">{country}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{percentage}%</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-red-100"
                  onClick={() => handleRemoveMarket(country)}
                >
                  <X className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
          <div className="text-xs text-gray-500">
            Total: {getTotalPercentage()}% {getTotalPercentage() > 100 && <span className="text-red-500">(Exceeds 100%)</span>}
          </div>
        </div>
      )}

      {/* Add new market */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search country..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10"
          />
        </div>

        {/* Dropdown */}
        {isOpen && filteredCountries.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country}
                type="button"
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => {
                  setSelectedCountry(country);
                  setSearchTerm(country);
                  setIsOpen(false);
                }}
              >
                {country}
              </button>
            ))}
          </div>
        )}

        {/* Percentage input */}
        {selectedCountry && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Percentage (1-100)"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                min="1"
                max="100"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => handleAddMarket(selectedCountry, parseInt(percentage) || 0)}
                disabled={!percentage || !canAddMarket(parseInt(percentage) || 0)}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {selectedCountry && percentage && !canAddMarket(parseInt(percentage) || 0) && (
              <div className="text-xs text-red-500">
                Total percentage would exceed 100%. Current total: {getTotalPercentage()}%
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 