import {Router} from "express"

import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middlewares.js"

// Strategy --> Each model should have a controller and each controller should have a router

const router = Router()
// URL: /api/v1/healthcheck/
// or URL: /api/v1/healthcheck/test


router.route("/register").post(
    upload.fields(
        [
            {   
                name:"avatar",
                maxCount:1
            },
            {
                name:"coverImage",
                maxCount:1
            }
        ]
    ),
    registerUser
)

export default router