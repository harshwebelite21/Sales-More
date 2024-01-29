import { Module } from '@nestjs/common'
import { AppConfigModule } from 'src/config/appConfig.module'
import { JwtService } from './jwt.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [AppConfigModule,ConfigModule],
  providers:[JwtService]
})
export class JwtModule {
   
}
