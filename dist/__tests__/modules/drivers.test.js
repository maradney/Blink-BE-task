"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../../src");
describe('test drivers endpoints', () => {
    afterAll(() => {
        src_1.server.close();
    });
    it('should fetch all drivers', async () => {
        const res = await (0, supertest_1.default)(src_1.app).get('/api/drivers');
        expect(res.status).toBe(200);
    });
    it('should create a new driver', async () => {
        const res = await (0, supertest_1.default)(src_1.app).post('/api/drivers').send({
            firstName: 'firstname',
            lastName: 'lastname',
            phoneNumber: 'phonenumber',
            email: 'testing@gmail.com',
        });
        expect(res.status).toBe(200);
    });
    it('should fail to create a new driver if data is missing', async () => {
        const res = await (0, supertest_1.default)(src_1.app).post('/api/drivers').send({
            email: 'testing@gmail.com',
        });
        expect(res.status).toBe(400);
    });
    it('should update a driver', async () => {
        const res = await (0, supertest_1.default)(src_1.app).patch('/api/drivers/edit/1').send({
            firstName: 'firstname',
            lastName: 'lastname',
            phoneNumber: 'phonenumber',
            email: 'testing@gmail.com',
        });
        expect(res.status).toBe(200);
    });
    it('should not show an error if body is empty', async () => {
        const res = await (0, supertest_1.default)(src_1.app).patch('/api/drivers/edit/1');
        expect(res.status).toBe(200);
    });
    it('should fail to update a driver if id is missing', async () => {
        const res = await (0, supertest_1.default)(src_1.app).patch('/api/drivers/edit/').send({
            firstName: 'firstname',
            lastName: 'lastname',
            phoneNumber: 'phonenumber',
            email: 'testing@gmail.com',
        });
        expect(res.status).toBe(404);
    });
    it('should delete a driver', async () => {
        const res = await (0, supertest_1.default)(src_1.app).delete('/api/drivers/delete/1');
        expect(res.status).toBe(200);
    });
    it('should fail to delete a driver if id is missing', async () => {
        const res = await (0, supertest_1.default)(src_1.app).delete('/api/drivers/');
        expect(res.status).toBe(404);
    });
    it('shoud fetch single driver', async () => {
        const res = await (0, supertest_1.default)(src_1.app).get('/api/drivers/1');
        expect(res.status).toBe(200);
    });
});
