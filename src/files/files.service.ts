import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs-extra';
//import * as PDFDocument from 'pdfkit';
import PDFDocument from 'pdfkit';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async changeProfileImage(email: string, file: Express.Multer.File) {
    try {
      // Check if the user exists
      const existingUser = await this.prisma.users.findUnique({
        where: { email },
      });

      if (!existingUser) {
        throw new NotFoundException();
      }

      // If the user has a profile picture, delete the existing one
      if (existingUser.profilePictureId) {
        const existingFile = await this.prisma.files.delete({
          where: { id: existingUser.profilePictureId },
        });

        try {
          await fs.remove(`${existingFile.filePath}`);
        } catch (error) {
          throw new InternalServerErrorException();
        }
      }

      // Create a new record in the files table
      const newFile = await this.prisma.files.create({
        data: {
          filename: file.filename,
          filePath: `./tmp/uploads/profile-pictures/${file.filename}`,
          fileType: file.mimetype,
          size: file.size,
        },
      });

      // Update the user with the created file
      await this.prisma.users.update({
        where: { email },
        data: {
          profilePictureId: newFile.id,
        },
      });

      return { massage: 'User profile picture updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User with specified email does not exist');
      } else {
        throw new InternalServerErrorException(
          'Failed to update user profile image. Please try again later.',
        );
      }
    }
  }

  async findProfilePicturePath(email: string): Promise<string> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email, profilePicture: { isNot: null }, isActive: true },
      });

      if (!user) {
        throw new NotFoundException();
      }

      const file = await this.prisma.files.findUnique({
        where: { id: user.profilePictureId },
      });

      return file.filePath;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'User with specified email cannot be found',
        );
      } else {
        throw new InternalServerErrorException(
          'Error while fetching profile picture. Please try again',
        );
      }
    }
  }

  async deleteProfilePicture(id: string) {
    // Check if the user exists and has profile picture
    const user = await this.prisma.users.findUnique({
      where: { id, profilePicture: { isNot: null } },
    });

    if (!user) {
      throw new NotFoundException(
        'A user with the specified ID cannot be found',
      );
    }

    // Delete the record from files table
    const file = await this.prisma.files.delete({
      where: { id: user.profilePictureId },
    });

    // Delete the file from the file system
    try {
      await fs.remove(file.filePath);
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to delete the file from the file system',
      );
    }

    try {
      await this.prisma.users.update({
        where: { id },
        data: {
          profilePictureId: null,
        },
      });

      return { message: 'Profile picture deleted successful' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while deleting profile picture. Please try again',
      );
    }
  }

  async changeLogo(id: string, file: Express.Multer.File) {
    try {
      // Check if the organization exists
      const org = await this.prisma.organizations.findUnique({
        where: { id },
      });
      if (!org) {
        throw new NotFoundException(
          "Organization with specified ID doesn't exist",
        );
      }

      // If the organization has a logo picture, delete the existing one
      if (org.logoId) {
        const existingFile = await this.prisma.files.delete({
          where: { id: org.logoId },
        });

        try {
          await fs.remove(`${existingFile.filePath}`);
        } catch (error) {
          throw new InternalServerErrorException();
        }
      }

      // Create a new record in the files table
      const newFile = await this.prisma.files.create({
        data: {
          filename: file.filename,
          filePath: `./tmp/uploads/logos/${file.filename}`,
          fileType: file.mimetype,
          size: file.size,
        },
      });

      // Update the organization with the created file
      await this.prisma.organizations.update({
        where: { id },
        data: {
          logoId: newFile.id,
        },
      });

      return { massage: 'Logo updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to update logo. Please try again later.',
        );
      }
    }
  }

  async findLogoPath(id: string): Promise<string> {
    try {
      const org = await this.prisma.organizations.findUnique({
        where: {
          id,
          logo: {
            isNot: null,
          },
        },
      });

      if (!org) {
        throw new NotFoundException();
      }

      const file = await this.prisma.files.findUnique({
        where: { id: org.logoId },
      });

      return file.filePath;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'Organization with specified ID cannot be found',
        );
      } else {
        throw new InternalServerErrorException(
          'Error while fetching profile picture. Please try again',
        );
      }
    }
  }

  async deleteLogo(id: string) {
    // Check if the organization exists and has logo
    const org = await this.prisma.organizations.findFirst({
      where: {
        AND: [{ id: id }, { logoId: { not: null } }],
      },
    });
    if (!org) {
      throw new NotFoundException(
        'An organization with the specified ID cannot be found',
      );
    }

    // Delete the record from files table
    const file = await this.prisma.files.delete({
      where: { id: org.logoId },
    });

    // Delete the file from the file system
    try {
      await fs.remove(file.filePath);
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to delete the file from the file system',
      );
    }

    try {
      await this.prisma.organizations.update({
        where: { id },
        data: {
          logoId: null,
        },
      });

      return { message: 'Logo deleted successful' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while deleting logo. Please try again',
      );
    }
  }

  async uploadPermit(id: string, file: Express.Multer.File) {
    try {
      // Check if the organization exists
      const org = await this.prisma.organizations.findUnique({
        where: { id },
      });
      if (!org) {
        throw new NotFoundException(
          "Organization with specified ID doesn't exist",
        );
      }

      // If the organization has a permit uploaded, delete the existing one
      if (org.permitId) {
        const existingFile = await this.prisma.files.delete({
          where: { id: org.permitId },
        });

        try {
          await fs.remove(`${existingFile.filePath}`);
        } catch (error) {
          throw new InternalServerErrorException();
        }
      }

      // Create a new record in the files table
      const newFile = await this.prisma.files.create({
        data: {
          filename: file.filename,
          filePath: `./tmp/uploads/permits/${file.filename}`,
          fileType: file.mimetype,
          size: file.size,
        },
      });

      // Update the organization with the created file
      await this.prisma.organizations.update({
        where: { id },
        data: {
          permitId: newFile.id,
        },
      });

      return { massage: 'Permit updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to upload permit. Please try again later.',
        );
      }
    }
  }

  async findPermitPath(id: string): Promise<string> {
    try {
      const org = await this.prisma.organizations.findUnique({
        where: {
          id,
          permit: {
            isNot: null,
          },
        },
      });
      if (!org) {
        throw new NotFoundException();
      }

      const file = await this.prisma.files.findUnique({
        where: { id: org.permitId },
      });

      return file.filePath;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'Organization with specified ID cannot be found',
        );
      } else {
        throw new InternalServerErrorException(
          'Error while fetching profile picture. Please try again',
        );
      }
    }
  }

  async uploadCV(id: string, file: Express.Multer.File) {
    try {
      // Check if the user exists
      const user = await this.prisma.users.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException("User with specified ID doesn't exist");
      }

      // If the user has a CV already uploaded, delete the existing one
      if (user.cvId) {
        const existingFile = await this.prisma.files.delete({
          where: { id: user.cvId },
        });

        try {
          await fs.remove(`${existingFile.filePath}`);
        } catch (error) {
          throw new InternalServerErrorException('Failed to delete CV');
        }
      }

      // Create a new record in the files table
      const newFile = await this.prisma.files.create({
        data: {
          filename: file.filename,
          filePath: `./tmp/uploads/CVs/${file.filename}`,
          fileType: file.mimetype,
          size: file.size,
        },
      });

      // Update the user with the created file
      await this.prisma.users.update({
        where: { id },
        data: {
          cvId: newFile.id,
        },
      });

      return { massage: 'CV uploaded successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to upload permit. Please try again later.',
        );
      }
    }
  }

  async findCVPath(id: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          id,
          cv: {
            isNot: null,
          },
          isActive: true,
        },
      });
      if (!user) {
        throw new NotFoundException("User with specified ID doesn't exist");
      }

      const file = await this.prisma.files.findUnique({
        where: { id: user.cvId },
      });

      return file.filePath;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error while fetching CV. Please try again',
        );
      }
    }
  }

  generateCertificate(
    orgLogoPath: string,
    vlLogoPath: string,
    fullName: string,
    projectTitle: string,
    organizationName: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const certificatePath = './tmp/uploads/certificate.pdf';
        const outerDistanceMargin = 10;
        const middleDistanceMargin = outerDistanceMargin + 8;
        const filleAndStrokeColor = '#444';
        const lineWidthLarge = 5;
        const lineWidthSmall = 1;
        const lineJoinType = 'bevel';
        const logoMaxWidth = 140;
        const logoMaxHeight = 50;
        const fontOnePath = './assets/fonts/Montserrat-VariableFont_wght.ttf';
        const fontTwoPath = './assets/fonts/Kalam-Regular.ttf';

        // Create a new A4-landscape PDF document
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });

        // Set destination for the PDF document
        const writeStream = fs.createWriteStream(certificatePath);
        doc.pipe(writeStream);

        // Draw rectangle around the page
        doc
          .fillAndStroke(filleAndStrokeColor)
          .lineWidth(lineWidthLarge)
          .lineJoin(lineJoinType)
          .rect(
            outerDistanceMargin,
            outerDistanceMargin,
            doc.page.width - outerDistanceMargin * 2,
            doc.page.height - outerDistanceMargin * 2,
          )
          .stroke();

        // Draw a small rectangle in the middle
        doc
          .fillAndStroke(filleAndStrokeColor)
          .lineWidth(lineWidthSmall)
          .lineJoin(lineJoinType)
          .rect(
            middleDistanceMargin,
            middleDistanceMargin,
            doc.page.width - middleDistanceMargin * 2,
            doc.page.height - middleDistanceMargin * 2,
          )
          .stroke();

        // Add VolunteerLink and organization logos at the top
        const x = doc.page.width / 2 - logoMaxWidth / 2;
        const y = 60;
        doc.image(orgLogoPath, x - 300, y, {
          fit: [logoMaxWidth, logoMaxHeight],
          align: 'center',
        });

        doc.image(vlLogoPath, x + 300, y, {
          fit: [logoMaxWidth, logoMaxHeight],
          align: 'center',
        });

        this.jumpLine(doc, 3);

        // Add the text contents
        doc
          .font(fontTwoPath)
          .fontSize(28)
          .text('Certificate of Participation', { align: 'center' });

        this.jumpLine(doc, 1);

        doc
          .font(fontTwoPath)
          .fontSize(12)
          .text(`This certificate is awarded to`, { align: 'center' });

        this.jumpLine(doc, 2);

        doc
          .font(fontOnePath)
          .fontSize(24)
          .text(fullName, { align: 'center', underline: true });

        this.jumpLine(doc, 1);

        doc
          .font(fontTwoPath)
          .fontSize(12)
          .text(`for participation in the project:`, { align: 'center' });

        this.jumpLine(doc, 2);

        doc
          .font(fontOnePath)
          .fontSize(24)
          .text(projectTitle, { align: 'center', underline: true });

        this.jumpLine(doc, 2);

        doc
          .font(fontTwoPath)
          .fontSize(10)
          .text(
            `This certificate is awarded to recognize ${fullName}'s generous volunteering efforts in the project ${projectTitle} organized by ${organizationName}. The project spanned from ${startDate} to ${endDate}.`,
            { align: 'center' },
          );

        // Close the PDF document
        doc.end();

        writeStream.on('finish', () => {
          resolve(certificatePath);
        });

        writeStream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        throw new InternalServerErrorException(
          'Error while generating certificate. Please try again',
        );
      }
    });
  }

  // Helper function to jump lines whn generating the certificate
  jumpLine(doc, lines) {
    for (let index = 0; index < lines; index++) {
      doc.moveDown();
    }
  }
}
