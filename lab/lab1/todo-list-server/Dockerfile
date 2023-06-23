# 使用 Java 官方的 OpenJDK 8 映像作為基礎映像
FROM openjdk:8

# 設定工作目錄
WORKDIR /app

COPY wait-for-it.sh /wait-for-it.sh

# 複製專案的 JAR 檔到容器中
COPY target/todo-list-server-0.0.1-SNAPSHOT.jar app.jar

# 定義容器的執行命令
CMD ["java", "-jar", "app.jar"]
