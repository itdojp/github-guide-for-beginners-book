---
title: "第9章：GitHub Actions入門 - 自動化の基礎"
layout: book
order: 9
---

# 第9章：GitHub Actions入門 - 自動化の基礎

## 学習目標

この章を読み終える頃には、次のことができるようになります。

- GitHub Actions の基本用語（workflow / job / step、trigger、runner、action）を説明できる
- `.github/workflows/ci.yml` を作成し、push / Pull Request で CI が自動実行される
- Actions の実行ログを確認し、失敗箇所の切り分けができる
- Secrets を「入れてよい/入れてはいけない」ケースを理解し、最低限の事故防止ができる

---

> **注意：まずは練習用リポジトリで試すこと**
>
> この章の手順は、まず個人の練習用リポジトリで動かしてから、本番リポジトリへ適用してください。Secrets/トークンは実キーではなくダミーを使い、ログへ出力しないでください。

## 9.1 GitHub Actionsとは（最短理解）

GitHub Actions は、GitHub 上で自動処理を実行する仕組みです。よく CI/CD（継続的インテグレーション/継続的デプロイ）として紹介されますが、この章では「まず CI を動かす」ことに絞ります。

### CI と CD（最小の理解）

- **CI**: 変更が入ったら、自動でテストや静的解析を回して、早くフィードバックを返す
- **CD**: CI が成功した成果物を、ステージング/本番へ自動デプロイする（本章では深掘りしない）

### 用語の最小セット

- **workflow**: 自動化の一連の流れ（YAMLファイル 1 つに相当）
- **job**: workflow の中の実行単位（複数の step からなる）
- **step**: job の中の 1 手順（コマンド実行や action 呼び出し）
- **trigger**: workflow を起動する条件（push / pull_request / workflow_dispatch など）
- **runner**: job を実行する環境（例: `ubuntu-latest`）
- **action**: 再利用可能な処理（例: `actions/checkout`）

### どこに置くか（ファイルパス）

workflow は、リポジトリ直下の `.github/workflows/` に YAML として配置します（例: `.github/workflows/ci.yml`）。

---

## 9.2 最短で動かす：Hello Workflow

最初は「動いた」という成功体験を作ります。次の workflow を `.github/workflows/hello.yml` として追加してください。

```yaml
name: Hello

on:
  workflow_dispatch:
  push:
    branches: ["main"]

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - name: Say hello
        run: echo "hello actions"
```

### 動作確認（Actions タブ）

1. 変更を commit して GitHub へ push します（main ブランチ）
2. リポジトリの **Actions** タブを開きます
3. 実行された workflow を開き、ログに `hello actions` が出ていれば成功です

失敗した場合は、ログの赤い `×` が付いた step が「失敗箇所」です。まずはそこから読みます。

---

## 9.3 最短CI：push / Pull Request でテストを回す

次に「push / Pull Request のたびにテストを回す」最小構成を作ります。ここでは Node.js を例にしますが、他言語でも考え方は同じです。

このリポジトリでは、コピペで試せる最短サンプルを `examples/github-actions-min/` に同梱しています（`ci.yml` / `manual.yml` / 最小 `package.json`）。

`.github/workflows/ci.yml` を作成し、次の内容を貼り付けます。

```yaml
name: CI

on:
  push:
    branches: ["main"]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: "20"
          cache: "npm"

      - name: Install
        run: npm ci

      - name: Test
        run: npm test
```

### `uses:` と `run:` の違い

- `uses:` は「既製品（action）を呼び出す」指定です（例: `actions/checkout`）
- `run:` は「シェルコマンドを実行する」指定です（例: `npm ci`）

### `GITHUB_TOKEN` と権限の最小化

workflow の各 job では、GitHub が一時的な `GITHUB_TOKEN` を自動発行します。通常の CI では、まず読み取り中心の権限から始め、必要な job だけに追加権限を与えます。

```yaml
on:
  pull_request:

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: npm test
```

fork からの Pull Request を検証する基本形は、`pull_request` と `contents: read` の組み合わせです。
public repository の fork PR では、既定で `GITHUB_TOKEN` は read-only になり、通常の repository secrets は渡りません。
private repository では管理設定により write token や secrets を送れるため、repository settings も確認してください。

Pull Request へコメントを書く、Pages へデプロイする、packages を発行するなどの操作では追加権限が必要です。その場合も、workflow 全体へ広い権限を付けるのではなく、対象 job に必要な権限だけを付与します。

### つまずきやすい点（npm）

- `npm ci` は `package-lock.json` がある前提です。ない場合は `npm install` を使うか、ロックファイルを作成してください。
- `npm test` はプロジェクトによって内容が異なります。手元で `npm test` が動く状態にしてから CI に載せると失敗しにくくなります。

