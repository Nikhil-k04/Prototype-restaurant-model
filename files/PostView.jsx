import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { usePosts } from '../context/PostsContext';
import { useToast } from '../context/ToastContext';
import { formatDate, formatRelativeTime } from '../utils/validators';
import ConfirmModal from '../components/ConfirmModal';

const TAG_COLORS = [
  '#E3F2FD', '#E8EAF6', '#E0F2F1', '#FFF3E0',
  '#FCE4EC', '#F3E5F5', '#E8F5E9', '#FFF9C4',
];
function getTagColor(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export default function PostView() {
  const { id } = useParams();
  const { getPost, deletePost } = usePosts();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const post = getPost(id);
  if (!post) return <Navigate to="/404" replace />;

  function handleDelete() {
    deletePost(id);
    addToast(`"${post.title}" deleted.`, 'success');
    navigate('/');
  }

  // Format content: split on blank lines to create paragraphs
  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean);

  const wasEdited = post.updatedAt !== post.createdAt;

  return (
    <div className="page-container page-container--narrow">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">All Posts</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">
          {post.title.length > 50 ? post.title.slice(0, 50) + '…' : post.title}
        </span>
      </nav>

      <article className="post-view" aria-labelledby="post-view-title">
        {/* Title */}
        <h1 id="post-view-title" className="post-view-title">{post.title}</h1>

        {/* Meta row */}
        <div className="post-view-meta">
          <div className="meta-author">
            <span className="author-avatar-md" aria-hidden="true">
              {post.author.charAt(0).toUpperCase()}
            </span>
            <div>
              <strong>{post.author}</strong>
              <time dateTime={post.createdAt} className="meta-date">
                Published {formatDate(post.createdAt)}
                {' '}
                <span className="meta-relative" title={new Date(post.createdAt).toLocaleString()}>
                  ({formatRelativeTime(post.createdAt)})
                </span>
              </time>
              {wasEdited && (
                <time dateTime={post.updatedAt} className="meta-updated">
                  Updated {formatDate(post.updatedAt)}
                </time>
              )}
            </div>
          </div>

          <div className="meta-actions">
            <Link to={`/posts/${id}/edit`} className="btn-secondary" aria-label="Edit this post">
              ✏️ Edit
            </Link>
            <button
              className="btn-danger-outline"
              onClick={() => setConfirmOpen(true)}
              aria-label="Delete this post"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="post-view-tags" aria-label="Post tags">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="tag-chip tag-chip--lg"
                style={{ backgroundColor: getTagColor(tag) }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <hr className="post-divider" />

        {/* Content */}
        <div className="post-view-content">
          {paragraphs.map((para, i) => (
            <p key={i}>{para.trim()}</p>
          ))}
        </div>

        <hr className="post-divider" />

        {/* Footer Nav */}
        <div className="post-view-footer">
          <Link to="/" className="btn-back">
            ← Back to all posts
          </Link>
          <div className="post-view-footer-actions">
            <Link to={`/posts/${id}/edit`} className="btn-secondary">
              ✏️ Edit Post
            </Link>
            <button className="btn-danger-outline" onClick={() => setConfirmOpen(true)}>
              🗑️ Delete Post
            </button>
          </div>
        </div>
      </article>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Post"
        message={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
