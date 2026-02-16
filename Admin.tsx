
import React, { useState } from 'react';
import { Language, TRANSLATIONS } from './constants';
import { Lock, FileText, Image as ImageIcon, Tag, Send, ArrowLeft } from 'lucide-react';

interface AdminProps {
  currentLang: Language;
  onBack: () => void;
}

const Admin: React.FC<AdminProps> = ({ currentLang, onBack }) => {
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

  const t = TRANSLATIONS[currentLang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password protection as requested
    if (password === 'bmbuzz2025') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New News Data Submitted:', formData);
    alert('News post logged to console successfully!');
    // Reset form
    setFormData({
      title: '',
      category: 'News',
      imageUrl: '',
      description: ''
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Lock className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl font-black text-secondary uppercase tracking-tight">Admin Access</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your password to manage BMBuzz content.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
              {error && <p className="text-primary text-xs font-bold mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-secondary hover:bg-black text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Login to Dashboard</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors"
            >
              Back to News
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-500 hover:text-primary font-bold transition-colors uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={16} />
          <span>Exit Admin</span>
        </button>
        <h2 className="text-3xl font-black text-secondary uppercase tracking-tighter">
          Publish <span className="text-primary">News</span>
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-secondary p-4 flex items-center space-x-3">
          <FileText className="text-primary" size={20} />
          <span className="text-white font-bold text-sm uppercase tracking-widest">Post Creator v1.0</span>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
              <FileText size={14} className="mr-2" /> News Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter a catchy headline..."
              className="w-full px-5 py-3 text-lg font-serif border-b-2 border-gray-100 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                <Tag size={14} className="mr-2" /> Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all font-bold text-gray-700"
              >
                <option value="News">News</option>
                <option value="Culture">Culture</option>
                <option value="Events">Events</option>
                <option value="Music">Music</option>
                <option value="Movies">Movies</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                <ImageIcon size={14} className="mr-2" /> Image URL
              </label>
              <input
                type="url"
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
              <FileText size={14} className="mr-2" /> Full Description
            </label>
            <textarea
              required
              rows={8}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Write the full story here (HTML supported)..."
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all font-sans leading-relaxed text-gray-700"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-12 py-4 bg-primary hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center space-x-3"
            >
              <Send size={18} />
              <span>Publish Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
