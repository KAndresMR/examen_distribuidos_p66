const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

server.on('connection', ws => {
    ws.send('Conectado al WebSocket');
    setInterval(() => {
        ws.send(`Mensaje desde WebSocket: ${new Date().toLocaleTimeString()}`);
    }, 5000);
});