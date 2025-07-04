# 🥁 ビートマシン

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000)](https://nextjs.org)
[![Tone.js](https://img.shields.io/badge/Audio-Tone.js-yellow)](https://tonejs.github.io)

Webブラウザでリアルタイムにビートを作成できるドラムマシン

## ✨ 特徴

- 🎵 **6種類のドラム音源**
  - キック (Q) - ベースドラム
  - スネア (W) - スネアドラム
  - ハイハット (E) - ハイハット（クローズ）
  - オープンハット (R) - ハイハット（オープン）
  - クラッシュ (T) - クラッシュシンバル
  - パーカッション (Y) - パーカッション

- 🎹 **直感的な操作**
  - マウス/タッチでパッドをクリック
  - キーボードショートカット対応
  - リアルタイム音楽制作

- 🎛️ **高機能シーケンサー**
  - 16ステップシーケンサー
  - テンポ調整（80-180 BPM）
  - パターンのクリア・ランダム生成

- 📱 **完全レスポンシブ**
  - PC・タブレット・スマートフォン対応
  - タッチ操作最適化

## 🚀 クイックスタート

### ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/beat-machine.git
cd beat-machine

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

### デプロイ

```bash
# Vercelにデプロイ
npx vercel --prod
```

## 🎯 使い方

1. **音声エンジン初期化**
   - 「🎧 オーディオエンジンを開始」をクリック

2. **ドラム演奏**
   - パッドをクリックまたはキーボード（Q,W,E,R,T,Y）で演奏

3. **パターン作成**
   - ステップシーケンサーのグリッドをクリックしてパターンを入力
   - ▶️ 再生ボタンで再生開始

4. **テンポ調整**
   - テンポスライダーで好みのBPMに設定

5. **パターン管理**
   - 🗑️ クリア: パターンをリセット
   - 🎲 ランダム: ランダムパターンを生成

## 🛠 技術スタック

- **フレームワーク**: Next.js 14.x
- **言語**: JavaScript (ES6+)
- **スタイリング**: Tailwind CSS 3.x
- **音声エンジン**: Tone.js 14.7.77
- **デプロイメント**: Vercel

## 📖 ドキュメント

- [📋 技術仕様書](./SPECIFICATION.md) - 詳細な技術仕様と実装方法
- [🔧 開発ガイド](./SPECIFICATION.md#開発デプロイ手順) - 開発環境のセットアップ
- [🎨 UI/UX仕様](./SPECIFICATION.md#uiux仕様) - デザインシステムとレスポンシブ対応

## 🔮 今後の予定

- [ ] パターン保存・読み込み機能
- [ ] エフェクト追加（リバーブ、ディレイ）
- [ ] 音源の追加
- [ ] パターン共有機能
- [ ] 録音・エクスポート機能

## 🤝 コントリビューション

プルリクエストやIssuesを歓迎します！

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 🙏 謝辞

- [Tone.js](https://tonejs.github.io) - Web Audio API のラッパー
- [Next.js](https://nextjs.org) - React フレームワーク
- [Tailwind CSS](https://tailwindcss.com) - ユーティリティファーストCSS

---

**🎵 新しいビートを作ろう！ 🥁**
