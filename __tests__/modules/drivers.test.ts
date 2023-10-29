import request from 'supertest';
import { app, server } from '../../src';

describe('test drivers endpoints', () => {
  afterAll(() => {
    server.close();
  });

  it('should fetch all drivers', async () => {
    const res = await request(app).get('/api/drivers');
    expect(res.status).toBe(200);
  });

  it('should fetch all drivers ordered by firstName and id', async () => {
    const res = await request(app).get('/api/drivers?order[]=firstName&order[]=id&by[]=ASC&by[]=DESC');
    expect(res.status).toBe(200);
  });

  it('should create a new driver', async () => {
    const res = await request(app).post('/api/drivers').send({
      firstName: 'firstname',
      lastName: 'lastname',
      phoneNumber: 'phonenumber',
      email: 'testing@gmail.com',
    });
    expect(res.status).toBe(200);
  });

  it('should fail to create a new driver if data is missing', async () => {
    const res = await request(app).post('/api/drivers').send({
      email: 'testing@gmail.com',
    });
    expect(res.status).toBe(400);
  });

  it('should update a driver', async () => {
    const res = await request(app).patch('/api/drivers/edit/1').send({
      firstName: 'firstname',
      lastName: 'lastname',
      phoneNumber: 'phonenumber',
      email: 'testing@gmail.com',
    });
    expect(res.status).toBe(200);
  });

  it('should not show an error if body is empty', async () => {
    const res = await request(app).patch('/api/drivers/edit/1');
    expect(res.status).toBe(200);
  });

  it('should fail to update a driver if id is missing', async () => {
    const res = await request(app).patch('/api/drivers/edit/').send({
      firstName: 'firstname',
      lastName: 'lastname',
      phoneNumber: 'phonenumber',
      email: 'testing@gmail.com',
    });
    expect(res.status).toBe(404);
  });

  it('should delete a driver', async () => {
    const res = await request(app).delete('/api/drivers/delete/1');
    expect(res.status).toBe(200);
  });

  it('should fail to delete a driver if id is missing', async () => {
    const res = await request(app).delete('/api/drivers/');
    expect(res.status).toBe(404);
  });

  it('shoud fetch single driver', async () => {
    const res = await request(app).get('/api/drivers/1');
    expect(res.status).toBe(200);
  });

  it('shoud fetch single driver with alphabetize name', async () => {
    const res = await request(app).get('/api/drivers/1?alphabetize=true');
    expect(res.status).toBe(200);
  });
});