---

## 9.4 手動実行（workflow_dispatch）の最小例

次は、Actions タブから手動実行できる workflow の最小例です。`.github/workflows/manual.yml` を作成し、次の内容を貼り付けます。

```yaml
name: Manual

on:
  workflow_dispatch:
    inputs:
      message:
        description: "Message to print"
        required: true
        default: "hello"

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - name: Print input
        env:
          MESSAGE: ${{ inputs.message }}
        run: |
          printf '%s\n' "message=$MESSAGE"
```

Actions タブから workflow を選び、**Run workflow** を押して入力を変えて実行すると、ログに反映されます。

---

## 9.5 つまずきポイント（最短）

### YAML のインデント

YAML はインデント（空白）に敏感です。コピペ後に動かない場合は、まずインデントが崩れていないかを確認します。

### `actions/checkout` を忘れる

リポジトリのファイルを使う job では、最初に `actions/checkout` が必要です。これがないと、`package.json が無い` などのエラーになりやすいです。

### Secrets とトリガー（事故防止）

- **Secrets をログに出さない**: `echo` や `set -x`（シェルのデバッグ出力）で漏洩しやすくなります。
- **fork からの Pull Request**: 基本は`pull_request`とread-onlyのminimum `permissions`です。public repositoryでは通常Secretsを渡しません。
- **`pull_request_target`の境界**: base repositoryのdefault branchにあるworkflowをbase branch contextで実行し、base側の`GITHUB_TOKEN`とrepository / organization secretsへ到達できます。
- **fork承認を安全装置にしない**: public repositoryの`pull_request_target`はfork workflowの承認設定に依存せずbase側で実行されるため、初回contributor承認で停止すると期待してはいけません。
- **untrusted head codeを実行しない**: `pull_request_target`で`github.event.pull_request.head.sha`をcheckoutし、build、test、install script、任意commandを実行してはいけません。label付与などmetadataだけを扱う場合も、PR codeをcheckout/実行しないことを確認します。
- **AI/外部サービスへログを貼らない**: 失敗ログにはトークン、URL、内部パス、顧客情報が混ざることがあります。共有前にマスクし、必要最小限だけ貼り付けます。

公式の境界は、[Securely using `pull_request_target`](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)、[Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)、[Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)、[Managing GitHub Actions settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository)で確認します。

### privileged writeが必要な場合の2-stage設計

1. 第1段は`pull_request`で実行し、`contents: read`、Secretsなしでuntrusted PR codeを検証します。
2. 第2段は`workflow_run`または手動承認で起動し、PR codeをcheckout/実行せず、write操作だけを行います。
3. 前段artifactを使う場合はuntrusted dataとして扱い、schema、size、対象PR、producer run、digestを検証します。展開先はworkspaceではなく`runner.temp`配下に限定します。
4. 後段ではartifact内のscriptやbinaryを実行せず、検証済みのmetadataだけをAPI writeへ渡します。

`workflow_run`は自動的に安全になる仕組みではありません。
後段でPR codeや未検証artifactを実行すると、低権限とprivileged処理を分けた意味が失われます。

### ログの読み方（最短）

1. Actions タブ → 対象 workflow → 対象 run を開く
2. 赤い `×` が付いた step を開く
3. まず「どのコマンドが失敗したか」を見て、ローカルで再現できる形に切り出します

---

## まとめ

この章では、GitHub Actions を「最短で動かす」ための最小セットを扱いました。

- workflow/job/step、trigger、runner、action の役割
- `workflow_dispatch` で手動実行してログを見る
- push / Pull Request をトリガーにして CI（`npm ci` → `npm test`）を回す
- Secrets はログに出さず、危険なトリガーを安易に使わない

次の章では、セキュリティ対策について学び、安全なGitHub利用方法を身につけます。

---

## 次の一手（最短の次にやること）

最短で動いたら、次は「プロジェクトに必要なチェックだけを追加していく」フェーズです。

例:

1. `npm test` に加えて `npm run lint` を回す
2. Pull Request の必須チェックに CI を設定する（ブランチ保護）
3. Secrets を使う場合は、対象ブランチ/イベントとログ出力の扱いを見直す（最小権限）
4. fork PRは`pull_request`で検証し、writeが必要ならPR codeを実行しない2-stageへ分離する

**理解度確認：**
□ GitHub Actionsの基本概念を理解している  
□ 基本的なワークフローを作成・設定できる  
□ Actions のログを見て失敗箇所を特定できる  
□ Secrets の事故パターンを理解している
