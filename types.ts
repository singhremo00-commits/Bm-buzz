// Exporting Language type to be used throughout the application
export type Language = 'en' | 'bn' | 'hi';

export interface NewsPost {
  id: string;
  category: string;
  author: string;
  date: string;
  timestamp?: any;
  image: string;
  featured?: boolean;
  trending?: boolean;
  translations: {
    [key: string]: {
      title: string;
      excerpt: string;
      content: string;
    }
  };
}

export type Category = 
  | 'Home' 
  | 'News' 
  | 'Music' 
  | 'Movies' 
  | 'Culture' 
  | 'Events' 
  | 'Interviews' 
  | 'Videos' 
  | 'Gallery' 
  | 'Talents' 
  | 'Jobs'
  | 'Silchar'
  | 'Manipuri'
  | 'Hingala'
  | 'Baronuni'
  | 'Bangladesh'
  | 'Tripura'
  | 'Bikrampur'
  | 'Patharkandi'
  | 'Guwahati';