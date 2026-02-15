
import React from 'react';
import { CATEGORIES, Language, TRANSLATIONS } from '../constants';

interface FooterProps {
  currentLang: Language;
}

const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  return (
    <footer className="bg-secondary text-white pt-16 pb-8 font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h2 className="text-3xl font-extrabold mb-6">BM<span className="text-primary">BUZZ</span></h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              BMBuzz is the premier news portal dedicated to the Bishnupriya community worldwide. 
              We bring you the latest in music, movies, culture, and social updates.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="hover:text-primary transition-colors"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-primary transition-colors"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sitemap</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 uppercase tracking-widest">Categories</h3>
            <ul className="grid grid-cols-2 gap-y-3 text-sm text-gray-400">
              {CATEGORIES.slice(1, 11).map((cat) => (
                <li key={cat}><a href="#" className="hover:text-white transition-colors">{cat}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 uppercase tracking-widest">Contact Info</h3>
            <div className="space-y-4 text-sm text-gray-400">
              <p className="flex items-center">
                <span className="text-primary mr-3 font-bold">Email:</span>
                contact@bmbuzz.com
              </p>
              <p className="flex items-center">
                <span className="text-primary mr-3 font-bold">Location:</span>
                Guwahati, Assam / Tripura / London
              </p>
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-[10px] uppercase font-bold text-gray-500">Editorial Line</p>
                <p>+91 987 654 3210</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-4 md:space-y-0">
          <p>© 2026 BMBuzz. All Rights Reserved.</p>
          <p className="flex items-center">
            {t.designed} 
            <span className="mx-2">|</span> 
            {t.madeIn}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
