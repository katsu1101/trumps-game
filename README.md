# ♠️ 7乗べ Webカードゲーム（Next.js × TypeScript）

このプロジェクトは、7乗べ風のトランプカードゲームをブラウザ上で楽しめるように構築した Web アプリです。  
React フレームワークの [Next.js](https://nextjs.org/)
と、軽量な状態管理ライブラリ [Zustand](https://github.com/pmndrs/zustand) を用いて実装しています。

---

## 🎮 主な機能

- ♠️ 山札からのカードシャッフル＆配布（プレイヤー + NPC）
- 🤖 NPCは2〜4人で自由に設定可能
- 🁏 プレイヤーの手筆は表表示、NPCは裏表示
- 🧩 カードごとの縦横比・マーク配置・対称表示に対応
- 🔧 状態管理はZustandで一括管理、再利用性の高い構造

---

## 🧱 使用技術スタック

| 技術            | 説明                                            |
|---------------|-----------------------------------------------|
| Next.js       | ReactベースのフルスタックWebフレームワーク                     |
| TypeScript    | 静的型付けによる信頼性の高い開発                              |
| Zustand       | `stores/gameStore.ts` にて ゲームの状態やロジックを一元化して管理。 |
| Tailwind CSS  | スタイリングの高速開発                                   |
| framer-motion | アニメーション実装（カードの動きなど）                           |

---

## 🚀 今後の予定

- ✅ カードを出す／出せない判定
- ✅ プレイヤーとNPCのターン制ロジック
- ⏳ 勝敗条件の自動判定
- ⏳ プレイヤー間通信（WebSocket対応）
- ⏳ カードのAI戦略（難易度調整）

---

## 🛠 開発・実行方法

```bash
# 依存パッケージをインストール
npm install

# 開発サーバー起動
npm run dev
```

開発環境は [http://localhost:3000](http://localhost:3000) でアクセスできます。

---

## 📁 ディレクトリ構成（抜粋）

```plaintext
src/
├── app/                  # ルート画面 (page.tsx)
├── components/           # カード、プレイヤー表示などのUI部品
├── stores/               # Zustandによる状態管理
├── types/                # 型定義（Cardなど）
├── utils/                # マーク配置テンプレートなど
├── public/
    ├── favicon-32.png
    ├── apple-touch-icon.png
    ├── icon-192.png
    ├── icon-400.png
    ├── icon-512.png 
    └── ogp.png               (GitHub Pagesなら trumps-game/ogp.png)
```

## SNS最適化などで使用する画像の一覧

|                      |        画像        |   サイズ（推奨）   |    形式    |            用途            |           備考            |
|----------------------|:----------------:|:-----------:|:--------:|:------------------------:|:-----------------------:|
| favicon-32.png       |      ファビコン       |  32×32 px   |   PNG    |       ブラウザタブのファビコン       |        昔からの標準サイズ        |
| apple-touch-icon.png | Apple Touch Icon | 180×180 px  |   PNG    |      iOS ホーム画面用アイコン      |  apple-touch-icon.png   |
| icon-192.png         |  Manifest Icon   | 192×192 px  |   PNG    | PWA用アイコン (manifest.json) |       複数サイズあると安心        |
| icon-400.png         |      アイコン画像      |   400×400   |   PNG    |        SNSアイコンなど         |                         |
| icon-512.png         |  Manifest Icon   | 512×512 px  |   PNG    | PWA用アイコン (manifest.json) |       複数サイズあると安心        |
| ogp.png              |      OGP画像       | 1200×630 px | PNG/JPEG |       SNS共有時のサムネイル       | openGraph, twitter card |

---

## 📦 インストールが必要な主なパッケージ

```bash
npm install zustand clsx framer-motion
```

---

## 🧩 状態管理の実装について

Zustandでは、`useGameStore` というカスタムフックを通じてゲームの状態と操作関数を一元的に扱います。
このストアは `stores/gameStore.ts` に定義されており、以下の2つの役割を担います：

### 1. 状態（State）

- `cards`：全カード情報（場所や向きを含む）
- `npcCount`：NPCの人数（2〜4人）
- `turn`：現在のターンプレイヤー（今後追加）
- `phase`：ゲームの進行段階（開始前、進行中、終了 など）

### 2. 処理（Actions）

- `setNpcCount(count)`：NPC人数を更新
- `dealCards()`：山札を作成してカードを配布
- `playCard(cardId)`：カードを場に出す（今後実装）
- `nextTurn()`：ターンを進める（今後実装）
- `resetGame()`：初期状態にリセット

### 利用例（コンポーネント側）

Reactコンポーネントでは以下のようにして状態にアクセス・操作します：

```tsx
const cards = useGameStore(state => state.cards);
const dealCards = useGameStore(state => state.dealCards);
dealCards();
```

これにより状態とロジックの責務が明確に分離され、
どのコンポーネントからでも柔軟に状態にアクセスできます。

Zustand は `stores/gameStore.ts` にて状態管理ストアを定義しています。
このストアでは以下のような情報とロジックを一元管理しています：

- 山札（全カード）と各プレイヤーの手札
- NPCの人数（2〜4人）とその変動機能
- ゲーム開始時のシャッフルと配布処理
- カードの現在位置（deck / player / npcX）と表裏状態（isFaceUp）

UIコンポーネントは `useGameStore` フックを使って状態にアクセスし、表示や操作に反映しています。
---

## 📄 ライセンス

MIT License
