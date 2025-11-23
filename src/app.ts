import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globelErrorHandlers from './app/middelware/globelErrorHandlers';
import router from './app/routes';
import status from 'http-status';
import cookieParser from 'cookie-parser';


const app: Application = express();


app.use(cors({
  origin: ['http://localhost:3000'], // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/', router);

app.get('/', async (req: Request, res: Response) => {
  res.send('hello World University managnent');
});

// Global Error Handel ...........................................
app.use(globelErrorHandlers);

// Handel  Note Pound .........................................
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: 'Not Pound',
    errorMessage: [
      {
        path: req.originalUrl,
        message: 'API note Pound',
      },
    ],
  });

  next();
});

export default app;
