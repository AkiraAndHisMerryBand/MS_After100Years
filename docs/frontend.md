## 環境選択・画面遷移の仕様

### 1. 環境の変数名

環境を表す変数名は `environment` に統一する。

| 環境 | 値 |
|---|---|
| 地上 | `land` |
| 海底 | `ocean` |
| 洞窟 | `cave` |

TypeScriptでの型定義：

```tsx
type Environment = "land" | "ocean" | "cave";
```

### 2. ページ構成

| 画面 | URL | ファイル |
|---|---|---|
| トップ | `/` | `src/app/page.tsx` |
| 環境設定 | `/setting` | `src/app/setting/page.tsx` |
| ロード | `/loading` | `src/app/loading/page.tsx` |
| 生成結果 | `/result` | `src/app/result/page.tsx` |

### 3. 画面遷移

選択した環境は、クエリパラメータ `environment` で次の画面へ引き継ぐ。

#### ① トップ → 環境設定

```tsx
import Link from "next/link";

<Link href="/setting?environment=land">地上</Link>
<Link href="/setting?environment=ocean">海底</Link>
<Link href="/setting?environment=cave">洞窟</Link>
```

#### ② 環境設定 → ロード

「進化させる」ボタンを押したら遷移する。

```tsx
<Link href={`/loading?environment=${environment}`}>
  進化させる
</Link>
```

※ `environment` は前画面から受け取った値を使用する。

#### ③ ロード → 生成結果

生成APIの処理が完了したら自動遷移する。

```tsx
router.push(`/result?environment=${environment}`);
```

※ `router` は `useRouter()` で取得する。生成処理完了後に実行すること。

### 4. 遷移例（海底を選択）

```text
/
↓ 海底を選択
/setting?environment=ocean
↓ 進化させる
/loading?environment=ocean
↓ 生成完了
/result?environment=ocean
```

### 5. 共通ルール

- `environment` は `land`、`ocean`、`cave` のいずれかとする。
- すべての画面で `environment` を引き継ぐ。
- 環境設定・ロード・生成結果はそれぞれ共通の1ページで実装する。
- 環境に応じて背景色・画像を切り替える。
- `environment` の値が不正な場合の処理は別途実装する。
- 生成画像・パラメータ値などは、APIの仕様に合わせて管理する。