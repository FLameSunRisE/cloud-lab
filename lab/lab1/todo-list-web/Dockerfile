# 使用 Node.js 官方提供的 Node 鏡像作為基礎映像檔
FROM node:17.9.1-alpine

# 設定工作目錄
WORKDIR /app

# 將 package.json 與 package-lock.json 複製到容器內的工作目錄
COPY package*.json ./

# 安裝相依套件
RUN npm install

# 將整個專案複製到容器內的工作目錄
COPY . .

# 檢查容器內的工作目錄是否正確複製了所有檔案
RUN ls -l

# 建構 Next.js 應用程式
RUN npm run build

# 暴露應用程式所使用的 port
EXPOSE 3000

# 定義啟動指令
CMD ["npm", "start"]