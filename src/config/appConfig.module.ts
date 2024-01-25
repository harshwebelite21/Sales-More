import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({ imports: [ConfigModule] })
export class AppConfigModule {
  constructor (private readonly configService: ConfigService) {
    const port = this.configService.get<number>('PORT', 3000)
    const databaseUrl = this.configService.get<string>('DATABASE_URL')
    this.configService.get<string>('SECRETKEY')
    console.log(`Server is running on port ${port}`)
    console.log(`Database URL: ${databaseUrl}`)
  }
}
