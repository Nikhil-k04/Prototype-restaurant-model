import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SEED_POSTS } from '../data/seedPosts';
import { generateId, parseTags } from '../utils/validators';

const PostsContext = createContext(null);

const STORAGE_KEY = 'postflow-posts';

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallthrough to seed
  }
  // Seed on first load
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_POSTS));
  return SEED_POSTS;
}

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState(loadPosts);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const getPost = useCallback((id) => posts.find(p => p.id === id), [posts]);

  const createPost = useCallback(({ title, author, content, tags }) => {
    const now = new Date().toISOString();
    const newPost = {
      id: generateId(),
      title: title.trim(),
      author: author.trim(),
      content: content.trim(),
      tags: parseTags(tags),
      createdAt: now,
      updatedAt: now,
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  }, []);

  const updatePost = useCallback((id, { title, author, content, tags }) => {
    setPosts(prev => prev.map(p =>
      p.id === id
        ? {
            ...p,
            title: title.trim(),
            author: author.trim(),
            content: content.trim(),
            tags: parseTags(tags),
            updatedAt: new Date().toISOString(),
          }
        : p
    ));
  }, []);

  const deletePost = useCallback((id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <PostsContext.Provider value={{ posts, getPost, createPost, updatePost, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used inside <PostsProvider>');
  return ctx;
}
