import {Router} from 'express';

import {logoutUser, registerUser} from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middlewares.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

// Strategy --> Each model should have a controller and each controller should have a router

const router = Router();
// URL: /api/v1/healthcheck/
// or URL: /api/v1/healthcheck/test

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  registerUser
);

// SECURED ROUTES: the routes in which processing has to happened

router.route('/logout').post(
  verifyJWT, //middleware
  logoutUser // we can add as many controllers as we want
)


export default router;
