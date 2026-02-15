
import React, { useState } from 'react';
import { CATEGORIES, CATEGORY_LABELS, LANGUAGES, Language, TRANSLATIONS } from '../constants';

interface HeaderProps {
  onCategoryClick: (cat: string) => void;
  onLogoClick: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ onCategoryClick, onLogoClick, currentLang, onLanguageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];
  const labels = CATEGORY_LABELS[currentLang];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md border-b border-gray-100 font-sans">
      <div className="bg-primary text-white py-1 md:py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-[10px] md:text-xs font-semibold uppercase tracking-wider">
          <div className="hidden md:block">{t.voice}</div>
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
          {CATEGORIES.slice(0, 8).map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onCategoryClick(cat)}
                className="text-sm font-bold uppercase text-gray-700 hover:text-primary transition-colors"
              >
                {labels[cat] || cat}
              </button>
            </li>
          ))}
          <li className="relative group">
            <button className="text-sm font-bold uppercase text-gray-700 hover:text-primary flex items-center">
              {t.more} <span className="ml-1 text-[8px]">▼</span>
            </button>
            <ul className="absolute right-0 top-full bg-white shadow-xl py-2 w-48 hidden group-hover:block border border-gray-100">
              {CATEGORIES.slice(8).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onCategoryClick(cat)}
                    className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-primary"
                  >
                    {labels[cat] || cat}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <button className="lg:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />}
          </svg>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 absolute w-full left-0 shadow-xl max-h-[80vh] overflow-y-auto">
          <ul className="flex flex-col px-6 space-y-4">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => {
                    onCategoryClick(cat);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-lg font-bold uppercase text-gray-800 hover:text-primary"
                >
                  {labels[cat] || cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
