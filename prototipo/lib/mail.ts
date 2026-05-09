import nodemailer from "nodemailer";

/**
 * Configuración del transporte SMTP con las credenciales de Gmail
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Contraseña de aplicación
  },
  tls: {
    rejectUnauthorized: false
  }
});

const APP_NAME = "Red de Bienestar Laboral";
const PRIMARY_COLOR = "#1e293b"; // Slate-800

/**
 * Función para enviar el email de bienvenida a la Red
 */
export async function sendWelcomeEmail(to: string, name: string, role: string) {
  const roleName = role === "PROFESSIONAL" ? "Profesional +45" : "Empresa Aliada";
  
  const mailOptions = {
    from: `"${APP_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject: `¡Bienvenido a la ${APP_NAME}! 🚀`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 20px;">
        <h2 style="color: ${PRIMARY_COLOR};">¡Hola ${name}! 👋</h2>
        <p>Es un placer darte la bienvenida a la <strong>${APP_NAME}</strong> como <strong>${roleName}</strong>.</p>
        
        <p>Nuestra misión es conectar el talento senior con empresas que valoran la experiencia y la trayectoria profesional.</p>

        <div style="margin: 30px 0; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0 0 16px 0; font-weight: bold; color: ${PRIMARY_COLOR};">Tu cuenta ha sido creada con éxito.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/login" style="display: inline-block; padding: 14px 28px; background-color: ${PRIMARY_COLOR}; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
            Ingresar a la Plataforma
          </a>
        </div>

        <p style="font-size: 14px; color: #64748b;">A partir de ahora podrás acceder a tu dashboard personalizado, ver próximos eventos y conectar con otros miembros de la red.</p>

        <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid #eee; padding-top: 20px;">
          Atentamente,<br>
          <strong>El equipo de la ${APP_NAME}</strong><br>
          (Evelyn Stacey, Vanina Colazo y Ana Caro Corbelle)
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de bienvenida enviado a: ${to}`);
  } catch (error) {
    console.error("❌ Error enviando email de bienvenida:", error);
    // No lanzamos error para no bloquear el registro si falla el mail
  }
}

/**
 * Función para enviar el email de verificación
 */
export async function sendVerificationEmail(to: string, url: string) {
  const mailOptions = {
    from: `"${APP_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Verifica tu cuenta - ${APP_NAME}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: ${PRIMARY_COLOR};">¡Bienvenido a la ${APP_NAME}!</h2>
        <p>Gracias por unirte. Para completar tu registro, por favor verifica tu correo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="display: inline-block; padding: 14px 28px; background-color: ${PRIMARY_COLOR}; color: white; text-decoration: none; border-radius: 12px; font-weight: bold;">
            Verificar mi Cuenta
          </a>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Función para enviar el email de restablecimiento de contraseña
 */
export async function sendPasswordResetEmail(to: string, url: string) {
  const mailOptions = {
    from: `"${APP_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Restablece tu contraseña - ${APP_NAME}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: ${PRIMARY_COLOR};">Restablecer tu contraseña</h2>
        <p>Has solicitado restablecer tu contraseña. Si no fuiste tú, puedes ignorar este correo.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="display: inline-block; padding: 14px 28px; background-color: ${PRIMARY_COLOR}; color: white; text-decoration: none; border-radius: 12px; font-weight: bold;">
            Restablecer Contraseña
          </a>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Función para avisar al usuario que su contraseña ha sido cambiada con éxito
 */
export async function sendPasswordChangeConfirmationEmail(to: string, name: string) {
  const mailOptions = {
    from: `"${APP_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Seguridad: Contraseña cambiada - ${APP_NAME}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: ${PRIMARY_COLOR};">¡Seguridad Actualizada! 🛡️</h2>
        <p>Hola <strong>${name}</strong>,</p>
        <p>Te confirmamos que la contraseña de tu cuenta en la ${APP_NAME} ha sido cambiada correctamente.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 14px 28px; background-color: ${PRIMARY_COLOR}; color: white; text-decoration: none; border-radius: 12px; font-weight: bold;">
            Ir al Dashboard
          </a>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
