
import React, { useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Section, Button, FadeIn, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { SERVICES } from '../constants';
import * as Icons from 'lucide-react';
import { ArrowRight, CheckCircle2, ChevronDown, Clock, Users, Package, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Services: React.FC = () => {
  const { slug } = useParams();

  if (slug) {
    const service = SERVICES.find(s => s.slug === slug);
    if (!service) return <div>Service not found</div>;

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": service.title,
      "description": service.description,
      "provider": {
        "@type": "Organization",
        "name": "Axrategy",
        "url": "https://axrategy.com"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Canada"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Digital Services",
        "itemListElement": service.features?.map(f => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": f
          }
        }))
      }
    };

    // Service Detail View
    return (
      <div className="bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
        <SEO 
          title={service.title}
          description={`${service.description} ${service.outcome}`}
          type="service"
          schema={serviceSchema}
        />

        <Section className="pt-32 pb-20 md:pt-48 md:pb-32">
          <Container size="lg">
             <NavLink to="/services" className="text-sm font-medium text-gray-400 hover:text-black dark:hover:text-white mb-8 block transition-colors">&larr; Back to Services</NavLink>
             <div className="inline-block px-4 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-8">
               Service
             </div>
             <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">{service.title}</h1>
             <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 leading-relaxed mb-12 max-w-3xl">{service.description} {service.outcome}</p>
             <div className="flex gap-4">
               <NavLink to={`/contact?service=${encodeURIComponent(service.title)}`}><Button size="lg">Book a Call</Button></NavLink>
               <NavLink to="/work"><Button size="lg" variant="outline">See Examples</Button></NavLink>
             </div>
          </Container>
        </Section>
        
        <Section light className="border-t border-gray-100 dark:border-gray-800">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              
              {/* Left Column: Deliverables & Who it's for */}
              <div className="lg:col-span-8 space-y-20">
                
                {/* Deliverables */}
                <div>
                   <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
                        <Package size={28} />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Deliverables</h3>
                   </div>
                   <div className="bg-white dark:bg-gray-800/50 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-700 shadow-sm">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        {service.features?.map((f, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <CheckCircle2 className="text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" size={22} />
                            <span className="text-lg text-gray-700 dark:text-gray-300 leading-snug font-medium">{f}</span>
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>

                {/* Who it's for */}
                <div>
                   <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                        <Users size={28} />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Who it's for</h3>
                   </div>
                   <div className="bg-gray-50/50 dark:bg-gray-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800">
                      <p className="text-gray-600 dark:text-gray-400 text-xl mb-8 leading-relaxed max-w-2xl">
                        {service.whoIsItFor || "Designed for forward-thinking businesses ready to scale."}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {service.tags.map((tag, i) => (
                          <span key={i} className="px-5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm">{tag}</span>
                        ))}
                      </div>
                   </div>
                </div>

                {/* FAQ */}
                {service.faq && service.faq.length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-600 dark:text-gray-400">
                          <HelpCircle size={28} />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Common Questions</h3>
                     </div>
                    <div className="space-y-6">
                      {service.faq.map((item, i) => (
                        <details key={i} className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 open:shadow-md transition-all duration-300">
                          <summary className="flex items-center justify-between p-8 font-semibold text-lg cursor-pointer list-none text-gray-900 dark:text-white select-none">
                            {item.q}
                            <ChevronDown className="group-open:rotate-180 transition-transform text-gray-400 group-open:text-white" />
                          </summary>
                          <div className="px-8 pb-8 text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                            {item.a}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Timeline & Sticky CTA */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] p-10 sticky top-32 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6 text-gray-400 dark:text-gray-500">
                       <Clock size={22} />
                       <span className="text-xs font-bold uppercase tracking-widest">Typical Timeline</span>
                    </div>
                    <div className="text-5xl font-bold mb-3 tracking-tight">{service.timeline || "4 - 6 Weeks"}</div>
                    <p className="text-gray-400 dark:text-gray-600 text-base mb-10 font-medium">From kick-off to launch.</p>
                    
                    <div className="border-t border-gray-800 dark:border-gray-200 pt-8 mt-4">
                      <h4 className="font-bold text-xl mb-6">Ready to start?</h4>
                      <NavLink to={`/contact?service=${encodeURIComponent(service.title)}`} className="block w-full">
                        <Button className="w-full bg-white dark:bg-black text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 py-4 text-base font-bold">Book Strategy Call</Button>
                      </NavLink>
                    </div>
                 </div>
              </div>

           </div>
        </Section>
      </div>
    );
  }

  // Services Overview with Goal Selector
  const [quizFilter, setQuizFilter] = useState<string | null>(null);

  const filteredServices = quizFilter 
    ? SERVICES.filter(s => s.outcome.toLowerCase().includes(quizFilter.toLowerCase()) || s.description.toLowerCase().includes(quizFilter.toLowerCase()))
    : SERVICES;

  return (
    <>
      <SEO 
        title="Our Services"
        description="Explore our core services: High-converting websites, AI sales agents, and business automation workflows designed for small businesses."
      />

      <Section className="text-center pt-32 md:pt-48">
        <Container size="md">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Our Capabilities</h1>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 leading-relaxed">
            We don't just sell hours. We sell outcomes. Select a goal below to see how we can help.
            </p>
        </Container>
      </Section>

      {/* Goal Selector UI */}
      <Section className="py-4">
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-sm max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-8 text-gray-400 uppercase tracking-widest text-xs">I want to...</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Show All", val: null },
              { label: "Get More Leads", val: "lead" },
              { label: "Save Admin Time", val: "admin" },
              { label: "Improve Brand", val: "conversion" },
              { label: "Organize Clients", val: "crm" }
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setQuizFilter(opt.val)}
                className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                  quizFilter === opt.val 
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105 ring-4 ring-black/10 dark:ring-white/10' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <AnimatePresence mode='popLayout'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            // Dynamic Icon Component
            const IconComponent = (Icons as any)[service.icon] || Icons.Zap;
            
            return (
              <FadeIn key={service.id}>
                <div className="relative h-full group bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 hover:shadow-2xl hover:dark:shadow-white/5 transition-all duration-500 hover:-translate-y-2 flex flex-col backdrop-blur-sm">
                  {/* Full card link overlay */}
                  <NavLink 
                    to={`/services/${service.slug}`} 
                    className="absolute inset-0 z-0" 
                    aria-label={`View details for ${service.title}`} 
                  />
                  
                  <div className="relative z-10 pointer-events-none">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-900 dark:text-white mb-8 group-hover:bg-black group-hover:dark:bg-white group-hover:text-white group-hover:dark:text-black transition-colors duration-300">
                      <IconComponent size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">{service.description}</p>
                  </div>

                  <div className="mt-auto pt-8 border-t border-gray-50 dark:border-gray-800 relative z-10 pointer-events-none space-y-6">
                    
                    {service.whoIsItFor && (
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Recommended For</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{service.whoIsItFor}</p>
                      </div>
                    )}

                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl -mx-2">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Outcome</p>
                      <p className="text-base text-gray-900 dark:text-white font-bold">{service.outcome}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-2">
                      <NavLink 
                        to={`/contact?service=${encodeURIComponent(service.title)}`}
                        className="pointer-events-auto flex-1 text-center py-4 rounded-xl text-sm font-bold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-lg"
                        aria-label={`Book a call for ${service.title}`}
                      >
                        Book Now <ArrowRight size={16} />
                      </NavLink>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
        </AnimatePresence>
      </Section>
    </>
  );
};
