# GitHub Actions 最短入門サンプル（github-actions-min）

このサンプルは「最小CI」と「手動実行（workflow_dispatch）」を最短で体験するための雛形です。

## 含まれるもの

- `.github/workflows/ci.yml`：push（main）/ Pull Request で `npm ci` → `npm test`
- `.github/workflows/manual.yml`：`workflow_dispatch` の入力をログへ出力
- `package.json` / `package-lock.json`：`npm ci` が通る最小 Node.js プロジェクト

## 使い方（最短）

1. GitHub 上で新規リポジトリを作成（main ブランチ）
2. このフォルダの内容を、リポジトリ直下へコピー
3. commit & push
4. Actions タブで CI が実行されることを確認
5. Actions → Manual → Run workflow で手動実行を確認

## 調整ポイント

- Node.js 以外の場合は `actions/setup-node` を該当言語のセットアップに置き換えます
- `npm test` を自プロジェクトのテストコマンドに置き換えます

注意: Secrets/トークンなどの機密情報をこのサンプルへ書き込まないでください。
