require("dotenv").config()
const brevo = require("@getbrevo/brevo")

const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  )

const sendVerificationEmail = async (to, token) => {
    const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`

    const emailData = {
      sender: {
        name: "VideoBelajar",
        email: process.env.MAILER_DEFAULT_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject: "Verifikasi Akun VideoBelajar",
      htmlContent: `
        <h3>Selamat datang di VideoBelajar!</h3>
        <p>Terima kasih sudah mendaftar. Klik tautan berikut untuk memverifikasi akun kamu:</p>
        <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
        <br/><br/>
        <p>Jika kamu tidak merasa mendaftar, abaikan email ini.</p>
      `,
    };

  try {
    const response = await apiInstance.sendTransacEmail(emailData)
    console.log("Email terkirim. Message ID:", response);
    return true
  } catch (error) {
    console.error("Brevo error:", error.response?.body || error)
    return false
  }
}

module.exports = { sendVerificationEmail }