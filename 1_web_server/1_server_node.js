const http = require('http')

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((request, response)=>{
    if (request.url === '/') {
        response.statusCode = 200;
        response.setHeader('Content-Type','text/plain')
        response.end("Hello Postman !! I am Pranav");
    }else if(request.url==='/pranav'){
        response.statusCode = 200;
        response.setHeader('Content-Type','text/plain')
        response.end('Hello Guys, this is Pranav Umak, a Backend Developer');
    }else{
        response.statusCode = 404;
        response.setHeader('Content-Type','text/plain')
        response.end("404, Not Found :( ")
    }
})

server.listen(port,hostname,()=>{
    console.log(`Server is up and listening at http://${hostname}:${port}`);
})