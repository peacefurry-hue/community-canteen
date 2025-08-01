# 社区小饭桌订餐系统

一个完整的社区餐盒订购系统，包含用户前端、后端API和管理后台。

## 功能特性

### 用户前端
- 🍽️ 菜品浏览和选择（主菜、甜点、水果、饮品）
- 🛒 购物车管理
- 📅 配送时间选择（日期 + 午餐/晚餐）
- 📍 配送地址填写
- ✨ 订单提交动画效果
- 📱 响应式设计，支持移动端

### 后端API
- 🔐 JWT身份验证
- 📋 菜品管理API
- 📦 订单管理API
- 👨‍💼 管理员认证API
- 📊 数据统计API

### 管理后台
- 📊 数据仪表板
- 📋 订单管理（状态更新、筛选）
- 🍽️ 菜品管理（添加、编辑、删除）
- 📈 业务报告生成
- 🔐 安全的管理员登录

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (状态管理)
- React Router (路由)

### 后端
- Node.js
- Express.js
- JWT (身份验证)
- bcryptjs (密码加密)
- CORS (跨域支持)
- Helmet (安全中间件)

### 管理后台
- 原生HTML/CSS/JavaScript
- Tailwind CSS
- Chart.js (图表)
- Lucide Icons

## 项目结构

```
社区小饭桌/
├── src/                    # 前端源码
│   ├── components/         # React组件
│   ├── pages/             # 页面组件
│   ├── store/             # Zustand状态管理
│   ├── types/             # TypeScript类型定义
│   └── App.tsx            # 主应用组件
├── server/                # 后端源码
│   ├── routes/            # API路由
│   ├── data/              # 数据层
│   ├── middleware/        # 中间件
│   ├── utils/             # 工具函数
│   └── index.js           # 服务器入口
├── admin/                 # 管理后台
│   ├── index.html         # 管理界面
│   └── admin.js           # 管理逻辑
└── public/                # 静态资源
```

## 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
```

### 2. 启动开发服务器

```bash
# 启动前端开发服务器 (端口: 5173)
npm run dev

# 启动后端服务器 (端口: 3001)
cd server
npm start
```

### 3. 访问应用

- 用户前端: http://localhost:5173
- 管理后台: http://localhost:3001/admin
- API文档: http://localhost:3001/api

### 4. 管理员登录

默认管理员账号：
- 用户名: admin
- 密码: admin123

## API接口

### 菜品管理
- `GET /api/menu` - 获取菜品列表
- `GET /api/menu/:id` - 获取单个菜品
- `GET /api/menu/categories` - 获取分类列表
- `GET /api/menu/search` - 搜索菜品

### 订单管理
- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情
- `PATCH /api/orders/:id/status` - 更新订单状态

### 管理员功能
- `POST /api/auth/login` - 管理员登录
- `GET /api/auth/verify` - 验证令牌
- `GET /api/admin/dashboard` - 仪表板数据
- `GET /api/admin/reports/business` - 业务报告

## 部署说明

### 前端部署
项目已配置Vercel部署，推送到GitHub后自动部署。

### 后端部署
1. 设置环境变量：
   ```
   JWT_SECRET=your-secret-key
   PORT=3001
   ```

2. 启动生产服务器：
   ```bash
   npm start
   ```

### 管理后台
管理后台通过后端服务器的静态文件服务提供，访问 `/admin` 路径即可。

## 环境变量

```env
# JWT密钥（生产环境必须更改）
JWT_SECRET=your-secret-key-change-in-production

# 服务器端口
PORT=3001

# 前端URL（用于CORS配置）
FRONTEND_URL=http://localhost:5173
```

## 开发指南

### 添加新菜品
1. 在管理后台登录
2. 进入"菜品管理"页面
3. 点击"添加菜品"按钮
4. 填写菜品信息并保存

### 处理订单
1. 在管理后台查看"订单管理"
2. 使用状态筛选器查看特定状态的订单
3. 点击状态下拉菜单更新订单状态

### 查看报告
1. 进入"报告"页面
2. 选择日期范围
3. 点击"生成报告"查看业务数据

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 联系方式

如有问题，请通过GitHub Issues联系。
