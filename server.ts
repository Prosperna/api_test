import app from './app';
import http from 'http';

const server = http.createServer(app);
const port = 8080;

server.listen(port,() => {
    console.log("server listening on port",8080);
});