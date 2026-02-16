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
                    <section className="relative group cursor-pointer overflow-hidden rounded-sm shadow-2xl" onClick={() => handlePostClick(featuredPost.id)}>
                      <div className="aspect-[16/9] w-full bg-gray-200">
                        <img src={featuredPost.image} alt={info.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white max-w-3xl">
                        <span className="bg-primary text-white text-[10px] font-black px-3 py-1 uppercase rounded-sm mb-4 inline-block tracking-[0.2em]">
                          {labels[featuredPost.category] || featuredPost.category}
                        </span>
                        <h2 className="text-2xl md:text-5xl font-black leading-[1.1] mb-4 group-hover:underline font-serif tracking-tight">{info.title}</h2>
                        <p className="text-sm md:text-lg text-gray-200 line-clamp-2 opacity-90 font-medium">{info.excerpt}</p>
                      </div>
                    </section>
                  );
                })() : null}

                {otherNews.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-8 border-b-2 border-primary pb-2">
                      <h3 className="text-2xl font-black uppercase tracking-tighter">{t.latest}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                      {otherNews.map(post => {
                        const info = getPostInfo(post);
                        return (
                          <article key={post.id} className="flex flex-col cursor-pointer group" onClick={() => handlePostClick(post.id)}>
                            <div className="aspect-[3/2] overflow-hidden rounded-sm mb-4 bg-gray-100 shadow-sm">
                              <img src={post.image} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{labels[post.category] || post.category}</span>
                              <span className="text-[10px] font-bold text-gray-400">{post.date}</span>
                            </div>
                            <h4 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors mb-2 font-serif">{info.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{info.excerpt}</p>
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
                <nav className="flex text-[10px] text-gray-500 mb-6 font-black uppercase tracking-[0.2em]">
                  <span className="cursor-pointer hover:text-primary" onClick={() => navigateTo('Home', '/')}>{t.backHome}</span>
                  <span className="mx-2">/</span>
                  <span className="text-primary">{labels[selectedCategory] || selectedCategory}</span>
                </nav>
                <h1 className="text-4xl font-black uppercase mb-10 pb-2 border-b-4 border-primary inline-block tracking-tighter">
                  {labels[selectedCategory] || selectedCategory}
                </h1>
                <div className="grid grid-cols-1 gap-12">
                  {allNews.filter(p => p.category === selectedCategory).length > 0 ? (
                    allNews.filter(p => p.category === selectedCategory).map(post => {
                      const info = getPostInfo(post);
                      return (
                        <article key={post.id} className="flex flex-col md:flex-row gap-8 cursor-pointer group items-center" onClick={() => handlePostClick(post.id)}>
                          <div className="md:w-1/3 aspect-[4/3] overflow-hidden rounded-sm shadow-lg w-full">
                            <img src={post.image} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <div className="md:w-2/3">
                            <span className="text-[10px] font-black text-primary uppercase mb-2 block tracking-widest">{labels[post.category] || post.category}</span>
                            <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight font-serif">{info.title}</h2>
                            <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{info.excerpt}</p>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="py-20 text-center text-gray-400 uppercase font-black tracking-widest">
                      No posts in {selectedCategory} yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePage === 'Post' && selectedPost && (() => {
              const info = getPostInfo(selectedPost);
              return (
                <article className="max-w-4xl mx-auto">
                  <h1 className="text-3xl md:text-6xl font-black mb-8 leading-[1.1] text-secondary font-serif tracking-tight">{info.title}</h1>
                  <div className="flex items-center space-x-4 mb-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span>{selectedPost.author}</span>
                    <span className="text-primary">•</span>
                    <span>{selectedPost.date}</span>
                  </div>
                  <div className="relative mb-12">
                    <img src={selectedPost.image} alt={info.title} className="w-full rounded-sm shadow-2xl" />
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest shadow-lg">
                      {labels[selectedPost.category] || selectedPost.category} {t.exclusive}
                    </div>
                  </div>
                  <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-sans">
                    <div className="article-content" dangerouslySetInnerHTML={{ __html: info.content }} />
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