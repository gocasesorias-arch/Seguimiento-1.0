import dotenv from 'dotenv'

dotenv.config()

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'default_secret_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptRounds: 10
}

export default authConfig
