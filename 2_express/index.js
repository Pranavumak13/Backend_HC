const express = require('express')
const logger = require('./logger.js')
const morgan = require('morgan')


const app = express() // app becomes powerfull as it gets all capabilities of express.
const morganFormat = ':method :url :status :response-time ms';

const port = 8080


//logging
app.use(morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(' ')[0],
          url: message.split(' ')[1],
          status: message.split(' ')[2],
          responseTime: message.split(' ')[3],
  
        };
        logger.info(JSON.stringify(logObject));
      }
    }
  }));

// Basics
// app.get('/',(req,res)=>{
//     res.send("Hello Postman !! I am Pranav")
// })

// app.get('/pranav',(req,res)=>{
//     res.send('Hello Guys, this is Pranav Umak, a Backend Developer')
// })

// app.get('*',(req,res)=>{
//     res.send('404, Not Found :(')
// })

// Middleware: converts one form of data into another.
// a simple app to store the data in an array.
app.use(express.json())

let gymArr = []
let i = 1;

// post req will be used as we are making a new resource at the database.
app.post('/gym',(req,res)=>{
    const {exercise, repetitions} = req.body
    // creating an object
    const newGymItem = {id:i++, exercise, repetitions}
    gymArr.push(newGymItem)
    res.status(201).send(newGymItem)
})

// list all the gym-exercise

app.get('/gym',(req,res)=>{
    res.status(200).send(gymArr)
})

// list the specific gym-exercise
// logic 1: post req
app.post('/gymid', (req,res)=>{
    let i = req.body.id
    res.status(202).send(gymArr[--i])
})

//logic 2: get req through params
app.get('/gym/:id',(req,res)=>{
    const exer = gymArr.find(ex => ex.id === parseInt(req.params.id))
    if(!exer){
        return res.status(404).send("Execersie not found!")
    }else{
        res.status(200).send(exer)
    }
})

//update the exercise
app.put('/gym/:id',(req,res)=>{
    const exId = gymArr.find(ex => ex.id === parseInt(req.params.id))

    if(!exId){
        return res.status(404).send("Exercise not found!")
    }

    const {exercise, repetitions} = req.body

    exId.exercise = exercise
    exId.repetitions = repetitions

    res.status(200).send(exId)
})

// delete the exercise
app.delete('/gym/:id', (req,res)=>{
    const exId = gymArr.findIndex(ex=>ex.id === parseInt(req.params.id))
    if(exId === -1){
        return res.status(404).send("Not found!")
    }
    gymArr.splice(exId, 1)
    res.status(200).send(`Exercise with the number ${req.params.id} is deleted!`)
})

app.listen(port, ()=>{
    console.log(`Server is listening on port: ${port}...`);
})