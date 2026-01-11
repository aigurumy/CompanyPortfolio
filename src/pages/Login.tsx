import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

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

  const setupDemoAccounts = async () => {
    setSetupLoading(true);
    setError('');
    setSetupSuccess('');

    const demoUsers = [
      { email: 'admin@childcare.com', password: 'admin123', full_name: 'Admin User', role: 'admin', phone: '+1-555-0001' },
      { email: 'teacher@childcare.com', password: 'teacher123', full_name: 'Teacher User', role: 'teacher', phone: '+1-555-0002' },
      { email: 'parent@childcare.com', password: 'parent123', full_name: 'Parent User', role: 'parent', phone: '+1-555-0003' }
    ];

    let successCount = 0;

    try {
      for (const user of demoUsers) {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
        });

        if (signUpError) {
          if (!signUpError.message.includes('already registered')) {
            console.error(`Error creating ${user.email}:`, signUpError);
          }
          continue;
        }

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              full_name: user.full_name,
              role: user.role,
              phone: user.phone
            });

          if (profileError && !profileError.message.includes('duplicate')) {
            console.error(`Error creating profile for ${user.email}:`, profileError);
            continue;
          }

          successCount++;
        }
      }

      await supabase.auth.signOut();

      if (successCount > 0) {
        setSetupSuccess(`Successfully created ${successCount} demo account(s)! You can now login.`);
        setEmail('admin@childcare.com');
        setPassword('admin123');
      } else {
        setSetupSuccess('Demo accounts already exist! You can login now.');
        setEmail('admin@childcare.com');
        setPassword('admin123');
      }
    } catch (err) {
      setError('Failed to create demo accounts. Please try again.');
      console.error('Setup error:', err);
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-100">Child-Care Portal</h2>
            <p className="text-slate-400 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {setupSuccess && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{setupSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              onClick={setupDemoAccounts}
              disabled={setupLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>{setupLoading ? 'Creating demo accounts...' : 'Setup Demo Accounts'}</span>
            </button>
          </div>

          <div className="mt-6 text-center text-slate-400 text-sm">
            <p>Demo Accounts:</p>
            <p className="mt-2">Admin: admin@childcare.com / admin123</p>
            <p>Teacher: teacher@childcare.com / teacher123</p>
            <p>Parent: parent@childcare.com / parent123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
