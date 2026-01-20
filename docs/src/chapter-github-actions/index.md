---
title: "第9章：GitHub Actions入門 - 自動化の基礎"
layout: book
order: 9
---

# 第9章：GitHub Actions入門 - 自動化の基礎

## 学習目標
この章を読み終える頃には、GitHub Actionsの基本概念を理解し、継続的インテグレーション（CI）や継続的デプロイメント（CD）の仕組みを活用できるようになります。また、自動テスト、自動ビルド、自動デプロイなどの基本的なワークフローを設定し、開発プロセスの効率化を図れるようになります。

---

> **注意：練習用リポジトリで試すこと**
>  
> この章で紹介するワークフローファイルや設定例は、まず自分専用の練習用リポジトリで試すことを前提としています。チームや組織で運用している本番リポジトリに適用する場合は、自組織の運用ルール・セキュリティポリシーに従い、必ず事前に合意を取ってから設定してください。また、シークレットやトークンには、学習目的のものを用い、本番用の認証情報は登録しないようにしてください。

## 9.1 GitHub Actionsとは

### 自動化の価値と必要性

**日常生活での自動化の例：**

**洗濯機の自動化**
- 手動：洗う→すすぐ→脱水を手作業で切り替え
- 自動：ボタン一つで全工程が自動実行
- メリット：時間節約、手間削減、品質の一定化

**銀行ATMの自動化**
- 手動：窓口で係員に依頼して手続き
- 自動：機械で24時間いつでも取引可能
- メリット：待ち時間削減、人的ミス防止、24時間対応

**ソフトウェア開発での自動化の重要性：**

**手動デプロイの問題点**
- ヒューマンエラーの発生
- 手順の複雑さと時間コスト
- 夜間や休日の作業負担
- テスト忘れや設定ミス

**自動化のメリット**
- 一貫性のある品質保証
- 24時間いつでも実行可能
- 人的ミスの削減
- 開発者の集中時間確保
- 迅速なフィードバック取得

### GitHub Actionsの基本概念

![PRブランチ保護]({{ '/assets/images/diagrams/chapter08/12_pr_branch_protection.svg' | relative_url }})

**GitHub Actions**は、GitHubが提供するCI/CD（継続的インテグレーション/継続的デプロイメント）プラットフォームです。ブランチ保護ルールと連携して、コード品質を維持しながら自動化を実現できます。

**主要コンポーネント：**

**ワークフロー（Workflow）**
- 自動化したい一連の処理の定義
- `.github/workflows/` フォルダにYAMLファイルで記述
- 例：「コードがプッシュされたらテストを実行」

**ジョブ（Job）**
- ワークフロー内の実行単位
- 複数のステップで構成
- 並列実行も可能

**ステップ（Step）**
- ジョブ内の個別の作業
- コマンド実行やアクション呼び出し

**アクション（Action）**
- 再利用可能な処理の単位
- GitHub Marketplaceで公開されている
- 独自作成も可能

**ランナー（Runner）**
- ワークフローを実行する仮想環境
- Ubuntu、Windows、macOSから選択
- セルフホステッドランナーも利用可能

### チームワークフロー管理

![PRチームワークフロー]({{ '/assets/images/diagrams/chapter08/13_pr_team_workflows.svg' | relative_url }})

チーム開発ではGitHub Actionsを使って、統一されたワークフローを構築することが重要です。各チームメンバーが一貫したプロセスで作業でき、品質と効率の両方を向上させることができます。

### CI/CDの基本的な流れ

**継続的インテグレーション（CI）**
```text
1. コード変更をコミット・プッシュ
   ↓
2. 自動テスト実行
   ↓
3. ビルドの実行
   ↓
4. 静的解析・品質チェック
   ↓
5. 結果の通知
```

**継続的デプロイメント（CD）**
```text
1. CIが成功
   ↓
2. ステージング環境へデプロイ
   ↓
3. 統合テスト実行
   ↓
4. プロダクション環境へデプロイ
   ↓
5. 監視とヘルスチェック
```

---

## 9.2 基本的なワークフローの作成

### 最初のワークフロー作成

**Step 1: ワークフローディレクトリの作成**

1. リポジトリのルートに `.github/workflows/` ディレクトリを作成
2. 「Create new file」から新しいファイルを作成
3. ファイル名：`ci.yml`（または任意の名前.yml）

**Step 2: 基本的なワークフロー定義**

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

# ワークフローの実行トリガー
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

