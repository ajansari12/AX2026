import React, { useState, useMemo } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { BLOG_POSTS } from '../constants';
import { useBlogPosts, useBlogPost, BlogPost as DBBlogPost } from '../hooks/useBlogPosts';
import { ArrowLeft, Clock, Calendar, Search, Twitter, Linkedin, Link2, Loader2 } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';
import { IllustratedAvatar } from '../components/IllustratedAvatar';

interface DisplayPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  featured?: boolean;
}

const mapDBPostToDisplay = (post: DBBlogPost): DisplayPost => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  category: post.category,
  readTime: post.read_time,
  date: post.published_date,
  image: post.image_url,
  author: {
    name: post.author.name,
    role: post.author.role,
    avatar: post.author.avatar_url,
  },
  featured: post.featured,
});

const mapConstantToDisplay = (post: typeof BLOG_POSTS[0]): DisplayPost => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  category: post.category,
  readTime: post.readTime,
  date: post.date,
  image: post.image,
  author: {
    name: post.author.name,
    role: post.author.role,
    avatar: post.author.avatar,
  },
  featured: post.featured,
});

const PostDetailView: React.FC<{ slug: string }> = ({ slug }) => {
  const { post: dbPost, isLoading, error } = useBlogPost(slug);
  const triggerBookingModal = useTriggerBookingModal();

  const post = useMemo(() => {
    if (dbPost) {
      return mapDBPostToDisplay(dbPost);
    }
    const constantPost = BLOG_POSTS.find(p => p.slug === slug);
    return constantPost ? mapConstantToDisplay(constantPost) : null;
  }, [dbPost, slug]);

  const { posts: dbPosts } = useBlogPosts();
  const allPosts = useMemo(() => {
    if (dbPosts.length > 0) {
      return dbPosts.map(mapDBPostToDisplay);
    }
    return BLOG_POSTS.map(mapConstantToDisplay);
  }, [dbPosts]);

  if (isLoading) {
    return (
      <Section className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
        <p className="mt-4 text-gray-500">Loading article...</p>
      </Section>
    );
  }

  if (!post) {
    return (
      <Section className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
        <NavLink to="/insights"><Button variant="outline">Back to Insights</Button></NavLink>
      </Section>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "Axrategy",
      "logo": {
        "@type": "ImageObject",
        "url": "https://axrategy.com/logo.png"
      }
    }
  };

  const relatedPosts = allPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const toc = post.content.match(/<h2>(.*?)<\/h2>/g)?.map(tag => tag.replace(/<\/?h2>/g, '')) || [];

  return (
    <article className="bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.image}
        type="article"
        schema={articleSchema}
      />

      <Section className="pt-32 pb-16 border-b border-gray-100 dark:border-gray-800">
        <Container size="lg">
          <NavLink to="/insights" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white mb-10 transition-colors">
            <ArrowLeft size={16} /> Back to Insights
          </NavLink>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full mb-8">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-[1.1] tracking-tight">{post.title}</h1>
            <div className="flex items-center justify-center gap-8 text-gray-500 dark:text-gray-400 text-sm font-medium">
              <div className="flex items-center gap-3">
                <IllustratedAvatar name={post.author.name} size="md" />
                <div className="text-left">
                  <p className="text-gray-900 dark:text-white font-bold leading-none">{post.author.name}</p>
                  <p className="text-xs mt-1">{post.author.role}</p>
                </div>
              </div>
              <span className="flex items-center gap-2"><Calendar size={14} /> {post.date}</span>
              <span className="flex items-center gap-2"><Clock size={14} /> {post.readTime}</span>
            </div>
          </div>
        </Container>
      </Section>

      <div className="max-w-6xl mx-auto px-6 -mt-10 mb-16">
        <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </div>

      <Section className="pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-10">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Table of Contents</p>
                <ul className="space-y-3 text-sm border-l-2 border-gray-100 dark:border-gray-800 pl-4">
                  {toc.map((heading, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors line-clamp-1">
                      {heading}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Share</p>
                <div className="flex gap-4">
                  <button className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"><Twitter size={18} /></button>
                  <button className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"><Linkedin size={18} /></button>
                  <button className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"><Link2 size={18} /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="prose prose-lg dark:prose-invert prose-emerald max-w-none">
              {post.content.split('<!-- CTA -->').map((part, index) => (
                <React.Fragment key={index}>
                  <div dangerouslySetInnerHTML={{ __html: part }} />
                  {index === 0 && post.content.includes('<!-- CTA -->') && (
                    <div className="my-12 not-prose">
                      <div className="bg-black dark:bg-white text-white dark:text-black p-8 md:p-10 rounded-3xl text-center relative overflow-hidden shadow-2xl group cursor-pointer">
                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-3">Want to build this system?</h3>
                          <p className="text-gray-300 dark:text-gray-600 mb-6 max-w-md mx-auto">Get the exact blueprint we used to {post.excerpt.toLowerCase().includes('automate') ? 'automate workflows' : 'boost conversions'} for our clients.</p>
                          <Button
                            variant="secondary"
                            className="bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800 border-0"
                            onClick={() => triggerBookingModal()}
                          >
                            <Calendar className="mr-2 w-4 h-4" />
                            Book a Strategy Call
                          </Button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3 group-hover:bg-emerald-500/30 transition-colors"></div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto mt-24 border-t border-gray-100 dark:border-gray-800 pt-20">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Read Next</h3>
              <NavLink to="/insights" className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline">View All</NavLink>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(rp => (
                <NavLink to={`/insights/${rp.slug}`} key={rp.id} className="group block">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
                    <img src={rp.image} alt={rp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{rp.category}</p>
                  <h4 className="font-bold text-gray-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{rp.title}</h4>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </Section>
    </article>
  );
};

export const Insights: React.FC = () => {
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const { posts: dbPosts, isLoading } = useBlogPosts();

  const allPosts = useMemo(() => {
    if (dbPosts.length > 0) {
      return dbPosts.map(mapDBPostToDisplay);
    }
    return BLOG_POSTS.map(mapConstantToDisplay);
  }, [dbPosts]);

  if (slug) {
    return <PostDetailView slug={slug} />;
  }

  const categories = ['All', 'Strategy', 'Automation', 'AI', 'Design', 'Growth'];
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const otherPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  return (
    <>
      <SEO
        title="Insights & Strategies"
        description="Practical guides on AI, automation, and conversion optimization for small business owners. Scripts, templates, and step-by-step walkthroughs."
      />

      <Section className="pt-32 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Insights</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
              Tactical guides on modernizing your business systems. No fluff, just results.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : (
          <>
            {featuredPost && !searchTerm && activeCategory === 'All' && (
              <div className="mb-20">
                <NavLink to={`/insights/${featuredPost.slug}`} className="group relative block rounded-[2.5rem] overflow-hidden aspect-[16/9] md:aspect-[21/9]">
                  <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                    <div className="max-w-3xl transform transition-transform duration-500 group-hover:-translate-y-2">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-widest">Featured</span>
                        <span className="text-white/80 text-sm font-medium flex items-center gap-2"><Clock size={14} /> {featuredPost.readTime}</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{featuredPost.title}</h2>
                      <p className="text-lg text-gray-200 line-clamp-2 md:line-clamp-none max-w-2xl">{featuredPost.excerpt}</p>
                    </div>
                  </div>
                </NavLink>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {otherPosts.map((post) => (
                <FadeIn key={post.id}>
                  <NavLink to={`/insights/${post.slug}`} className="block group h-full">
                    <article className="flex flex-col h-full">
                      <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6 relative">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wide text-black dark:text-white shadow-sm border border-white/20">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-xs font-semibold text-gray-400 mb-3">
                          <span>{post.date}</span>
                          <span>-</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">{post.title}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed mb-6">{post.excerpt}</p>

                        <div className="mt-auto flex items-center gap-3">
                          <IllustratedAvatar name={post.author.name} size="sm" />
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{post.author.name}</span>
                        </div>
                      </div>
                    </article>
                  </NavLink>
                </FadeIn>
              ))}
            </div>

            {otherPosts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400">No articles found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </Section>
    </>
  );
};
