
import React from 'react';
import { MOCK_NEWS, Language, TRANSLATIONS, CATEGORY_LABELS } from '../constants';
import { TrendingUp, Clock, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface SidebarProps {
  onPostClick: (id: string) => void;
  currentLang: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ onPostClick, currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const labels = CATEGORY_LABELS[currentLang];
  
  // Popular posts
  const popularPosts = MOCK_NEWS.slice(0, 3);
  
  // Recent posts
  const recentPosts = [...MOCK_NEWS].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 4);

  return (
    <aside className="space-y-10">
      {/* Newsletter Widget */}
      <div className="bg-secondary text-white p-6 rounded-sm shadow-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Mail size={20} className="text-primary" />
          <h3 className="text-xl font-bold font-serif">{t.join}</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">{t.newsletterSub}</p>
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder={t.placeholder} 
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-sm text-sm focus:outline-none focus:border-primary transition-colors" 
          />
          <button className="w-full bg-primary hover:bg-red-700 text-white font-bold py-2 uppercase text-xs tracking-widest transition-colors flex items-center justify-center space-x-2">
            <span>{t.subscribe}</span>
          </button>
        </form>
      </div>

      {/* Popular Posts Section */}
      <section>
        <div className="flex items-center space-x-2 mb-6 border-b-2 border-primary pb-1">
          <TrendingUp size={18} className="text-primary" />
          <h3 className="text-lg font-extrabold uppercase tracking-tight">{t.popular}</h3>
        </div>
        <div className="space-y-6">
          {popularPosts.map((post, i) => {
            const info = post.translations[currentLang] || post.translations.en;
            return (
              <div key={post.id} className="flex items-start space-x-4 cursor-pointer group" onClick={() => onPostClick(post.id)}>
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 relative overflow-hidden rounded-sm">
                  <img src={post.image} alt={info.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-0 left-0 bg-primary text-white text-[9px] px-1 font-bold">#{i + 1}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase mb-1 block">
                    {labels[post.category] || post.category}
                  </span>
                  <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 font-serif">
                    {info.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Posts Section */}
      <section>
        <div className="flex items-center space-x-2 mb-6 border-b-2 border-secondary pb-1">
          <Clock size={18} className="text-secondary" />
          <h3 className="text-lg font-extrabold uppercase tracking-tight">{t.recent}</h3>
        </div>
        <div className="space-y-5">
          {recentPosts.map((post) => {
            const info = post.translations[currentLang] || post.translations.en;
            return (
              <div 
                key={`recent-${post.id}`} 
                className="group cursor-pointer border-b border-gray-100 pb-4 last:border-0"
                onClick={() => onPostClick(post.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    {labels[post.category] || post.category}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">{post.date}</span>
                </div>
                <h4 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 font-serif">
                  {info.title}
                </h4>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social Connect Widget */}
      <section>
        <div className="flex items-center space-x-2 mb-6 border-b-2 border-primary pb-1">
          <h3 className="text-lg font-extrabold uppercase tracking-tight">{t.connect}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a href="#" className="flex items-center justify-center space-x-2 py-2 bg-[#1877F2] text-white text-[10px] font-bold uppercase rounded-sm hover:opacity-90">
            <Facebook size={12} /> <span>Facebook</span>
          </a>
          <a href="#" className="flex items-center justify-center space-x-2 py-2 bg-[#1DA1F2] text-white text-[10px] font-bold uppercase rounded-sm hover:opacity-90">
            <Twitter size={12} /> <span>Twitter</span>
          </a>
          <a href="#" className="flex items-center justify-center space-x-2 py-2 bg-[#E4405F] text-white text-[10px] font-bold uppercase rounded-sm hover:opacity-90">
            <Instagram size={12} /> <span>Instagram</span>
          </a>
          <a href="#" className="flex items-center justify-center space-x-2 py-2 bg-[#FF0000] text-white text-[10px] font-bold uppercase rounded-sm hover:opacity-90">
            <Youtube size={12} /> <span>Youtube</span>
          </a>
        </div>
      </section>

      {/* Ad Placeholder */}
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center border border-dashed border-gray-300 text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center px-4">
        {t.partners}
      </div>
    </aside>
  );
};

export default Sidebar;
