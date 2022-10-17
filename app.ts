import express from 'express';
import * as bodyParser from 'body-parser';
import router from './router';

// create an express app
const app = express();

app.use(bodyParser.json());

// add prefix to url, the url should be http://localhost:<port>/api/v1
app.use('/api/v1', router)

// export app so that we can use it in unit testing
export default app;