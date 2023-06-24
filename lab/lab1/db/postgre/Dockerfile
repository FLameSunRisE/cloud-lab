# 使用 PostgreSQL 官方提供的映像檔作為基礎映像檔
# FROM postgres:latest
FROM postgres:15.3-alpine

# 設定環境變數
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=123456
ENV POSTGRES_DB=Test

# 將自訂的初始化 SQL 檔案複製到容器內
# COPY init.sql /docker-entrypoint-initdb.d/

# 指定執行時的命令或指令
CMD ["postgres"]
