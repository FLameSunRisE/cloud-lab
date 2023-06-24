# 使用 Maven 官方的 Maven 3 映像作為基礎映像
FROM maven:3 AS builder

# 設定工作目錄
WORKDIR /app

# 複製專案的 pom.xml 檔案到容器中
COPY pom.xml .

# 下載 Maven 依賴項
RUN mvn dependency:go-offline -B

# 複製專案的所有檔案到容器中
COPY . .

# 執行 Maven 建置
RUN mvn package -DskipTests

# 使用 OpenJDK 8 官方映像作為基礎映像
FROM openjdk:8

# 設定工作目錄
WORKDIR /app

# 從建置階段的容器中複製 JAR 檔案到此容器中
COPY --from=builder /app/target/todo-list-server-0.0.1-SNAPSHOT.jar app.jar

# 定義容器的執行命令
CMD ["java", "-jar", "app.jar"]
