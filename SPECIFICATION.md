# 🥁 Beat Machine - 技術仕様書

## 📋 プロジェクト概要

### プロダクト名
**Beat Machine** - インタラクティブWebドラムマシン

### 概要
リアルタイムでビートを作成できるWebベースのドラムマシン。6種類のドラム音源と16ステップシーケンサーを搭載し、キーボードショートカットとGUIの両方で操作可能。

### 対象ユーザー
- 音楽制作者・プロデューサー
- 趣味で音楽を楽しむユーザー
- 教育機関での音楽学習

---

## 🛠 技術スタック

### フロントエンド
- **Framework**: Next.js 14.x (Pages Router)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS 3.x
- **Audio Engine**: Tone.js 14.7.77
- **Build Tool**: Next.js built-in (Webpack)

### デプロイメント
- **Platform**: Vercel
- **CI/CD**: Vercel automatic deployment
- **Domain**: *.vercel.app (custom domain可)

### 開発環境
- **Node.js**: 18.x 以上
- **Package Manager**: npm
- **Code Quality**: ESLint

---

## 🎵 機能仕様

### 1. ドラムパッド機能
**概要**: 6種類のドラム音源をリアルタイム演奏

#### ドラム音源リスト
| 音源名 | キー | 音色 | 実装方法 |
|--------|------|------|----------|
| KICK | Q | キックドラム | MembraneSynth |
| SNARE | W | スネアドラム | NoiseSynth |
| HIHAT | E | ハイハット（クローズ） | MetalSynth |
| OPENHAT | R | ハイハット（オープン） | MetalSynth |
| CRASH | T | クラッシュシンバル | MetalSynth |
| PERC | Y | パーカッション | Synth |

#### 操作方法
- **GUI**: パッドクリック
- **キーボード**: Q, W, E, R, T, Y キー
- **視覚フィードバック**: パッド押下時の色変化・スケール変化

### 2. ステップシーケンサー機能
**概要**: 16ステップのドラムパターンプログラミング

#### 仕様
- **ステップ数**: 16 steps
- **解像度**: 16分音符
- **同時再生**: 全6音源対応
- **視覚表示**: 現在再生ステップのハイライト

#### 操作
- **パターン入力**: グリッドボタンクリック
- **再生制御**: Play/Stop ボタン
- **パターン管理**: Clear/Random ボタン

### 3. テンポ制御
- **BPM範囲**: 80-180 BPM
- **調整方法**: スライダー入力
- **リアルタイム変更**: 再生中も変更可能

### 4. パターン生成
- **Clear**: 全パターンリセット
- **Random**: ランダムパターン生成
  - Kick: 30%確率
  - Snare: 25%確率
  - Hi-hat: 50%確率
  - Open Hat: 15%確率
  - Crash: 10%確率
  - Perc: 20%確率

---

## 🏗 アーキテクチャ

### コンポーネント構成
```
DrumMachine (Root Component)
├── Audio Engine (Tone.js)
├── Drum Pads Section
├── Control Panel
│   ├── Transport Controls (Play/Stop)
│   ├── Pattern Controls (Clear/Random)
│   └── BPM Control
└── Step Sequencer
    └── Pattern Grid (6 × 16)
```

### 状態管理
```javascript
// React State Structure
{
  isPlaying: boolean,           // 再生状態
  currentStep: number,          // 現在のステップ (0-15)
  bpm: number,                  // テンポ (80-180)
  pattern: {                    // パターンデータ
    kick: boolean[16],
    snare: boolean[16],
    hihat: boolean[16],
    openhat: boolean[16],
    crash: boolean[16],
    perc: boolean[16]
  },
  isInitialized: boolean,       // Audio Engine初期化状態
  pressedPads: object          // パッド押下状態
}
```

---

## 🎚 Audio Engine 仕様

### Tone.js 音源設定

#### 1. Kick (MembraneSynth)
```javascript
new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 2,
  oscillator: { type: 'sine' },
  envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
})
```

#### 2. Snare (NoiseSynth)
```javascript
new Tone.NoiseSynth({
  noise: { type: 'white' },
  envelope: { attack: 0.001, decay: 0.13, sustain: 0, release: 0.03 }
})
```

#### 3. Hi-hat (MetalSynth)
```javascript
new Tone.MetalSynth({
  frequency: 200,
  envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5
})
```

#### 4. Open Hat (MetalSynth)
```javascript
new Tone.MetalSynth({
  frequency: 200,
  envelope: { attack: 0.001, decay: 0.3, release: 0.03 },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5
})
```

#### 5. Crash (MetalSynth)
```javascript
new Tone.MetalSynth({
  frequency: 150,
  envelope: { attack: 0.001, decay: 1, release: 3 },
  harmonicity: 5.1,
  modulationIndex: 64,
  resonance: 4000,
  octaves: 1.5
})
```

