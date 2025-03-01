import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ChevronDown } from 'lucide-react';

const Header: React.FC<{ variant?: 'default' | 'ohub' }> = ({ variant = 'default' }) => {
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [showPartnershipDropdown, setShowPartnershipDropdown] = useState(false);
  const [showInvestorDropdown, setShowInvestorDropdown] = useState(false);
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];
  
  if (variant === 'ohub') {
    return (
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/ohub" className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  O
                </div>
                <span className="ml-2 text-2xl font-bold text-gray-800">hub</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <Link to="/ohub" className="text-gray-700 hover:text-blue-500 font-medium">
                Home
              </Link>
              
              <div className="relative group">
                <button 
                  className="flex items-center text-gray-700 hover:text-blue-500 font-medium"
                  onMouseEnter={() => setShowTeamDropdown(true)}
                  onMouseLeave={() => setShowTeamDropdown(false)}
                >
                  About <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {showTeamDropdown && (
                  <div 
                    className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10"
                    onMouseEnter={() => setShowTeamDropdown(true)}
                    onMouseLeave={() => setShowTeamDropdown(false)}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Team
                      <div className="absolute left-full top-0 mt-0 w-48 bg-white shadow-lg rounded-md py-2 hidden group-hover:block">
                        <Link to="/team/board" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Board of Directors
                        </Link>
                        <Link to="/team/advisory" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Advisory Committee
                        </Link>
                      </div>
                    </div>
                    <Link to="/about/partnership" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Partnership
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button 
                  className="flex items-center text-gray-700 hover:text-blue-500 font-medium"
                  onMouseEnter={() => setShowInvestorDropdown(true)}
                  onMouseLeave={() => setShowInvestorDropdown(false)}
                >
                  Investors <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {showInvestorDropdown && (
                  <div 
                    className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10"
                    onMouseEnter={() => setShowInvestorDropdown(true)}
                    onMouseLeave={() => setShowInvestorDropdown(false)}
                  >
                    <Link to="/investors/dealflow" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Deal Flow
                    </Link>
                    <Link to="/investors/strategic" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Strategic Team
                    </Link>
                    <Link to="/investors/partners" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Partners
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button 
                  className="flex items-center text-gray-700 hover:text-blue-500 font-medium"
                  onMouseEnter={() => setShowResourcesDropdown(true)}
                  onMouseLeave={() => setShowResourcesDropdown(false)}
                >
                  Resources <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {showResourcesDropdown && (
                  <div 
                    className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10"
                    onMouseEnter={() => setShowResourcesDropdown(true)}
                    onMouseLeave={() => setShowResourcesDropdown(false)}
                  >
                    <Link to="/resources/news" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      News
                    </Link>
                    <Link to="/resources/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Blog
                    </Link>
                    <Link to="/resources/studio" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Studio
                    </Link>
                  </div>
                )}
              </div>
              
              <Link to="/events" className="text-gray-700 hover:text-blue-500 font-medium">
                Events
              </Link>
              
              <Link to="/contact" className="text-gray-700 hover:text-blue-500 font-medium">
                Contact Us
              </Link>
            </nav>
            
            <div className="flex items-center">
              <img 
                src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="University Logo" 
                className="h-10"
              />
            </div>
          </div>
        </div>
      </header>
    );
  }
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                alt="Indian Government Logo" 
                className="h-12"
              />
              <div className="ml-2 text-center">
                <p className="font-semibold text-base">OLABS</p>
                <p className="text-xs">Funded by MeitY</p>
                <p className="text-xs">Ministry of Electronics and</p>
                <p className="text-xs">Information Technology</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
              alt="AMRITA Logo" 
              className="h-10 mx-2"
            />
          </div>
        </div>
      </div>
      
      <nav className="bg-gray-100 border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8">
              <Link to="/" className="px-3 py-4 text-gray-700 font-medium hover:text-blue-500">Home</Link>
              <div className="px-3 py-4 text-gray-700 font-medium hover:text-blue-500 cursor-pointer">About</div>
              <div className="px-3 py-4 text-gray-700 font-medium hover:text-blue-500 cursor-pointer">In the news</div>
              <div className="px-3 py-4 text-gray-700 font-medium hover:text-blue-500 cursor-pointer">Workshops</div>
              <div className="px-3 py-4 text-gray-700 font-medium hover:text-blue-500 cursor-pointer">Training</div>
              <div className="px-3 py-4 text-gray-700 font-medium hover:text-blue-500 cursor-pointer">Download</div>
              <Link to="/ohub" className="px-3 py-4 text-orange-500 font-medium hover:text-orange-600">OHUB</Link>
              <div className="px-3 py-4 text-gray-700 font-medium hover:text-blue-500 cursor-pointer">Contact us</div>
            </div>
            
            <div className="flex items-center relative">
              <div 
                className="px-3 py-4 text-gray-700 font-medium hover:text-blue-500 cursor-pointer flex items-center"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                {currentLanguage} <Globe className="ml-1 h-4 w-4" />
              </div>
              
              {showLanguageDropdown && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white shadow-lg rounded-md py-2 z-10">
                  {languages.map(lang => (
                    <div 
                      key={lang} 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setCurrentLanguage(lang);
                        setShowLanguageDropdown(false);
                      }}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;