# 実行するジョブ
jobs:
  test:
    # 実行環境の指定
    runs-on: ubuntu-latest
    
    # ジョブ内のステップ
    steps:
    # ソースコードのチェックアウト
    - name: Checkout code
      uses: actions/checkout@v4
    
    # Node.js環境のセットアップ
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    # 依存関係のインストール
    - name: Install dependencies
      run: npm ci
    
    # テストの実行
    - name: Run tests
      run: npm test
    
    # ビルドの実行
    - name: Build project
      run: npm run build
```

### ベストプラクティス総括

![PRベストプラクティス総括]({{ '/assets/images/diagrams/chapter08/14_pr_best_practices_summary.svg' | relative_url }})

GitHub ActionsとPull Requestを組み合わせた効果的な開発フローのベストプラクティスを統合し、高品質なソフトウェア開発を実現しましょう。これらのプラクティスを遵守することで、チーム全体の生産性とコード品質を大幅に向上させることができます。

### ワークフロー構文の詳細解説

**トリガー設定（on）**

```yaml
# プッシュ時に実行
on: push

# 特定ブランチのプッシュ時のみ
on:
  push:
    branches: [ main, develop ]

# プルリクエスト時も含める
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

# スケジュール実行（毎日午前2時）
on:
  schedule:
    - cron: '0 2 * * *'

# 手動実行を可能にする
on:
  workflow_dispatch:
```

**ジョブ設定（jobs）**

```yaml
jobs:
  # ジョブID
  test:
    name: Test and Build
    runs-on: ubuntu-latest
    
    # 環境変数の設定
    env:
      NODE_ENV: test
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
```

**マトリックス戦略（複数環境でのテスト）**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, windows-latest, macos-latest]
    
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
```

### 実践例：Webサイトの自動テスト

**プロジェクト構成例：**
```text
my-website/
├── index.html
├── style.css
├── script.js
├── package.json
├── tests/
│   ├── unit.test.js
│   └── integration.test.js
└── .github/
    └── workflows/
        └── test.yml
```

**テスト用ワークフロー：**
```yaml
# .github/workflows/test.yml
name: Website Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lint-and-test:
    name: Lint and Test
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    # ESLintによるコード品質チェック
    - name: Run ESLint
      run: npm run lint
    
    # HTMLの構文チェック
    - name: Validate HTML
      run: npm run html-validate
    
    # CSSの構文チェック
    - name: Validate CSS
      run: npm run stylelint
    
    # JavaScript単体テスト
    - name: Run unit tests
      run: npm run test:unit
    
    # E2Eテスト（ブラウザテスト）
    - name: Run E2E tests
      run: npm run test:e2e
      
    # テストカバレッジレポート
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        fail_ci_if_error: true
```

---

## 9.3 自動デプロイの設定

### GitHub Pagesへの自動デプロイ

**静的サイトのデプロイワークフロー：**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  # 手動実行も可能にする
  workflow_dispatch:

# GitHub Pagesへの書き込み権限を設定
permissions:
  contents: read
  pages: write
  id-token: write

# 同時実行の制限
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build website
      run: npm run build
    
    - name: Setup Pages
      uses: actions/configure-pages@v4
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'
  
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

### 環境変数とシークレットの管理

**シークレットの設定手順：**

1. リポジトリの「Settings」タブに移動
2. 左メニューから「Secrets and variables」→「Actions」を選択
3. 「New repository secret」をクリック
4. 名前と値を入力して保存

**ワークフローでのシークレット使用：**

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to server
      env:
        # シークレットの参照
        DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        API_TOKEN: ${{ secrets.API_TOKEN }}
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
      run: |
        echo "Deploying with secure credentials..."
        # デプロイスクリプトの実行
        ./deploy.sh
```

**環境ごとの設定管理：**

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
    - name: Deploy to staging
      env:
        API_URL: ${{ vars.STAGING_API_URL }}
        DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}
      run: npm run deploy:staging
  
  deploy-production:
    runs-on: ubuntu-latest
    environment: production
    needs: deploy-staging
    # プロダクションは手動承認が必要
    steps:
    - name: Deploy to production
      env:
        API_URL: ${{ vars.PRODUCTION_API_URL }}
        DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
      run: npm run deploy:production
```

### マルチステージデプロイメント

**段階的デプロイメントの設計：**

```yaml
name: Multi-stage Deployment

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Run tests
      run: |
        npm ci
        npm test
  
  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    environment: staging
    steps:
    - name: Deploy to staging
      run: |
        echo "Deploying to staging..."
        # ステージング環境へのデプロイ
    
    - name: Run smoke tests
      run: |
        npm run test:smoke -- --env=staging
  
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    # プロダクション環境は手動承認が必要
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # プロダクション環境へのデプロイ
    
    - name: Run health checks
      run: |
        npm run test:health -- --env=production
    
    - name: Notify team
      if: success()
      run: |
        # Slackやメールで通知
        curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
          -H 'Content-type: application/json' \
          --data '{"text":"✅ Production deployment successful!"}'
```

