# 使用 Node.js 22 作为基础镜像
FROM node:22 AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖(允许所有构建脚本) --frozen-lockfile
RUN pnpm install --unsafe-perm --ignore-scripts=false

# 复制项目文件
COPY . .

# 构建项目
RUN pnpm build

# 生产环境镜像
FROM node:22-alpine AS runner

WORKDIR /app

# 检查 prisma 目录内容
RUN ls -la /app

# 从构建阶段复制必要的文件
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# 安装 PM2 全局
RUN npm install -g pm2

# 检查 prisma 目录内容
RUN ls -la /app/prisma  

# 验证 prisma/schema.prisma 是否存在
RUN if [ ! -f "prisma/schema.prisma" ]; then echo "Error: prisma/schema.prisma not found!" && exit 1; fi

# 生成 Prisma 客户端
RUN pnpm prisma generate

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["pm2-runtime", "start", "npm", "--", "start"]