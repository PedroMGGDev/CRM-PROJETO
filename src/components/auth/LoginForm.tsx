import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { login, verifyMfaCode } from '../../modules/auth/services/authService';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const mfaSchema = z.object({
  code: z.string().length(6, 'Código deve ter 6 dígitos'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type MfaFormData = z.infer<typeof mfaSchema>;

export default function LoginForm() {
  const [needsMfa, setNeedsMfa] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerMfa,
    handleSubmit: handleMfaSubmit,
    formState: { errors: mfaErrors },
  } = useForm<MfaFormData>({
    resolver: zodResolver(mfaSchema),
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError('');
      const response = await login(data.email, data.password);
      
      if (response.requiresMfa) {
        setEmail(data.email);
        setNeedsMfa(true);
      } else {
        setCurrentUser(response.user);
        navigate('/');
      }
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
  };

  const onMfaSubmit = async (data: MfaFormData) => {
    try {
      setLoading(true);
      setError('');
      const response = await verifyMfaCode(email, data.code);
      setCurrentUser(response.user);
      navigate('/');
    } catch (error) {
      setError('Código inválido. Tente novamente.');
      console.error('Erro na verificação MFA:', error);
    } finally {
      setLoading(false);
    }
  };

  if (needsMfa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verificação em duas etapas
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Digite o código enviado para seu email
            </p>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleMfaSubmit(onMfaSubmit)}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="code" className="sr-only">
                  Código de verificação
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...registerMfa('code')}
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Digite o código de 6 dígitos"
                  />
                </div>
                {mfaErrors.code && (
                  <p className="mt-2 text-sm text-red-600">{mfaErrors.code.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit(onLoginSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  {...registerLogin('email')}
                  type="email"
                  className="appearance-none rounded-t-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                />
              </div>
              {loginErrors.email && (
                <p className="mt-2 text-sm text-red-600">{loginErrors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  {...registerLogin('password')}
                  type="password"
                  className="appearance-none rounded-b-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Senha"
                />
              </div>
              {loginErrors.password && (
                <p className="mt-2 text-sm text-red-600">{loginErrors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}