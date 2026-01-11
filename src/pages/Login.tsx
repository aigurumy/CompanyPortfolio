import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LogIn, AlertCircle, Baby, Heart } from 'lucide-react';
import LanguageToggle from '../components/LanguageToggle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, profile } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F0F9FF] to-[#F0FDF4]">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#B5EAD7] to-[#C7CEEA] p-2 rounded-xl">
              <Baby className="w-6 h-6 text-gray-800" />
            </div>
            <span className="text-2xl font-bold text-gray-800">Taska-Care</span>
          </Link>
          <LanguageToggle />
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 min-h-screen flex items-center justify-center">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C7CEEA] to-blue-200 rounded-2xl flex items-center justify-center mb-4">
                <LogIn className="w-8 h-8 text-gray-800" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{t('staffLogin')}</h2>
              <p className="text-gray-600 mt-2">
                {language === 'en' ? 'For Admin & Teacher access' : 'Untuk akses Pentadbir & Guru'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B5EAD7] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('password')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B5EAD7] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                  placeholder={language === 'en' ? 'Enter your password' : 'Masukkan kata laluan'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#C7CEEA] to-blue-200 text-gray-800 font-semibold py-4 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (language === 'en' ? 'Signing in...' : 'Mendaftar masuk...') : t('signIn')}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-2">
                {language === 'en' ? 'Demo Accounts:' : 'Akaun Demo:'}
              </p>
              <div className="space-y-1 text-xs text-gray-700">
                <p><span className="font-medium">Admin:</span> admin@childcare.com / admin123</p>
                <p><span className="font-medium">Teacher:</span> teacher@childcare.com / teacher123</p>
                <p><span className="font-medium">Parent:</span> parent@childcare.com / parent123</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-10 shadow-xl border border-pink-100 flex flex-col justify-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-rose-200 rounded-2xl flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-gray-800" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{t('newParent')}</h2>
              <p className="text-gray-600 mt-2 mb-8">
                {language === 'en'
                  ? 'Register your child and join our caring community'
                  : 'Daftarkan anak anda dan sertai komuniti penjagaan kami'}
              </p>
            </div>

            <Link
              to="/register"
              className="w-full bg-gradient-to-r from-pink-200 to-rose-200 text-gray-800 font-semibold py-4 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-center"
            >
              {t('registerNewStudent')}
            </Link>

            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" />
                <p className="text-gray-700">
                  {language === 'en'
                    ? 'Real-time updates on your child\'s daily activities'
                    : 'Kemas kini masa nyata mengenai aktiviti harian anak anda'}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" />
                <p className="text-gray-700">
                  {language === 'en'
                    ? 'Photo updates and progress reports'
                    : 'Kemas kini foto dan laporan kemajuan'}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" />
                <p className="text-gray-700">
                  {language === 'en'
                    ? 'Direct communication with teachers and admin'
                    : 'Komunikasi terus dengan guru dan pentadbir'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
