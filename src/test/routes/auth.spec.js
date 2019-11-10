import {
  app, chai, expect
} from '../testHelpers/config';

import userMock from '../mockData/userMock';
import { generateToken } from '../../services/authServices';

const {
  validUser, validAdmin, invalidPassword, validUserReg, inValidPasswordReg, inValidEmailReg
} = userMock;

const BACKEND_BASE_URL = '/api/v1';

describe('AUTH', () => {
  describe('POST /auth/signin', () => {
    const signinEndpoint = `${BACKEND_BASE_URL}/auth/signin`;

    it('should authenticate an admin with admin email address and password', (done) => {
      chai
        .request(app)
        .post(signinEndpoint)
        .send(validAdmin)
        .end((err, res) => {
          const { data } = res.body;
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status').that.equal('success');
          expect(data).to.have.property('token');
          done(err);
        });
    });

    it('should authenticate a user with their email address and password', (done) => {
      chai
        .request(app)
        .post(signinEndpoint)
        .send(validUser)
        .end((err, res) => {
          const { data } = res.body;
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status').that.equal('success');
          expect(data).to.have.property('token');
          done(err);
        });
    });

    it('should not authenticate a user if email address is not recognized', (done) => {
      chai
        .request(app)
        .post(signinEndpoint)
        .send({ ...validUser, email: 'unrecognized@email.com' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('status').that.equal('error');
          done(err);
        });
    });

    it('should not authenticate a user if password is incorrect ', (done) => {
      chai
        .request(app)
        .post(signinEndpoint)
        .send(invalidPassword)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status').that.equal('error');
          done(err);
        });
    });
  });
  describe('POST /auth/signup', () => {
    const signupEndpoint = `${BACKEND_BASE_URL}/auth/signup`;
    let adminToken;
    before(async () => {
      adminToken = generateToken({ id: validUserReg.id, roleId: 1 });
    });

    it('should create a user and generate jwt', (done) => {
      chai
        .request(app)
        .post(signupEndpoint)
        .set('authorization', adminToken)
        .send(validUserReg)
        .end((err, res) => {
          const { data } = res.body;
          expect(data).property('token');
          expect(data).property('email');
          done(err);
        });
    });

    it('should not signup user if password length is less than 8', (done) => {
      chai
        .request(app)
        .post(signupEndpoint)
        .set('authorization', adminToken)
        .send(inValidPasswordReg)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done(err);
        });
    });

    it('should not create a user with wrong email', (done) => {
      chai
        .request(app)
        .post(signupEndpoint)
        .set('authorization', adminToken)
        .send(inValidEmailReg)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done(err);
        });
    });

    it('should not allow duplicate email address when creating a user', (done) => {
      chai
        .request(app)
        .post(signupEndpoint)
        .set('authorization', adminToken)
        .send(validUserReg)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status').that.equal('error');
          expect(res.body.data).to.not.have.property('token');
          done(err);
        });
    });
  });
});
