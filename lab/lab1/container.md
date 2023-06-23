# 容器化實作過程

- [容器化實作過程](#容器化實作過程)
  - [實作步驟](#實作步驟)
    - [前端容器化](#前端容器化)
    - [後端容器化](#後端容器化)
    - [資料庫容器化](#資料庫容器化)
    - [定義 Docker Compose 文件](#定義-docker-compose-文件)
    - [使用 Docker Compose 啟動容器](#使用-docker-compose-啟動容器)
    - [測試容器化應用](#測試容器化應用)
  - [遇到的問題](#遇到的問題)
    - [Docker 網絡設置問題](#docker-網絡設置問題)
    - [端口衝突問題](#端口衝突問題)
    - [Docker 映像構建問題](#docker-映像構建問題)
    - [環境變量配置問題](#環境變量配置問題)
  - [常用指令](#常用指令)

---

## 實作步驟

### 前端容器化

- 建立一個前端應用的 Dockerfile，其中定義了構建前端應用所需的環境和相依套件。
  - 在 Dockerfile 中設定適當的工作目錄
  - 將前端應用程式碼複製到容器中。

```Dockerfile
# 使用 Node.js 的官方映像作為基礎
FROM node:14-alpine

# 設定工作目錄
WORKDIR /app

# 將 package.json 和 package-lock.json 複製到容器中
COPY package*.json ./

# 安裝相依套件
RUN npm install

# 複製所有前端程式碼到容器中
COPY . .

# 執行前端應用
CMD ["npm", "start"]
```

- 定義容器的埠映射，以便可以通過主機訪問前端應用。

```shell
docker build -t frontend-image .
```

- 構建前端容器鏡像並運行容器。

```shell
docker run -d -p 3000:3000 --name frontend-container frontend-image
```

### 後端容器化

- 建立一個後端應用的 Dockerfile，其中定義了構建後端應用所需的環境和相依套件。
  - 在 Dockerfile 中設定適當的工作目錄
  - 後端應用程式碼複製到容器中。

```Dockerfile
# 使用適當的基礎映像，例如 OpenJDK
FROM openjdk:8-jdk-alpine

# 設定工作目錄
WORKDIR /app

# 將 JAR 檔案複製到容器中
COPY app.jar .

# 執行後端應用
CMD ["java", "-jar", "app.jar"]
```

- 定義容器的埠映射，以便可以通過主機訪問後端應用。

```shell
docker build -t backend-image .
```

- 構建後端容器鏡像並運行容器。

```shell
docker run -d -p 8080:8080 --name backend-container backend-image
```

### 資料庫容器化

- 根據所使用的資料庫選擇適合的資料庫鏡像
  - 配置資料庫容器的環境變數，例如使用者名稱、密碼和資料庫名稱等。
  - 定義容器的埠映射，以便可以通過主機訪問資料庫服務。

```Dockerfile
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
```

- 運行資料庫容器。

```shell
docker run -d -p 5432:5432 --name database-container -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=mydb postgres:15.3-alpine
```

### 定義 Docker Compose 文件

- 建立一個名為 docker-compose.yml 的文件，用於定義前端、後端和資料庫的容器配置。
- 在 Docker Compose 文件中定義各個服務的構建方式、鏡像、埠映射、環境變數等配置。
- 定義服務之間的相依關係，以確保容器按正確的順序啟動和連接。

### 使用 Docker Compose 啟動容器

- 在命令行中使用 docker-compose up 命令啟動容器。
  - Docker Compose 將根據定義的配置構建和啟動前端、後端和資料庫容器。

```yaml
version: "3"
services:
  frontend:
    build:
      context: ./todo-list-web
      dockerfile: Dockerfile
    environment:
      - API_HOST=localhost
      - API_PORT=8080
    ports:
      - 3000:3000
    depends_on:
      - backend
    networks:
      - my-network
  backend:
    build:
      context: ./todo-list-server
      dockerfile: Dockerfile
    ports:
      - 8080:8080
    depends_on:
      - database
    networks:
      - my-network
  database:
    image: postgres:15.3-alpine
    hostname: my-postgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=123456
      - POSTGRES_DB=Test
    ports:
      - 5432:5432
    networks:
      - my-network
networks:
  my-network:
    driver: bridge
```

- 您可以檢視命令行輸出以確認容器的啟動狀態和日誌資訊。

  - 啟動

    ```shell
    docker-compose up -d
    ```

  - 關閉

    ```shell
    docker-compose up -d
    ```

### 測試容器化應用

- 確認 Docker 執行狀態

  - cmd

    ```shell
    docker ps
    docker-compose ps
    ```

  - 圖片

    ![lab1_container_status_demo](/img/lab1/container/lab1_container_status_demo.png)

- 通過訪問主機的相應埠，例如 localhost:3000 來測試前端應用。
  ![lab1_container_frontend_demo](/img/lab1/container/lab1_container_frontend_demo.png)

- 確保前端應用能夠成功與後端應用通訊並獲取所需的資料。

- 檢查後端應用是否能夠成功連接到資料庫並執行相應的資料庫操作。

  ![lab1_container_db_demo](/img/lab1//container/lab1_container_db_demo.png)

---

## 遇到的問題

### Docker 網絡設置問題

- 問題說明
  在一開始的配置中，由於網絡設置不正確，前端容器無法解析後端容器的域名，導致連接失敗。通過檢查網絡設置並將容器連接到正確的網絡中解決了這個問題。
- 解決辦法

  - 說明
    檢查 Docker Compose 文件中的網絡設置，**確保前端和後端容器連接到同一個網絡**。修改 Compose 文件，**將前端容器和後端容器放置在相同的網絡中**，以便它們可以相互訪問。
  - 實作過程

    ```yaml
    networks:
      - my-network
    ```

### 端口衝突問題

- 問題說明
  在運行容器時，出現了端口衝突的情況。可能是由於主機上的其他服務正在使用相同的端口。通過停止衝突的服務或更改容器的端口映射，解決了這個問題。
- 解決辦法

  - 說明
    檢查主機上的已使用端口，並確保容器的端口映射與主機上的端口不衝突。如果有衝突，可以更改容器的端口映射或停止佔用該端口的服務。
  - 實作過程

    ```yaml
    ports:
      - 3000:3000
    ```

### Docker 映像構建問題

- 問題說明
  在構建 Docker 映像時，可能會遇到依賴項缺失或構建過程中的錯誤。通過檢查 Dockerfile 和相關依賴項，解決了這些問題。
- 解決辦法

  - 說明
    仔細檢查 Dockerfile 中的構建步驟和依賴項安裝命令，確保所有依賴項都正確安裝，並且構建過程中沒有出現錯誤。根據錯誤消息進行調試，並確保構建環境中安裝了必要的工具和軟件。
  - 實作過程

    ```shell
    RUN apt-get install -y <package_name>
    ```

### 環境變量配置問題

- 問題說明
  在設置容器環境變量時，可能會遇到錯誤的變量名稱或值的問題。通過仔細檢查環境變量的設置，並確保其與容器內部應用程序的期望值匹配，解決了這個問題。
- 解決辦法

  - 說明
    檢查 Docker Compose 文件或 Dockerfile 中環境變量的設置，並確保變量的名稱和值與容器內部應用程序的期望值匹配。如果有需要，可以參考相關文檔來確保正確設置環境變量。
  - 實作過程

    1. 在前端應用程序的代碼中，通過使用環境變量 API_HOST 來引用後端 API 的主機名。

       ```tsx
       const apiHost = process.env.API_HOST;
       ```

    2. 在 Docker Compose 文件或 Dockerfile 中，將 API_HOST 設置為後端容器的主機名。

       ```yaml
       environment:
         - API_HOST=backend
         - API_PORT=8080
       ```

    3. 確保前端應用程序在容器內正確地解析 API_HOST。這通常需要在容器的網絡設置中進行適當的配置。
       - 如果前後端容器在同一個網絡中，可以直接使用容器名稱作為 API_HOST。
       - 如果前後端容器不在同一個網絡中，可以使用 Docker 網絡別名（service name）來解析 API_HOST。
    4. 重新起動

       ```shell
       docker-compose up --build
       ```

---

## 常用指令

- 指令功能: 構建 Docker 映像

  - 說明: 根據 Dockerfile 構建 Docker 映像。
  - 替換部分:
    - image-name：您希望給映像指定的名稱
    - .Dockerfile 所在的目錄

- 指令:

  ```shell
  docker build -t image-name .
  ```

- 指令功能: 運行 Docker 容器

  - 說明: 運行 Docker 容器。
  - 替換部分:
    - host-port：主機上的端口
    - container-port：容器內的端口
    - container - image-name：映像的名稱 -
  - 指令:

    ```shell
    docker run -d -p host-port:container-port name container-name image-name
    ```

- 指令功能:

  - 說明: 顯示運行中的容器列表。
  - 指令:

  ```shell
  docker ps
  ```

- 指令功能: 停止運行中的容器
- 說明: 停止運行中的容器。
- 替換部分

  - container-name：要停止的容器的名稱
  - 指令:

  ```shell
  docker stop container-name
  ```

- 指令功能: 刪除已停止的容器

  - 說明: 刪除已停止的容器。
  - 替換部分
    - container-name：要刪除的容器的名稱
  - 指令:

    ```shell
    rm container-name
    ```

- 指令功能: 列出 Docker 中的網

  - 說明: 列出 Docker 中的網絡。
  - 指令:

  ```shell
  docker network ls
  ```

- 指令功能: 創建一個 Docker 網絡

  - 說明: 創建一個 Docker 網絡。
  - 替換部分
    - network-name：要創建的網絡的名稱
  - 指令:

  ```shell
  docker network create network-name
  ```

- 指令功能: 進入運行中的容器的終端

  - 說明: 進入運行中的容器的終端。
  - 替換部分
    - container-name：要進入的容器的名稱
  - 指令:

    ```shell
    exec -it container-name sh
    ```

- 指令功能: 使用 Docker Compose 啟動容

  - 說明: 使用 Docker Compose 啟動容器。
  - 指令:

  ```shell
  docker-compose up -d
  ```
