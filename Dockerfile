# 构建阶段
FROM node:22 AS runner

WORKDIR /app

# 复制依赖配置文件
COPY package.json pnpm-lock.yaml ./

# 全局安装 pnpm
RUN npm install -g pnpm

# 安装所有依赖（包括开发依赖，用于构建）
RUN pnpm install

# 复制项目文件
COPY . .

# 生成 Prisma 客户端
RUN pnpm dlx prisma generate

# 构建 Next.js 应用
RUN pnpm run build

# 运行阶段
FROM node:22-alpine

WORKDIR /app

# 复制依赖配置文件
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# 全局安装 pnpm
RUN npm install -g pnpm

# 只安装生产环境依赖
RUN pnpm install --prod

# 复制构建产物、public 目录和 Prisma 客户端
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# 暴露 Next.js 默认端口
EXPOSE 3000

# 启动应用
CMD ["pnpm", "run", "start"]