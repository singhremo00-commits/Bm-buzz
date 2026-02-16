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
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const labels = CATEGORY_LABELS[currentLang] || CATEGORY_LABELS.en;

  const handleAreaClick = (cat: string) => {
    onCategoryClick(cat);
    setIsNewsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-white shadow-xl border-b border-gray-100 font-sans">
      <div className="bg-secondary text-white py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest">
          <div className="hidden md:flex items-center space-x-3">
            <Globe size={14} className="text-primary" />
            <span className="opacity-90">{t.voice}</span>
          </div>
          <div className="flex items-center space-x-6 ml-auto md:ml-0">
            <span className="hidden sm:inline opacity-70">Friday, October 24, 2025</span>
            <div className="flex items-center space-x-3 border-l border-white/20 pl-6">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code as Language)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    currentLang === lang.code ? 'bg-primary text-white font-black' : 'opacity-60 hover:opacity-100'
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
          <h1 className="text-2xl md:text-3xl font-black font-title tracking-tighter text-secondary">
            BM<span className="text-primary">BUZZ</span>
          </h1>
        </div>

        <ul className="hidden lg:flex items-center space-x-8">
          <li>
            <button
              onClick={() => onCategoryClick('Home')}
              className="text-xs font-black font-title uppercase text-secondary hover:text-primary transition-all tracking-wider"
            >
              {labels['Home']}
            </button>
          </li>
          
          <li className="relative group" 
              onMouseEnter={() => setIsNewsDropdownOpen(true)}
              onMouseLeave={() => setIsNewsDropdownOpen(false)}>
            <button
              onClick={() => onCategoryClick('News')}
              className="flex items-center space-x-2 text-xs font-black font-title uppercase text-secondary hover:text-primary transition-all tracking-wider py-1"
            >
              <CategoryIcon category="News" className="text-primary/70" />
              <span>{labels['News']}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isNewsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Area Dropdown */}
            <div className={`absolute left-0 top-full bg-white shadow-2xl border border-gray-100 rounded-2xl py-3 min-w-[240px] transition-all duration-300 transform origin-top ${isNewsDropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
              <div className="px-5 py-2 text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50 mb-2">{t.areas}</div>
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {REGIONAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleAreaClick(cat)}
                    className="flex items-center space-x-4 w-full px-5 py-3 text-left text-xs font-bold text-secondary hover:bg-primary/5 hover:text-primary transition-all border-l-4 border-transparent hover:border-primary uppercase tracking-wide"
                  >
                    <CategoryIcon category={cat} className="text-gray-300 group-hover:text-primary" />
                    <span>{labels[cat] || cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </li>

          {GENERAL_CATEGORIES.filter(c => c !== 'News').map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onCategoryClick(cat)}
                className="flex items-center space-x-2 text-xs font-black font-title uppercase text-secondary hover:text-primary transition-all tracking-wider"
              >
                <CategoryIcon category={cat} className="text-primary/70" />
                <span>{labels[cat] || cat}</span>
              </button>
            </li>
          ))}
        </ul>

        <button 
          className="lg:hidden p-2 text-secondary bg-gray-50 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Popup */}
      <div 
        className={`lg:hidden fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-black font-title tracking-tighter text-secondary">
              BM<span className="text-primary">BUZZ</span>
            </h2>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-all"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-5 px-5 space-y-6 pb-20">
            {/* General Categories Section (Displayed First) */}
            <div>
              <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mb-4 border-b border-gray-50 pb-2">
                Categories
              </div>
              <div className="flex flex-col space-y-2">
                {GENERAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { onCategoryClick(cat); setIsMenuOpen(false); }}
                    className="flex items-center space-x-3 p-3 text-base font-bold font-title uppercase text-secondary hover:bg-primary/5 hover:text-primary rounded-xl transition-all active:scale-[0.98]"
                  >
                    <CategoryIcon category={cat} className="text-primary/50" />
                    <span>{labels[cat] || cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* News Regions Section (Displayed Second - "Niche Rakho") */}
            <div>
              <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mb-4 border-b border-gray-50 pb-2">
                {labels['News']} - {t.areas}
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                {REGIONAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleAreaClick(cat)}
                    className="flex items-center space-x-2 text-xs font-semibold text-secondary hover:text-primary transition-all uppercase tracking-tight bg-gray-50/50 p-2.5 rounded-lg hover:bg-primary/5 active:scale-95 border border-transparent hover:border-primary/10"
                  >
                    <CategoryIcon category={cat} className="text-primary/30" />
                    <span className="truncate">{labels[cat] || cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection in Menu */}
            <div className="pt-6 border-t border-gray-100">
               <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mb-3">Language</div>
               <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => onLanguageChange(lang.code as Language)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        currentLang === lang.code 
                          ? 'bg-primary border-primary text-white shadow-sm' 
                          : 'bg-white border-gray-200 text-secondary hover:border-primary'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
               </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 text-center bg-gray-50">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 opacity-60">Voice of Bishnupriya Community</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;