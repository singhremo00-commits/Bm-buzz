import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Language, CATEGORIES, REGIONAL_CATEGORIES, GENERAL_CATEGORIES } from './constants';
import { supabase } from './supabaseClient';
import { 
  Lock, 
  FileText, 
  Image as ImageIcon, 
  Tag, 
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
  XCircle,
  Loader2,
  Star
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
    imageUrl: '', 
    description: '',
    featured: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchAdminNews = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('News')
        .select('id, title, category, image_url, content, created_at, featured')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      setNewsList(data || []);
    } catch (err: any) {
      console.error('Fetch Error:', err.message || 'Unknown error');
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
      if (previewUrl && !previewUrl.startsWith('http')) {
        URL.revokeObjectURL(previewUrl);
      }
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
      const url = prompt("Enter the URL:", "https://");
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
      description: item.content,
      featured: item.featured || false
    });
    setSelectedFile(null);
    setPreviewUrl(item.image_url);
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story? This cannot be undone.')) return;
    try {
      const { error: deleteError } = await supabase
        .from('News')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      alert('✅ Story deleted successfully.');
      fetchAdminNews();
    } catch (err: any) {
      alert('❌ Error deleting: ' + (err.message || 'Check connection'));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', category: 'News', imageUrl: '', description: '', featured: false });
    setSelectedFile(null);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async (file: File): Promise<string> => {
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
      if (!editingId && !selectedFile) {
        throw new Error("Please select an image from your gallery.");
      }
      if (selectedFile) {
        finalImageUrl = await handleUpload(selectedFile);
      }
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        content: formData.description.trim(),
        image_url: finalImageUrl,
        featured: formData.featured
      };
      if (editingId) {
        const { error: updateError } = await supabase
          .from('News')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
        alert('✅ Story Updated Successfully!');
      } else {
        const { error: insertError } = await supabase
          .from('News')
          .insert([payload]);
        if (insertError) throw insertError;
        alert('✅ Story Published Successfully!');
      }
      resetForm();
      fetchAdminNews();
    } catch (err: any) {
      alert('❌ Error: ' + (err.message || 'Action failed'));
    } finally {
      setLoading(false);
    }
  };

  const allTargetSections = [...GENERAL_CATEGORIES, ...REGIONAL_CATEGORIES].filter(c => c !== 'Home');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-secondary rounded-[2rem] mb-8 shadow-xl border-4 border-primary ring-8 ring-gray-50">
              <Lock className="text-white" size={36} />
            </div>
            <h2 className="text-3xl font-black font-title text-secondary tracking-tighter uppercase">BM <span className="text-primary">BUZZ</span> Admin</h2>
            <p className="text-gray-400 text-sm mt-3 font-bold tracking-widest uppercase">Secure Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:outline-none transition-all text-center text-xl font-black tracking-widest placeholder:tracking-normal placeholder:font-bold"
              required
            />
            {error && <p className="text-primary text-[10px] font-black mt-3 text-center uppercase tracking-[0.2em]">{error}</p>}
            <button type="submit" className="w-full bg-secondary hover:bg-primary text-white font-black py-5 rounded-2xl transition-all shadow-xl uppercase tracking-[0.3em] text-xs active:scale-95">Authenticate</button>
            <button type="button" onClick={onBack} className="w-full text-gray-300 text-[10px] font-black uppercase tracking-[0.4em] mt-6 hover:text-primary transition-colors">Exit Admin</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background -mt-8 -mx-4 pb-24 font-sans">
      <header className="bg-secondary text-white p-6 shadow-2xl flex items-center justify-between sticky top-0 z-50 border-b-4 border-primary">
        <div className="flex items-center space-x-5">
          <div className="bg-primary p-2.5 rounded-xl shadow-lg"><LayoutDashboard size={24} className="text-white" /></div>
          <h1 className="text-2xl font-black font-title tracking-tighter uppercase">BM <span className="text-primary">BUZZ</span> Management</h1>
        </div>
        <button onClick={handleLogout} className="bg-white/10 hover:bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center space-x-3 border border-white/20 active:scale-95">
          <LogOut size={16} /> <span>Logout</span>
        </button>
      </header>

      <div className="max-w-6xl mx-auto py-16 px-8">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-primary/5 p-10 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-4xl font-black font-title text-secondary tracking-tight uppercase flex items-center">
              <span className="w-12 h-2 bg-primary mr-6 block rounded-full"></span>
              {editingId ? 'Edit' : 'Create'} <span className="text-primary ml-3">Update</span>
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-[10px] font-black uppercase bg-white border-2 border-gray-100 px-6 py-3 rounded-xl hover:bg-gray-50 shadow-sm transition-all tracking-widest text-secondary">
                Cancel Editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-12">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center"><FileText size={16} className="mr-3 text-primary" /> Story Headline</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Type your extra bold headline here..."
                className="w-full px-0 py-5 text-3xl font-extrabold font-title border-b-4 border-gray-100 focus:border-primary focus:outline-none transition-all placeholder:text-gray-200 tracking-tight text-secondary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center"><Tag size={16} className="mr-3 text-primary" /> Region / Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:outline-none transition-all font-black text-secondary cursor-pointer appearance-none uppercase tracking-widest text-xs"
                >
                  {allTargetSections.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center"><ImageIcon size={16} className="mr-3 text-primary" /> Upload Photo</label>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <input 
                      id="fileInput"
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="block w-full text-xs text-gray-400 file:mr-6 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-secondary file:text-white hover:file:bg-primary transition-all cursor-pointer shadow-lg"
                    />
                  </div>
                  {previewUrl && (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-2xl flex-shrink-0 group">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(editingId ? formData.imageUrl : null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute inset-0 bg-primary/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><XCircle size={24} /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 max-w-sm hover:border-primary transition-colors group">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="w-6 h-6 rounded-lg border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer shadow-md"
                />
                <label htmlFor="featured" className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] cursor-pointer flex items-center group-hover:text-primary transition-colors">
                  <Star size={16} className={`mr-3 ${formData.featured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 group-hover:text-primary'}`} />
                  Mark as Featured Story
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center"><FileText size={16} className="mr-3 text-primary" /> Article Content</label>
                <div className="flex bg-gray-100 rounded-xl p-1.5 space-x-2 border border-gray-200 shadow-inner">
                  <button type="button" onClick={() => applyTag('<b>', '</b>')} className="p-2 hover:bg-white rounded-lg transition-all text-secondary hover:text-primary shadow-sm" title="Bold"><Bold size={16} /></button>
                  <button type="button" onClick={() => applyTag('<i>', '</i>')} className="p-2 hover:bg-white rounded-lg transition-all text-secondary hover:text-primary shadow-sm" title="Italic"><Italic size={16} /></button>
                  <button type="button" onClick={() => applyTag('<a href="">', '</a>')} className="p-2 hover:bg-primary hover:text-white rounded-lg transition-all px-4 text-xs font-black uppercase tracking-widest shadow-lg" title="Insert Link"><LinkIcon size={16} /></button>
                </div>
              </div>
              <textarea
                ref={textAreaRef}
                required
                rows={12}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Share the full community narrative here..."
                className="w-full px-8 py-8 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-primary focus:outline-none transition-all text-secondary shadow-inner leading-relaxed text-lg font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-20 py-6 ${editingId ? 'bg-blue-600' : 'bg-secondary'} hover:bg-primary text-white font-black font-title uppercase tracking-[0.4em] rounded-2xl shadow-2xl transition-all flex items-center justify-center space-x-5 disabled:opacity-70 active:scale-95 text-xs`}
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (editingId ? <Edit3 size={24} /> : <PlusCircle size={24} />)}
              <span>{loading ? 'Processing...' : (editingId ? 'Update News' : 'Publish to Feed')}</span>
            </button>
          </form>
        </div>

        <div className="mt-24 space-y-12">
          <div className="flex items-center justify-between border-b-4 border-primary/20 pb-5">
            <h3 className="text-3xl font-black font-title uppercase tracking-tighter text-secondary flex items-center">
              <Clock size={28} className="mr-4 text-primary" />
              Manage Feed <span className="ml-5 text-sm text-gray-400 font-black bg-gray-100 px-5 py-2 rounded-full tracking-widest">{newsList.length} Posts</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {newsList.length > 0 ? (
              newsList.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 flex flex-col md:flex-row items-center gap-8 group hover:shadow-2xl hover:border-primary/20 transition-all duration-500">
                  <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shadow-2xl bg-gray-100 flex-shrink-0">
                    <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-lg">{item.category}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {item.featured && <span className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em] bg-yellow-50 px-3 py-1 rounded-lg flex items-center shadow-sm"><Star size={12} className="mr-2 fill-yellow-600" /> Featured</span>}
                    </div>
                    <h4 className="text-2xl font-extrabold font-title text-secondary line-clamp-1 tracking-tight group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-1 italic font-medium">{item.content.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-gray-50">
                    <button 
                      onClick={() => handleEdit(item)} 
                      className="flex-1 md:flex-none p-4 bg-gray-50 text-secondary rounded-2xl hover:bg-secondary hover:text-white transition-all flex items-center justify-center shadow-sm active:scale-95"
                      title="Edit Story"
                    >
                      <Edit3 size={20} />
                      <span className="ml-3 md:hidden font-black uppercase text-[10px] tracking-widest">Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="flex-1 md:flex-none p-4 bg-primary/5 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm active:scale-95"
                      title="Delete Story"
                    >
                      <Trash2 size={20} />
                      <span className="ml-3 md:hidden font-black uppercase text-[10px] tracking-widest">Delete</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-32 text-center border-4 border-dashed border-gray-100 rounded-[3rem]">
                <p className="text-gray-300 font-black uppercase tracking-[0.5em] text-sm">Database Empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;