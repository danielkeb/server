import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: {
            checkApplication: jest.fn(),
            getMyApplications: jest.fn(),
            getApplicationsByProjectId: jest.fn(),
            acceptApplication: jest.fn(),
            rejectApplication: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkApplication', () => {
    it('should return the application status', async () => {
      const req = { user: { sub: 'userId' } };
      const projectId = 'projectId';
      const result = { applied: true };

      jest.spyOn(service, 'checkApplication').mockResolvedValue(result);

      expect(await controller.checkApplication(req, projectId)).toBe(result);
      expect(service.checkApplication).toHaveBeenCalledWith(
        'userId',
        projectId,
      );
    });
  });

  describe('getMyApplications', () => {
    it('should return the user applications', async () => {
      const req = { user: { sub: 'userId' } };
      const result = {
        pending: [],
        accepted: [],
        rejected: [],
      };

      jest.spyOn(service, 'getMyApplications').mockResolvedValue(result);

      expect(await controller.getMyApplications(req)).toBe(result);
      expect(service.getMyApplications).toHaveBeenCalledWith('userId');
    });
  });

  describe('getApplicationsByProjectId', () => {
    it('should return applications by projectId', async () => {
      const projectId = 'projectId';
      const result = {
        pending: [],
        accepted: [],
        rejected: [],
      };

      jest
        .spyOn(service, 'getApplicationsByProjectId')
        .mockResolvedValue(result);

      expect(await controller.getApplicationsByProjectId(projectId)).toBe(
        result,
      );
      expect(service.getApplicationsByProjectId).toHaveBeenCalledWith(
        projectId,
      );
    });
  });

  describe('acceptApplication', () => {
    it('should accept an application', async () => {
      const applicationId = 'applicationId';
      const result = { message: 'Application accepted' };

      jest.spyOn(service, 'acceptApplication').mockResolvedValue(result);

      expect(await controller.acceptApplication(applicationId)).toBe(result);
      expect(service.acceptApplication).toHaveBeenCalledWith(applicationId);
    });
  });

  describe('rejectApplication', () => {
    it('should reject an application', async () => {
      const applicationId = 'applicationId';
      const result = { message: 'Application rejected' };

      jest.spyOn(service, 'rejectApplication').mockResolvedValue(result);

      expect(await controller.rejectApplication(applicationId)).toBe(result);
      expect(service.rejectApplication).toHaveBeenCalledWith(applicationId);
    });
  });
});
