import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import driverRoutes from './modules/driver/router';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

config();

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req, res, next) => {
  if (process.env.ENV !== 'testing') {
    console.log(`API called: [${req.method}] ${req.originalUrl}`);
  }
  next();
});
app.use('/api/drivers', driverRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

export const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
