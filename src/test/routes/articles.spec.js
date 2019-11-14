import {
  app, chai, expect
} from '../testHelpers/config';

import articlesMock from '../mockData/articlesMock';
import { generateToken } from '../../services/authServices';

const {
  validArticle, invalidTagArticle, validArticleTwo, validArticleComment
} = articlesMock;

const BACKEND_BASE_URL = '/api/v1';
let adminToken, userToken, badToken;

describe('ARTICLES', () => {
  describe('POST /articles', () => {
    const createArticleEndpoint = `${BACKEND_BASE_URL}/articles`;
    before(async () => {
      adminToken = generateToken({ id: 1, roleId: 1 });
      badToken = generateToken({ id: 0, roleId: 1 });
      userToken = generateToken({ id: 2, roleId: 2 });
    });

    it('should allow admin create article', (done) => {
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

    it('should allow admin create another article', (done) => {
      chai
        .request(app)
        .post(createArticleEndpoint)
        .set('authorization', adminToken)
        .send(validArticleTwo)
        .end((err, res) => {
          const { data } = res.body;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('status').that.equal('success');
          expect(data).to.have.property('articleId');
          done(err);
        });
    });

    it('should allow employee create article', (done) => {
      chai
        .request(app)
        .post(createArticleEndpoint)
        .set('authorization', userToken)
        .send(validArticleTwo)
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

  describe('PATCH /articles/articleId', () => {
    const updateArticleEndpoint = `${BACKEND_BASE_URL}/articles/1`;
    it('should allow employee update article', (done) => {
      chai
        .request(app)
        .patch(updateArticleEndpoint)
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

    it('should not allow employee use existing title when updating article', (done) => {
      chai
        .request(app)
        .patch(updateArticleEndpoint)
        .set('authorization', adminToken)
        .send(validArticleTwo)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status').that.equal('error');
          done(err);
        });
    });

    it('should allow only author employee update article', (done) => {
      chai
        .request(app)
        .patch(updateArticleEndpoint)
        .set('authorization', userToken)
        .send(validArticleTwo)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('status').that.equal('error');
          done(err);
        });
    });
  });

  describe('DELETE /articles/articleId', () => {
    const deleteArticleEndpoint = `${BACKEND_BASE_URL}/articles/1`;
    it('should allow only author employee delete article', (done) => {
      chai
        .request(app)
        .delete(deleteArticleEndpoint)
        .set('authorization', userToken)
        .send(validArticleTwo)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('status').that.equal('error');
          done(err);
        });
    });
    it('should allow employee delete article', (done) => {
      chai
        .request(app)
        .delete(deleteArticleEndpoint)
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
  });

  describe('POST /articles/articleId/{comment}', () => {
    const createArticleCommentEndpoint = `${BACKEND_BASE_URL}/articles/2/comment`;
    const badcreateArticleCommentEndpoint = `${BACKEND_BASE_URL}/articles/20/comment`;
    it('should allow admin post article comment', (done) => {
      chai
        .request(app)
        .post(createArticleCommentEndpoint)
        .set('authorization', adminToken)
        .send(validArticleComment)
        .end((err, res) => {
          const { data } = res.body;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('status').that.equal('success');
          expect(data).to.have.property('comment');
          done(err);
        });
    });
    it('should allow user/employee post article comment', (done) => {
      chai
        .request(app)
        .post(createArticleCommentEndpoint)
        .set('authorization', userToken)
        .send(validArticleComment)
        .end((err, res) => {
          const { data } = res.body;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('status').that.equal('success');
          expect(data).to.have.property('comment');
          done(err);
        });
    });
    it('should return article not found', (done) => {
      chai
        .request(app)
        .post(badcreateArticleCommentEndpoint)
        .set('authorization', userToken)
        .send(validArticleComment)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status').that.equal('error');
          done(err);
        });
    });
  });
});
