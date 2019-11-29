import express from 'express';
import cors from 'cors';
import './config/env';
import swaggerUi from 'swagger-ui-express';
import trimmer from 'trim-request-body';
import morganBody from 'morgan-body';
import messages from './utils/messages';
import response from './utils/response';
import routes from './routes/index';
import swaggerDoc from './config/swaggerDoc';

const app = express();
const router = express.Router();

// Log http information to console
if (process.env.NODE_ENV !== 'test') {
  morganBody(app, { prettify: true });
}

// Pass router to routes
routes(router);

// Pass router to swagger middleware
swaggerDoc(router);

// Allow cross origin access
app.use(cors());

// Parse application/json
app.use(express.json());

// Parse application/xwww-
app.use(express.urlencoded({ extended: true }));

// Trim the parsed request body
app.use(trimmer);

// Handle base route
app.get('/', (req, res) => response(res, 200, 'success', {
  message: messages.welcome,
}));

// Routes
app.use('/api/v1', router, swaggerUi.serve);

// Handle routes not found
app.use('*', (req, res) => response(res, 404, 'error', {
  message: messages.notFound,
}));

// Port
const port = parseInt(process.env.PORT, 10) || 4000;

app.listen(port, console.log(`Listening on port ${port}`));

export default app;
