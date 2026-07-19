---
title: "第10章：セキュリティのベストプラクティス"
layout: book
order: 10
---

# 第10章：セキュリティのベストプラクティス

安全なコード管理と機密情報の保護

## 学習目標

この章を読み終える頃には、GitHubでの安全なコード管理方法を理解し、機密情報の保護、アクセス権限の適切な設定、セキュリティ脅威への対策ができるようになります。

---

## 機密情報の管理

### APIキーとパスワードの保護

**絶対にコミットしてはいけない情報：**
- APIキー・トークン
- データベース接続文字列
- パスワード・秘密鍵
- 個人情報

### AI/エージェント利用時の注意（機密・権限・Secrets）

生成AIや自動化エージェントを使う場合は、「入力した情報が外部に出る可能性がある」前提で扱います。Issue / プルリクエスト（PR） / チャットに、機密情報や個人情報を貼り付けないでください。

**貼ってはいけない情報の例**
- トークン（例：`ghp_...` / `github_pat_...` など）
- 秘密鍵（例：`-----BEGIN ... PRIVATE KEY-----`）
- 顧客情報・個人情報（氏名、メールアドレス、請求情報など）
- 認証に使える情報（ワンタイムURL、署名付きURLなど）

#### GitHub Actions Secrets と環境変数（基礎）

- Secrets は GitHub 上で保管し、ワークフローから参照します（例：リポジトリの Settings → Secrets and variables → Actions）。
- ワークフローでは `${{ secrets.API_KEY }}` のように参照し、ソースコードに埋め込みません。
- ローカル開発で `.env` を使う場合も、`.gitignore` に入れてコミットしない運用が基本です。

```yaml
# .github/workflows/example.yml（一例）
jobs:
  example-job:
    runs-on: ubuntu-latest
    steps:
      - name: Use API key
        env: # 必要なステップにだけ Secrets を渡す
          API_KEY: ${{ secrets.API_KEY }}
        run: echo "APIキーを使用します"
```

#### PR/Issue でのログの扱い

- 原則として、ログは「必要最小限」を共有します（再現手順とエラー要約を優先）。
- ログを貼る場合は、値を `***` に置換し、機密情報が含まれないことを確認します。
- GitHub が一部の秘密情報をマスクしても、すべてを防げるわけではありません。最終確認は人間が行います。

### .gitignoreファイルの活用

```gitignore
# 環境変数ファイル
.env
.env.local
.env.production

# 設定ファイル
config/database.yml
config/secrets.yml

# ログファイル
*.log
logs/

# 一時ファイル
*.tmp
*.swp
```

### 環境変数の使用

**悪い例：**
```javascript
const apiKey = "sk-1234567890abcdef"; // ❌ ハードコーディング
```

**良い例：**
```javascript
const apiKey = process.env.API_KEY; // ✅ 環境変数から取得
```

## アクセス権限の管理

### リポジトリの可視性設定

**Public vs Private の選択基準：**

**Publicにすべき場合：**
- オープンソースプロジェクト
- 学習用・デモ用コード
- 公開したいポートフォリオ

**Privateにすべき場合：**
- 商用プロジェクト
- 機密情報を含むコード
- 開発中の未完成プロジェクト

### チームメンバーの権限設定

**権限レベル：**
1. **Read（読み取り）**: コードの閲覧のみ
2. **Write（書き込み）**: プッシュ・プルリクエスト可能
3. **Admin（管理者）**: 設定変更・メンバー管理可能

### 権限最小化（わからない場合は上げない）

権限は高いほど、事故が起きたときの影響が大きくなります。判断に迷う場合は、まず低い権限で運用し、必要になった時点で段階的に上げる方針が安全です。

- リポジトリ権限は Read/Write/Admin の順に強くなります。最初は Read から検討します。
- Token は必要なスコープだけ付与し、不要になったら削除します。
- GitHub Actions の Secrets は、リポジトリや Environment などのスコープを適切に分けて管理します。
- ワークフロー内では、その Secrets を本当に必要なジョブ/ステップにだけ `env` などで渡し、露出範囲を最小限にします。

## セキュリティ機能の活用

### 二要素認証（2FA）の設定

**設定手順：**
1. GitHub アカウントの Settings
2. Password and authentication
3. Two-factor authentication
4. 認証アプリまたはSMSで設定

### Personal Access Token

**使用場面：**

- API経由でのGitHub操作
- CI/CDパイプライン
- 自動化スクリプト

**選び方：**

| 種類 | 使う場面 | 注意点 |
| --- | --- | --- |
| Fine-grained personal access token | 特定リポジトリや特定権限だけで足りる操作 | まずはこちらを検討する |
| Personal access token (classic) | fine-grained token が未対応の操作や古いツール連携 | 権限範囲が広くなりやすいため、期限と権限を厳しく絞る |

**作成時の最小ルール：**

1. Settings → Developer settings → Personal access tokens を開く
2. 可能なら fine-grained token を選び、対象リポジトリを限定する
3. 必要な権限だけを選ぶ（例: Pull requests は read/write、Contents は read など）
4. 有効期限を設定し、使わなくなった token は削除する
5. token を Git 管理対象のファイル、ログ、Issue、PR、AI/外部サービスに貼り付けない
6. ローカルの `.env` で扱う場合も `.gitignore` の対象にし、共有・アップロードしない

