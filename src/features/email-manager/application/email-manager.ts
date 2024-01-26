import { emailAdapter } from "../infrastructure/email-adapter"

export const emailManager = {
    async sendEmail (email: string, subject?: string, message?: string, html?: string) {
        return await emailAdapter.sendEmail(email, subject, message, html)
    },

    async sendRegistrationEmail (code: string, email: string) {
        const html = `<h1>Thanks for your registration</h1><p>To finish registration please follow the link below:<a href='https://some-front.com/confirm-registration?code=${code}'>complete registration</a></p>`
        return await emailAdapter.sendEmail(email, '', '', html)
    },

    async sendRecoveryPasswordEmail (code: string, email: string) {
        const html = `<h1>Password recovery</h1><p>To finish password recovery please follow the link below:<a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a></p>`
        return await emailAdapter.sendEmail(email, '', '', html)
    }
}