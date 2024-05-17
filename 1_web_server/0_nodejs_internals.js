const http = require('http')

const port = 4000
const hostname = '127.0.0.1'


const server = http.createServer((req,res)=>{
    res.statusCode = 200,
    res.setHeader('Content-Type','text/plain')
    res.end("Hello world")
})


server.listen(port,hostname,()=>{
    console.log(`Server is up and running on ${port}`);
})