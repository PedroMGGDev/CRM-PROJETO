import api from '../../../lib/api';
import { sendVerificationCode } from '../../../services/email';

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.requiresMfa) {
      const code = generateVerificationCode();
      await sendVerificationCode(email, code);
      // Armazena o código temporariamente (em produção, usar Redis ou similar)
      sessionStorage.setItem(`mfa_${email}`, code);
    }
    
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

export const verifyMfaCode = async (email: string, code: string) => {
  try {
    const storedCode = sessionStorage.getItem(`mfa_${email}`);
    
    if (code !== storedCode) {
      throw new Error('Código inválido');
    }
    
    const response = await api.post('/auth/verify-mfa', { email, code });
    sessionStorage.removeItem(`mfa_${email}`);
    return response.data;
  } catch (error) {
    console.error('Erro na verificação MFA:', error);
    throw error;
  }
};