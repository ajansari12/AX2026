import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  avatar_url: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  published_date: string;
  image_url: string;
  author: BlogAuthor;
  featured: boolean;
  status: string;
}

interface UseBlogPostsReturn {
  posts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBlogPosts(options?: { featured?: boolean; limit?: number }): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('blog_posts')
        .select(`
          id,
          slug,
          title,
          excerpt,
          content,
          category,
          read_time,
          published_date,
          image_url,
          featured,
          status,
          authors:author_id (
            id,
            name,
            role,
            avatar_url
          )
        `)
        .eq('status', 'published')
        .order('published_date', { ascending: false });

      if (options?.featured) {
        query = query.eq('featured', true);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      const formattedPosts: BlogPost[] = (data || []).map((post: any) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        read_time: post.read_time,
        published_date: post.published_date,
        image_url: post.image_url,
        featured: post.featured,
        status: post.status,
        author: {
          id: post.authors?.id || '',
          name: post.authors?.name || 'Unknown Author',
          role: post.authors?.role || '',
          avatar_url: post.authors?.avatar_url || '',
        },
      }));

      setPosts(formattedPosts);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [options?.featured, options?.limit]);

  return { posts, isLoading, error, refetch: fetchPosts };
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select(`
            id,
            slug,
            title,
            excerpt,
            content,
            category,
            read_time,
            published_date,
            image_url,
            featured,
            status,
            authors:author_id (
              id,
              name,
              role,
              avatar_url
            )
          `)
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setPost({
            id: data.id,
            slug: data.slug,
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            category: data.category,
            read_time: data.read_time,
            published_date: data.published_date,
            image_url: data.image_url,
            featured: data.featured,
            status: data.status,
            author: {
              id: (data.authors as any)?.id || '',
              name: (data.authors as any)?.name || 'Unknown Author',
              role: (data.authors as any)?.role || '',
              avatar_url: (data.authors as any)?.avatar_url || '',
            },
          });
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, isLoading, error };
}
