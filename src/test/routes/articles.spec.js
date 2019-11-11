import {
  app, chai, expect
} from '../testHelpers/config';

import articlesMock from '../mockData/articlesMock';
import { generateToken } from '../../services/authServices';

const {
  validArticle, invalidTagArticle
} = articlesMock;

const BACKEND_BASE_URL = '/api/v1';

describe('ARTICLES', () => {
  describe('POST /articles', () => {
    const createArticleEndpoint = `${BACKEND_BASE_URL}/articles`;
    let adminToken, badToken;
    before(async () => {
      adminToken = generateToken({ id: 1, roleId: 1 });
      badToken = generateToken({ id: 0, roleId: 1 });
    });
    it('should allow employee create article', (done) => {
      chai
        .request(app)
        .post(createArticleEndpoint)
        .set('authorization', adminToken)
        .send(validArticle)
        .end((err, res) => {
          const { data } = res.body;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('status').that.equal('success');
          expect(data).to.have.property('articleId');
          done(err);
        });
    });

    it('should not allow duplicate title when creating article', (done) => {
      chai
        .request(app)
        .post(createArticleEndpoint)
        .set('authorization', adminToken)
        .send(validArticle)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status').that.equal('error');
          expect(res.body).to.have.property('error').that.equal('You have an existing article with same title, please check');
          done(err);
        });
    });

    it('should return invalid tagid when creating article', (done) => {
      chai
        .request(app)
        .post(createArticleEndpoint)
        .set('authorization', `Bearer ${adminToken}`)
        .send(invalidTagArticle)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status').that.equal('error');
          expect(res.body).to.have.property('error').that.equal('Invalid tag Id');
          done(err);
        });
    });

    it('should return server error', (done) => {
      chai
        .request(app)
        .post(createArticleEndpoint)
        .set('authorization', `Bearer ${adminToken}dino`)
        .send(invalidTagArticle)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.have.property('status').that.equal('error');
          done(err);
        });
    });

    it('should return invalid token error', (done) => {
      chai
        .request(app)
        .post(createArticleEndpoint)
        .set('authorization', `Bearer ${badToken}`)
        .send(invalidTagArticle)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('status').that.equal('error');
          done(err);
        });
    });

    it('should return no token error', (done) => {
      chai
        .request(app)
        .post(createArticleEndpoint)
        .send(invalidTagArticle)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('status').that.equal('error');
          done(err);
        });
    });
  });
});
