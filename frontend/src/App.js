import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProviderHome from './pages/ProviderHome';
import StudentHome from './pages/StudentHome';
import MyProfilePage from './pages/MyProfilePage';
import InsideCard from './pages/InsideCard';
import ProviderProfile from './pages/ProviderProfile';

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
        <Route path="/material/:id" element={<InsideCard />} />
        <Route path="/providers/:enrolment_id" element={<ProviderProfile />} />
        <Route path="/" element={<h1>Welcome Home</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
