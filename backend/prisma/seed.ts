import { PrismaClient, Role, Status } from '@prisma/client';
import * as argon from 'argon2';
import { Chance } from 'chance';
const prisma = new PrismaClient();

export async function main() {
  const chance = new Chance();

  const users = [];
  for (let i = 0; i < 200; i++) {
    users.push(
      prisma.user.create({
        data: {
          email: `paitent${i}@test.com`,
          firstName: `${chance.first()}${i}`,
          lastName: `${chance.last()}${i}`,
          telephone: `${chance.phone()}${i}`,
          dateOfBirth: chance.birthday(),
          hash: await argon.hash(`Password!@#1234${i}`),
          role: Role.PATIENT,
          Patient: {
            create: {},
          },
        },
      }),
    );
  }
  await Promise.all(users);

  const specialists = [
    'General',
    'Pedodontist',
    'Orthodontist',
    'Periodontist',
    'Endodontist',
    'Maxillofacial Surgeon',
    'Prosthodontist',
    'Oral Surgeon',
  ];

  await prisma.specialist.createMany({
    data: specialists.map((item) => {
      return {
        name: item,
      };
    }),
  });

  const dentists = [];
  for (let i = 0; i < 30; i++) {
    dentists.push(
      prisma.user.create({
        data: {
          email: `dentist${i}@test.com`,
          firstName: `${chance.first()}${i}`,
          lastName: `${chance.last()}${i}`,
          telephone: `${chance.phone()}`,
          dateOfBirth: chance.birthday(),
          hash: await argon.hash(`Password!@#1234${i}`),
          role: Role.DENTIST,
          Dentist: {
            create: {
              SpecialistOfDentist: {
                create: {
                  yearOfExperience: chance.integer({ min: 1, max: 5 }),
                  specialistId: 1,
                },
              },
            },
          },
        },
      }),
    );
  }
  await Promise.all(dentists);

  for (let i = 0; i < 40; i++) {
    const dentistId = chance.integer({ min: 201, max: 230 });
    const specialistId = chance.integer({ min: 2, max: 8 });

    const dentist = await prisma.dentist.findUnique({
      where: {
        userId: dentistId,
      },
      include: {
        SpecialistOfDentist: true,
      },
    });

    if (
      dentist.SpecialistOfDentist.map((item) => item.specialistId).includes(
        specialistId,
      )
    ) {
      continue;
    }

    await prisma.specialistOfDentist.create({
      data: {
        yearOfExperience: chance.integer({ min: 1, max: 5 }),
        dentistId: dentistId,
        specialistId: specialistId,
      },
    });
  }
  const appointments = [];
  for (let i = 0; i < 500; i++) {
    const dentistId = chance.integer({ min: 201, max: 230 });
    const patientId = chance.integer({ min: 1, max: 200 });
    appointments.push(
      prisma.appointment.create({
        data: {
          dentistId: dentistId,
          patientId: patientId,
          time: chance.date({ year: 2021 }),
          status: Status.COMPLETED,
          details: chance.paragraph(),
        },
      }),
    );
  }

  for (let i = 0; i < 100; i++) {
    const dentistId = chance.integer({ min: 201, max: 230 });
    const patientId = chance.integer({ min: 1, max: 200 });
    appointments.push(
      prisma.appointment.create({
        data: {
          dentistId: dentistId,
          patientId: patientId,
          time: chance.date({ year: 2021 }),
          status: Status.CANCELED,
          details: chance.paragraph(),
        },
      }),
    );
  }

  await Promise.all(appointments);
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
