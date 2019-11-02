import express from 'express';
import cors from 'cors';
import './config/env';
import messages from './utils/messages';
import response from './utils/response';
import routes from './routes/index';

const app = express();
const router = express.Router();

// Pass router to routes
routes(router);

// Allow cross origin access
app.use(cors());

// Parse application/json
app.use(express.json());

// Parse application/xwww-
app.use(express.urlencoded({ extended: false }));

// Handle base route
app.get('/', (req, res) => response(res, 200, 'success', {
  message: messages.welcome,
}));

// Routes
app.use('/api/v1', router);

// Handle routes not found
app.use('*', (req, res) => response(res, 404, 'error', {
  message: messages.notFound,
}));

// Port
const port = parseInt(process.env.PORT, 10) || 4000;

app.listen(port, console.log(`Listening on port ${port}`));

export default app;
