import { https, setGlobalOptions, logger } from 'firebase-functions/v2';
import * as express from 'express';

setGlobalOptions({ region: 'europe-west1' });

export const endpoint = https.onRequest((request: express.Request, response: express.Response) => {
  logger.info('Function called');
  response.status(200).send('Function called');
});
