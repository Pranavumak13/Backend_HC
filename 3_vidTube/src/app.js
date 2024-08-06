import express from "express"
import cors from "cors"

const app = express()

// who should be able to talk to the db --> CORS {Cross Origin Resource Sharing}

// handling the middleware we always use app.use()
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials:true
    })
)

//another middleware for express
app.use(express.json({limit:"16kb"})) // limit on json content
app.use(express.urlencoded({ //encoding the url for eg %20 in the url
    extended:true, 
    limit:"16kb"
}))
app.use(express.static("public")) //all media files here

// import routes
import healthcheckRouter from "./routes/healthcheck.routes.js"

// routes
// another middleware to control the router
app.use("/api/v1/healthcheck", healthcheckRouter)


export {app}