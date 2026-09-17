# Executando o BensTracker com Docker

Este projeto possui suporte completo e otimizado para containerização utilizando **Multi-stage Docker** com servidor full-stack Node.js (Express + Vite).

---

## 🚀 Como executar com Docker Compose (Recomendado)

Para construir a imagem e subir o container em segundo plano:

```bash
docker compose up -d --build
```

O aplicativo estará acessível em:
👉 **http://localhost:3000**

Endpoint de verificação da API:
👉 **http://localhost:3000/api/health**

Para parar o container:

```bash
docker compose down
```

---

## 🐳 Como executar apenas com Docker CLI

### 1. Construir a imagem Docker

```bash
docker build -t benstracker:latest .
```

### 2. Rodar o container

```bash
docker run -d -p 3000:3000 --name benstracker benstracker:latest
```

Acesse em **http://localhost:3000**.

### 3. Verificar status e logs

```bash
# Ver status do container
docker ps

# Ver logs do servidor
docker logs -f benstracker
```

---

## 🛠️ Estrutura do Back-end

- **`server.ts`**: Ponto de entrada do Express integrando middlewares, rotas `/api/*` e o Vite middleware (ou arquivos estáticos em produção).
- **`server/routes/api.routes.ts`**: Roteador mestre para conectar novas rotas (`/movements`, `/assets`, `/users`, etc.).
- **`server/routes/health.routes.ts`**: Rota `/api/health` para monitoramento de status do servidor.
- **`server/middleware/`**:
  - `requestLogger.ts`: Logs de chamadas da API.
  - `errorHandler.ts`: Tratamento centralizado de erros.
