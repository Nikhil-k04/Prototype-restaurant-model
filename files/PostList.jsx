import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import { useToast } from '../context/ToastContext';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';

const POSTS_PER_PAGE = 6;

export default function PostList() {
  const { posts, deletePost } = usePosts();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, title: '' });

  // Unique authors for filter dropdown
  const authors = useMemo(() => {
    const set = new Set(posts.map(p => p.author));
    return [...set].sort();
  }, [posts]);

  // Unique tags for filter dropdown
  const allTags = useMemo(() => {
    const set = new Set(posts.flatMap(p => p.tags || []));
    return [...set].sort();
  }, [posts]);

  // Filtered + sorted posts
  const filtered = useMemo(() => {
    let result = [...posts];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
      );
    }

    if (filterAuthor) {
      result = result.filter(p => p.author === filterAuthor);
    }

    if (filterTag) {
      result = result.filter(p => p.tags?.includes(filterTag));
    }

    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === 'title-az') result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'title-za') result.sort((a, b) => b.title.localeCompare(a.title));

    return result;
  }, [posts, search, filterAuthor, filterTag, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleFilterChange(setter) {
    return (e) => {
      setter(e.target.value);
      setPage(1);
    };
  }

  function clearFilters() {
    setSearch('');
    setFilterAuthor('');
    setFilterTag('');
    setSortBy('newest');
    setPage(1);
  }

  function requestDelete(id, title) {
    setConfirmModal({ open: true, id, title });
  }

  function confirmDelete() {
    deletePost(confirmModal.id);
    addToast(`"${confirmModal.title}" deleted successfully.`, 'success');
    setConfirmModal({ open: false, id: null, title: '' });
    if (paginated.length === 1 && page > 1) setPage(page - 1);
  }

  const hasFilters = search || filterAuthor || filterTag || sortBy !== 'newest';

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">All Posts</h1>
          <p className="page-subtitle">
            {filtered.length} post{filtered.length !== 1 ? 's' : ''}
            {filtered.length !== posts.length ? ` matching your filters (${posts.length} total)` : ' in total'}
          </p>
        </div>
        <Link to="/posts/new" className="btn-primary" aria-label="Create a new post">
          ＋ New Post
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="filter-bar" role="search" aria-label="Filter and search posts">
        <div className="search-wrap">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="search-input"
            placeholder="Search posts by title, content, or author…"
            value={search}
            onChange={handleSearchChange}
            aria-label="Search posts"
          />
        </div>

        <div className="filter-controls">
          <label htmlFor="filter-author" className="sr-only">Filter by author</label>
          <select
            id="filter-author"
            className="filter-select"
            value={filterAuthor}
            onChange={handleFilterChange(setFilterAuthor)}
          >
            <option value="">All Authors</option>
            {authors.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          <label htmlFor="filter-tag" className="sr-only">Filter by tag</label>
          <select
            id="filter-tag"
            className="filter-select"
            value={filterTag}
            onChange={handleFilterChange(setFilterTag)}
          >
            <option value="">All Tags</option>
            {allTags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <label htmlFor="sort-by" className="sr-only">Sort posts</label>
          <select
            id="sort-by"
            className="filter-select"
            value={sortBy}
            onChange={handleFilterChange(setSortBy)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-az">Title A–Z</option>
            <option value="title-za">Title Z–A</option>
          </select>

          {hasFilters && (
            <button className="btn-clear-filters" onClick={clearFilters} title="Clear all filters">
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Post Grid or Empty State */}
      {paginated.length > 0 ? (
        <>
          <div className="posts-grid" role="list" aria-label="Posts list">
            {paginated.map(post => (
              <div role="listitem" key={post.id}>
                <PostCard post={post} onDelete={requestDelete} />
              </div>
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : (
        <div className="empty-state" role="status" aria-live="polite">
          <div className="empty-state-icon" aria-hidden="true">
            {hasFilters ? '🔍' : '📭'}
          </div>
          <h2 className="empty-state-title">
            {hasFilters ? 'No posts match your search' : 'No posts yet'}
          </h2>
          <p className="empty-state-desc">
            {hasFilters
              ? 'Try adjusting your search terms or filters.'
              : 'Create your first post to get started!'}
          </p>
          {hasFilters
            ? <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
            : <Link to="/posts/new" className="btn-primary">＋ Create First Post</Link>
          }
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title="Delete Post"
        message={`Are you sure you want to delete "${confirmModal.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ open: false, id: null, title: '' })}
      />
    </div>
  );
}
