import { app, chai, expect } from '../testHelpers/config';

import { generateToken } from '../../services/authServices';

const BACKEND_BASE_URL = '/api/v1';
let userToken;

describe('FEED', () => {
  describe('GET /feed', () => {
    const feedEndpoint = `${BACKEND_BASE_URL}/feed`;
    before(async () => {
      userToken = generateToken({ id: 2, roleId: 2 });
    });
    it('should return array of object of feed', (done) => {
      chai
        .request(app)
        .get(feedEndpoint)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body)
            .to.have.property('status')
            .that.equal('success');
          done(err);
        });
    });
  });
});
