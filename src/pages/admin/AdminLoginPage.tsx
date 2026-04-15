import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@/api/services';
import { Lock, Eye, EyeOff } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await login(password);
      localStorage.setItem('admin_token', token);
      navigate('/admin', { replace: true });
    } catch {
      setError('Неверный пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-4">
            <Lock size={24} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">abclinic.uz</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1e25] border border-white/8 rounded-2xl p-8 space-y-5 shadow-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                className="w-full bg-[#12161b] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-colors pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
          >
            {loading ? 'Входим…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
