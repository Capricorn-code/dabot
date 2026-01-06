FROM node:20-bookworm

# pnpm を有効化
RUN corepack enable && corepack prepare pnpm@latest --activate

# 作業ディレクトリ
WORKDIR /workspaces/davot

# 必要なら git
RUN apt-get update && apt-get install -y git && apt-get clean

# タイムゾーンを設定
ENV TZ=Asia/Tokyo
