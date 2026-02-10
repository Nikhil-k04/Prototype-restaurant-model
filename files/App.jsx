import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PostsProvider } from './context/PostsContext';
import Header from './components/Header';
import Toast from './components/Toast';
import { ToastProvider } from './context/ToastContext';
import PostList from './pages/PostList';
import PostCreate from './pages/PostCreate';
import PostView from './pages/PostView';
import PostEdit from './pages/PostEdit';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <PostsProvider>
          <div className="app-shell">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/"              element={<PostList />} />
                <Route path="/posts/new"     element={<PostCreate />} />
                <Route path="/posts/:id"     element={<PostView />} />
                <Route path="/posts/:id/edit" element={<PostEdit />} />
                <Route path="/404"           element={<NotFound />} />
                <Route path="*"              element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
            <Toast />
          </div>
        </PostsProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
