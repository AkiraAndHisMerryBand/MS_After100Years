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

## API仕様

MVPにおいて、Front・Backend・Unity間で使用するデータ仕様を以下に定義する。

### Front → Backend

Frontでユーザーが設定した環境条件をBackendへ送信する。

#### Request

- `environment`
  - 型：`string`
  - 値：`ocean` / `cave` / `land`
  - 内容：生物が生息する環境

- `temperature`
  - 型：`number`
  - 範囲：`0〜100`
  - 内容：温度の高さ

- `space`
  - 型：`number`
  - 範囲：`0〜100`
  - 内容：活動空間の広さ

- `brightness`
  - 型：`number`
  - 範囲：`0〜100`
  - 内容：環境の明るさ

- `food`
  - 型：`number`
  - 範囲：`0〜100`
  - 内容：餌資源の豊富さ

- `predators`
  - 型：`number`
  - 範囲：`0〜100`
  - 内容：天敵の多さ

#### Request例

```json
{
  "environment": "ocean",
  "temperature": 20,
  "space": 80,
  "brightness": 10,
  "food": 70,
  "predators": 80
}
```

#### パラメータについて

MVPではデータの扱いやすさを優先し、各環境パラメータを0〜100の数値として扱う。

基本的に `0` を「低い・少ない・狭い」、`100` を「高い・多い・広い」とする。

各パラメータの具体的な基準については、今後の企画仕様やAI連携方法に応じて再検討する。

---

### Backend → Unity

BackendからUnityへ、生成された生物を展示するために必要なデータを送信する。

MVPではAIによる生成を行わないため、あらかじめ用意したテストデータを使用する。

#### Response

- `id`
  - 型：`string`
  - 内容：生物を識別するためのID

- `name`
  - 型：`string`
  - 内容：生物の名前

- `environment`
  - 型：`string`
  - 内容：生物が生息する環境

- `imageUrl`
  - 型：`string`
  - 内容：生物画像の参照先

- `description`
  - 型：`string`
  - 内容：生物の説明

- `parameters`
  - 型：`object`
  - 内容：生物生成時に指定された環境条件
  - `temperature`：`number`
  - `space`：`number`
  - `brightness`：`number`
  - `food`：`number`
  - `predators`：`number`

#### Response例

```json
{
  "id": "creature-001",
  "name": "アビスフィン",
  "environment": "ocean",
  "imageUrl": "/images/test-ocean.png",
  "description": "暗く広い海中環境に適応した未来生物",
  "parameters": {
    "temperature": 20,
    "space": 80,
    "brightness": 10,
    "food": 70,
    "predators": 80
  }
}
```

#### MVPでの扱い

MVPではAIを使用せず、`ocean`（海中）、`cave`（洞窟）、`land`（地上）の各環境についてテスト用の生物データを用意する。

Responseの項目については暫定仕様とし、Unityでのオブジェクト生成・展示に必要な情報をUnity担当と確認したうえで調整する。

#### テストデータ

MVPではAIを使用しないため、動作確認用として各環境に対応したテストデータを使用する。

##### 海中（ocean）

```json
{
  "id": "creature-001",
  "name": "アビスフィン",
  "environment": "ocean",
  "imageUrl": "/images/test-ocean.png",
  "description": "暗く広い海中環境に適応した未来生物",
  "parameters": {
    "temperature": 20,
    "space": 80,
    "brightness": 10,
    "food": 70,
    "predators": 80
  }
}
```

##### 洞窟（cave）

```json
{
  "id": "creature-002",
  "name": "ケイブウォーカー",
  "environment": "cave",
  "imageUrl": "/images/test-cave.png",
  "description": "暗く狭い洞窟環境に適応した未来生物",
  "parameters": {
    "temperature": 30,
    "space": 20,
    "brightness": 0,
    "food": 30,
    "predators": 40
  }
}
```

##### 地上（land）

```json
{
  "id": "creature-003",
  "name": "サンドランナー",
  "environment": "land",
  "imageUrl": "/images/test-land.png",
  "description": "明るく餌資源の少ない地上環境に適応した未来生物",
  "parameters": {
    "temperature": 80,
    "space": 90,
    "brightness": 90,
    "food": 20,
    "predators": 60
  }
}
```

追記　
温度はどの範囲にするか
陸海洞で分けるのかすべて統一して-50~50度にするとか

MVP段階ではimageUrlはいるのか