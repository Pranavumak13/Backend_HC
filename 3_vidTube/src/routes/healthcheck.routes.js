import {Router} from "express"

import { healthcheck } from "../controllers/healthcheck.controller.js"

// Strategy --> Each model should have a controller and each controller should have a router

const router = Router()
// URL: /api/v1/healthcheck/
// or URL: /api/v1/healthcheck/test


router.route("/").get(healthcheck)

export default router