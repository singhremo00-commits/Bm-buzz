import React from 'react';
import { REGIONAL_CATEGORIES } from '../constants';
import { Target, Heart, CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 font-sans">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-extrabold font-title text-secondary tracking-tighter mb-8 uppercase">
          Welcome to <span className="text-primary">BM Buzz</span>
        </h1>
        <div className="w-32 h-2 bg-primary mx-auto mb-10 rounded-full"></div>
        <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium italic">
          Your premier digital news destination dedicated to the voices and stories of the Bishnupriya community.
        </p>
      </div>

      <section className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-2xl border border-gray-100 mb-20">
        <p className="text-xl text-secondary leading-relaxed mb-0 font-medium">
          We provide a platform where local news meets global reach, ensuring that our heritage and current events are always just a click away. BM Buzz bridges the gap between traditional storytelling and modern digital journalism.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
        <div className="space-y-8">
          <div className="flex items-center space-x-5 mb-2">
            <div className="bg-primary/10 p-4 rounded-3xl">
              <Target className="text-primary" size={32} />
            </div>
            <h2 className="text-3xl font-extrabold font-title uppercase tracking-tighter text-secondary">Our Mission</h2>
          </div>
          <p className="text-gray-500 leading-relaxed text-lg font-medium">
            At BM Buzz, our mission is simple: to keep our community informed, engaged, and connected. We believe every local story deserves to be told, whether it’s a major update from Guwahati or a community event in Patharkandi.
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex items-center space-x-5 mb-2">
            <div className="bg-primary/10 p-4 rounded-3xl">
              <Heart className="text-primary" size={32} />
            </div>
            <h2 className="text-3xl font-extrabold font-title uppercase tracking-tighter text-secondary">Why Choose BM Buzz?</h2>
          </div>
          <ul className="space-y-5">
            <li className="flex items-start space-x-4">
              <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
              <div>
                <strong className="text-secondary block font-extrabold text-lg">Hyper-Local Focus</strong>
                <span className="text-gray-400 text-sm font-medium">Dedicated coverage of specific regions including Silchar, Manipur, Bangladesh, and more.</span>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
              <div>
                <strong className="text-secondary block font-extrabold text-lg">Cultural Hub</strong>
                <span className="text-gray-400 text-sm font-medium">We celebrate our music, talents, and traditions beyond just news.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <section className="bg-secondary text-white p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-extrabold font-title uppercase tracking-widest mb-10 border-b border-white/10 pb-6">Regions We Cover</h3>
          <div className="flex flex-wrap gap-4">
            {REGIONAL_CATEGORIES.map(area => (
              <span key={area} className="bg-white/10 px-6 py-3 rounded-2xl text-sm font-extrabold hover:bg-primary transition-all duration-300 cursor-default tracking-wide uppercase">
                {area}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
      </section>
    </div>
  );
};

export default About;