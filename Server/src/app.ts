import express, { Request, Response } from 'express';
import cors from 'cors';

type User = {
  first_name: string;
  last_name: string;
  city: string;
  gender: string;
}
let usersList: User[] = [];

const app = express();

app.use(express.json());
app.use(cors());

app.post('/add-user', (req, res) => {
  const { ...user } = req.body;

  if (user) {
    usersList = [...usersList, user];
  }
  return res.json({ message: 'User Added'});
});

const SEND_INTERVAL = 2000;

const writeEvent = (res: Response, sseId: string, data: string) => {
  res.write(`id: ${sseId}\n`);
  res.write(`data: ${data}\n\n`);
};

const sendEvent = (_req: Request, res: Response) => {
  res.writeHead(200, {
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
  });

  const sseId = new Date().toDateString();

  setInterval(() => {
    writeEvent(res, sseId, JSON.stringify(usersList));
  }, SEND_INTERVAL);

  writeEvent(res, sseId, JSON.stringify(usersList));
};

app.get('/dashboard', (req: Request, res: Response) => {
  if (req.headers.accept === 'text/event-stream') {
    sendEvent(req, res);
  } else {
    res.json({ message: 'Ok' });
  }
});

app.listen(5000, () => {
  console.log(`APplication started on port 5000`);
});
