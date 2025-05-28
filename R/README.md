Perfecto, vamos a armar esto rápido paso a paso.

---

## 🔧 Estructura del proyecto

```
my-docker-app/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   └── [app Angular]
├── websocket-server/
│   ├── server.js
│   └── Dockerfile
├── README.md
```

---

## 1. 🧱 `docker-compose.yml`

```yaml
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
```

---

## 2. 🧑‍💻 Backend WebSocket (Node.js)

### `websocket-server/server.js`

```js
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

server.on('connection', ws => {
  ws.send('Conectado al WebSocket');
  setInterval(() => {
    ws.send(`Mensaje desde WebSocket: ${new Date().toLocaleTimeString()}`);
  }, 5000);
});
```

### `websocket-server/Dockerfile`

```dockerfile
FROM node:18

WORKDIR /app

COPY server.js .

RUN npm install ws

CMD ["node", "server.js"]
```

---

## 3. 🌐 Frontend Angular servido con Apache

### `frontend/Dockerfile`

```dockerfile
# Build Angular app
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install && npm run build --prod

# Serve with Apache
FROM httpd:2.4
COPY --from=build /app/dist/[nombre-proyecto] /usr/local/apache2/htdocs/
```

**Reemplaza `[nombre-proyecto]` por la carpeta generada por Angular en `dist/`**.

---

## 4. 💻 Código Angular (resumen del componente principal)

```ts
// src/app/app.component.ts
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
```

---

## 5. 📝 `README.md`

````md
# Proyecto Angular + WebSocket con Docker Compose

## Despliegue

```bash
git clone [repo]
cd my-docker-app
docker-compose up --build
````

## Acceso

* Web Angular: [http://localhost:4200](http://localhost:4200)
* WebSocket: ws\://localhost:3000

## DockerHub

Imagen publicada: \[docker.io/tuusuario/websocket-server]

````

---

## 6. 🐳 Publicar en DockerHub

```bash
docker build -t tuusuario/websocket-server ./websocket-server
docker push tuusuario/websocket-server
````

---

¿Quieres que te genere los archivos y el código Angular base listo para copiar y pegar también?
