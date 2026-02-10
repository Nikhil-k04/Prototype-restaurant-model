import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import { useToast } from '../context/ToastContext';
import PostForm from '../components/PostForm';

export default function PostEdit() {
  const { id } = useParams();
  const { getPost, updatePost } = usePosts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const post = getPost(id);
  if (!post) return <Navigate to="/404" replace />;

  async function handleSubmit(data) {
    updatePost(id, data);
    addToast(`"${data.title}" updated successfully! ✔`, 'success');
    navigate(`/posts/${id}`);
  }

  return (
    <div className="page-container page-container--narrow">
      <div className="page-header">
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">All Posts</Link>
            <span aria-hidden="true"> / </span>
            <Link to={`/posts/${id}`}>
              {post.title.length > 45 ? post.title.slice(0, 45) + '…' : post.title}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Edit</span>
          </nav>
          <h1 className="page-title">Edit Post</h1>
          <p className="page-subtitle">Update your post details below.</p>
        </div>
      </div>
      <PostForm initialData={post} onSubmit={handleSubmit} submitLabel="Save Changes" isEditing />
    </div>
  );
}
