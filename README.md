# Next.js project

このプロジェクトは、[Next.js](https://nextjs.org) の [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) を使用して作成されています。

## 開発環境の起動

まず、開発サーバーを起動します。

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

開発サーバーを起動したら、ブラウザで http://localhost:3000 を開いてください。
ページを編集する場合は、app/page.tsx を変更します。
ファイルを編集すると、変更内容が自動的にブラウザへ反映されます。
このプロジェクトでは next/font を使用して、Vercelのフォントファミリーである Geist を自動的に最適化・読み込みしています。
Next.jsについて
Next.jsについて詳しく知りたい場合は、以下の公式資料を参照してください。
- Next.js Documentation - Next.jsの機能やAPIについて確認できます。
- Learn Next.js - Next.jsをインタラクティブに学習できるチュートリアルです。
- Next.js GitHub Repository - Next.jsのGitHubリポジトリです。
Vercelへのデプロイ
Next.jsアプリケーションを簡単にデプロイする方法として、Next.jsの開発元が提供している Vercel Platform を利用できます。
デプロイ方法の詳細については、Next.js Deployment Documentation を参照してください。


ただ、これは`create-next-app`の初期READMEを日本語化しただけなので、**チーム開発用READMEとしてはまだ情報不足**です。

今回の「100年後の生態系」なら、この後に `プロジェクト概要 / MVP構成 / 環境構築手順 / ディレクトリ構成 / Git運用ルール / API仕様` あたりを追加して、**新しいメンバーがREADMEだけ見れば開発開始できる状態**にしていくのがよいです。