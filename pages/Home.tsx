
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Check, Zap, Layers, BarChart3, ChevronDown, Quote } from 'lucide-react';
import { Section, Button, FadeIn, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { CASE_STUDIES, PRICING_TIERS } from '../constants';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Axrategy",
        "url": "https://axrategy.com",
        "logo": "https://axrategy.com/logo.png",
        "sameAs": [
          "https://twitter.com/axrategy",
          "https://linkedin.com/company/axrategy",
          "https://instagram.com/axrategy"
        ]
      },
      {
        "@type": "LocalBusiness",
        "name": "Axrategy",
        "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
        "telephone": "+1-416-555-0199",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 King St W",
          "addressLocality": "Toronto",
          "addressRegion": "ON",
          "postalCode": "M5V 1J9",
          "addressCountry": "CA"
        },
        "priceRange": "$$$"
      }
    ]
  };

  return (
    <>
      <SEO 
        title="AI-Powered Business Systems & Automation Consultancy"
        description="Axrategy builds modern websites, AI assistants, and automation workflows that quietly grow revenue for small businesses in Canada & the US."
        schema={schema}
      />
      
      {/* 1. Hero */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-gradient-to-b from-blue-50/80 to-transparent dark:from-blue-900/10 dark:to-transparent rounded-full blur-[100px] opacity-60 translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-50/80 to-transparent dark:from-emerald-900/10 dark:to-transparent rounded-full blur-[100px] opacity-40 -translate-x-1/3 translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 shadow-sm mb-10 transition-transform hover:scale-105 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-semibold text-black dark:text-white tracking-wide">AI • Automation • Web Systems</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.05] mb-8">
              Your competitors respond in 5 minutes. <span className="text-gray-400 dark:text-gray-500">You respond tomorrow.</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
              We build systems that book calls on your calendar while you sleep. No more missed leads. No more hiring headaches.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 mb-12">
              <NavLink to="/contact">
                <Button size="lg" className="w-full sm:w-auto group text-base px-8 py-4">
                  Book a Strategy Call 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </NavLink>
              <NavLink to="/work">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-4 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
                  See Results
                </Button>
              </NavLink>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-[3px] border-white dark:border-gray-900 bg-gray-200 overflow-hidden ring-1 ring-gray-900/5 dark:ring-white/10">
                    <img src={`https://picsum.photos/seed/face${i}/100/100`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p>Trusted by 50+ service businesses in healthcare, legal, and real estate</p>
            </div>
          </motion.div>

          {/* Right Side Visual */}
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="relative hidden lg:block h-[640px]"
          >
             {/* Abstract Glass UI Representation */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/60 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-[48px] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                  <div className="p-10 space-y-8">
                    {/* Mock Dashboard UI */}
                    <div className="flex justify-between items-center mb-8">
                      <div className="h-5 w-40 bg-gray-100/80 dark:bg-white/10 rounded-full"></div>
                      <div className="h-10 w-10 bg-gray-100/80 dark:bg-white/10 rounded-full"></div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-2/3 h-56 bg-blue-50/80 dark:bg-blue-500/10 rounded-3xl border border-blue-100 dark:border-blue-500/20 p-8 flex flex-col justify-between shadow-sm">
                         <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30"><Zap size={20}/></div>
                         <div>
                           <div className="h-10 w-32 bg-gray-900/5 dark:bg-white/10 rounded-xl mb-3"></div>
                           <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Leads Automated</div>
                         </div>
                      </div>
                      <div className="w-1/3 space-y-4">
                        <div className="h-24 bg-white/70 dark:bg-white/5 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm"></div>
                        <div className="h-24 bg-white/70 dark:bg-white/5 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm"></div>
                      </div>
                    </div>
                    <div className="h-72 bg-gray-50/80 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-white/5 p-8 shadow-inner">
                       <div className="flex items-end gap-3 h-full pb-4 px-2">
                         {[40, 60, 45, 70, 85, 60, 75].map((h, i) => (
                           <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-gray-900 dark:bg-white/80 rounded-md opacity-5 hover:opacity-20 transition-all duration-500"></div>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Proof Band */}
      <section className="border-y border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
            <FadeIn>
              <div className="p-6">
                <p className="text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">0</p>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Leads left on read</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="p-6">
                <p className="text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">2x</p>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">More qualified calls booked (avg. result)</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="p-6">
                <p className="text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">15hr+</p>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Freed up weekly (that's half an employee)</p>
              </div>
            </FadeIn>
          </div>
          
          {/* Micro CTA */}
          <div className="text-center mt-10">
             <NavLink to="/work" className="text-sm font-semibold text-gray-400 hover:text-black dark:hover:text-white transition-colors border-b border-gray-200 dark:border-gray-700 pb-0.5 hover:border-black">
                See how we achieve these numbers &rarr;
             </NavLink>
          </div>
        </div>
      </section>

      {/* 3. Three Core Pillars */}
      <Section id="what-we-build">
        <Container size="md" className="mb-20 md:text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Three systems. <br />One revenue engine.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">Most agencies give you a pretty brochure. We give you infrastructure that captures leads, qualifies them, and puts appointments on your calendar while you focus on closing.</p>
        </Container>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Layers,
              title: "Storefronts That Sell",
              desc: "Most visitors decide in 8 seconds. Our sites close them in 5. Fast, clean, and engineered to convert strangers into booked calls.",
              color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",
              link: "/services/websites-landing-pages"
            },
            {
              icon: Zap,
              title: "24/7 Lead Response",
              desc: "Never lose a lead to voicemail again. AI agents answer instantly, qualify prospects, and book meetings for you around the clock.",
              color: "text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400",
              link: "/services/ai-assistants"
            },
            {
              icon: BarChart3,
              title: "Zero Manual Entry",
              desc: "Forms sync to your CRM. Follow-ups send automatically. Nothing falls through the cracks. Reclaim 15+ hours every week.",
              color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
              link: "/services/automation-systems"
            }
          ].map((item, idx) => (
             <FadeIn key={idx} delay={idx * 0.1}>
              <NavLink to={item.link} className="block h-full group">
                <div className="p-10 rounded-[2.5rem] bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:dark:shadow-white/5 transition-all duration-300 hover:-translate-y-2 h-full cursor-pointer relative overflow-hidden backdrop-blur-sm">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-300 ${item.color}`}>
                    <item.icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    {item.title} <ArrowRight size={20} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </NavLink>
             </FadeIn>
          ))}
        </div>
      </Section>

      {/* 4. How It Works */}
      <Section light className="border-t border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Live in weeks, not months.</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 leading-relaxed">We skip the endless meetings and focus on shipping. You get a system that starts working before you lose momentum.</p>
            <div className="space-y-10 mb-12">
              {[
                { title: "1. Audit", desc: "We look at where you're losing money and time." },
                { title: "2. Design", desc: "We craft a clean, high-trust visual identity." },
                { title: "3. Build", desc: "We wire up your website, AI, and automations." },
                { title: "4. Handover", desc: "You get the keys, training videos, and full ownership." }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <NavLink to="/contact">
                <Button variant="outline" className="border-gray-300 dark:border-gray-700">Start your audit now</Button>
            </NavLink>
          </div>
          <div className="relative">
             <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-[3rem] overflow-hidden shadow-inner ring-1 ring-black/5 dark:ring-white/10">
                <img src="https://picsum.photos/seed/workprocess/1000/1000" alt="Process" className="w-full h-full object-cover opacity-80 mix-blend-multiply dark:mix-blend-normal dark:opacity-60 scale-105" />
             </div>
          </div>
        </div>
      </Section>

      {/* 5. Featured Work */}
      <Section>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">See the results.</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">Real businesses. Real revenue growth. No fluff.</p>
          </div>
          <NavLink to="/work" className="hidden md:flex items-center text-lg font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            View all case studies <ArrowRight size={20} className="ml-2" />
          </NavLink>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {CASE_STUDIES.map((study, idx) => (
             <FadeIn key={study.id} delay={idx * 0.1}>
               <NavLink to={`/work/${study.slug}`} className="block group">
                 <div className="rounded-[2rem] overflow-hidden mb-8 relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10">
                   <img src={study.image} alt={study.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors duration-500"></div>
                 </div>
                 <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">{study.industry}</div>
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:underline decoration-1 underline-offset-4">{study.client}</h3>
                 <p className="text-gray-600 dark:text-gray-400 text-base mb-4 line-clamp-2 leading-relaxed">{study.title}</p>
                 <div className="text-sm font-semibold text-gray-900 dark:text-gray-200 flex items-center gap-2">
                   {study.outcome}
                 </div>
               </NavLink>
             </FadeIn>
          ))}
        </div>
      </Section>

      {/* 6. Pricing Preview */}
      <Section light className="bg-gray-50/80 dark:bg-gray-900/30">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Clear, flat pricing.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">No hourly billing surprises. You know exactly what you're paying and what you're getting.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PRICING_TIERS.map((tier, idx) => (
             <FadeIn key={idx} delay={idx * 0.1}>
               <div className={`relative p-10 rounded-[2.5rem] h-full flex flex-col transition-all duration-300 ${
                  tier.isPopular 
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xl scale-105 z-10 ring-1 ring-white/10 dark:ring-black/5' 
                    : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 shadow-sm'
                }`}>
                 {tier.isPopular && (
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg whitespace-nowrap z-20">
                     Most Popular
                   </div>
                 )}
                 <h3 className="text-xl font-bold mb-3 opacity-90">{tier.name}</h3>
                 <div className="text-5xl font-bold mb-6 tracking-tight">{tier.price}</div>
                 <p className={`text-base mb-10 leading-relaxed ${tier.isPopular ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>{tier.description}</p>
                 
                 <div className="flex-grow space-y-5 mb-10">
                   {tier.features.map((feat, fIdx) => (
                     <div key={fIdx} className="flex items-start gap-4 text-sm font-medium">
                       <Check size={18} className={`mt-0.5 flex-shrink-0 ${tier.isPopular ? 'text-emerald-400 dark:text-emerald-600' : 'text-emerald-500 dark:text-emerald-400'}`} />
                       <span className={tier.isPopular ? 'text-gray-200 dark:text-gray-800' : 'text-gray-700 dark:text-gray-300'}>{feat}</span>
                     </div>
                   ))}
                 </div>
                 
                 <NavLink to="/contact" className="w-full">
                   <button className={`w-full py-4 px-6 rounded-2xl font-bold tracking-wide transition-all ${
                     tier.isPopular 
                      ? 'bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800' 
                      : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                   }`}>
                     {tier.ctaText}
                   </button>
                 </NavLink>
               </div>
             </FadeIn>
          ))}
        </div>
      </Section>

      {/* 7. Testimonials */}
      <Section>
        <Container size="lg" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Real results from real businesses</h2>
        </Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-900/50 p-12 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow backdrop-blur-sm">
                <Quote className="text-gray-200 dark:text-gray-700 mb-6" size={40} />
                <p className="text-xl md:text-2xl text-gray-900 dark:text-white mb-8 leading-relaxed font-medium">"We went from drowning in voicemails to fully booked 6 weeks out. Admin time? Down 50%. New patient inquiries? Up 35%."</p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                      <img src="https://picsum.photos/seed/face9/100/100" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">Dr. Sarah Jenning</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Founder, Apex Dental</p>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-900/50 p-12 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow backdrop-blur-sm">
                <Quote className="text-gray-200 dark:text-gray-700 mb-6" size={40} />
                <p className="text-xl md:text-2xl text-gray-900 dark:text-white mb-8 leading-relaxed font-medium">"Last month, the AI qualified 47 leads and booked 12 consultations. That's $180k in potential case value we would have missed."</p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                      <img src="https://picsum.photos/seed/face10/100/100" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">Mark Thompson</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Partner, Harrison Law</p>
                    </div>
                </div>
            </div>
        </div>
      </Section>

      {/* 8. FAQ */}
      <Section className="pt-0">
        <Container size="md">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "How fast can you deliver?", a: "Most projects launch in 4-6 weeks. We've shipped in as fast as 2 weeks when scope is tight. No endless meetings. No waiting on feedback loops. We move fast." },
              { q: "Do I own everything when it's done?", a: "100%. You own all the code, accounts, and assets. We hand over everything with training videos. Nothing held hostage." },
              { q: "What's the ongoing cost after launch?", a: "Typically $50-150/month total for hosting, AI credits, and CRM. You own all accounts directly. No markup." },
              { q: "Do you work with businesses outside of North America?", a: "We focus on Canada and the US for time-zone alignment, but take select international projects if the fit is right." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 open:shadow-lg transition-all duration-300">
                <summary className="flex items-center justify-between p-8 font-semibold text-lg cursor-pointer list-none text-gray-900 dark:text-white select-none">
                  {faq.q}
                  <ChevronDown className="group-open:rotate-180 transition-transform text-gray-400 group-open:text-white" />
                </summary>
                <div className="px-8 pb-8 text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* 9. Final CTA */}
      <Section className="pb-32">
        <div className="bg-black dark:bg-gray-900 rounded-[3rem] p-12 md:p-32 text-center relative overflow-hidden shadow-2xl dark:shadow-emerald-900/10 border border-transparent dark:border-white/5">
          {/* Abstract glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-black dark:from-black dark:to-gray-900 z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 dark:bg-emerald-900/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Every hour you wait, someone else closes your prospect.</h2>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 font-light">Stop losing leads to competitors who respond faster. Let's build your unfair advantage this week.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <NavLink to="/contact">
                <Button className="bg-white text-black hover:bg-gray-100 dark:hover:bg-gray-200 hover:shadow-white/20 w-full sm:w-auto px-10 py-5 text-lg border-0">Book a Strategy Call</Button>
              </NavLink>
              <NavLink to="/contact" className="text-gray-400 hover:text-white transition-colors text-base font-medium border-b border-transparent hover:border-white pb-0.5">
                Just get a quote &rarr;
              </NavLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
