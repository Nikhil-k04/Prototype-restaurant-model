import { useNavigate, Link } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import { useToast } from '../context/ToastContext';
import PostForm from '../components/PostForm';

export default function PostCreate() {
  const { createPost } = usePosts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(data) {
    const newPost = createPost(data);
    addToast(`"${newPost.title}" published successfully! 🚀`, 'success');
    navigate(`/posts/${newPost.id}`);
  }

  return (
    <div className="page-container page-container--narrow">
      <div className="page-header">
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">All Posts</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">New Post</span>
          </nav>
          <h1 className="page-title">Create New Post</h1>
          <p className="page-subtitle">Share your knowledge with the world.</p>
        </div>
      </div>
      <PostForm onSubmit={handleSubmit} submitLabel="Publish Post" />
    </div>
  );
}
