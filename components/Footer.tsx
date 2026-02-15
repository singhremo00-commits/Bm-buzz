
import React from 'react';
import { CATEGORIES, Language, TRANSLATIONS } from '../constants';
import { Mail, MapPin, Phone, Facebook, Twitter, Youtube, ExternalLink } from 'lucide-react';

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
            <h2 className="text-3xl font-extrabold mb-6 tracking-tighter">BM<span className="text-primary">BUZZ</span></h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              BMBuzz is the premier news portal dedicated to the Bishnupriya community worldwide. 
              We bring you the latest in music, movies, culture, and social updates.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors flex items-center group"><ExternalLink size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" /> About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center group"><ExternalLink size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" /> Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center group"><ExternalLink size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" /> Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center group"><ExternalLink size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" /> Terms of Service</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 uppercase tracking-widest">Categories</h3>
            <ul className="grid grid-cols-2 gap-y-3 text-sm text-gray-400">
              {CATEGORIES.slice(1, 11).map((cat) => (
                <li key={cat}><a href="#" className="hover:text-white transition-colors uppercase font-bold text-[10px] tracking-wider">{cat}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 uppercase tracking-widest">Contact Info</h3>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start">
                <Mail size={16} className="text-primary mr-3 mt-1" />
                <span>contact@bmbuzz.com</span>
              </div>
              <div className="flex items-start">
                <MapPin size={16} className="text-primary mr-3 mt-1" />
                <span>Guwahati, Assam / Tripura / London</span>
              </div>
              <div className="flex items-start">
                <Phone size={16} className="text-primary mr-3 mt-1" />
                <span>+91 987 654 3210</span>
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
