import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

@Module({
  imports: [EmailModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, EmailService],
})
export class ApplicationsModule {}
