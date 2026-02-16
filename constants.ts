import { NewsPost, Category, Language } from './types';
export type { Language };

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'hi', name: 'हिन्दी' }
];

export const CATEGORY_LABELS: Record<Language, Record<string, string>> = {
  en: {
    'Home': 'Home', 
    'News': 'News', 
    'Music': 'Music', 
    'Movies': 'Movies', 
    'Culture': 'Culture', 
    'Events': 'Events',
    'Interviews': 'Interviews',
    'Videos': 'Videos',
    'Gallery': 'Gallery',
    'Talents': 'Talents',
    'Jobs': 'Jobs'
  },
  bn: {
    'Home': 'প্রচ্ছদ', 
    'News': 'খবর', 
    'Music': 'গান', 
    'Movies': 'চলচ্চিত্র', 
    'Culture': 'সংস্কৃতি', 
    'Events': 'ইভেন্ট',
    'Interviews': 'সাক্ষাৎকার',
    'Videos': 'ভিডিও',
    'Gallery': 'গ্যালারি',
    'Talents': 'প্রতিভা',
    'Jobs': 'চাকরি'
  },
  hi: {
    'Home': 'होम', 
    'News': 'समाचार', 
    'Music': 'संगीत', 
    'Movies': 'फिल्में', 
    'Culture': 'संस्कृति', 
    'Events': 'आयोजन',
    'Interviews': 'साक्षात्कार',
    'Videos': 'वीडियो',
    'Gallery': 'गैलरी',
    'Talents': 'प्रतिभा',
    'Jobs': 'नौकरियां'
  }
};

export const CATEGORIES: Category[] = [
  'Home', 'News', 'Music', 'Movies', 'Culture', 'Events', 'Interviews', 'Videos', 'Gallery', 'Talents', 'Jobs'
];

export const BREAKING_NEWS: Record<Language, string[]> = {
  en: [
    "Official: 'Banar Moynago' confirmed for 2025 end release.",
    "Bishnupriya Literature Festival to be held in Guwahati this December.",
    "New scholarship announced for Bishnupriya students."
  ],
  bn: [
    "অফিসিয়াল: 'বানার ময়নাগো' গানটি ২০২৫-এর শেষে মুক্তি পাচ্ছে।",
    "এই ডিসেম্বরে গুয়াহাটিতে বিষ্ণুপ্রিয়া সাহিত্য উৎসব অনুষ্ঠিত হবে।",
    "বিষ্ণুপ্রিয়া ছাত্রদের জন্য নতুন স্কলারশিপ ঘোষণা করা হয়েছে।"
  ],
  hi: [
    "आधिकारिक: 'बनार मयनागो' 2025 के अंत में रिलीज होगी।",
    "इस दिसंबर में गुवाहाटी में विष्णुप्रिया साहित्य महोत्सव आयोजित किया जाएगा।",
    "विष्णुप्रिया छात्रों के लिए नई छात्रवृत्ति की घोषणा की जाएगा।"
  ]
};

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    voice: "Voice of Bishnupriya Community",
    breaking: "Breaking News",
    trending: "Trending Now",
    recent: "Recent Posts",
    popular: "Popular Stories",
    latest: "Latest Updates",
    join: "Join the Buzz",
    subscribe: "Subscribe",
    placeholder: "Your Email",
    newsletterSub: "Get latest community updates directly in your inbox.",
    exclusive: "Exclusive",
    partners: "Community Partners",
    designed: "Designed for Bishnupriya Community",
    madeIn: "Made in North East India",
    more: "More",
    backHome: "Home",
    connect: "Stay Connected"
  },
  bn: {
    voice: "বিষ্ণুপ্রিয়া সম্প্রদায়ের কণ্ঠস্বর",
    breaking: "ব্রেকিং নিউজ",
    trending: "এখন ট্রেন্ডিং",
    recent: "সাম্প্রতিক পোস্ট",
    popular: "জনপ্রিয় খবর",
    latest: "সর্বশেষ আপডেট",
    join: "বাজ-এ যোগ দিন",
    subscribe: "সাবাস্ক্রাইব",
    placeholder: "আপনার ইমেল",
    newsletterSub: "সরাসরি আপনার ইনবক্সে সর্বশেষ কমিউনিটি আপডেট পান।",
    exclusive: "এক্সক্লুসিভ",
    partners: "কমিউনিটি অংশীদার",
    designed: "বিষ্ণুপ্রিয়া সম্প্রদায়ের জন্য",
    madeIn: "উত্তর-পূর্ব ভারতে তৈরি",
    more: "আরও",
    backHome: "হোম",
    connect: "সাথে থাকুন"
  },
  hi: {
    voice: "विष्णुप्रिया समुदाय की आवाज़",
    breaking: "ब्रेकिंग न्यूज़",
    trending: "अभी ट्रेंडिंग में",
    recent: "हालिया पोस्ट",
    popular: "लोकप्रिय कहानियाँ",
    latest: "नवीनतम अपडेट",
    join: "बज़ से जुड़ें",
    subscribe: "सब्सक्राइब",
    placeholder: "आपका ईमेल",
    newsletterSub: "सीधे अपने इनबॉक्स में नवीनतम सामुदायिक अपडेट प्राप्त करें।",
    exclusive: "एक्सक्लूसिव",
    partners: "सामुदायिक भागीदार",
    designed: "विष्णुप्रिया समुदाय के लिए",
    madeIn: "उत्तर पूर्व भारत में निर्मित",
    more: "अधिक",
    backHome: "होम",
    connect: "जुड़े रहें"
  }
};

