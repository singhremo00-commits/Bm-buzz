
import React, { useState } from 'react';
import { Language, TRANSLATIONS, CATEGORIES, CATEGORY_LABELS } from './constants';
import { Lock, FileText, Image as ImageIcon, Tag, Send, ArrowLeft, LogOut, LayoutDashboard, Globe } from 'lucide-react';

interface AdminProps {
  currentLang: Language;
  onBack: () => void;
  onPublish: (data: any) => void;
}

const Admin: React.FC<AdminProps> = ({ currentLang, onBack, onPublish }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'News',
    imageUrl: '',
    description: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'bmbuzz2025') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublish(formData);
    alert('✅ Published Successfully! Your post is now live in the ' + formData.category + ' section.');
    // Reset form
    setFormData({
      title: '',
      category: 'News',
      imageUrl: '',
      description: ''
    });
  };

  const labels = CATEGORY_LABELS['en']; // Use English keys for internal logic

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6 shadow-xl border-4 border-primary">
              <Lock className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-black text-secondary tracking-tighter uppercase">
              BM <span className="text-primary">BUZZ</span> Admin
            </h2>
            <p className="text-gray-400 text-sm mt-3 font-medium">Enter secure credentials to proceed.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-center text-lg font-bold"
                required
              />
              {error && <p className="text-primary text-xs font-black mt-3 text-center uppercase tracking-widest animate-bounce">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white font-black py-4 rounded-xl transition-all shadow-lg transform active:scale-95 flex items-center justify-center space-x-3 uppercase tracking-widest text-sm"
            >
              <span>Authenticate Access</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-colors mt-4"
            >
              &larr; Return to Site
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 -mt-8 -mx-4">
      {/* Admin Header */}
      <header className="bg-black text-white p-6 shadow-2xl flex items-center justify-between sticky top-0 z-50 border-b-4 border-primary">
        <div className="flex items-center space-x-4">
          <div className="bg-primary p-2 rounded-lg">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">
            BM <span className="text-primary">BUZZ</span> <span className="hidden sm:inline">Admin Dashboard</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="hidden md:flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all border border-white/10"
          >
            <Globe size={14} />
            <span>View Website</span>
          </button>
          <button 
            onClick={handleLogout}
            className="bg-white/10 hover:bg-primary text-white px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center space-x-2 border border-white/20"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-primary/5 p-8 border-b border-gray-100">
            <h2 className="text-3xl font-black text-secondary tracking-tight uppercase flex items-center">
              <span className="w-10 h-1 text-primary mr-4 block"></span>
              Publish <span className="text-primary ml-2 underline">New Content</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            {/* Title */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                <FileText size={14} className="mr-2 text-primary" /> News Headline
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter an eye-catching headline..."
                className="w-full px-0 py-4 text-2xl font-serif border-b-2 border-gray-100 focus:border-primary focus:outline-none transition-all placeholder:text-gray-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Category */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                  <Tag size={14} className="mr-2 text-primary" /> Target Section (Synced with Menu)
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-black text-gray-700 appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                  <ImageIcon size={14} className="mr-2 text-primary" /> Feature Image (Direct URL)
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-600"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                <FileText size={14} className="mr-2 text-primary" /> Detailed Story / Article Body
              </label>
              <textarea
                required
                rows={10}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Type the full story here. You can use HTML tags like <h2> or <p> for formatting..."
                className="w-full px-6 py-6 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans leading-relaxed text-gray-700 shadow-inner"
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full md:w-auto px-16 py-5 bg-black hover:bg-primary text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center space-x-4 text-sm group"
              >
                <Send size={20} className="group-hover:rotate-12 transition-transform" />
                <span>Publish to BMBuzz</span>
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.5em] mt-12 opacity-50">
          Administrator Console &copy; 2026 BM BUZZ
        </p>
      </div>
    </div>
  );
};

export default Admin;
