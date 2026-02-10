import { Link } from 'react-router-dom';
import { formatRelativeTime, createExcerpt } from '../utils/validators';

const TAG_COLORS = [
  '#E3F2FD', '#E8EAF6', '#E0F2F1', '#FFF3E0',
  '#FCE4EC', '#F3E5F5', '#E8F5E9', '#FFF9C4',
];

function getTagColor(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export default function PostCard({ post, onDelete }) {
  const excerpt = createExcerpt(post.content, 140);

  return (
    <article className="post-card" aria-labelledby={`post-title-${post.id}`}>
      <div className="post-card-body">
        <div className="post-card-meta">
          <span className="post-author">
            <span className="author-avatar-sm" aria-hidden="true">
              {post.author.charAt(0).toUpperCase()}
            </span>
            {post.author}
          </span>
          <time className="post-date" dateTime={post.createdAt} title={new Date(post.createdAt).toLocaleString()}>
            {formatRelativeTime(post.createdAt)}
          </time>
        </div>

        <h2 id={`post-title-${post.id}`} className="post-card-title">
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h2>

        <p className="post-card-excerpt">{excerpt}</p>

        {post.tags?.length > 0 && (
          <div className="post-card-tags" aria-label="Post tags">
            {post.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="tag-chip"
                style={{ backgroundColor: getTagColor(tag) }}
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 4 && (
              <span className="tag-chip tag-chip--more">+{post.tags.length - 4}</span>
            )}
          </div>
        )}
      </div>

      <div className="post-card-footer">
        <Link to={`/posts/${post.id}`} className="btn-read" aria-label={`Read "${post.title}"`}>
          Read post →
        </Link>
        <div className="post-card-actions">
          <Link
            to={`/posts/${post.id}/edit`}
            className="btn-icon btn-icon--edit"
            aria-label={`Edit "${post.title}"`}
            title="Edit post"
          >
            ✏️
          </Link>
          <button
            className="btn-icon btn-icon--delete"
            onClick={() => onDelete(post.id, post.title)}
            aria-label={`Delete "${post.title}"`}
            title="Delete post"
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  );
}
