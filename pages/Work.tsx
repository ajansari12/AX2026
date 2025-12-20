
import React, { useState } from 'react';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { CASE_STUDIES } from '../constants';
import { ArrowUpRight, ArrowLeft, CheckCircle2, Layers, Cpu, Code2, LineChart } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';

export const Work: React.FC = () => {
  const { slug } = useParams();
  const [filter, setFilter] = useState<string>('All');

  // --- DETAIL VIEW ---
  if (slug) {
    const study = CASE_STUDIES.find(s => s.slug === slug);
    if (!study) return <div className="pt-32 text-center text-gray-500">Case Study Not Found</div>;

    const caseStudySchema = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "headline": study.title,
      "description": study.summary,
      "image": study.image,
      "author": {
        "@type": "Organization",
        "name": "Axrategy"
      },
      "provider": {
        "@type": "Organization",
        "name": "Axrategy"
      },
      "about": {
        "@type": "Organization",
        "name": study.client
      }
    };

    return (
       <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <SEO 
            title={`${study.client} - Case Study`}
            description={`How we helped ${study.client} achieve ${study.outcome} through ${study.tags.join(' and ')}.`}
            image={study.image}
            type="article"
            schema={caseStudySchema}
          />

          {/* Header */}
          <Section className="pt-32 pb-12">
             <Container size="xl">
               <NavLink to="/work" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:hover:text-white mb-8 font-medium transition-colors">
                 <ArrowLeft size={16} /> Back to All Work
               </NavLink>
               <div className="max-w-5xl">
                 <div className="flex flex-wrap gap-3 mb-8">
                   {study.tags.map(t => (
                     <span key={t} className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs font-bold uppercase tracking-widest rounded-full">{t}</span>
                   ))}
                 </div>
                 <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.1]">{study.title}</h1>
                 <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">{study.summary}</p>
               </div>
             </Container>
          </Section>

          {/* Hero Image */}
          <div className="w-full h-[50vh] md:h-[70vh] bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
             <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
          </div>

          <Section>
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
               
               {/* Main Narrative */}
               <div className="lg:col-span-8 space-y-20">
                  
                  {/* The Problem */}
                  <div>
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                        <Layers size={18} />
                      </div>
                      The Challenge
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg md:text-xl">
                      {study.problem}
                    </p>
                  </div>
                  
                  {/* The Build */}
                  <div>
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Cpu size={18} />
                      </div>
                      The Build
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg md:text-xl mb-8">
                      {study.solution}
                    </p>
                    
                    {/* Gallery Grid (Placeholders) */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img src={`https://picsum.photos/seed/${study.slug}1/800/600`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Detail 1" />
                      </div>
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img src={`https://picsum.photos/seed/${study.slug}2/800/600`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Detail 2" />
                      </div>
                    </div>
                  </div>

                  {/* The Outcome */}
                  <div>
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white mb-8">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <LineChart size={18} />
                      </div>
                      The Outcome
                    </h2>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
                      <p className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">{study.outcome}</p>
                      <ul className="space-y-4">
                        {study.outcomeDetails?.map((detail, i) => (
                           <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="mt-1 text-emerald-500 flex-shrink-0" size={20} />
                              <span className="text-lg text-gray-700 dark:text-gray-300 font-medium">{detail}</span>
                           </li>
                        ))}
                      </ul>
                    </div>
                  </div>
               </div>
               
               {/* Sidebar */}
               <div className="lg:col-span-4">
                 <div className="sticky top-32 space-y-8">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
                       <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">Project Details</h3>
                       
                       <div className="space-y-6">
                          <div>
                             <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">Client</p>
                             <p className="font-medium text-gray-900 dark:text-white text-lg">{study.client}</p>
                          </div>
                          <div>
                             <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">Industry</p>
                             <p className="font-medium text-gray-900 dark:text-white text-lg">{study.industry}</p>
                          </div>
                          <div>
                             <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-2">Tech Stack</p>
                             <div className="flex flex-wrap gap-2">
                                {study.stack?.map(s => (
                                  <span key={s} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold border border-gray-200 dark:border-gray-700 flex items-center gap-1">
                                    <Code2 size={12} className="opacity-50" /> {s}
                                  </span>
                                ))}
                             </div>
                          </div>
                       </div>
                       
                       <div className="border-t border-gray-100 dark:border-gray-800 mt-8 pt-8">
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Want results like this?</p>
                          <NavLink to="/contact" className="block w-full">
                             <Button className="w-full">Get a Quote</Button>
                          </NavLink>
                       </div>
                    </div>
                 </div>
               </div>

             </div>
          </Section>
       </div>
    );
  }

  // --- LIST VIEW ---
  const filters = ['All', 'Website', 'AI Assistant', 'Automation', 'App'];
  const filteredStudies = filter === 'All' 
    ? CASE_STUDIES 
    : CASE_STUDIES.filter(s => s.tags.includes(filter));

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <SEO
        title="Case Studies & Results"
        description="See how we've helped small businesses save time and grow revenue through automation and modern web systems."
      />

      <Section className="pt-32 pb-12">
        <Container size="lg">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Proven results.</h1>
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl leading-relaxed">
            Real businesses. Real revenue growth. Here is exactly how we implement systems that print money.
          </p>
          
          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            {filters.map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  filter === tag 
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105 ring-4 ring-gray-100 dark:ring-gray-800' 
                    : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <div className="space-y-32">
          {filteredStudies.map((study, idx) => (
            <FadeIn key={study.id}>
              <div className="group grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                
                {/* Image Section */}
                <NavLink 
                  to={`/work/${study.slug}`} 
                  className={`block relative rounded-[2.5rem] overflow-hidden aspect-[4/3] bg-gray-100 dark:bg-gray-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}
                >
                  <img 
                    src={study.image} 
                    alt={study.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <span className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-black rounded-full text-black dark:text-white font-bold shadow-2xl hover:scale-105 transition-transform">
                      View Case Study <ArrowUpRight size={18} />
                    </span>
                  </div>
                </NavLink>

                {/* Content Section */}
                <div className={`${idx % 2 === 1 ? 'lg:order-1' : ''} flex flex-col justify-center`}>
                  
                  <div className="flex flex-wrap gap-3 mb-8">
                    {study.tags.map(tag => (
                      <span key={tag} className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full text-xs font-bold uppercase tracking-widest border border-gray-200 dark:border-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{study.client}</h2>
                  <h3 className="text-xl text-gray-400 dark:text-gray-500 mb-8 font-medium">{study.title}</h3>
                  
                  <div className="space-y-6 mb-10">
                    <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">The Problem</p>
                       <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{study.summary}</p>
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">The Fix</p>
                       <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">{study.solution}</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-6 rounded-2xl mb-10">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Outcome</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{study.outcome}</p>
                  </div>

                  <NavLink to={`/work/${study.slug}`} className="inline-flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group/link">
                    Read Full Story <ArrowUpRight size={20} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </NavLink>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>
      </Section>
    </div>
  );
};
