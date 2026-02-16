import React, { useState } from 'react';
import { CATEGORY_LABELS, LANGUAGES, Language, TRANSLATIONS, REGIONAL_CATEGORIES, GENERAL_CATEGORIES } from '../constants';
import { 
  Menu, 
  X, 
  Globe, 
  ChevronDown, 
  Newspaper, 
  Music, 
  Film, 
  Palmtree, 
  Calendar, 
  Mic2, 
  Video, 
  Image as ImageIcon, 
  Star, 
  Briefcase,
  Building2,
  MapPin,
  Landmark,
  Flag,
  Mountain,
  History,
  Trees,
  Navigation
} from 'lucide-react';

interface HeaderProps {
  onCategoryClick: (cat: string) => void;
  onLogoClick: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

const CategoryIcon: React.FC<{ category: string; className?: string }> = ({ category, className }) => {
  switch (category) {
    case 'News': return <Newspaper className={className} size={14} />;
    case 'Music': return <Music className={className} size={14} />;
    case 'Movies': return <Film className={className} size={14} />;
    case 'Culture': return <Palmtree className={className} size={14} />;
    case 'Events': return <Calendar className={className} size={14} />;
    case 'Interviews': return <Mic2 className={className} size={14} />;
    case 'Videos': return <Video className={className} size={14} />;
    case 'Gallery': return <ImageIcon className={className} size={14} />;
    case 'Talents': return <Star className={className} size={14} />;
    case 'Jobs': return <Briefcase className={className} size={14} />;
    case 'Silchar': return <Building2 className={className} size={14} />;
    case 'Manipuri': return <MapPin className={className} size={14} />;
    case 'Hingala': return <Landmark className={className} size={14} />;
    case 'Baronuni': return <Landmark className={className} size={14} />;
    case 'Bangladesh': return <Flag className={className} size={14} />;
    case 'Tripura': return <Mountain className={className} size={14} />;
    case 'Bikrampur': return <History className={className} size={14} />;
    case 'Patharkandi': return <Trees className={className} size={14} />;
    case 'Guwahati': return <Navigation className={className} size={14} />;
    default: return null;
  }
};

const Header: React.FC<HeaderProps> = ({ onCategoryClick, onLogoClick, currentLang, onLanguageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];
  const labels = CATEGORY_LABELS[currentLang];

  const handleAreaClick = (cat: string) => {
    onCategoryClick(cat);
    setIsNewsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md border-b border-gray-100 font-sans">
      <div className="bg-secondary text-white py-1 md:py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-[10px] md:text-xs font-semibold uppercase tracking-wider">
          <div className="hidden md:flex items-center space-x-2">
            <Globe size={12} className="text-primary" />
            <span>{t.voice}</span>
          </div>
          <div className="flex items-center space-x-4 ml-auto md:ml-0">
            <span className="hidden sm:inline">Friday, October 24, 2025</span>
            <div className="flex items-center space-x-2 border-l border-white/20 pl-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code as Language)}
                  className={`px-2 py-1 rounded transition-colors hover:bg-white/10 ${
                    currentLang === lang.code ? 'bg-white/20 font-bold' : 'opacity-70'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="cursor-pointer" onClick={onLogoClick}>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tighter text-secondary">
            BM<span className="text-primary">BUZZ</span>
          </h1>
        </div>

        <ul className="hidden lg:flex items-center space-x-6">
          <li>
            <button
              onClick={() => onCategoryClick('Home')}
              className="text-sm font-bold uppercase text-gray-700 hover:text-primary transition-colors tracking-tight"
            >
              {labels['Home']}
            </button>
          </li>
          
          <li className="relative group" 
              onMouseEnter={() => setIsNewsDropdownOpen(true)}
              onMouseLeave={() => setIsNewsDropdownOpen(false)}>
            <button
              onClick={() => onCategoryClick('News')}
              className="flex items-center space-x-1 text-sm font-bold uppercase text-gray-700 hover:text-primary transition-colors tracking-tight py-2"
            >
              <CategoryIcon category="News" className="text-primary/70" />
              <span>{labels['News']}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isNewsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Area Dropdown */}
            <div className={`absolute left-0 top-full bg-white shadow-xl border border-gray-100 rounded-b-lg py-2 min-w-[200px] transition-all duration-200 transform origin-top ${isNewsDropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
              <div className="px-4 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-2">{t.areas}</div>
              {REGIONAL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleAreaClick(cat)}
                  className="flex items-center space-x-3 w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors border-l-2 border-transparent hover:border-primary"
                >
                  <CategoryIcon category={cat} className="text-gray-400 group-hover:text-primary" />
                  <span>{labels[cat] || cat}</span>
                </button>
              ))}
            </div>
          </li>

          {GENERAL_CATEGORIES.filter(c => c !== 'News').map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onCategoryClick(cat)}
                className="flex items-center space-x-1 text-sm font-bold uppercase text-gray-700 hover:text-primary transition-colors tracking-tight"
              >
                <CategoryIcon category={cat} className="text-primary/70" />
                <span>{labels[cat] || cat}</span>
              </button>
            </li>
          ))}
        </ul>

        <button className="lg:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 absolute w-full left-0 shadow-xl max-h-[80vh] overflow-y-auto z-50">
          <ul className="flex flex-col px-6 space-y-4 pb-8">
            <li>
              <div className="text-primary font-black uppercase tracking-widest text-xs mb-4 border-b pb-1">{labels['News']}</div>
              <div className="grid grid-cols-2 gap-4">
                {REGIONAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleAreaClick(cat)}
                    className="flex items-center space-x-2 text-sm font-bold text-gray-600 hover:text-primary"
                  >
                    <CategoryIcon category={cat} className="text-primary/50" />
                    <span>{labels[cat]}</span>
                  </button>
                ))}
              </div>
            </li>

            <li>
              <div className="text-primary font-black uppercase tracking-widest text-xs mb-4 border-b pb-1">Categories</div>
              <div className="flex flex-col space-y-3">
                {GENERAL_CATEGORIES.filter(c => c !== 'News').map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { onCategoryClick(cat); setIsMenuOpen(false); }}
                    className="flex items-center space-x-3 text-lg font-bold uppercase text-gray-800"
                  >
                    <CategoryIcon category={cat} className="text-primary" />
                    <span>{labels[cat] || cat}</span>
                  </button>
                ))}
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;