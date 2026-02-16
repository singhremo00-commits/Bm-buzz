
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
  Loader2,
  Star
} from 'lucide-react';

interface AdminProps {
  currentLang: Language;
  onBack: () => void;
}

// Fixed the Admin component which was truncated and missing default export
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
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 font-sans">
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
              className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-secondary font-bold"
            />
            {error && <p className="text-primary text-xs font-black uppercase tracking-widest text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-secondary hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-[0.2em] text-xs"
            >
              Enter Dashboard
            </button>
          </form>
          <button 
            onClick={onBack}
            className="w-full mt-6 text-gray-400 hover:text-primary text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden font-sans">
      <div className="bg-secondary p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <LayoutDashboard className="text-primary" size={24} />
            <h2 className="text-3xl font-black font-title tracking-tighter uppercase">Admin <span className="text-primary">Dashboard</span></h2>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Manage your community stories</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-white/10 hover:bg-primary px-6 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <div className="p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3 border-b-4 border-primary/20 pb-3 mb-8">
              {editingId ? <Edit3 className="text-primary" /> : <PlusCircle className="text-primary" />}
              <h3 className="text-xl font-black font-title uppercase tracking-tight text-secondary">
                {editingId ? 'Edit Story' : 'Publish New Story'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                  <FileText size={14} className="mr-2" /> Title
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-secondary"
                  placeholder="Enter catch headline..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                    <Tag size={14} className="mr-2" /> Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-secondary appearance-none"
                  >
                    {allTargetSections.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                    <Star size={14} className="mr-2" /> Featured
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                    className={`w-full px-5 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all border-2 ${
                      formData.featured 
                      ? 'bg-primary border-primary text-white' 
                      : 'bg-gray-50 border-gray-100 text-gray-400'
                    }`}
                  >
                    {formData.featured ? 'Featured Post' : 'Normal Post'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                  <ImageIcon size={14} className="mr-2" /> Cover Image
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 bg-gray-50 border-4 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer group-hover:bg-primary/5 group-hover:border-primary/20 transition-all overflow-hidden"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload size={32} className="text-gray-200 mb-2" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Upload Photo</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                    <Globe size={14} className="mr-2" /> Content (HTML)
                  </label>
                  <div className="flex space-x-1">
                    <button type="button" onClick={() => applyTag('<b>', '</b>')} className="p-2 hover:bg-primary/10 rounded text-secondary" title="Bold"><Bold size={14} /></button>
                    <button type="button" onClick={() => applyTag('<i>', '</i>')} className="p-2 hover:bg-primary/10 rounded text-secondary" title="Italic"><Italic size={14} /></button>
                    <button type="button" onClick={() => applyTag('<a href="">', '</a>')} className="p-2 hover:bg-primary/10 rounded text-secondary" title="Link"><LinkIcon size={14} /></button>
                  </div>
                </div>
                <textarea
                  ref={textAreaRef}
                  required
                  rows={10}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-primary transition-all font-medium text-secondary text-sm leading-relaxed"
                  placeholder="Tell your story here..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  disabled={loading}
                  type="submit"
                  className="flex-1 bg-primary hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-xl transition-all active:scale-95 uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                  <span>{editingId ? 'Update Story' : 'Publish Now'}</span>
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-500 font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3 border-b-4 border-secondary/10 pb-3 mb-8">
              <Clock className="text-secondary" />
              <h3 className="text-xl font-black font-title uppercase tracking-tight text-secondary">Manage Posts</h3>
            </div>

            <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
              {newsList.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                  <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest">{item.category}</span>
                      {item.featured && <Star size={10} className="fill-yellow-400 text-yellow-400" />}
                    </div>
                    <h4 className="text-xs font-bold text-secondary truncate uppercase tracking-tight">{item.title}</h4>
                    <p className="text-[9px] text-gray-400 font-medium">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(item)} className="p-2.5 bg-white text-secondary hover:text-primary hover:shadow-md rounded-xl transition-all"><Edit3 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-white text-gray-400 hover:text-red-500 hover:shadow-md rounded-xl transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {newsList.length === 0 && (
                <div className="text-center py-20 border-4 border-dashed border-gray-50 rounded-3xl">
                  <FileText size={48} className="text-gray-100 mx-auto mb-4" />
                  <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No stories found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
