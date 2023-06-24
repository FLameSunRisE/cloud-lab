# 第一阶段：构建和编译应用程序
FROM node:17.9.1-alpine AS builder

WORKDIR /app

# 将 package.json 和 package-lock.json 复制到容器内的工作目录
COPY package*.json ./

# 安装依赖项
RUN npm install

# 将整个项目复制到容器内的工作目录
COPY . .

# 构建应用程序
RUN npm run build

# 第二阶段：最终镜像
FROM node:17.9.1-alpine

WORKDIR /app

# 从第一阶段复制编译好的结果到最终镜像
COPY --from=builder /app .

# 暴露应用程序所使用的端口
EXPOSE 3000

# 定义启动命令
CMD ["npm", "start"]
