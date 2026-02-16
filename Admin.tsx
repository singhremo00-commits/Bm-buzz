import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Language, CATEGORIES } from './constants';
import { supabase } from './supabaseClient';
import { 
  Lock, 
  FileText, 
  Image as ImageIcon, 
  Tag, 
  Send, 
  LogOut, 
  LayoutDashboard, 
  Globe, 
  Link as LinkIcon, 
  Bold, 
  Italic,
  Trash2,
  Edit3,
  PlusCircle,
  Clock,
  Upload,
  XCircle
} from 'lucide-react';

interface AdminProps {
  currentLang: Language;
  onBack: () => void;
}

const Admin: React.FC<AdminProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'News',
    imageUrl: '', // This stores the current URL (either from DB or newly uploaded)
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchAdminNews = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('News')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      setNewsList(data || []);
    } catch (err: any) {
      console.error('Fetch Admin List Error:', err.message);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminNews();
    }
  }, [isAuthenticated, fetchAdminNews]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const applyTag = (startTag: string, endTag: string) => {
    const el = textAreaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    
    let processedTags = startTag;
    if (startTag.includes('href=""')) {
      const url = prompt("Enter the URL (e.g., https://google.com):", "https://");
      if (url === null) return; 
      processedTags = startTag.replace('href=""', `href="${url}" target="_blank" class="text-primary underline font-bold"`);
    }

    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = before + processedTags + selected + endTag + after;

    setFormData({ ...formData, description: newText });
    
    setTimeout(() => {
      el.focus();
      const newCursorPos = start + processedTags.length + selected.length + endTag.length;
      el.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      imageUrl: item.image_url,
      description: item.content
    });
    setSelectedFile(null);
    setPreviewUrl(item.image_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story permanently?')) return;
    
    try {
      const { error: deleteError } = await supabase
        .from('News')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      alert('🗑️ Story deleted successfully.');
      fetchAdminNews();
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', category: 'News', imageUrl: '', description: '' });
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('news-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let finalImageUrl = formData.imageUrl;

      // If a new file is selected, upload it first
      if (selectedFile) {
        finalImageUrl = await uploadImage(selectedFile);
      }

      if (!finalImageUrl && !editingId) {
        throw new Error("Please select an image for the news story.");
      }

      const payload = {
        title: String(formData.title || '').trim(),
        category: String(formData.category || 'News'),
        content: String(formData.description || '').trim(),
        image_url: finalImageUrl,
        featured: false
      };

      if (editingId) {
        // Update existing story
        const { error: updateError } = await supabase
          .from('News')
          .update(payload)
          .eq('id', editingId);
        
        if (updateError) throw updateError;
        alert('✅ Story Updated Successfully!');
      } else {
        // Insert new story
        const { error: insertError } = await supabase
          .from('News')
          .insert([payload]);
        
        if (insertError) throw insertError;
        alert('✅ Story Published Successfully!');
      }

      resetForm();
      fetchAdminNews();
    } catch (err: any) {
      console.error('Supabase Operation Error:', err.message || 'Unknown error');
      alert('❌ Error: ' + (err.message || 'Check database connection'));
    } finally {
      setLoading(false);
    }
  };

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
            <p className="text-gray-400 text-sm mt-3 font-medium">Secure content management portal.</p>
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
    <div className="min-h-screen bg-gray-50 -mt-8 -mx-4 pb-20">
      <header className="bg-black text-white p-6 shadow-2xl flex items-center justify-between sticky top-0 z-50 border-b-4 border-primary">
        <div className="flex items-center space-x-4">
          <div className="bg-primary p-2 rounded-lg">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">
            BM <span className="text-primary">BUZZ</span> <span className="hidden sm:inline">Management</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="hidden md:flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all border border-white/10"
          >
            <Globe size={14} />
            <span>View Site</span>
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

      <div className="max-w-5xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-1 gap-12">
        {/* Editor Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-primary/5 p-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-3xl font-black text-secondary tracking-tight uppercase flex items-center">
              <span className="w-10 h-1 text-primary mr-4 block"></span>
              {editingId ? 'Edit' : 'Publish'} <span className="text-primary ml-2 underline">Story</span>
            </h2>
            {editingId && (
              <button 
                onClick={resetForm}
                className="text-[10px] font-black uppercase bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
              >
                Cancel Edit & Create New
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                <FileText size={14} className="mr-2 text-primary" /> News Headline
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter headline..."
                className="w-full px-0 py-4 text-2xl font-serif border-b-2 border-gray-100 focus:border-primary focus:outline-none transition-all placeholder:text-gray-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                  <Tag size={14} className="mr-2 text-primary" /> Target Section
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-black text-gray-700 appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                  <ImageIcon size={14} className="mr-2 text-primary" /> News Image
                </label>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                   <div className="flex-1 w-full">
                      <label 
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-primary transition-colors" />
                          <p className="mb-2 text-sm text-gray-500"><span className="font-black uppercase text-[10px] tracking-widest">Click to upload photo</span></p>
                          <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                        </div>
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                      </label>
                   </div>
                   {previewUrl && (
                     <div className="relative w-full md:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner group">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(editingId ? formData.imageUrl : null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute top-1 right-1 bg-white/80 hover:bg-primary hover:text-white rounded-full p-1 shadow-md transition-all opacity-0 group-hover:opacity-100"
                        >
                          <XCircle size={14} />
                        </button>
                     </div>
                   )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                  <FileText size={14} className="mr-2 text-primary" /> Full Story
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1 space-x-1 border border-gray-200">
                  <button type="button" onClick={() => applyTag('<b>', '</b>')} className="p-1.5 hover:bg-white rounded transition-colors" title="Bold"><Bold size={14} /></button>
                  <button type="button" onClick={() => applyTag('<i>', '</i>')} className="p-1.5 hover:bg-white rounded transition-colors" title="Italic"><Italic size={14} /></button>
                  <button type="button" onClick={() => applyTag('<a href="">', '</a>')} className="p-1.5 hover:bg-primary hover:text-white rounded transition-colors flex items-center space-x-1 px-2" title="Add Link"><LinkIcon size={14} /><span className="text-[9px] font-black uppercase">Link</span></button>
                </div>
              </div>
              <textarea
                ref={textAreaRef}
                required
                rows={10}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Tell the story..."
                className="w-full px-6 py-6 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 shadow-inner"
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-16 py-5 bg-black hover:bg-primary text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center space-x-4 text-sm group"
              >
                {loading ? <span className="animate-spin">🌀</span> : (editingId ? <Edit3 size={20} /> : <PlusCircle size={20} />)}
                <span>{loading ? (editingId ? 'Updating...' : 'Publishing...') : (editingId ? 'Update Story' : 'Publish Story')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-primary pb-2">
            <h3 className="text-2xl font-black uppercase tracking-tighter">Existing Stories</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{newsList.length} Total</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {newsList.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">{item.category}</span>
                    <span className="text-[9px] text-gray-400 flex items-center"><Clock size={10} className="mr-1" /> {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{item.title}</h4>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-3 bg-gray-50 hover:bg-secondary hover:text-white text-gray-400 rounded-lg transition-all"
                    title="Edit Story"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-red-50 hover:bg-primary hover:text-white text-primary rounded-lg transition-all"
                    title="Delete Story"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {newsList.length === 0 && (
              <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-[0.2em] border-2 border-dashed rounded-3xl">
                No stories published yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;