import {
  app, chai, expect
} from '../testHelpers/config';

import userMock from '../mockData/userMock';

const { validUser, validAdmin, invalidPassword } = userMock;

const BACKEND_BASE_URL = '/api/v1';

describe('AUTH', () => {
  describe('POST /auth/signin', () => {
    const signinEndpoint = `${BACKEND_BASE_URL}/auth/signin`;
    it('should authenticate a user with their email address and password', (done) => {
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
});
