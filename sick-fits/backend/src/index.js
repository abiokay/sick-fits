const cookieParser = require('cookie-parser');
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');
const jwt = require('jsonwebtoken');

const server = createServer();

server.express.use(cookieParser());
// TODO Use express middlware to handle cookies (JWT)
//decode jwt to get user Id on each request

server.express.use((req, res, next) => {
	const {token} = req.cookies;
	if (token) {
		const {userId} = jwt.verify(token, process.env.APP_SECRET);
		req.userId = userId;
	}
	next();
});


// TODO Use express middlware to populate current user

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