#### 6. Percussion (Synth)
```javascript
new Tone.Synth({
  oscillator: { type: 'triangle' },
  envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.1 }
})
```

### シーケンサー実装
```javascript
// Tone.Sequence による16ステップシーケンサー
new Tone.Sequence((time, step) => {
  // ステップごとの音源トリガー処理
}, Array.from({length: 16}, (_, i) => i), '16n')
```

---

## 📁 ファイル構成

```
drum-machine/
├── pages/
│   ├── _app.js                 # Next.js App Component
│   ├── _document.js            # Next.js Document
│   └── index.js               # メインドラムマシンページ
├── styles/
│   └── globals.css            # グローバルCSS (Tailwind)
├── public/
│   ├── favicon.ico
│   └── vercel.svg
├── package.json               # 依存関係定義
├── next.config.js            # Next.js設定
├── tailwind.config.js        # Tailwind設定
├── postcss.config.js         # PostCSS設定
├── README.md                 # プロジェクト説明
├── SPECIFICATION.md          # 技術仕様書（このファイル）
└── .gitignore               # Git除外設定
```

---

## 🚀 開発・デプロイ手順

### 初期セットアップ
```bash
# 1. プロジェクト作成
npx create-next-app@latest drum-machine
cd drum-machine

# 2. 依存関係インストール
npm install tone

# 3. 開発サーバー起動
npm run dev
```

### ローカル開発
```bash
npm run dev          # 開発サーバー起動 (localhost:3000)
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動
npm run lint         # ESLint実行
```

### Vercelデプロイ
```bash
# 方法1: CLI使用
npx vercel --prod

# 方法2: GitHub連携
git push origin main  # 自動デプロイ
```

---

## 🎨 UI/UX仕様

### デザインシステム
- **カラーパレット**: グラデーション（Purple-Blue-Gray）
- **タイポグラフィ**: システムフォント
- **レスポンシブ**: Mobile-first design
- **アニメーション**: Tailwind transitions

### ブレイクポイント
- **Mobile**: < 768px
- **Desktop**: ≥ 768px

### インタラクション
- **Hover Effects**: スケール・色変化
- **Active States**: パッド押下フィードバック
- **Focus States**: キーボードアクセシビリティ対応

---

## 📱 レスポンシブ対応

### モバイル仕様
- パッドサイズ調整 (p-4)
- グリッドレイアウト最適化 (grid-cols-2)
- フォントサイズ調整 (text-lg → text-xl)
- タッチ操作対応

### デスクトップ仕様
- 大きなパッドサイズ (p-6)
- 3列グリッドレイアウト (md:grid-cols-3)
- キーボードショートカット完全対応

---

## 🧪 テスト仕様

### 手動テスト項目
1. **音源テスト**
   - [ ] 各パッドから正しい音が再生される
   - [ ] キーボードショートカットが機能する
   - [ ] パッド視覚フィードバックが表示される

2. **シーケンサーテスト**
   - [ ] パターン入力が正常に動作する
   - [ ] 再生時に正しいタイミングで音が鳴る
   - [ ] BPM変更が反映される
   - [ ] Clear/Random機能が動作する

3. **レスポンシブテスト**
   - [ ] モバイルで正常に表示される
   - [ ] タッチ操作が機能する
   - [ ] デスクトップで最適化表示される

---

## 🔮 今後の拡張予定

### Phase 2: 高度な機能
- [ ] **パターン保存・読み込み**
  - LocalStorage活用
  - JSON形式でのエクスポート・インポート

- [ ] **エフェクト追加**
  - Reverb, Delay, Filter
  - Tone.js Effects活用

- [ ] **音源追加**
  - より多くのドラム音源
  - サンプリング対応

### Phase 3: コラボレーション機能
- [ ] **パターン共有**
  - URL共有機能
  - QRコード生成

- [ ] **リアルタイム録音**
  - MediaRecorder API
  - WAVエクスポート

### Phase 4: 高度なUI
- [ ] **ドラッグ&ドロップ**
  - パターンコピー
  - ドラム音源配置変更

- [ ] **カスタムテーマ**
  - ダークモード対応
  - カラーテーマ選択

---

## 📄 ライセンス

MIT License

---

## 🤝 コントリビューション

### 開発ガイドライン
1. **コーディング規約**: ESLint設定に従う
2. **コミットメッセージ**: Conventional Commits
3. **ブランチ戦略**: feature/xxxx からmainへPR

### 課題・バグ報告
GitHub Issuesを活用

---

## 📞 サポート

技術的な質問や改善提案は、新しいAIチャットでこの仕様書を共有してご相談ください。

---

**更新日**: 2025-07-04  
**バージョン**: 1.0.0  
**作成者**: AI Assistant