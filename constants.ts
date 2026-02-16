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
    'Talent Showcase': 'Talents',
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
    'Talent Showcase': 'প্রতিভা',
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
    'Talent Showcase': 'प्रतिभा',
    'Jobs': 'नौकरियां'
  }
};

export const CATEGORIES: Category[] = [
  'Home', 'News', 'Music', 'Movies', 'Culture', 'Events', 'Interviews', 'Videos', 'Gallery', 'Talent Showcase', 'Jobs'
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
    "विष्णुप्रिया छात्रों के लिए नई छात्रवृत्ति की घोषणा की गई है।"
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
    subscribe: "সাবস্ক্রাইব",
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
    id: '7',
    category: 'News',
    author: 'Deepankar Jain',
    date: 'Oct 24, 2025',
    image: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&q=80&w=1200',
    featured: true,
    translations: {
      en: {
        title: "The 8-Year Journey of 'Banar Moynago': A Masterpiece Matured Through Time",
        excerpt: "From a 2017 composition to a 2025 official release, 'Banar Moynago' is more than just a song.",
        content: `<h2>The Genesis</h2><p>The journey began in 2017... (Full English Article Content)</p>`
      },
      bn: {
        title: "'বানার ময়নাগো'-র ৮ বছরের যাত্রা: সময়ের সাথে পরিপক্ক এক মাস্টারপিস",
        excerpt: "২০১৭ সালের সুর থেকে ২০২৫-এ অফিসিয়াল রিলিজ, 'বানার ময়নাগো' কেবল একটি গান নয়—এটি একটি আবেগ।",
        content: `<h2>সূচনা</h2><p>২০১৭ সালে এই গানের যাত্রা শুরু হয়... (সম্পূর্ণ নিবন্ধ)</p>`
      },
      hi: {
        title: "'बनार मयनागो' की 8 साल की यात्रा: समय के साथ परिपक्व हुई एक उत्कृष्ट कृति",
        excerpt: "2017 की रचना से लेकर 2025 में आधिकारिक रिलीज तक, 'बनार मयनागो' सिर्फ एक गाना नहीं है।",
        content: `<h2>उत्पत्ति</h2><p>यह यात्रा 2017 में शुरू हुई थी... (पूरा लेख)</p>`
      }
    }
  },
  {
    id: '1',
    category: 'Events',
    author: 'Admin',
    date: 'Oct 23, 2025',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    trending: true,
    translations: {
      en: {
        title: "Bishnupriya Literature Festival 2025 Schedule Released",
        excerpt: "Mark your calendars for the biggest literary gathering of the year in Guwahati.",
        content: "<p>Details about the speakers and venues for the upcoming festival.</p>"
      },
      bn: {
        title: "বিষ্ণুপ্রিয়া সাহিত্য উৎসব ২০২৫-এর সময়সূচী প্রকাশিত",
        excerpt: "গুয়াহাটিতে বছরের সবচেয়ে বড় সাহিত্যিক সমাবেশের জন্য ক্যালেন্ডার চিহ্নিত করুন।",
        content: "<p>আসন্ন উৎসবের বক্তা এবং ভেন্যু সম্পর্কে বিস্তারিত।</p>"
      },
      hi: {
        title: "विष्णुप्रिया साहित्य महोत्सव 2025 का शेड्यूल जारी",
        excerpt: "गुवाहाटी में वर्ष के सबसे बड़े साहित्यिक समागम के लिए अपना कैलेंडर मार्क करें।",
        content: "<p>आगामी महोत्सव के वक्ताओं और स्थानों के बारे में विवरण।</p>"
      }
    }
  },
  {
    id: '2',
    category: 'Culture',
    author: 'Rina Sinha',
    date: 'Oct 22, 2025',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
    translations: {
      en: {
        title: "Traditional Weaving Techniques Revived by Youth Groups",
        excerpt: "Young artisans are bringing back ancient patterns to modern fashion shows.",
        content: "<p>Exploring how tradition meets modern trends in the textile world.</p>"
      },
      bn: {
        title: "যুব গোষ্ঠীর উদ্যোগে ঐতিহ্যবাহী বয়ন কৌশলের পুনরুজ্জীবন",
        excerpt: "তরুণ কারিগররা আধুনিক ফ্যাশন শো-তে প্রাচীন নকশা ফিরিয়ে আনছেন।",
        content: "<p>কীভাবে ঐতিহ্য এবং আধুনিক ট্রেন্ডের মেলবন্ধন ঘটছে তা নিয়ে বিস্তারিত।</p>"
      },
      hi: {
        title: "युवा समूहों द्वारा पारंपरिक बुनाई तकनीकों का पुनरुद्धार",
        excerpt: "युवा कारीगर आधुनिक फैशन शो में प्राचीन पैटर्न वापस ला रहे हैं।",
        content: "<p>वस्त्र उद्योग में परंपरा और आधुनिक रुझानों के मिलन का अन्वेषण।</p>"
      }
    }
  },
  {
    id: '3',
    category: 'Music',
    author: 'Karan Sharma',
    date: 'Oct 21, 2025',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
    translations: {
      en: {
        title: "New Bishnupriya Short Film Wins International Award",
        excerpt: "Local filmmaker's story about rural life touches hearts in Europe.",
        content: "<p>The film 'Mati' has won the Best Narrative Short at a recent festival.</p>"
      },
      bn: {
        title: "নতুন বিষ্ণুপ্রিয়া শর্ট ফিল্ম আন্তর্জাতিক পুরস্কার জিতেছে",
        excerpt: "গ্রামীণ জীবন নিয়ে স্থানীয় চলচ্চিত্র নির্মাতার গল্প ইউরোপের মানুষের মন জয় করেছে।",
        content: "<p>'মাটি' নামক চলচ্চিত্রটি একটি সাম্প্রতিক উৎসবে সেরা ন্যারেটিভ শর্ট জিতেছে।</p>"
      },
      hi: {
        title: "नई विष्णुप्रिया शॉर्ट फिल्म ने अंतरराष्ट्रीय पुरस्कार जीता",
        excerpt: "ग्रामीण जीवन पर स्थानीय फिल्म निर्माता की कहानी ने यूरोप में दिल जीत लिया।",
        content: "<p>फिल्म 'माटी' ने हाल ही में एक महोत्सव में सर्वश्रेष्ठ लघु फिल्म का पुरस्कार जीता है।</p>"
      }
    }
  }
];