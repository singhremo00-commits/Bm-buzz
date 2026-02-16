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
  Loader2
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
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchAdminNews = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('News')
        .select('id, title, category, image_url, content, created_at')
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
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    
    try {
      const { error: deleteError } = await supabase
        .from('News')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      alert('Story deleted.');
      fetchAdminNews();
    } catch (err: any) {
      alert('Error deleting: ' + (err.message || 'Check connection'));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', category: 'News', imageUrl: '', description: '' });
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
        throw new Error("Please pick a photo from your gallery.");
      }

      if (selectedFile) {
        finalImageUrl = await handleUpload(selectedFile);
      }

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        content: formData.description.trim(),
        image_url: finalImageUrl,
        featured: false
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('News')
          .update(payload)
          .eq('id', editingId);
        
        if (updateError) throw updateError;
        alert('✅ Story Updated!');
      } else {
        const { error: insertError } = await supabase
          .from('News')
          .insert([payload]);
        
        if (insertError) throw insertError;
        alert('✅ Story Published!');
      }

      resetForm();
      fetchAdminNews();
    } catch (err: any) {
      alert('❌ Error: ' + (err.message || 'Upload failed'));
    } finally {
      setLoading(false);
    }
  };

  const allTargetSections = [...GENERAL_CATEGORIES, ...REGIONAL_CATEGORIES].filter(c => c !== 'Home');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6 shadow-xl border-4 border-primary">
              <Lock className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-black text-secondary tracking-tighter uppercase">BM <span className="text-primary">BUZZ</span> Admin</h2>
            <p className="text-gray-400 text-sm mt-3 font-medium">Secure Content Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none transition-all text-center text-lg font-bold"
              required
            />
            {error && <p className="text-primary text-xs font-black mt-3 text-center uppercase tracking-widest">{error}</p>}
            <button type="submit" className="w-full bg-black hover:bg-gray-900 text-white font-black py-4 rounded-xl transition-all shadow-lg uppercase tracking-widest text-sm">Authenticate</button>
            <button type="button" onClick={onBack} className="w-full text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Return to Site</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 -mt-8 -mx-4 pb-20">
      <header className="bg-black text-white p-6 shadow-2xl flex items-center justify-between sticky top-0 z-50 border-b-4 border-primary">
        <div className="flex items-center space-x-4">
          <div className="bg-primary p-2 rounded-lg"><LayoutDashboard size={24} className="text-white" /></div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">BM <span className="text-primary">BUZZ</span> Management</h1>
        </div>
        <button onClick={handleLogout} className="bg-white/10 hover:bg-primary text-white px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center space-x-2 border border-white/20">
          <LogOut size={14} /> <span>Logout</span>
        </button>
      </header>

      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-primary/5 p-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-3xl font-black text-secondary tracking-tight uppercase flex items-center">
              <span className="w-10 h-1 text-primary mr-4 block"></span>
              {editingId ? 'Edit' : 'Publish'} <span className="text-primary ml-2 underline">Story</span>
            </h2>
            {editingId && <button onClick={resetForm} className="text-[10px] font-black uppercase bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">Cancel Edit</button>}
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center"><FileText size={14} className="mr-2 text-primary" /> News Headline</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter story headline..."
                className="w-full px-0 py-4 text-2xl font-serif border-b-2 border-gray-100 focus:border-primary focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center"><Tag size={14} className="mr-2 text-primary" /> Target Section</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-primary focus:outline-none transition-all font-black text-gray-700 cursor-pointer appearance-none"
                >
                  {allTargetSections.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center"><ImageIcon size={14} className="mr-2 text-primary" /> Choose News Photo</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input 
                      id="fileInput"
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                    />
                  </div>
                  {previewUrl && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-primary/20 shadow-md">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(editingId ? formData.imageUrl : null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute top-0.5 right-0.5 bg-white rounded-full p-0.5 shadow hover:text-primary"><XCircle size={12} /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center"><FileText size={14} className="mr-2 text-primary" /> Full Story Body</label>
                <div className="flex bg-gray-100 rounded-lg p-1 space-x-1 border border-gray-200">
                  <button type="button" onClick={() => applyTag('<b>', '</b>')} className="p-1.5 hover:bg-white rounded transition-colors" title="Bold"><Bold size={14} /></button>
                  <button type="button" onClick={() => applyTag('<i>', '</i>')} className="p-1.5 hover:bg-white rounded transition-colors" title="Italic"><Italic size={14} /></button>
                  <button type="button" onClick={() => applyTag('<a href="">', '</a>')} className="p-1.5 hover:bg-primary hover:text-white rounded transition-colors px-2" title="Link"><LinkIcon size={14} /></button>
                </div>
              </div>
              <textarea
                ref={textAreaRef}
                required
                rows={8}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Write the full news content here..."
                className="w-full px-6 py-6 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary focus:outline-none transition-all text-gray-700 shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-16 py-5 bg-black hover:bg-primary text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-4 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (editingId ? <Edit3 size={20} /> : <PlusCircle size={20} />)}
              <span>{loading ? 'Uploading & Saving...' : (editingId ? 'Update Story' : 'Publish to Feed')}</span>
            </button>
          </form>
        </div>

        <div className="mt-16 space-y-6">
          <h3 className="text-2xl font-black uppercase tracking-tighter border-b-2 border-primary pb-2">Recent Submissions ({newsList.length})</h3>
          <div className="grid grid-cols-1 gap-4">
            {newsList.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 group">
                <img src={item.image_url} alt="" className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">{item.category}</span>
                    <span className="text-[9px] text-gray-400">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-secondary"><Edit3 size={18} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-primary"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;