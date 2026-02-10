/**
 * validators.js — Form validation utilities for PostFlow
 */

/**
 * Validate a post form object.
 * Returns an object of { fieldName: errorMessage } (empty = valid).
 */
export function validatePost(data) {
  const errors = {};

  // Title
  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required.';
  } else if (data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters.';
  } else if (data.title.trim().length > 120) {
    errors.title = 'Title must be under 120 characters.';
  }

  // Author
  if (!data.author || !data.author.trim()) {
    errors.author = 'Author name is required.';
  } else if (data.author.trim().length < 2) {
    errors.author = 'Author name must be at least 2 characters.';
  } else if (data.author.trim().length > 80) {
    errors.author = 'Author name must be under 80 characters.';
  }

  // Content
  if (!data.content || !data.content.trim()) {
    errors.content = 'Post content is required.';
  } else if (data.content.trim().length < 50) {
    errors.content = `Content must be at least 50 characters (currently ${data.content.trim().length}).`;
  } else if (data.content.trim().length > 20000) {
    errors.content = 'Content must be under 20,000 characters.';
  }

  // Tags (optional, but validate format if provided)
  if (data.tags && data.tags.trim()) {
    const tagList = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (tagList.length > 10) {
      errors.tags = 'Maximum 10 tags allowed.';
    }
    const invalidTag = tagList.find(t => t.length > 30);
    if (invalidTag) {
      errors.tags = `Tag "${invalidTag}" is too long (max 30 characters).`;
    }
  }

  return errors;
}

/**
 * Check if a validation errors object is empty (= form is valid).
 */
export function isValid(errors) {
  return Object.keys(errors).length === 0;
}

/**
 * Parse a comma-separated tag string into a clean array.
 */
export function parseTags(tagString) {
  if (!tagString || !tagString.trim()) return [];
  return tagString
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Serialize a tags array back to a comma-separated string for the form input.
 */
export function serializeTags(tagsArray) {
  if (!Array.isArray(tagsArray)) return '';
  return tagsArray.join(', ');
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

/**
 * Format a date string to a relative time string (e.g., "2 days ago").
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const then = new Date(dateString);
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return formatDate(dateString);
}

/**
 * Generate a simple unique ID (UUID v4 style)
 */
export function generateId() {
  return 'post-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

/**
 * Create an excerpt from content (first ~150 characters, ending at a word boundary).
 */
export function createExcerpt(content, maxLength = 150) {
  if (!content) return '';
  const clean = content.trim().replace(/\n+/g, ' ');
  if (clean.length <= maxLength) return clean;
  const truncated = clean.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated) + '…';
}
