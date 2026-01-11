import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Baby, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'parent',
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ phone })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
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
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-rose-200 rounded-2xl flex items-center justify-center mb-4">
                <Baby className="w-8 h-8 text-gray-800" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{t('registerNewStudent')}</h2>
              <p className="text-gray-600 mt-2">
                {language === 'en'
                  ? 'Create your parent account'
                  : 'Buat akaun ibubapa anda'}
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
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fullName')}
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B5EAD7] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                  placeholder={language === 'en' ? 'Enter your full name' : 'Masukkan nama penuh'}
                />
              </div>

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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('phone')}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B5EAD7] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="+60 12-345 6789"
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
                  minLength={6}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B5EAD7] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                  placeholder={language === 'en' ? 'Minimum 6 characters' : 'Minimum 6 aksara'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-200 to-rose-200 text-gray-800 font-semibold py-4 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (language === 'en' ? 'Creating account...' : 'Membuat akaun...') : t('createAccount')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {language === 'en' ? 'Already have an account?' : 'Sudah mempunyai akaun?'}{' '}
                <Link to="/login" className="text-[#B5EAD7] hover:text-[#C7CEEA] font-semibold transition-colors">
                  {t('signIn')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}