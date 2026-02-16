import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NewsTicker from './components/NewsTicker';
import Sidebar from './components/Sidebar';
import Admin from './Admin';
import About from './components/About';
import { CATEGORIES, CATEGORY_LABELS, TRANSLATIONS, Language, MOCK_NEWS } from './constants';
import { NewsPost } from './types';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<'Home' | 'Category' | 'Post' | 'Admin' | 'About'>('Home');
  const [selectedCategory, setSelectedCategory] = useState('Home');
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [allNews, setAllNews] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('News')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error.message);
        setAllNews([...MOCK_NEWS]);
        return;
      }

      if (data && data.length > 0) {
        const mappedNews: NewsPost[] = data.map((item: any) => {
          const titleStr = String(item.title || 'Untitled Story');
          const contentStr = String(item.content || '');
          const excerptStr = contentStr.substring(0, 160).replace(/<[^>]*>/g, '') + '...';
          
          return {
            id: String(item.id),
            category: String(item.category || 'News'),
            author: 'Admin',
            date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            }) : 'Recently',
            image: String(item.image_url || 'https://picsum.photos/seed/news/800/600'),
            featured: Boolean(item.featured),
            translations: {
              en: { title: titleStr, excerpt: excerptStr, content: contentStr },
              bn: { title: titleStr, excerpt: excerptStr, content: contentStr },
              hi: { title: titleStr, excerpt: excerptStr, content: contentStr }
            }
          };
        });
        setAllNews(mappedNews);
      } else {
        setAllNews([...MOCK_NEWS]);
      }
    } catch (err: any) {
      console.error('Fetch caught error:', err?.message || 'Unknown error');
      setAllNews([...MOCK_NEWS]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();

    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setActivePage('Admin');
      } else if (path === '/about') {
        setActivePage('About');
      } else if (path === '/') {
        setActivePage('Home');
        fetchNews();
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();
    
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [fetchNews]);

  const navigateTo = (page: 'Home' | 'Category' | 'Post' | 'Admin' | 'About', path: string = '/') => {
    window.history.pushState({}, '', path);
    setActivePage(page);
    window.scrollTo(0, 0);
    if (page === 'Home') fetchNews();
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const labels = CATEGORY_LABELS[language] || CATEGORY_LABELS.en;

  const handleCategoryClick = (cat: string) => {
    if (cat === 'Home') {
      navigateTo('Home', '/');
    } else {
      setSelectedCategory(cat);
      navigateTo('Category', `/${cat.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  const handlePostClick = (id: string) => {
    const post = allNews.find(p => p.id === id);
    if (post) {
      setSelectedPost(post);
      navigateTo('Post', `/post/${id}`);
    }
  };

  const getPostInfo = (post: NewsPost) => {
    if (!post) return { title: '', excerpt: '', content: '' };
    const translation = post.translations?.[language] || post.translations?.en;
    if (translation) return translation;
    return { title: "Untitled", excerpt: "", content: "" };
  };

  const featuredPost = allNews.find(p => p.featured) || (allNews.length > 0 ? allNews[0] : null);
  const otherNews = featuredPost ? allNews.filter(p => p.id !== featuredPost.id) : allNews;

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-primary selection:text-white ${language !== 'en' ? 'leading-relaxed' : ''}`}>
      <Header 
        onCategoryClick={handleCategoryClick} 
        onLogoClick={() => navigateTo('Home', '/')} 
        currentLang={language}
        onLanguageChange={(lang) => setLanguage(lang)}
      />
      
      {activePage !== 'Admin' && <NewsTicker currentLang={language} />}

      <main className="flex-grow container mx-auto px-4 py-4 md:py-6">
        {isLoading && activePage !== 'Admin' && activePage !== 'About' && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[8px]">Syncing BMBuzz...</p>
          </div>
        )}

        <div className={`grid grid-cols-1 ${activePage === 'Admin' || activePage === 'About' ? '' : 'lg:grid-cols-12'} gap-6`}>
          
          <div className={activePage === 'Admin' || activePage === 'About' ? 'w-full' : 'lg:col-span-8'}>
            {activePage === 'Home' && !isLoading && (
              <div className="space-y-6 md:space-y-10">
                {featuredPost ? (() => {
                  const info = getPostInfo(featuredPost);
                  return (
                    <section className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-xl bg-secondary" onClick={() => handlePostClick(featuredPost.id)}>
                      {/* Image container with fixed aspect ratio for mobile consistency */}
                      <div className="aspect-[16/10] sm:aspect-[16/8] w-full overflow-hidden">
                        <img 
                          src={featuredPost.image} 
                          alt={info.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90" 
                        />
                      </div>
                      
                      {/* VERY strong gradient for text over image readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                      
                      <div className="absolute bottom-0 left-0 p-5 md:p-10 text-white w-full">
                        <div className="mb-4">
                          <span className="bg-primary text-white text-[10px] font-black px-2.5 py-1 uppercase rounded-sm inline-block tracking-[0.2em] shadow-lg">
                            {labels[featuredPost.category] || featuredPost.category}
                          </span>
                        </div>
                        
                        {/* Main Title text-2xl and font-semibold for professional look */}
                        <h2 className="text-2xl md:text-4xl font-semibold font-title tracking-tight leading-tight mb-4 group-hover:underline decoration-primary underline-offset-8 transition-all">
                          {info.title}
                        </h2>
                        
                        {/* Meta info with 16px (mb-4) headline spacing and clear gray-400 color */}
                        <div className="flex items-center space-x-4 text-[11px] font-bold uppercase tracking-widest text-gray-300">
                          <span className="flex items-center">By {featuredPost.author}</span>
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          <span>{featuredPost.date}</span>
                        </div>
                        
                        <p className="hidden md:block mt-6 text-base text-gray-200 line-clamp-2 opacity-80 font-medium leading-relaxed max-w-3xl">{info.excerpt}</p>
                      </div>
                    </section>
                  );
                })() : null}

                {otherNews.length > 0 && (
                  <section className="mt-12">
                    <div className="flex items-center justify-between mb-8 border-b-2 border-gray-100 pb-3">
                      <h3 className="text-xs font-black font-title uppercase tracking-[0.25em] text-gray-400">{t.latest}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                      {otherNews.map(post => {
                        const info = getPostInfo(post);
                        return (
                          <article key={post.id} className="flex flex-col cursor-pointer group px-1" onClick={() => handlePostClick(post.id)}>
                            <div className="aspect-[16/10] overflow-hidden rounded-2xl mb-5 bg-gray-100 shadow-md">
                              <img src={post.image} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            
                            <div className="flex items-center space-x-3 mb-3">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{labels[post.category] || post.category}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{post.date}</span>
                            </div>
                            
                            {/* News title text-xl font-semibold */}
                            <h4 className="text-[20px] font-semibold font-title leading-tight group-hover:text-primary transition-colors mb-4 tracking-tight text-slate-900">
                              {info.title}
                            </h4>
                            
                            {/* Metadata Admin/Date with consistent gray-500 color */}
                            <div className="flex items-center space-x-3 mb-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                              <span>{post.author}</span>
                              <span className="opacity-30">|</span>
                              <span>{post.date}</span>
                            </div>
                            
                            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-medium opacity-90">{info.excerpt}</p>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            )}

            {activePage === 'Category' && (
              <div className="px-1">
                <nav className="flex text-[9px] text-gray-400 mb-6 font-black uppercase tracking-widest items-center">
                  <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigateTo('Home', '/')}>{t.backHome}</span>
                  <span className="mx-2 opacity-30 text-lg">›</span>
                  <span className="text-primary">{labels[selectedCategory] || selectedCategory}</span>
                </nav>
                <h1 className="text-2xl md:text-3xl font-black font-title uppercase mb-10 pb-3 border-b-4 border-primary inline-block tracking-tighter text-secondary">
                  {labels[selectedCategory] || selectedCategory}
                </h1>
                <div className="grid grid-cols-1 gap-12">
                  {allNews.filter(p => p.category === selectedCategory).length > 0 ? (
                    allNews.filter(p => p.category === selectedCategory).map(post => {
                      const info = getPostInfo(post);
                      return (
                        <article key={post.id} className="flex flex-col md:flex-row gap-8 cursor-pointer group items-start" onClick={() => handlePostClick(post.id)}>
                          <div className="md:w-5/12 aspect-[16/10] overflow-hidden rounded-2xl w-full shrink-0 shadow-lg bg-gray-100">
                            <img src={post.image} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          </div>
                          <div className="flex-1 pt-2">
                            <div className="flex items-center space-x-3 mb-4">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{labels[post.category] || post.category}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{post.date}</span>
                            </div>
                            <h2 className="text-[22px] md:text-2xl font-semibold font-title mb-4 group-hover:text-primary transition-colors leading-tight tracking-tight text-slate-900">{info.title}</h2>
                            <p className="text-base text-slate-600 line-clamp-3 leading-relaxed font-medium">{info.excerpt}</p>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="py-24 text-center text-gray-300 uppercase font-black tracking-widest text-[11px] border-4 border-dashed border-gray-100 rounded-3xl">
                      No updates in {selectedCategory} yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePage === 'Post' && selectedPost && (() => {
              const info = getPostInfo(selectedPost);
              return (
                <article className="max-w-4xl mx-auto px-1">
                  <div className="mb-6">
                    <span className="bg-primary/5 text-primary text-[10px] font-black px-4 py-1.5 uppercase rounded-full inline-block tracking-[0.2em] border border-primary/10">
                      {labels[selectedPost.category] || selectedPost.category}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-semibold font-title mb-8 leading-tight text-slate-900 tracking-tight">{info.title}</h1>
                  
                  {/* Standard metadata layout for professional look */}
                  <div className="flex items-center space-x-6 mb-10 pb-6 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">B</div>
                      <span className="text-slate-900">{selectedPost.author}</span>
                    </div>
                    <span className="opacity-20">|</span>
                    <span className="flex items-center">
                      Published on {selectedPost.date}
                    </span>
                  </div>
                  
                  {/* Consistent 20px gap between Admin/Date and Image (mt-5 = 20px) */}
                  <div className="mb-12 mt-5">
                    <img src={selectedPost.image} alt={info.title} className="w-full rounded-3xl shadow-2xl border border-gray-100" />
                  </div>
                  
                  <div className="prose prose-lg max-w-none text-slate-800 leading-relaxed font-medium">
                    <div className="article-content space-y-8" dangerouslySetInnerHTML={{ __html: info.content }} />
                  </div>
                </article>
              );
            })()}

            {activePage === 'Admin' && <Admin currentLang={language} onBack={() => navigateTo('Home', '/')} />}
            {activePage === 'About' && <About />}
          </div>

          {activePage !== 'Admin' && activePage !== 'About' && (
            <div className="lg:col-span-4 mt-12 lg:mt-0">
              <Sidebar onPostClick={handlePostClick} currentLang={language} newsData={allNews} />
            </div>
          )}
        </div>
      </main>

      <Footer currentLang={language} />
    </div>
  );
};

export default App;