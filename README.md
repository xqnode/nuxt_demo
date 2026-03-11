# Nuxt 全栈模板工程

基于 **Nuxt 4** 构建的全栈模板，集成了现代化 UI 组件、数据库 ORM 和用户认证，适合快速搭建中后台管理系统。

## 技术栈

| 分类 | 技术 |
|------|------|
| 核心框架 | Nuxt 4 + Vue 3 |
| UI 组件 | reka-ui + shadcn-vue 风格 |
| 样式 | Tailwind CSS v4 |
| 数据表格 | TanStack Vue Table |
| ORM | Drizzle ORM |
| 数据库 | MySQL |
| 认证 | nuxt-auth-utils + bcryptjs |
| 工具库 | VueUse |
| 图标 | Lucide + Nuxt Icon |

## 环境要求

- Node.js >= 18
- MySQL 数据库

## 快速开始

### 安装依赖

```bash
# pnpm（推荐）
pnpm install

# npm
npm install

# yarn
yarn install
```

### 配置环境变量

在项目根目录创建 `.env` 文件，配置数据库连接等信息：

```env
# 数据库连接
DATABASE_URL=mysql://用户名:密码@localhost:3306/数据库名

# 认证密钥
NUXT_SESSION_PASSWORD=your-secret-key-at-least-32-characters
```

### 数据库迁移

```bash
# 生成迁移文件
pnpm drizzle-kit generate

# 执行迁移
pnpm drizzle-kit migrate
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 构建与部署

### 构建生产版本

```bash
pnpm build
```

### 本地预览生产构建

```bash
pnpm preview
```

### 静态生成

```bash
pnpm generate
```

更多部署方式请参考 [Nuxt 部署文档](https://nuxt.com/docs/getting-started/deployment)。

## 项目结构

```
nuxt_demo/
├── app/          # 前端页面与组件
├── database/     # 数据库 Schema 与迁移文件
├── public/       # 静态资源
├── server/       # 服务端 API 路由
├── nuxt.config.ts
└── package.json
```

## 参考文档

- [Nuxt 官方文档](https://nuxt.com/docs/getting-started/introduction)
- [Drizzle ORM 文档](https://orm.drizzle.team)
- [Tailwind CSS v4 文档](https://tailwindcss.com)
- [reka-ui 文档](https://reka-ui.com)
- [TanStack Table 文档](https://tanstack.com/table/latest)