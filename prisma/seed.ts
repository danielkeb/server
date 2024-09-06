import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LOCATIONS } from './seedData/locations';
import { SKILL_CATEGORIES } from './seedData/skillCategories';
import { SKILLS } from './seedData/skills';

const prisma = new PrismaClient();

async function main() {
  const logger = new Logger('seeder');

  // Create roles
  const adminRole = await prisma.roles.create({
    data: { name: 'Admin', description: 'Administrator role.' },
  });
  const volunteerRole = await prisma.roles.create({
    data: { name: 'Volunteer', description: 'Regular user role.' },
  });
  logger.log('Seeded 2 roles.');

  // Seed locations
  // Create sample locations
  const addisAbaba = await prisma.locations.create({
    data: { name: 'Addis Ababa', code: 'ADDABA' },
  });
  const debreBerhan = await prisma.locations.create({
    data: { name: 'Debre Berhan', code: 'DEBBER' },
  });

  // Create other locations in bulk
  const locations = await prisma.locations.createMany({
    data: LOCATIONS.map((location) => ({
      name: location.name,
      code: location.code,
    })),
    skipDuplicates: true,
  });
  logger.log(`Seeded ${locations.count} locations.`);

  // Seed users
  const adminPassword = 'Admin1234';
  const volunteerPassword = 'User1234';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const hashedVolunteerPassword = await bcrypt.hash(volunteerPassword, 10);

  const volunteer = await prisma.users.create({
    data: {
      firstName: 'user',
      lastName: 'volunteer',
      username: 'volunteer',
      email: 'user.volunteer@test.com',
      password: hashedVolunteerPassword,
      roleId: volunteerRole.id,
      locationId: debreBerhan.id,
      age: faker.number.int({ min: 18, max: 100 }),
      gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
      bio: faker.lorem.sentences(),
      notificationPreference: [
        { option: 'task_assigned', value: true },
        { option: 'new_project_recommendation', value: true },
        { option: 'project_status_update', value: true },
        { option: 'deadlines', value: true },
        { option: 'application_status_update', value: true },
        { option: 'badge_and_certificate', value: true },
      ],
      socialLinks: [
        { platform: 'LinkedIn', url: faker.internet.url() },
        { platform: 'GitHub', url: faker.internet.url() },
        { platform: 'Behance', url: null },
        { platform: 'Instagram', url: null },
        { platform: 'Dribbble', url: null },
        { platform: 'Website', url: faker.internet.url() },
      ],
    },
  });
  const admin = await prisma.users.create({
    data: {
      firstName: 'user',
      lastName: 'admin',
      username: 'admin',
      email: 'user.admin@test.com',
      password: hashedAdminPassword,
      roleId: adminRole.id,
      locationId: addisAbaba.id,
      age: faker.number.int({ min: 18, max: 100 }),
      gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
      bio: faker.lorem.sentences(),
    },
  });
  logger.log(`Seeded 2 users.`);

  // Seed skills and skill categories
  // Seed skill categories
  const skillCategories = await prisma.skillCategories.createMany({
    data: SKILL_CATEGORIES,
    skipDuplicates: true,
  });
  logger.log(`Seeded ${skillCategories.count} skill categories.`);

  // Seed skills
  let skills_count = 0;
  for (const skill of SKILLS) {
    await prisma.skills.upsert({
      where: {
        name: skill.name,
      },
      update: {},
      create: {
        name: skill.name,
        description: skill.description,
        category: {
          connectOrCreate: {
            create: {
              name: skill.category,
              description: 'Skill category description.',
            },
            where: { name: skill.category },
          },
        },
      },
    });

    skills_count++;
  }
  logger.log(`Seeded ${skills_count} skills.`);

  // Seed badges
  const badgeData = [
    {
      name: 'Bronze',
      threshold: 5,
      description:
        'Users who have contributed to at least 5 projects will be awarded the Bronze badge.',
    },
    {
      name: 'Silver',
      threshold: 10,
      description:
        'Users who have contributed to at least 10 projects will be awarded the Silver badge.',
    },
    {
      name: 'Gold',
      threshold: 20,
      description:
        'Users who have contributed to at least 20 projects will be awarded the Gold badge.',
    },
    {
      name: 'Platinum',
      threshold: 50,
      description:
        'Users who have contributed to at least 50 projects will be awarded the Platinum badge.',
    },
    {
      name: 'Diamond',
      threshold: 100,
      description:
        'Users who have contributed to at least 100 projects will be awarded the Diamond badge.',
    },
  ];

  const badges = await prisma.badges.createMany({
    data: badgeData,
  });
  logger.log(`Seeded ${badges.count} badges.`);

  // Give sample badges to users
  await prisma.usersToBadges.create({
    data: {
      user: {
        connect: {
          id: volunteer.id,
        },
      },
      badge: {
        connect: {
          name: 'Bronze',
        },
      },
    },
  });
  await prisma.usersToBadges.create({
    data: {
      user: {
        connect: {
          id: volunteer.id,
        },
      },
      badge: {
        connect: {
          name: 'Gold',
        },
      },
    },
  });
  logger.log(`Seeded 2 badges to users.`);

  // Seed organizations
  const organization1 = await prisma.organizations.create({
    data: {
      name: 'Tech Org',
      mission: 'Innovate tech solutions',
      aboutUs: 'We are a tech organization focused on innovation',
      contactPhone: faker.phone.number(),
      location: { connect: { id: addisAbaba.id } },
      verified: true,
      owner: {
        create: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          roleId: volunteerRole.id,
          age: faker.number.int({ min: 18, max: 100 }),
          gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
          bio: faker.lorem.sentences(),
          skills: {
            connect: [
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
            ],
          },
        },
      },
    },
  });
  const organization2 = await prisma.organizations.create({
    data: {
      name: 'Design Org',
      mission: 'Create beautiful designs',
      aboutUs: 'We are a design organization focused on aesthetics',
      contactPhone: faker.phone.number(),
      location: { connect: { id: debreBerhan.id } },
      verified: false,
      owner: {
        create: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          roleId: volunteerRole.id,
          age: faker.number.int({ min: 18, max: 100 }),
          gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
          bio: faker.lorem.sentences(),
          skills: {
            connect: [
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
            ],
          },
        },
      },
    },
  });
  logger.log(`Seeded 2 organizations.`);

  // Seed projects
  const createProject = async () => {
    const project = await prisma.projects.create({
      data: {
        title: faker.lorem.words({ min: 3, max: 8 }),
        description: faker.lorem.sentences({ min: 5, max: 10 }),
        organization: {
          connect: {
            id: faker.helpers.arrayElement([
              organization1.id,
              organization2.id,
            ]),
          },
        },
        location: {
          connect: { code: faker.helpers.arrayElement(LOCATIONS)['code'] },
        },
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        timeCommitment: faker.helpers.arrayElement(['SHORT_TERM', 'LONG_TERM']),
        status: faker.helpers.arrayElement([
          'IN_PROGRESS',
          'NOT_STARTED',
          'DONE',
        ]),
        provideCertificate: faker.helpers.arrayElement([true, false]),
      },
    });

    return project;
  };
  const project5 = await prisma.projects.create({
    data: {
      title: 'Project 5',
      description: faker.lorem.sentences({ min: 5, max: 10 }),
      organization: {
        connect: {
          id: faker.helpers.arrayElement([organization1.id, organization2.id]),
        },
      },
      location: {
        connect: { code: faker.helpers.arrayElement(LOCATIONS)['code'] },
      },
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      timeCommitment: faker.helpers.arrayElement(['SHORT_TERM', 'LONG_TERM']),
      status: faker.helpers.arrayElement(['DONE']),
      provideCertificate: faker.helpers.arrayElement([true, false]),
    },
  });
  for (let i = 0; i < 24; i++) {
    await createProject();
  }
  logger.log(`Seeded 25 projects.`);

  // Seed project skills
  const projects = await prisma.projects.findMany();
  projects.map(async (project) => {
    await prisma.skillsToProjects.create({
      data: {
        project: {
          connect: { id: project.id },
        },
        skill: {
          connect: {
            name: faker.helpers.arrayElement(SKILLS).name,
          },
        },
        vacancies: faker.number.int({ min: 1, max: 100 }),
      },
    });
  });
  logger.log(`Seeded 9 project skills.`);

  // Seed reviews
  await prisma.reviews.create({
    data: {
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(),
      project: {
        connect: { id: project5.id },
      },
      user: {
        create: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          roleId: volunteerRole.id,
          age: faker.number.int({ min: 18, max: 100 }),
          gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
          skills: {
            connect: [
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
            ],
          },
        },
      },
    },
  });
  await prisma.reviews.create({
    data: {
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(),
      project: {
        connect: { id: project5.id },
      },
      user: {
        create: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          roleId: volunteerRole.id,
          age: faker.number.int({ min: 18, max: 100 }),
          gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
          skills: {
            connect: [
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
            ],
          },
        },
      },
    },
  });
  await prisma.reviews.create({
    data: {
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(),
      project: {
        connect: { id: project5.id },
      },
      user: {
        create: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          roleId: volunteerRole.id,
          age: faker.number.int({ min: 18, max: 100 }),
          gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
          skills: {
            connect: [
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
            ],
          },
        },
      },
    },
  });
  await prisma.reviews.create({
    data: {
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(),
      project: {
        connect: { id: project5.id },
      },
      user: {
        create: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          roleId: volunteerRole.id,
          age: faker.number.int({ min: 18, max: 100 }),
          gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
          skills: {
            connect: [
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
            ],
          },
        },
      },
    },
  });
  await prisma.reviews.create({
    data: {
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(),
      project: {
        connect: { id: project5.id },
      },
      user: {
        create: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          roleId: volunteerRole.id,
          age: faker.number.int({ min: 18, max: 100 }),
          gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
          skills: {
            connect: [
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
            ],
          },
        },
      },
    },
  });
  await prisma.reviews.create({
    data: {
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(),
      project: {
        connect: { id: project5.id },
      },
      user: {
        create: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          roleId: volunteerRole.id,
          age: faker.number.int({ min: 18, max: 100 }),
          gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
          skills: {
            connect: [
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
            ],
          },
        },
      },
    },
  });
  await prisma.reviews.create({
    data: {
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(),
      project: {
        connect: { id: project5.id },
      },
      user: {
        create: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          roleId: volunteerRole.id,
          age: faker.number.int({ min: 18, max: 100 }),
          gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
          skills: {
            connect: [
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
              {
                name: faker.helpers.arrayElement(SKILLS).name,
              },
            ],
          },
        },
      },
    },
  });
  logger.log('Seeded 7 reviews.');

  // Seed certificates
  await prisma.certificates.create({
    data: {
      dateGiven: new Date(),
      projectId: project5.id,
      userId: volunteer.id,
    },
  });
  logger.log('Seeded 1 certificate.');

  // Seed applications
  const applications = await prisma.applications.createMany({
    data: [
      {
        message: faker.lorem.sentences(),
        projectId: faker.helpers.arrayElement(projects)['id'],
        userId: volunteer.id,
        status: 'ACCEPTED',
      },
      {
        message: faker.lorem.sentences(),
        projectId: faker.helpers.arrayElement(projects)['id'],
        userId: volunteer.id,
        status: faker.helpers.arrayElement(['PENDING', 'ACCEPTED', 'REJECTED']),
      },
      {
        message: faker.lorem.sentences(),
        projectId: faker.helpers.arrayElement(projects)['id'],
        userId: volunteer.id,
        status: faker.helpers.arrayElement(['PENDING', 'ACCEPTED', 'REJECTED']),
      },
      {
        message: faker.lorem.sentences(),
        projectId: faker.helpers.arrayElement(projects)['id'],
        userId: volunteer.id,
        status: faker.helpers.arrayElement(['PENDING', 'ACCEPTED', 'REJECTED']),
      },
      {
        message: faker.lorem.sentences(),
        projectId: faker.helpers.arrayElement(projects)['id'],
        userId: volunteer.id,
        status: faker.helpers.arrayElement(['PENDING', 'ACCEPTED', 'REJECTED']),
      },
    ],
  });
  logger.log(`Seeded ${applications.count} applications.`);

  // Seed reports
  const reports = await prisma.reports.createMany({
    data: [
      {
        contentId: project5.id,
        contentType: 'PROJECT',
        reason: faker.helpers.arrayElement([
          'FAKE',
          'SCAM',
          'INAPPROPRIATE_CONTENT',
          'SPAM',
          'IMPERSONATION',
          'PRIVACY_VIOLATION',
          'OTHER',
        ]),
        reporterId: volunteer.id,
        status: faker.helpers.arrayElement(['ACTIVE', 'RESOLVED']),
        description: faker.lorem.sentences(),
      },
      {
        contentId: admin.id,
        contentType: 'USER',
        reason: faker.helpers.arrayElement([
          'FAKE',
          'SCAM',
          'INAPPROPRIATE_CONTENT',
          'SPAM',
          'IMPERSONATION',
          'PRIVACY_VIOLATION',
          'OTHER',
        ]),
        reporterId: volunteer.id,
        status: faker.helpers.arrayElement(['ACTIVE', 'RESOLVED']),
        description: faker.lorem.sentences(),
      },
      {
        contentId: organization2.id,
        contentType: 'ORGANIZATION',
        reason: faker.helpers.arrayElement([
          'FAKE',
          'SCAM',
          'INAPPROPRIATE_CONTENT',
          'SPAM',
          'IMPERSONATION',
          'PRIVACY_VIOLATION',
          'OTHER',
        ]),
        reporterId: volunteer.id,
        status: faker.helpers.arrayElement(['ACTIVE', 'RESOLVED']),
        description: faker.lorem.sentences(),
      },
      {
        contentId: organization1.id,
        contentType: 'ORGANIZATION',
        reason: faker.helpers.arrayElement([
          'FAKE',
          'SCAM',
          'INAPPROPRIATE_CONTENT',
          'SPAM',
          'IMPERSONATION',
          'PRIVACY_VIOLATION',
          'OTHER',
        ]),
        reporterId: volunteer.id,
        status: faker.helpers.arrayElement(['ACTIVE', 'RESOLVED']),
        description: faker.lorem.sentences(),
      },
    ],
  });
  logger.log(`Seeded ${reports.count} reports.`);

  // Seed tasks
  const createTask = async () => {
    await prisma.tasks.create({
      data: {
        title: faker.lorem.words({ min: 3, max: 8 }),
        description: faker.lorem.sentences({ min: 5, max: 10 }),
        project: {
          connect: {
            id: project5.id,
          },
        },
        status: faker.helpers.arrayElement(['OPEN', 'COMPLETED']),
        deadline: faker.date.future(),
        priority: faker.helpers.arrayElement([1, 2, 3, 4]),
        assignedTo: {
          create: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            roleId: volunteerRole.id,
            age: faker.number.int({ min: 18, max: 100 }),
            gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
            bio: faker.lorem.sentences(),
            skills: {
              connect: [
                {
                  name: faker.helpers.arrayElement(SKILLS).name,
                },
                {
                  name: faker.helpers.arrayElement(SKILLS).name,
                },
              ],
            },
          },
        },
      },
    });
  };
  await prisma.tasks.create({
    data: {
      title: faker.lorem.words({ min: 3, max: 8 }),
      description: faker.lorem.sentences({ min: 5, max: 10 }),
      projectId: project5.id,
      status: faker.helpers.arrayElement(['OPEN', 'COMPLETED']),
      deadline: faker.date.future(),
      priority: faker.helpers.arrayElement([1, 2, 3, 4]),
      assignedToId: volunteer.id,
    },
  });
  for (let i = 0; i < 7; i++) {
    await createTask();
  }
  logger.log(`Seeded 8 tasks.`);

  logger.log('Seeded successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
