import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Blogs from './pages/Blogs';
import Experience from './pages/Experience';
import Testimonials from './pages/Testimonials';
import Services from './pages/Services';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="about" element={<About />} />
            <Route path="skills" element={<Skills />} />
            <Route path="projects" element={<Projects />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="experience" element={<Experience />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="services" element={<Services />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
