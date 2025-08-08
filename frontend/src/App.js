import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProviderHome from './pages/ProviderHome';
import StudentHome from './pages/StudentHome';
import MyProfilePage from './pages/MyProfilePage';

function App() {
  return (
    <Router>
      {/* <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav> */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/provider-home" element={<ProviderHome />} />
        <Route path="/student-home" element={<StudentHome />} />
        <Route path="/profile" element={<MyProfilePage />} />
        <Route path="/" element={<h1>Welcome Home</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