---

## 9.4 高度なワークフロー機能

### 条件分岐とエラーハンドリング

**条件付き実行：**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    # PRの場合のみ実行
    - name: Run expensive tests
      if: github.event_name == 'pull_request'
      run: npm run test:expensive
    
    # mainブランチの場合のみ実行
    - name: Deploy
      if: github.ref == 'refs/heads/main' && github.event_name == 'push'
      run: npm run deploy
    
    # ファイルが変更された場合のみ実行
    - name: Build docs
      if: contains(github.event.head_commit.message, '[docs]')
      run: npm run build:docs
```

**エラーハンドリング：**

```yaml
jobs:
  build-with-error-handling:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Build application
      id: build
      run: npm run build
      # このステップが失敗しても続行
      continue-on-error: true
    
    - name: Handle build failure
      if: steps.build.outcome == 'failure'
      run: |
        echo "Build failed, sending notification..."
        # エラー通知の送信
    
    - name: Cleanup on failure
      if: failure()
      run: |
        echo "Cleaning up resources..."
        # リソースのクリーンアップ
    
    - name: Always run cleanup
      if: always()
      run: |
        echo "This always runs"
        # 必ず実行したい処理
```

### カスタムアクションの作成

**JavaScript アクションの作成例：**

```javascript
// .github/actions/notify/index.js
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // 入力パラメータの取得
    const message = core.getInput('message');
    const webhookUrl = core.getInput('webhook-url');
    
    // GitHub コンテキストの取得
    const { context } = github;
    const { owner, repo } = context.repo;
    
    // 通知メッセージの作成
    const payload = {
      text: `${message} - ${owner}/${repo}`,
      repository: `${owner}/${repo}`,
      commit: context.sha.substring(0, 7)
    };
    
    // Webhook送信
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      core.setOutput('status', 'success');
    } else {
      core.setFailed('Failed to send notification');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
```

**アクション定義ファイル：**

```yaml
# .github/actions/notify/action.yml
name: 'Send Notification'
description: 'Send notification to webhook URL'
inputs:
  message:
    description: 'Notification message'
    required: true
  webhook-url:
    description: 'Webhook URL'
    required: true
outputs:
  status:
    description: 'Notification status'
runs:
  using: 'node20'
  main: 'index.js'
```

**カスタムアクションの使用：**

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy application
      run: npm run deploy
    
    - name: Send success notification
      uses: ./.github/actions/notify
      with:
        message: 'Deployment completed successfully'
        webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### ワークフローの最適化

**キャッシュの活用：**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    # Node.jsの依存関係キャッシュ
    - name: Cache node modules
      uses: actions/cache@v3
      with:
        path: ~/.npm
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-node-
    
    # ビルド成果物のキャッシュ
    - name: Cache build output
      uses: actions/cache@v3
      with:
        path: ./dist
        key: build-${{ github.sha }}
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
```

**並列実行の活用：**

```yaml
jobs:
  # 並列で実行されるジョブ
  lint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm ci && npm run lint
  
  test-unit:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm ci && npm run test:unit
  
  test-integration:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm ci && npm run test:integration
  
  # 上記のジョブが全て成功したら実行
  deploy:
    needs: [lint, test-unit, test-integration]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm ci && npm run deploy
```

---

## まとめ

この章では、GitHub Actionsを使った自動化について学びました：

**GitHub Actionsの基礎**
- CI/CDの概念と自動化の価値
- ワークフロー、ジョブ、ステップの構造
- YAMLファイルでの設定記述

**基本的なワークフロー作成**
- トリガー設定とジョブ定義
- 自動テストとビルドの実装
- マトリックス戦略による複数環境テスト

**自動デプロイメント**
- GitHub Pagesへのデプロイ設定
- 環境変数とシークレットの管理
- マルチステージデプロイメント

**高度な機能**
- 条件分岐とエラーハンドリング
- カスタムアクションの作成
- キャッシュと並列実行による最適化

**開発プロセスの改善効果**
- 品質保証の自動化
- デプロイメントの安全性向上
- 開発者の生産性向上
- チーム全体の効率化

次の章では、セキュリティ対策について学び、安全なGitHub利用方法を身につけます。

![PRベストプラクティスサマリー]({{ '/assets/images/diagrams/chapter08/14_pr_best_practices_summary.svg' | relative_url }})

**理解度確認：**
□ GitHub Actionsの基本概念を理解している  
□ 基本的なワークフローを作成・設定できる  
□ 自動テストとビルドを実装できる  
□ 自動デプロイメントを設定できる  
□ シークレットや環境変数を適切に管理できる
