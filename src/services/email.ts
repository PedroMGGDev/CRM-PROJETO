import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: import.meta.env.VITE_SMTP_HOST,
  port: parseInt(import.meta.env.VITE_SMTP_PORT),
  secure: true,
  auth: {
    user: import.meta.env.VITE_SMTP_USER,
    pass: import.meta.env.VITE_SMTP_PASS,
  },
});

export const sendVerificationCode = async (email: string, code: string) => {
  try {
    await transporter.sendMail({
      from: `"CRM System" <${import.meta.env.VITE_SMTP_FROM}>`,
      to: email,
      subject: 'Código de Verificação',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Seu código de verificação</h2>
          <p>Use o código abaixo para completar seu login:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 4px; margin: 20px 0;">
            <strong>${code}</strong>
          </div>
          <p>Este código expira em 5 minutos.</p>
          <p>Se você não solicitou este código, ignore este email.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
};

export const sendPasswordRecovery = async (email: string, resetToken: string) => {
  try {
    const resetLink = `${import.meta.env.VITE_APP_URL}/reset-password?token=${resetToken}`;
    
    await transporter.sendMail({
      from: `"CRM System" <${import.meta.env.VITE_SMTP_FROM}>`,
      to: email,
      subject: 'Recuperação de Senha',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Recuperação de Senha</h2>
          <p>Você solicitou a recuperação de senha. Clique no link abaixo para criar uma nova senha:</p>
          <div style="margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Redefinir Senha
            </a>
          </div>
          <p>Este link expira em 1 hora.</p>
          <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    return false;
  }
};