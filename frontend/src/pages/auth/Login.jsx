// src/pages/auth/Login.jsx
import '../../css/login.css'; // Tus estilos personalizados
import HeroSection from '../../components/HeroSection';
import LoginForm from '../../components/LoginForm';

export default function Login() {
  return (
    <div className="login-page"> {/* Esta clase tendrá height: 100vh */}
      <HeroSection />
      <LoginForm />
    </div>
  );
}
