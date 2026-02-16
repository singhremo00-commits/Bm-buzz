import React from 'react';
import { REGIONAL_CATEGORIES } from '../constants';
import { Target, Heart, CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 font-sans">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter mb-6 uppercase">
          Welcome to <span className="text-primary">BM Buzz</span>
        </h1>
        <div className="w-24 h-1 bg-primary mx-auto mb-10"></div>
        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-serif italic">
          Your premier digital news destination dedicated to the voices and stories of our community.
        </p>
      </div>

      <section className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 mb-16">
        <p className="text-lg text-gray-700 leading-loose mb-0">
          We provide a platform where local news meets global reach, ensuring that our heritage and current events are always just a click away. BM Buzz bridges the gap between traditional storytelling and modern digital journalism.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Target className="text-primary" size={28} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-secondary">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-lg">
            At BM Buzz, our mission is simple: to keep our community informed, engaged, and connected. We believe every local story deserves to be told, whether it’s a major update from Guwahati or a community event in Patharkandi.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Heart className="text-primary" size={28} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-secondary">Why Choose BM Buzz?</h2>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={18} />
              <div>
                <strong className="text-secondary block">Hyper-Local Focus</strong>
                <span className="text-gray-500 text-sm">Dedicated coverage of specific regions including Silchar, Manipur, Bangladesh, and more.</span>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={18} />
              <div>
                <strong className="text-secondary block">Cultural Hub</strong>
                <span className="text-gray-500 text-sm">We celebrate our music, talents, and traditions beyond just news.</span>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={18} />
              <div>
                <strong className="text-secondary block">Real-Time Updates</strong>
                <span className="text-gray-500 text-sm">Powered by modern tech, we bring you news as it happens.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <section className="bg-secondary text-white p-10 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black uppercase tracking-widest mb-8 border-b border-white/10 pb-4">Regions We Cover</h3>
          <div className="flex flex-wrap gap-3">
            {REGIONAL_CATEGORIES.map(area => (
              <span key={area} className="bg-white/10 px-4 py-2 rounded-full text-sm font-bold hover:bg-primary transition-colors cursor-default">
                {area}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
};

export default About;