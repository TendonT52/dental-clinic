import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Role, Status } from '@prisma/client';
import * as argon from 'argon2';
import { Chance } from 'chance';
import { CreateAppointmentReq } from 'src/dto/createAppointment.dto';
import { CreateDentistReq } from 'src/dto/createDentist.dto';
import { CreatePatientReq } from 'src/dto/createPatient.dto';
import { Specialist } from 'src/dto/getSpecialist.dto';
import { LoginReq } from 'src/dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
jest.setTimeout(30000);
describe('app e2e testing', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let patientSeed;
  let adminSeed;
  let specialistSeed;
  let dentistSeed;
  let appointmentSeed;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const chance = new Chance();
    patientSeed = [
      {
        email: 'paitent1@test.com',
        firstName: 'testFirstname1',
        lastName: 'testLastname1',
        telephone: 'testTelephone1',
        hash: await argon.hash('testPassw!@#ord1234'),
        dateOfBirth: chance.birthday(),
        role: Role.PATIENT,
        Patient: {
          create: {},
        },
      },
      {
        email: 'paitent2@test.com',
        firstName: 'testFirstname2',
        lastName: 'testLastname2',
        telephone: 'testTelephone2',
        hash: await argon.hash('testPassw!@#ord1234'),
        dateOfBirth: chance.birthday(),
        role: Role.PATIENT,
        Patient: {
          create: {},
        },
      },
      {
        email: 'paitent3@test.com',
        firstName: 'testFirstname3',
        lastName: 'testLastname3',
        telephone: 'testTelephone3',
        hash: await argon.hash('testPassw!@#ord1234'),
        dateOfBirth: chance.birthday(),
        role: Role.PATIENT,
        Patient: {
          create: {},
        },
      },
    ];

    specialistSeed = [
      {
        name: 'General',
      },
      {
        name: 'Periodontist',
      },
      {
        name: 'Orthodontist',
      },
    ];

    dentistSeed = [
      {
        email: 'dentist4@test.com',
        firstName: 'testFirstname4',
        lastName: 'testLastname4',
        telephone: 'testTelephone4',
        hash: await argon.hash('testPassw!@#ord1234'),
        dateOfBirth: chance.birthday(),
        role: Role.DENTIST,
        Dentist: {
          create: {
            SpecialistOfDentist: {
              create: [
                {
                  yearOfExperience: 3,
                  specialist: {
                    connect: {
                      id: 1,
                    },
                  },
                },
              ],
            },
          },
        },
      },
      {
        email: 'dentist5@test.com',
        firstName: 'testFirstname5',
        lastName: 'testLastname5',
        telephone: 'testTelephone5',
        hash: await argon.hash('testPassw!@#ord1234'),
        dateOfBirth: chance.birthday(),
        role: Role.DENTIST,
        Dentist: {
          create: {
            SpecialistOfDentist: {
              create: [
                {
                  yearOfExperience: 3,
                  specialist: {
                    connect: {
                      id: 1,
                    },
                  },
                },
                {
                  yearOfExperience: 4,
                  specialist: {
                    connect: {
                      id: 2,
                    },
                  },
                },
              ],
            },
          },
        },
      },
      {
        email: 'dentist6@test.com',
        firstName: 'testFirstname6',
        lastName: 'testLastname6',
        telephone: 'testTelephone6',
        hash: await argon.hash('testPassw!@#ord1234'),
        dateOfBirth: chance.birthday(),
        role: Role.DENTIST,
        Dentist: {
          create: {
            SpecialistOfDentist: {
              create: [
                {
                  yearOfExperience: 4,
                  specialist: {
                    connect: {
                      id: 1,
                    },
                  },
                },
                {
                  yearOfExperience: 2,
                  specialist: {
                    connect: {
                      id: 2,
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ];
    adminSeed = {
      email: 'admin@test.com',
      firstName: 'testFirstname7',
      lastName: 'testLastname7',
      telephone: 'testTelephone7',
      dateOfBirth: chance.birthday(),
      role: Role.ADMIN,
      hash: await argon.hash('testPassw!@#ord1234'),
    };

    appointmentSeed = [
      {
        details: ' test ' + chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 3,
      },
      {
        details: ' test ' + chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 3,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 3,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 1,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 1,
      },
      {
        details: ' test ' + chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 3,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 1,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 3,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 1,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 1,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 1,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 1,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 1,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 1,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 5,
        patientId: 2,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 6,
        patientId: 3,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 5,
        patientId: 3,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 5,
        patientId: 3,
      },
      {
        details: chance.paragraph(),
        time: chance.date(),
        status: Status.PENDING,
        dentistId: 4,
        patientId: 2,
      },
    ];

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    await Promise.all([
      prisma.user.create({
        data: patientSeed[0],
      }),
      prisma.user.create({
        data: patientSeed[1],
      }),
      prisma.user.create({
        data: patientSeed[2],
      }),
    ]);

    await prisma.specialist.createMany({
      data: specialistSeed,
    });

    await Promise.all([
      prisma.user.create({
        data: dentistSeed[0],
      }),
      prisma.user.create({
        data: dentistSeed[1],
      }),
      prisma.user.create({
        data: dentistSeed[2],
      }),
    ]);

    await prisma.user.create({
      data: adminSeed,
    });

    await prisma.appointment.createMany({
      data: appointmentSeed,
    });
  });

  afterAll(() => {
    prisma.$disconnect();
    app.close();
  });

  describe('testing server', () => {
    it('/', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('testing patient controller', () => {
    describe('create patient usecase', () => {
      describe('create patient', () => {
        let accessToken: string;
        let patientId: number;
        it('should return userID and accessToken', async () => {
          const req: CreatePatientReq = {
            email: 'asasdsdf@asdf.com',
            firstName: 'testFirstname',
            lastName: 'testLastname',
            telephone: 'testTelephone',
            password: 'testPassw!@#ord1234',
            dateOfBirth: new Date(),
          };
          const res = await request(app.getHttpServer())
            .post('/patients')
            .send(req);
          expect(res.status).toBe(HttpStatus.CREATED);
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('id');
          accessToken = res.body.accessToken;
          patientId = res.body.id;
        });

        it('should return patient', async () => {
          const res = await request(app.getHttpServer())
            .get(`/patients/${patientId}`)
            .set('Authorization', `Bearer ${accessToken}`);
          expect(res.status).toBe(HttpStatus.OK);
          expect(res.body).toHaveProperty('id');
        });

        describe('login create patient', () => {
          let accessToken: string;
          it('should return accessToken', async () => {
            const res = await request(app.getHttpServer())
              .post('/auth/login')
              .send({
                email: 'asasdsdf@asdf.com',
                password: 'testPassw!@#ord1234',
              });
            expect(res.status).toBe(HttpStatus.ACCEPTED);
            expect(res.body).toHaveProperty('accessToken');
            accessToken = res.body.accessToken;
          });

          it('should return patient', async () => {
            const res = await request(app.getHttpServer())
              .get(`/patients/${patientId}`)
              .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toHaveProperty('id');
          });

          describe('update create patient by accessToken', () => {
            it('should return OK', async () => {
              const res = await request(app.getHttpServer())
                .put(`/patients/${patientId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                  email: 'email@test.com',
                  firstName: 'testUpdateFirstname',
                  lastName: 'testUpdateLastname',
                  telephone: 'testUpdateTelephone',
                  password: 'testPassw!@#ord12345',
                  dateOfBirth: 12341234,
                });
              expect(res.status).toBe(HttpStatus.OK);
            });
          });
        });
      });
    });
  });

  describe('login', () => {
    let admin: { id: any; accessToken: any };
    it('login as admin', async () => {
      const req: LoginReq = {
        email: adminSeed.email,
        password: 'testPassw!@#ord1234',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(req);

      expect(res.status).toBe(HttpStatus.ACCEPTED);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('id');
      admin = {
        id: res.body.id,
        accessToken: res.body.accessToken,
      };
    });
    let dentist: { id: any; accessToken: any };
    it('login as dentist', async () => {
      const req: LoginReq = {
        email: dentistSeed[0].email,
        password: 'testPassw!@#ord1234',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(req);

      expect(res.status).toBe(HttpStatus.ACCEPTED);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('id');
      dentist = {
        id: res.body.id,
        accessToken: res.body.accessToken,
      };
    });
    let patient: { accessToken: any; id?: any };
    it('login as destist', async () => {
      const req: LoginReq = {
        email: patientSeed[0].email,
        password: 'testPassw!@#ord1234',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(req);

      expect(res.status).toBe(HttpStatus.ACCEPTED);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('id');
      patient = {
        id: res.body.id,
        accessToken: res.body.accessToken,
      };
    });

    let spaciallist: Specialist[];
    describe('testing specialist controller', () => {
      let spaciallistId: number;
      describe('create specialist usecase', () => {
        it('should return 201', async () => {
          const res = await request(app.getHttpServer())
            .post('/specialists')
            .send({ name: 'Endodontist' })
            .set('Authorization', `Bearer ${admin.accessToken}`);
          expect(res.status).toBe(HttpStatus.CREATED);
          expect(res.body).toHaveProperty('id');
          spaciallistId = res.body.id;
        });

        it('should contain Endodontist', async () => {
          const res = await request(app.getHttpServer())
            .get('/specialists')
            .set('Authorization', `Bearer ${admin.accessToken}`);
          expect(res.body).toHaveProperty('specialists');
          expect(res.body.specialists.map((item) => item.name)).toContainEqual(
            'Endodontist',
          );
        });
      });

      describe('delete specialist usecase', () => {
        it('should return 200', async () => {
          const res = await request(app.getHttpServer())
            .delete(`/specialists/${spaciallistId}`)
            .set('Authorization', `Bearer ${admin.accessToken}`);
          expect(res.status).toBe(HttpStatus.OK);
        });

        it('should not contain Endodontist', async () => {
          const res = await request(app.getHttpServer())
            .get('/specialists')
            .set('Authorization', `Bearer ${admin.accessToken}`);
          expect(res.body).toHaveProperty('specialists');
          expect(
            res.body.specialists.map((item) => item.name),
          ).not.toContainEqual('Endodontist');
          spaciallist = res.body.specialists;
        });
      });
    });
    describe('testing dentist controller', () => {
      describe('create dentist usecase', () => {
        let accessToken: string;
        let dentistId: number;
        let createReq: CreateDentistReq;
        it('should return userID and accessToken', async () => {
          createReq = {
            email: 'dentist@email.com',
            firstName: 'testFirstnamedentist',
            lastName: 'testLastnamedentist',
            telephone: 'testTelephonedentist',
            dateOfBirth: new Date(),
            password: 'testPassw!@#ord1234',
            specialist: [
              {
                id: spaciallist[0].id,
                yearOfExperience: 2,
              },
              {
                id: spaciallist[1].id,
                yearOfExperience: 3,
              },
            ],
          };

          const res = await request(app.getHttpServer())
            .post('/dentists')
            .send(createReq);
          expect(res.status).toBe(HttpStatus.CREATED);
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('id');
          accessToken = res.body.accessToken;
          dentistId = res.body.id;
        });

        let spaciallists;

        it('get specialist', async () => {
          const res = await request(app.getHttpServer())
            .get('/specialists')
            .set('Authorization', `Bearer ${accessToken}`);
          expect(res.status).toBe(HttpStatus.OK);
          expect(res.body).toHaveProperty('specialists');
          spaciallists = res.body.specialists;
        });

        it('should return dentist', async () => {
          const res = await request(app.getHttpServer())
            .get(`/dentists/${dentistId}`)
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.status).toBe(HttpStatus.OK);
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('specialist');
          expect(res.body.id).toEqual(dentistId);
          expect(res.body.specialist).toEqual(
            createReq.specialist.map((item) => {
              return {
                id: item.id,
                name: spaciallists.find(
                  (spaciallist) => spaciallist.id === item.id,
                ).name,
                yearOfExperience: item.yearOfExperience,
              };
            }),
          );
        });
        describe('login dentist usecase', () => {
          let accessToken: string;
          let dentistId: number;

          it('should return userID and accessToken', async () => {
            const req = {
              email: 'dentist@email.com',
              password: 'testPassw!@#ord1234',
            };

            const res = await request(app.getHttpServer())
              .post('/auth/login')
              .send(req);

            expect(res.status).toBe(HttpStatus.ACCEPTED);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('id');
            accessToken = res.body.accessToken;
            dentistId = res.body.id;
          });

          it('should return dentist', async () => {
            const res = await request(app.getHttpServer())
              .get(`/dentists/${dentistId}`)
              .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('specialist');
            expect(res.body.id).toEqual(dentistId);
          });
        });
      });
    });
    describe('testing appointment controller', () => {
      describe('create appointment usecase', () => {
        let appointmentId: number;
        it('should return 201', async () => {
          const req: CreateAppointmentReq = {
            dentistId: dentist.id,
            details: 'createTestDetails',
            time: new Date(),
          };
          const res = await request(app.getHttpServer())
            .post('/appointments')
            .send(req)
            .set('Authorization', `Bearer ${patient.accessToken}`);
          expect(res.status).toBe(HttpStatus.CREATED);
          expect(res.body).toHaveProperty('id');
          appointmentId = res.body.id;
        });

        describe('get appointment of patient', () => {
          it('should return appointment', async () => {
            const res = await request(app.getHttpServer())
              .get(`/appointments/patient`)
              .set('Authorization', `Bearer ${patient.accessToken}`);

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body.map((item) => item.details)).toContain(
              'createTestDetails',
            );
          });
        });

        describe('get appointment of dentist', () => {
          it('should return appointment', async () => {
            const res = await request(app.getHttpServer())
              .get(`/appointments/dentist`)
              .set('Authorization', `Bearer ${dentist.accessToken}`);

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body.map((item) => item.details)).toContain(
              'createTestDetails',
            );
          });
        });
      });
    });
  });
});