export const MOCK_NEWS: NewsPost[] = [
  {
    id: '1',
    category: 'Music',
    author: 'Admin',
    date: 'Oct 24, 2025',
    featured: true,
    image: 'https://picsum.photos/seed/music/1200/800',
    translations: {
      en: {
        title: "Bishnupriya Music Awards 2025 Nominees Announced",
        excerpt: "The long-awaited list of nominees for the annual Bishnupriya Music Awards is finally here, celebrating local talent.",
        content: "The annual Bishnupriya Music Awards (BMA) has officially announced its 2025 nominees. This year sees a surge in independent artists from Tripura and Assam. Leading the pack is the 'Banar Moynago' crew with 5 nominations."
      },
      bn: {
        title: "বিষ্ণুপ্রিয়া মিউজিক অ্যাওয়ার্ডস ২০২৫-এর মনোনীতদের নাম ঘোষণা",
        excerpt: "বার্ষিক বিষ্ণুপ্রিয়া মিউজিক অ্যাওয়ার্ডের জন্য দীর্ঘ প্রতীক্ষিত মনোনীতদের তালিকা অবশেষে প্রকাশিত হয়েছে।",
        content: "বার্ষিক বিষ্ণুপ্রিয়া মিউজিক অ্যাওয়ার্ডস (BMA) ২০২৫-এর মনোনীতদের নাম আনুষ্ঠানিকভাবে ঘোষণা করা হয়েছে।"
      }
    }
  },
  {
    id: '2',
    category: 'Culture',
    author: 'Editor',
    date: 'Oct 23, 2025',
    image: 'https://picsum.photos/seed/culture/1200/800',
    translations: {
      en: {
        title: "The Art of Pung Cholom: A Heritage Revived",
        excerpt: "Younger generations are taking a keen interest in traditional Bishnupriya dance forms like Pung Cholom.",
        content: "Across the community, we are seeing a beautiful revival of Pung Cholom. Workshops in Silchar are seeing record participation."
      },
      bn: {
        title: "পুং চোলম শিল্প: একটি ঐতিহ্যের পুনর্জাগরণ",
        excerpt: "তরুণ প্রজন্ম পুং চোলমের মতো ঐতিহ্যবাহী নৃত্যশৈলীতে গভীর আগ্রহ দেখাচ্ছে।",
        content: "সম্প্রদায় জুড়ে আমরা পুং চোলমের একটি সুন্দর পুনর্জাগরণ দেখতে পাচ্ছি।"
      }
    }
  }
];