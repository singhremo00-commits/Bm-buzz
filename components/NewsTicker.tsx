
import React from 'react';
import { BREAKING_NEWS, Language, TRANSLATIONS } from '../constants';

interface NewsTickerProps {
  currentLang: Language;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const newsList = BREAKING_NEWS[currentLang] || BREAKING_NEWS.en;

  return (
    <div className="bg-gray-100 border-b border-gray-200 overflow-hidden py-2 hidden sm:block">
      <div className="container mx-auto px-4 flex items-center">
        <div className="bg-primary text-white text-[10px] font-bold px-3 py-1 uppercase rounded-sm mr-4 whitespace-nowrap">
          {t.breaking}
        </div>
        <div className="relative w-full overflow-hidden h-6">
          <div className="flex space-x-12 whitespace-nowrap news-ticker-animation absolute top-0 left-0">
            {newsList.map((news, idx) => (
              <span key={idx} className="text-sm font-semibold text-gray-700 italic">
                {news}
              </span>
            ))}
            {newsList.map((news, idx) => (
              <span key={`dup-${idx}`} className="text-sm font-semibold text-gray-700 italic">
                {news}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
