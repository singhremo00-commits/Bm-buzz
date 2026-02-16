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

      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading && activePage !== 'Admin' && activePage !== 'About' && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Loading BMBuzz Feed...</p>
          </div>
        )}

        <div className={`grid grid-cols-1 ${activePage === 'Admin' || activePage === 'About' ? '' : 'lg:grid-cols-12'} gap-10`}>
          
          <div className={activePage === 'Admin' || activePage === 'About' ? 'w-full' : 'lg:col-span-8'}>
            {activePage === 'Home' && !isLoading && (
              <div className="space-y-12">
                {featuredPost ? (() => {
                  const info = getPostInfo(featuredPost);
                  return (
                    <section className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl" onClick={() => handlePostClick(featuredPost.id)}>
                      <div className="aspect-[16/9] w-full bg-gray-200">
                        <img src={featuredPost.image} alt={info.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white max-w-4xl">
                        <span className="bg-primary text-white text-[10px] font-black px-3 py-1 uppercase rounded-sm mb-6 inline-block tracking-[0.25em]">
                          {labels[featuredPost.category] || featuredPost.category}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold font-title tracking-tighter leading-[1.1] mb-8 group-hover:underline decoration-primary">
                          {info.title}
                        </h2>
                        <div className="flex items-center space-x-6 mb-6 text-xs font-bold uppercase tracking-widest text-gray-300">
                          <span className="flex items-center space-x-2">
                             <div className="w-2 h-2 rounded-full bg-primary"></div>
                             <span>{featuredPost.author}</span>
                          </span>
                          <span className="opacity-50">/</span>
                          <span>{featuredPost.date}</span>
                        </div>
                        <p className="text-sm md:text-lg text-gray-200 line-clamp-2 opacity-90 font-medium leading-relaxed">{info.excerpt}</p>
                      </div>
                    </section>
                  );
                })() : null}

                {otherNews.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-10 border-b-4 border-primary/10 pb-4">
                      <h3 className="text-2xl font-black font-title uppercase tracking-tighter text-secondary">{t.latest}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
                      {otherNews.map(post => {
                        const info = getPostInfo(post);
                        return (
                          <article key={post.id} className="flex flex-col cursor-pointer group" onClick={() => handlePostClick(post.id)}>
                            <div className="aspect-[16/10] overflow-hidden rounded-xl mb-6 bg-gray-100 shadow-sm">
                              <img src={post.image} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{labels[post.category] || post.category}</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.date}</span>
                            </div>
                            <h4 className="text-2xl font-extrabold font-title leading-tight group-hover:text-primary transition-colors mb-4 tracking-tighter text-secondary">{info.title}</h4>
                            <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed font-medium">{info.excerpt}</p>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            )}

            {activePage === 'Category' && (
              <div>
                <nav className="flex text-[10px] text-gray-400 mb-8 font-black uppercase tracking-[0.25em]">
                  <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigateTo('Home', '/')}>{t.backHome}</span>
                  <span className="mx-4 opacity-30">/</span>
                  <span className="text-primary">{labels[selectedCategory] || selectedCategory}</span>
                </nav>
                <h1 className="text-4xl md:text-6xl font-black font-title uppercase mb-14 pb-5 border-b-4 border-primary inline-block tracking-tighter text-secondary">
                  {labels[selectedCategory] || selectedCategory}
                </h1>
                <div className="grid grid-cols-1 gap-16">
                  {allNews.filter(p => p.category === selectedCategory).length > 0 ? (
                    allNews.filter(p => p.category === selectedCategory).map(post => {
                      const info = getPostInfo(post);
                      return (
                        <article key={post.id} className="flex flex-col md:flex-row gap-12 cursor-pointer group items-center" onClick={() => handlePostClick(post.id)}>
                          <div className="md:w-2/5 aspect-[16/10] overflow-hidden rounded-xl shadow-lg w-full">
                            <img src={post.image} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="md:w-3/5">
                            <div className="flex items-center space-x-4 mb-4">
                              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{labels[post.category] || post.category}</span>
                              <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.date}</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold font-title mb-5 group-hover:text-primary transition-colors leading-tight tracking-tighter text-secondary">{info.title}</h2>
                            <p className="text-gray-500 mb-0 line-clamp-3 leading-relaxed font-medium">{info.excerpt}</p>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="py-24 text-center text-gray-300 uppercase font-black tracking-[0.3em] border-2 border-dashed border-gray-100 rounded-3xl">
                      No updates in {selectedCategory} yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePage === 'Post' && selectedPost && (() => {
              const info = getPostInfo(selectedPost);
              return (
                <article className="max-w-4xl mx-auto">
                  <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1.5 uppercase rounded-full mb-8 inline-block tracking-[0.2em]">
                    {labels[selectedPost.category] || selectedPost.category}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-extrabold font-title mb-10 leading-[1.05] text-secondary tracking-tighter">{info.title}</h1>
                  <div className="flex items-center space-x-8 mb-12 pb-8 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <div className="flex items-center space-x-3 text-secondary">
                      <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center text-[10px] font-black ring-4 ring-gray-50">BM</div>
                      <span>{selectedPost.author}</span>
                    </div>
                    <span className="opacity-30">/</span>
                    <span>{selectedPost.date}</span>
                  </div>
                  <div className="relative mb-16 group">
                    <img src={selectedPost.image} alt={info.title} className="w-full rounded-2xl shadow-2xl" />
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-full -z-10 blur-3xl opacity-20"></div>
                  </div>
                  <div className="prose prose-xl prose-slate max-w-none text-secondary leading-[1.8] font-medium selection:bg-primary/20">
                    <div className="article-content space-y-8" dangerouslySetInnerHTML={{ __html: info.content }} />
                  </div>
                </article>
              );
            })()}

            {activePage === 'Admin' && <Admin currentLang={language} onBack={() => navigateTo('Home', '/')} />}
            {activePage === 'About' && <About />}
          </div>

          {activePage !== 'Admin' && activePage !== 'About' && (
            <div className="lg:col-span-4">
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