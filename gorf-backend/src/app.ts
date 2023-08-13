import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth';

const routers = [authRouter];

const app = express();

app.use(
  cors({
    origin: '*',
  }),
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

routers.map(router => {
  app.use(router.path, router.router);
});

app.get('/', (req, res) => {
  res.status(200).json({ success: true });
});

export default app;
