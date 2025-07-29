# GitHub初心者ガイド - バージョン管理の基礎から実践まで

![GitHub Guide for Beginners](https://img.shields.io/badge/Status-Draft-orange) ![License](https://img.shields.io/badge/License-MIT-blue) ![Language](https://img.shields.io/badge/Language-Japanese-red)

## 📖 書籍について

この書籍は、Gitとgithubを初めて学ぶ方から、基本操作は知っているが体系的に学び直したい方まで、幅広い読者を対象とした実践的なガイドブックです。

### 🎯 対象読者

- プログラミングを始めたばかりの学生・初心者
- これからチーム開発に参加する方
- 独学でコードを書いているが、バージョン管理を使ったことがない方
- GitHubの基本操作は知っているが、ワークフローを体系的に学びたい方

### ✨ 特徴

- **実践重視**: 実際の開発現場で使われるワークフローを重視
- **段階的学習**: 個人利用からチーム開発まで段階的にスキルアップ
- **トラブル対応**: よくあるエラーとその解決方法を詳しく解説
- **最新対応**: GitHub Actions、GitHub Pages等の最新機能にも対応

## 📚 書籍構成

### 第1部: 基礎編
1. **はじめに - なぜGitHubを学ぶのか**
2. **Git基礎 - バージョン管理の仕組み**
3. **GitHubアカウント作成と初期設定**
4. **基本操作 - push、pull、clone**

### 第2部: 実践編
5. **リポジトリ管理の実践**
6. **チーム開発入門 - ブランチとマージ**
7. **プルリクエストによるコードレビュー**
8. **Issues活用による課題管理**

### 第3部: 応用編
9. **GitHub Actions入門 - 自動化の基礎**
10. **セキュリティのベストプラクティス**
11. **実践的な活用法**
12. **よくある問題と解決方法**

### 付録
- **A. Gitコマンドリファレンス**
- **B. GitHubショートカット集**
- **C. 学習リソースと参考文献**

## 🚀 使用方法

### 必要な環境
- インターネット接続
- GitHubアカウント（無料）
- ターミナル・コマンドライン環境

### 推奨環境
- Visual Studio Code（または任意のエディタ）
- Git GUI ツール（GitKraken、SourceTree等）

### 学習の進め方

1. **各章を順番に読み進める**
2. **実習コードを実際に動かす**
3. **章末の演習問題に取り組む**
4. **不明な点はIssuesで質問する**

## 🛠 開発・ビルド方法

この書籍は [book-formatter](https://github.com/itdojp/book-formatter) を使用して作成されています。

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/itdojp/github-guide-for-beginners-book.git
cd github-guide-for-beginners-book

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### ビルド

```bash
# 本番ビルド
npm run build

# GitHub Pages用ビルド
npm run build:github-pages
```

## 📝 執筆ガイドライン

### コンテンツ作成時の注意事項

1. **SVG図の作成**
   - [SVG作成ガイドライン](docs/diagram/svg_style_guide.md)に従って作成
   - 技術書に適した見やすいデザインを心がける

2. **コードサンプル**
   - 実際に動作することを確認
   - コメントで詳しく説明を追加

3. **スクリーンショット**
   - 最新のGitHub UIに基づいて作成
   - 重要な部分をハイライト

### 執筆の進め方

技術書作成の詳細な手順については、[tech-book-writing-6phases.md](tech-book-writing-6phases.md) を参照してください。

## 🤝 貢献方法

### バグ報告・改善提案

Issuesを使用してバグ報告や改善提案をお願いします：

1. **バグ報告**: 内容の間違いや誤字脱字
2. **改善提案**: より良い説明方法や追加すべき内容
3. **質問**: 理解が困難な箇所についての質問

### プルリクエスト

以下の改善については、プルリクエストを歓迎します：

- 誤字脱字の修正
- より分かりやすい説明への改善
- コードサンプルの改善
- 図表の改善

### 貢献ガイドライン

1. **Issue first**: 大きな変更前にIssueで議論
2. **小さな単位**: 一つのPRで一つの改善を行う
3. **テスト**: コードサンプルは必ず動作確認
4. **説明**: PRの説明で変更理由を明確に記載

## 📄 ライセンス

この書籍は [MIT License](LICENSE) の下で公開されています。

### 利用について

- **個人学習**: 自由に利用可能
- **企業研修**: 社内研修での利用可能（要クレジット表記）
- **改変・再配布**: ライセンス条項に従って可能

## 📞 お問い合わせ

### 著者情報

**ITDO Inc.**（株式会社アイティードゥ）
- Website: https://itdo.jp
- Email: knowledge@itdo.jp
- GitHub: [@itdojp](https://github.com/itdojp)

### サポート

- **技術的な質問**: GitHubのIssuesをご利用ください
- **商用利用の相談**: メールにてお問い合わせください
- **研修・セミナー**: 企業向け研修サービスも提供しています

## 🔗 関連リソース

### ITDO Inc. の他の技術書籍

- [実践Linux インフラエンジニア入門](https://itdojp.github.io/linux-infra-textbook/)
- [理論計算機科学教科書](https://itdojp.github.io/theoretical-computer-science-textbook/)
- [Supabaseアーキテクチャパターン実践技術書](https://itdojp.github.io/supabase-architecture-patterns-book/)

### 学習リソース

- [IT Engineer Knowledge Architecture](https://itdojp.github.io/it-engineer-knowledge-architecture/) - ITエンジニア学習ロードマップ
- [ITDO Inc. 技術ブログ](https://itdo.jp/blog/)

---

**🌟 この書籍が役に立ったら、ぜひStarをお願いします！**

最新の更新情報は、このリポジトリをWatchしてください。