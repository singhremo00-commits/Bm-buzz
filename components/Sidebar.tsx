import React from 'react';
import { Language, TRANSLATIONS, CATEGORY_LABELS } from '../constants';
// Added Star to the lucide-react imports
import { TrendingUp, Clock, Mail, Facebook, Twitter, Instagram, Youtube, Star } from 'lucide-react';
import { NewsPost } from '../types';

interface SidebarProps {
  onPostClick: (id: string) => void;
  currentLang: Language;
  newsData: NewsPost[];
}

const Sidebar: React.FC<SidebarProps> = ({ onPostClick, currentLang, newsData }) => {
  const t = TRANSLATIONS[currentLang];
  const labels = CATEGORY_LABELS[currentLang];
  
  // Popular posts (mock logic: first 3)
  const popularPosts = newsData.slice(0, 3);
  
  // Recent posts
  const recentPosts = [...newsData].slice(0, 5);

  return (
    <aside className="space-y-12">
      <div className="bg-secondary text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary p-2 rounded-lg"><Mail size={20} className="text-white" /></div>
            <h3 className="text-2xl font-black font-title tracking-tight uppercase">{t.join}</h3>
          </div>
          <p className="text-sm text-gray-400 mb-6 font-medium leading-relaxed">{t.newsletterSub}</p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder={t.placeholder} className="w-full px-5 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-gray-500" />
            <button className="w-full bg-primary hover:bg-red-700 text-white font-black py-3.5 uppercase text-xs tracking-[0.2em] rounded-xl transition-all shadow-lg active:scale-95">
              <span>{t.subscribe}</span>
            </button>
          </form>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-8 border-b-4 border-primary/20 pb-3">
          <h3 className="text-lg font-black font-title uppercase tracking-tighter text-secondary flex items-center">
            <TrendingUp size={20} className="text-primary mr-3" />
            {t.popular}
          </h3>
        </div>
        <div className="space-y-8">
          {popularPosts.map((post, i) => {
            const info = post.translations[currentLang] || post.translations.en;
            return (
              <div key={post.id} className="flex items-center space-x-5 cursor-pointer group" onClick={() => onPostClick(post.id)}>
                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 relative overflow-hidden rounded-xl shadow-sm">
                  <img src={post.image || (post as any).imageUrl} alt={info.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <span className="absolute top-0 left-0 bg-primary text-white text-[10px] px-2 py-0.5 font-black rounded-br-lg shadow-md">0{i + 1}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-primary uppercase mb-2 block tracking-widest">{labels[post.category] || post.category}</span>
                  <h4 className="text-sm font-extrabold font-title leading-tight text-secondary group-hover:text-primary transition-colors line-clamp-2 tracking-tight">{info.title}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8 border-b-4 border-secondary/10 pb-3">
          <h3 className="text-lg font-black font-title uppercase tracking-tighter text-secondary flex items-center">
            <Clock size={20} className="text-secondary mr-3" />
            {t.recent}
          </h3>
        </div>
        <div className="space-y-6">
          {recentPosts.map((post) => {
            const info = post.translations[currentLang] || post.translations.en;
            return (
              <div key={`recent-${post.id}`} className="group cursor-pointer border-b border-gray-100 pb-5 last:border-0" onClick={() => onPostClick(post.id)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{labels[post.category] || post.category}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">{post.date}</span>
                </div>
                <h4 className="text-sm font-extrabold font-title leading-snug text-secondary group-hover:text-primary transition-colors line-clamp-2 tracking-tight">{info.title}</h4>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8 border-b-4 border-primary/20 pb-3">
          <h3 className="text-lg font-black font-title uppercase tracking-tighter text-secondary">{t.connect}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <a href="#" className="flex items-center justify-center space-x-2 py-3 bg-[#1877F2] text-white text-[10px] font-black uppercase rounded-xl hover:shadow-xl transition-all active:scale-95"><Facebook size={14} /> <span>Facebook</span></a>
          <a href="#" className="flex items-center justify-center space-x-2 py-3 bg-[#1DA1F2] text-white text-[10px] font-black uppercase rounded-xl hover:shadow-xl transition-all active:scale-95"><Twitter size={14} /> <span>Twitter</span></a>
          <a href="#" className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white text-[10px] font-black uppercase rounded-xl hover:shadow-xl transition-all active:scale-95"><Instagram size={14} /> <span>Instagram</span></a>
          <a href="#" className="flex items-center justify-center space-x-2 py-3 bg-[#FF0000] text-white text-[10px] font-black uppercase rounded-xl hover:shadow-xl transition-all active:scale-95"><Youtube size={14} /> <span>Youtube</span></a>
        </div>
      </section>

      <div className="w-full h-80 bg-white rounded-[2rem] flex flex-col items-center justify-center border-4 border-dashed border-gray-100 text-gray-300 shadow-inner group">
        <div className="bg-gray-50 p-6 rounded-full mb-4 group-hover:scale-110 transition-transform">
          <Star size={32} className="text-gray-200" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-center px-10 leading-loose">
          Partner with <br/> BM Buzz News
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;