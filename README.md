my-docker-app/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   └── angular-app/ (proyecto Angular generado con Angular CLI)
├── websocket-server/
│   ├── Dockerfile
│   └── server.js
├── README.md

---

// docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "4200:80"
    depends_on:
      - websocket

  websocket:
    build: ./websocket-server
    ports:
      - "3000:3000"

---

// websocket-server/server.js
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

server.on('connection', ws => {
  ws.send('Conectado al WebSocket');
  setInterval(() => {
    ws.send(`Mensaje desde WebSocket: ${new Date().toLocaleTimeString()}`);
  }, 5000);
});

---

// websocket-server/Dockerfile
FROM node:18

WORKDIR /app
COPY server.js .
RUN npm install ws
CMD ["node", "server.js"]

---

// frontend/Dockerfile
# Etapa de build
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install && npm run build --prod

# Etapa de producción con Apache
FROM httpd:2.4
COPY --from=build /app/dist/angular-app /usr/local/apache2/htdocs/

---

// frontend/angular-app/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Bienvenido a la App Angular</h1>
    <p *ngFor="let msg of messages">{{ msg }}</p>
  `
})
export class AppComponent implements OnInit {
  messages: string[] = [];

  ngOnInit() {
    const socket = new WebSocket('ws://localhost:3000');
    socket.onmessage = (event) => {
      this.messages.push(event.data);
    };
  }
}

---

// README.md
# Proyecto Angular + WebSocket con Docker Compose

## Despliegue

```bash
git clone https://github.com/tuusuario/angular-websocket-docker.git
cd angular-websocket-docker
docker-compose up --build
```

## Acceso

- Web Angular: http://localhost:4200
- WebSocket: ws://localhost:3000

## DockerHub

Imagen publicada: [docker.io/tuusuario/websocket-server]
