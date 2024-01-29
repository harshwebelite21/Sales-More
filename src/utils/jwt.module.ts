import { Module } from '@nestjs/common'
import { AppConfigModule } from 'src/config/appConfig.module'

@Module({
  imports: [AppConfigModule]
})
export class JwtModule {
  async generateJwtToken () {
    try {
      return jwt.sign(payload, appConfig.jwtKey, options)
    } catch (err) {
      console.error('Error while generating token', err)
      throw err
    }
  }

  async verifyJwtToken () {
    try {
      return jwt.verify(cookieToken, appConfig.jwtKey)
    } catch (err) {
      console.error('Error while verifying token:', err)
      return false
    }
  }

  async decodeJwtToken () {
    const { userId } = jwt.decode(cookieToken, appConfig.jwtKey)
    return userId
  }
}
