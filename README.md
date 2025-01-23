# IM-Monorepo

## im-server

```
npx create-nx-workspace im-server --preset=nest
```

### 安装依赖

**配置**

```
pnpm add dotenv @nestjs/config -w
```

**fastify**

版本要对，不然可能会有意外的错误

```
pnpm add fastify @nestjs/platform-fastify@10 @fastify/cookie@9 @fastify/multipart@8 @fastify/static@7 -w
```

**socket**

```
pnpm add socket.io @nestjs/websockets@10 @nestjs/platform-socket.io@10 @socket.io/redis-adapter @socket.io/redis-emitter -w
```

cache

```
pnpm add ioredis @nestjs/cache-manager cache-manager cache-manager-ioredis-yet @liaoliaots/nestjs-redis -w
```

http

```
pnpm add axios @nestjs/axios -w
```

事件监听

```
pnpm add @nestjs/event-emitter -w
```

工具库

```
pnpm add lodash -w
```
