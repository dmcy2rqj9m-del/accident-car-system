事故车线索后端示例

说明
- 这是一个最小可运行的 Node.js + Express 示例服务，用于替换小程序中的本地 mock 存储，便于后续接入真实后端。

快速开始
1. 进入目录并安装依赖：

```bash
cd projects/backend
npm install
npm start
```

2. 服务默认监听 `http://localhost:3000`，提供 REST API：
- `GET /api/clues`
- `POST /api/clues` (body: { photos, location, plate, vehicle, damage })
- `POST /api/clues/:id/approve`
- `POST /api/clues/:id/reject`
 - `POST /api/ai/recognize` (body: { imageBase64 }) - M1 stub for AI 识别，返回 mock 识别结果
 - `GET /api/ai/models` - 列出可用的识别模型（静态）
- `GET /api/orders`
- `POST /api/orders` (创建订单/派单)
- `POST /api/orders/:id/push` (推送至门店)
- `POST /api/orders/:id/confirm` (门店确认接收)
- `POST /api/orders/:id/progress` (更新维修进度)

## API Token 鉴权

- 非 GET 的 `/api/*` 写操作需携带 Token。
- 默认 Token：`dev-token`，可通过 `API_TOKEN=xxx` 环境变量自定义。
- 前端需在请求头加：
  - `x-api-key: dev-token` 或
  - `Authorization: Bearer dev-token`

## 数据结构
- 所有数据存储于 `data/db.json`，结构包含：clues, orders, pushed, dealer_responses, locations。
- 可直接编辑/备份该文件实现数据迁移。

## 常见问题

- 启动报 `npm: command not found`：请先安装 Node.js 与 npm。
- 前端无法访问本地接口：请确保微信开发者工具允许本地网络请求，或将 BASE_URL 指向可访问的服务器。
- Token 校验失败：请检查请求头是否正确携带 Token。

## 联调建议

1. 启动本地后端（如上）。
2. 微信开发者工具中将 BASE_URL 配置为 `http://localhost:3000`（或实际服务器地址）。
3. 按照小程序端页面流程依次测试：
   - 骑手端提交线索
   - 专员端接单、轨迹上报、推送门店
   - 4S 店端确认接收、进度反馈
   - 管理员端查看 pushed 与 dealer_responses
4. 离线/失败场景可通过断网或关闭后端模拟，重连后手动同步。

## 生产建议
- 建议将数据存储迁移至 MySQL/MongoDB 等数据库
- 增加用户/角色鉴权、接口速率限制、日志与监控
- 接入微信服务消息/订阅消息实现通知

---
如有问题请联系项目维护者。

## 使用 Docker 运行（当本机无 npm/node 时）

项目根目录提供 `docker-compose.yml`，可以快速构建并在容器中运行后端服务：

```bash
# 在项目根目录下运行（首次会构建镜像）
docker-compose up --build -d

# 查看日志
docker-compose logs -f backend

# 停止并移除容器
docker-compose down
```

默认容器会将本地 `projects/backend` 挂载到容器内，可在容器内修改代码并实时生效（开发模式）。环境变量 `API_TOKEN` 可在 `docker-compose.yml` 中配置。

如果 Docker 不可用，请按本节前述的“快速启动”使用本机 Node.js 运行。