## セキュリティ脅威への対策

### 依存関係の脆弱性チェック

GitHubの自動セキュリティアラートには、次のものがあります。
- Dependabot alerts
- Security advisories
- 依存関係の自動更新

### コードスキャニングとシークレットスキャン

GitHub のセキュリティ機能は、プランやリポジトリ種別によって利用条件が変わります。本文では細かな課金条件を固定的に覚えるのではなく、公式ドキュメントで現在の利用条件を確認する前提にします。

**代表的な機能：**

- CodeQL analysis / code scanning
- Secret scanning alerts
- Push protection
- Dependabot alerts / Dependabot security updates
- Dependency review

**初心者が最初に確認すること：**

- Public リポジトリでも secret scanning alerts の対象になる場合があるため、「公開だから検出されるはず」ではなく、Security タブで有効状態と alert を確認する。
- secret scanning が検出しても、漏えいした token は自動的に安全になるわけではない。必ず token を失効し、再発防止を記録する。
- 検出対象外の形式や独自秘密情報もあるため、`.gitignore`、環境変数、review、CI を併用する。

## セキュリティインシデントへの対応

### 機密情報の誤コミット時の対処

**即座に実行すべきこと：**
1. **APIキーの無効化**: 漏洩したキーを即座に無効化
2. **履歴からの削除**: `git filter-branch`または`BFG Repo-Cleaner`
3. **新しいキーの生成**: 安全な新しいキーに更新

**履歴からの削除例：**
```bash
# BFG Repo-Cleanerを使用
java -jar bfg.jar --delete-files apikey.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### セキュリティ監査の実施

**定期的にチェックすべき項目：**
- [ ] アクセス権限の見直し
- [ ] 古いPersonal Access Tokenの削除
- [ ] 不要なデプロイキーの削除
- [ ] 依存関係の脆弱性確認

## ベストプラクティス

### 開発フロー

1. **branch protection rule / rulesets**: mainブランチへの直接プッシュを禁止し、branch protection rule と rulesets を使い分ける。branch protection rule は 1 つの branch に 1 件しか同時適用されない一方、rulesets は branch/tag を対象に複数重ねられるため、適用 model に応じて使い分ける
2. **プルリクエストレビュー**: 必須レビュー、最新 push の再レビュー、conversation resolution を設定する
3. **ステータスチェック**: CI/CDでのテスト、lint、セキュリティチェックを必須化する
4. **merge 後確認**: main の Actions、Pages、リリース先を確認し、Issue に証跡を残す

### branch protection rule / rulesets 運用の最小原則

- bypass 権限は最小化します。ruleset では `For pull requests only` を選ぶと、直接 push を許可せず、Pull Request と audit log に変更の軌跡を残せます。
- この `For pull requests only` は ruleset の bypass 設定です。branch protection rule 側では bypass list に actor を追加できるのは organization 所有 repository の場合だけなので、両者を混同しないでください。
- branch protection rule は特定 branch 名または `fnmatch` pattern を対象にできますが、同じ branch に同時適用される rule は 1 件だけです。specific branch rule が優先され、同じ specific branch への rule が複数ある場合は古い rule が優先されます。`*` などを含む wildcard rule 同士も古い rule が優先されます。
- rulesets は branch または tag を対象にでき、複数の ruleset と branch protection rule が layer されます。同じ rule が複数ある場合は most restrictive が適用されます。
- active ruleset は read 権限で確認できます。`/rules` や branch 一覧で対象 ruleset を確認し、Pull Request の merge box に rule が表示された場合は、merge を妨げている条件を確認します。
- Free / Pro / Team 向けの一般 docs では ruleset の status として `Active` と `Disabled` が案内されています。Enterprise Cloud 向け docs では `Evaluate` も案内されており、利用できる環境では Rule Insights で非強制の評価結果を確認してから `Active` に進めます。
- **本書の推奨**: 個人学習用 repository では branch protection や rulesets は任意とし、team operation では必須レビューと必須 status checks を含む最低限の merge gate として利用します。

**GitHub Docs（2026-07-19確認）**
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Creating rulesets for a repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)
- [Managing rulesets for a repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/managing-rulesets-for-a-repository)

### チームでのセキュリティ文化

**セキュリティ教育：**
- 新メンバーへのセキュリティ研修
- 定期的なセキュリティ意識向上
- インシデント共有と学習

**コードレビューでの観点：**
- ハードコーディングされた機密情報
- 入力値検証の不備
- 認証・認可の実装確認

---

## まとめ

セキュリティは「後で考える」ものではなく、開発の最初から組み込むべき重要な要素です。この章で学んだ内容を実践し、安全なコード管理習慣を身につけましょう。

**重要なポイント：**

- 機密情報は絶対にコミットしない
- token は fine-grained、最小権限、期限付き、対象リポジトリ限定を基本にする
- AI/外部サービスへログやコードを貼る前に、秘密情報・個人情報・社外秘情報を除去する
- AI/エージェント利用時も、機密情報・個人情報を貼らない（ログ貼付を含む）
- 適切なアクセス権限の設定
- 二要素認証の有効化
- 定期的なセキュリティ監査

次の章では、これらのセキュリティ知識を活用した実践的なプロジェクト運用方法について学習します。
