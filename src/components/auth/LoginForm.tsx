import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import axios from 'axios';

// Schema de validação do login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// Schema de validação do código MFA
const mfaSchema = z.object({
  code: z.string().length(6, 'Código deve ter 6 dígitos'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type MfaFormData = z.infer<typeof mfaSchema>;

export default function LoginForm() {
  const [needsMfa, setNeedsMfa] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');  // Estado para capturar o erro
  const navigate = useNavigate();
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  // Hook para o formulário de login
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Hook para o formulário MFA
  const {
    register: registerMfa,
    handleSubmit: handleMfaSubmit,
    formState: { errors: mfaErrors },
  } = useForm<MfaFormData>({
    resolver: zodResolver(mfaSchema),
  });

  // Função para o envio do login
  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      // Envia os dados de login para o backend
      const response = await axios.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      });

      // Se a resposta for bem-sucedida, ativa a necessidade de MFA
      if (response.status === 200) {
        setEmail(data.email);
        setNeedsMfa(true);  // Ativa a tela de MFA
        alert('Código de verificação enviado para o seu e-mail!');
      }
    } catch (error) {
      // Exibe a mensagem de erro diretamente na interface
      setErrorMessage(error.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  // Função para a verificação do código MFA
  const onMfaSubmit = async (data: MfaFormData) => {
    try {
      const response = await axios.post('/api/auth/verify-mfa', {
        email: email,
        code: data.code,
      });

      // Se a verificação for bem-sucedida, define o usuário como autenticado
      if (response.status === 200) {
        setCurrentUser(response.data.user);
        navigate('/');
      }
    } catch (error) {
      setErrorMessage('Erro na verificação MFA. Verifique o código e tente novamente.');
    }
  };

  // Se precisar de MFA, exibe o formulário de verificação
  if (needsMfa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verificação em duas etapas
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Digite o código enviado para seu e-mail
            </p>
          </div>
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
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Verificar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Exibe o formulário de login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua co
          </h2>
        </div>
        {errorMessage && (
          <p className="text-center text-sm text-red-600">{errorMessage}</p>  {/* Exibe o erro */}
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
                Esquece sua senha?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
