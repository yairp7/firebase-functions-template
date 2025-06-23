import { https, setGlobalOptions, logger } from 'firebase-functions/v2';
import express, { Request, Response } from 'express';

setGlobalOptions({ region: 'europe-west1' });

const app = express();

app.get('/', (request: Request, response: Response) => {
  logger.info(`Function called from ${request.url}`);
  response.status(200).send('Function called');
});

export const endpoint = https.onRequest(app);
