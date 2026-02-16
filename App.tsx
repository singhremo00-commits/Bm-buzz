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
              <div className="space-y-6">
                {featuredPost ? (() => {
                  const info = getPostInfo(featuredPost);
                  return (
                    <section className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg" onClick={() => handlePostClick(featuredPost.id)}>
                      <div className="aspect-[16/8] w-full bg-gray-200">
                        <img src={featuredPost.image} alt={info.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-5 md:p-6 text-white max-w-4xl">
                        <span className="bg-primary text-white text-[8px] font-black px-2 py-0.5 uppercase rounded-sm mb-1 inline-block tracking-[0.15em]">
                          {labels[featuredPost.category] || featuredPost.category}
                        </span>
                        <h2 className="text-xl md:text-2xl font-semibold font-title tracking-tight leading-tight mb-1 group-hover:underline decoration-primary">
                          {info.title}
                        </h2>
                        <div className="flex items-center space-x-3 mb-2 text-[9px] font-bold uppercase tracking-wider text-gray-300 opacity-80">
                          <span>{featuredPost.date}</span>
                        </div>
                        <p className="hidden md:block text-xs text-gray-200 line-clamp-1 opacity-80 font-medium leading-normal">{info.excerpt}</p>
                      </div>
                    </section>
                  );
                })() : null}

                {otherNews.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-1.5">
                      <h3 className="text-[10px] font-black font-title uppercase tracking-[0.2em] text-gray-400">{t.latest}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      {otherNews.map(post => {
                        const info = getPostInfo(post);
                        return (
                          <article key={post.id} className="flex flex-col cursor-pointer group" onClick={() => handlePostClick(post.id)}>
                            <div className="aspect-[16/10] overflow-hidden rounded-lg mb-2 bg-gray-100">
                              <img src={post.image} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="text-[8px] font-black text-primary uppercase tracking-widest">{labels[post.category] || post.category}</span>
                              <span className="text-[8px] font-bold text-gray-400 uppercase">{post.date}</span>
                            </div>
                            <h4 className="text-[18px] font-semibold font-title leading-tight group-hover:text-primary transition-colors mb-1 tracking-tight text-gray-900">
                              {info.title}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-snug font-medium opacity-80">{info.excerpt}</p>
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
                <nav className="flex text-[8px] text-gray-400 mb-4 font-black uppercase tracking-widest">
                  <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigateTo('Home', '/')}>{t.backHome}</span>
                  <span className="mx-2 opacity-30">/</span>
                  <span className="text-primary">{labels[selectedCategory] || selectedCategory}</span>
                </nav>
                <h1 className="text-xl font-black font-title uppercase mb-6 pb-1.5 border-b-2 border-primary inline-block tracking-tighter text-secondary">
                  {labels[selectedCategory] || selectedCategory}
                </h1>
                <div className="grid grid-cols-1 gap-5">
                  {allNews.filter(p => p.category === selectedCategory).length > 0 ? (
                    allNews.filter(p => p.category === selectedCategory).map(post => {
                      const info = getPostInfo(post);
                      return (
                        <article key={post.id} className="flex flex-col md:flex-row gap-5 cursor-pointer group items-start" onClick={() => handlePostClick(post.id)}>
                          <div className="md:w-1/4 aspect-[16/10] overflow-hidden rounded-lg w-full shrink-0 shadow-sm">
                            <img src={post.image} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-0.5">
                              <span className="text-[8px] font-black text-primary uppercase tracking-widest">{labels[post.category] || post.category}</span>
                              <span className="text-[8px] font-bold text-gray-400 uppercase">{post.date}</span>
                            </div>
                            <h2 className="text-[18px] font-semibold font-title mb-1.5 group-hover:text-primary transition-colors leading-tight tracking-tight text-gray-900">{info.title}</h2>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">{info.excerpt}</p>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-gray-300 uppercase font-black tracking-widest text-[10px] border border-dashed border-gray-100 rounded-2xl">
                      No updates in {selectedCategory} yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePage === 'Post' && selectedPost && (() => {
              const info = getPostInfo(selectedPost);
              return (
                <article className="max-w-3xl mx-auto">
                  <span className="bg-gray-100 text-primary text-[8px] font-black px-2 py-0.5 uppercase rounded mb-3 inline-block tracking-widest">
                    {labels[selectedPost.category] || selectedPost.category}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-semibold font-title mb-4 leading-tight text-secondary tracking-tight">{info.title}</h1>
                  <div className="flex items-center space-x-4 mb-6 pb-3 border-b border-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <span className="text-secondary">{selectedPost.author}</span>
                    <span className="opacity-20">|</span>
                    <span>{selectedPost.date}</span>
                  </div>
                  <div className="mb-8">
                    <img src={selectedPost.image} alt={info.title} className="w-full rounded-lg shadow-md" />
                  </div>
                  <div className="prose prose-sm max-w-none text-secondary leading-relaxed font-medium">
                    <div className="article-content space-y-4" dangerouslySetInnerHTML={{ __html: info.content }} />
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