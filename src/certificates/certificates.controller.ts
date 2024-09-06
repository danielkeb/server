import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { CertificatesService } from 'src/certificates/certificates.service';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Public()
  @Get(':userId')
  getAllByUserId(@Param('userId') userId: string) {
    return this.certificatesService.findAll(userId);
  }
}
