import {
  app,
  chai,
  expect,
  testImage,
  sinon,
  testPngImage
} from '../testHelpers/config';

import articlesMock from '../mockData/articlesMock';
import cloudinaryMock from '../mockData/cloudinaryMock';
import { generateToken } from '../../services/authServices';
import { uploader } from '../../config/cloudinary';

const {
  validArticleComment
} = articlesMock;

const BACKEND_BASE_URL = '/api/v1';
let adminToken, userToken;

describe('GIFS', () => {
  describe('POST /gifs', () => {
    const createGifEndpoint = `${BACKEND_BASE_URL}/gifs`;
    before(async () => {
      adminToken = generateToken({ id: 1, roleId: 1 });
      userToken = generateToken({ id: 2, roleId: 2 });
    });

    it('should allow admin create gif', (done) => {
      const stub = sinon
        .stub(uploader, 'upload')
        .callsFake(() => Promise.resolve(cloudinaryMock.response));
      chai
        .request(app)
        .post(createGifEndpoint)
        .set('authorization', adminToken)
        .set('Content-Type', 'multipart/form-data')
        .attach('image', testImage, 'giphy.gif')
        .field('title', 'testing image upload with postman admin')
        .field('tagid', 1)
        .end((err, res) => {
          const { data } = res.body;
          expect(res.status).to.equal(201);
          expect(res.body)
            .to.have.property('status')
            .that.equal('success');
          expect(data).to.have.property('gifId');
          done(err);
          stub.restore();
        });
    });

    it('should allow user create gif', (done) => {
      const stub = sinon
        .stub(uploader, 'upload')
        .callsFake(() => Promise.resolve(cloudinaryMock.response));
      chai
        .request(app)
        .post(createGifEndpoint)
        .set('authorization', userToken)
        .set('Content-Type', 'multipart/form-data')
        .attach('image', testImage, 'giphy.gif')
        .field('title', 'testing image upload with postman user')
        .field('tagid', 1)
        .end((err, res) => {
          const { data } = res.body;
          expect(res.status).to.equal(201);
          expect(res.body)
            .to.have.property('status')
            .that.equal('success');
          expect(data).to.have.property('gifId');
          done(err);
          stub.restore();
        });
    });

    it('should not allow user create gif with existing title', (done) => {
      const stub = sinon
        .stub(uploader, 'upload')
        .callsFake(() => Promise.resolve(cloudinaryMock.response));
      chai
        .request(app)
        .post(createGifEndpoint)
        .set('authorization', userToken)
        .set('Content-Type', 'multipart/form-data')
        .attach('image', testImage, 'giphy.gif')
        .field('title', 'testing image upload with postman user')
        .field('tagid', 1)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('status')
            .that.equal('error');
          done(err);
          stub.restore();
        });
    });

    it('should not allow user create gif with wrong tagId', (done) => {
      const stub = sinon
        .stub(uploader, 'upload')
        .callsFake(() => Promise.resolve(cloudinaryMock.response));
      chai
        .request(app)
        .post(createGifEndpoint)
        .set('authorization', userToken)
        .set('Content-Type', 'multipart/form-data')
        .attach('image', testImage, 'giphy.gif')
        .field('title', 'testing image upload with postman user with bad tag')
        .field('tagid', 0)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('status')
            .that.equal('error');
          done(err);
          stub.restore();
        });
    });

    it('should not allow user create png image', (done) => {
      const stub = sinon
        .stub(uploader, 'upload')
        .callsFake(() => Promise.resolve(cloudinaryMock.response));
      chai
        .request(app)
        .post(createGifEndpoint)
        .set('authorization', userToken)
        .set('Content-Type', 'multipart/form-data')
        .attach('image', testPngImage, 'test.png')
        .field('title', 'testing image upload with postman user with png')
        .field('tagid', 2)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          done(err);
          stub.restore();
        });
    });

    it('should show server error', (done) => {
      const stub = sinon
        .stub(uploader, 'upload')
        .callsFake(() => Promise.reject(new Error('Internal server error')));
      chai
        .request(app)
        .post(createGifEndpoint)
        .set('authorization', userToken)
        .set('Content-Type', 'multipart/form-data')
        .attach('image', testImage, 'giphy.gif')
        .field('title', 'testing image upload with postman')
        .field('tagid', 2)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          done(err);
          stub.restore();
        });
    });
  });

  describe('DELETE /gifs/:gifId', () => {
    const deleteGifEndpoint = `${BACKEND_BASE_URL}/gifs/1`;
    before(async () => {
      adminToken = generateToken({ id: 1, roleId: 1 });
      userToken = generateToken({ id: 2, roleId: 2 });
    });

    it('should not allow another user delete employees gif', (done) => {
      chai
        .request(app)
        .delete(deleteGifEndpoint)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('status').that.equal('error');
          done(err);
        });
    });

    it('should allow user delete created gif', (done) => {
      const stub = sinon
        .stub(uploader, 'destroy')
        .callsFake(() => Promise.resolve({ result: 'ok' }));
      chai
        .request(app)
        .delete(deleteGifEndpoint)
        .set('authorization', adminToken)
        .end((err, res) => {
          const { data } = res.body;
          expect(res.status).to.equal(201);
          expect(res.body)
            .to.have.property('status')
            .that.equal('success');
          expect(data).to.have.property('gifId');
          done(err);
          stub.restore();
        });
    });
  });

  describe('POST /gifs/gifId/{comment}', () => {
    const createGifCommentEndpoint = `${BACKEND_BASE_URL}/gifs/2/comment`;
    const badcreateGifCommentEndpoint = `${BACKEND_BASE_URL}/gifs/20/comment`;
    it('should allow admin post gif comment', (done) => {
      chai
        .request(app)
        .post(createGifCommentEndpoint)
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
    it('should allow user/employee post gif comment', (done) => {
      chai
        .request(app)
        .post(createGifCommentEndpoint)
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
    it('should return gif post not found', (done) => {
      chai
        .request(app)
        .post(badcreateGifCommentEndpoint)
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
