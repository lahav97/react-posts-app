import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import PostsPage from './pages/PostsPage'
import PostDetailPage from './pages/PostDetailPage'
import NotFoundPage from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <PostsPage /> },
      { path: 'posts/:id', element: <PostDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])