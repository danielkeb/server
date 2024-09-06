import { Module } from '@nestjs/common';
import { CertificatesModule } from 'src/certificates/certificates.module';
import { CertificatesService } from 'src/certificates/certificates.service';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [CertificatesModule],
  controllers: [FilesController],
  providers: [FilesService, CertificatesService],
})
export class FilesModule {}
