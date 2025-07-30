---
title: "トラブルシューティング"
layout: book
order: 11
---

# 第12章：トラブルシューティング

## 学習目標
この章を読み終える頃には、GitHubの使用中に発生する可能性のある一般的な問題を特定し、効果的に解決できるようになります。また、問題の予防方法や、困った時の適切な情報収集方法、コミュニティでのサポートの求め方を身につけ、自信を持ってGitHubを活用できるようになります。

---

## 12.1 よくある問題と解決方法

![よくあるエラーの概要]({{ '/assets/images/diagrams/chapter10/01_common_errors_overview.svg' | relative_url }})

### 認証関連の問題

![認証トラブルシューティング]({{ '/assets/images/diagrams/chapter10/02_authentication_troubleshooting.svg' | relative_url }})

**パスワード認証の廃止エラー**

**症状：**
```bash
remote: Support for password authentication was removed on August 13, 2021.
remote: Please use a personal access token instead. 
fatal: Authentication failed for 'https://github.com/user/repo.git/'
```

**原因：**
GitHubは2021年8月13日にHTTPS接続でのパスワード認証を廃止し、個人アクセストークン（PAT）の使用が必須になりました。

**解決方法：**

**1. 個人アクセストークンの作成**
```
1. GitHub.com → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token → Generate new token (classic)
4. 適切なスコープを選択（repo、user など）
5. Generate token → トークンをコピー（再表示不可）
```

**2. 認証情報の更新**
```bash
# Windows Credential Manager での更新
Control Panel → Credential Manager → Windows Credentials
→ Generic Credentials → git:https://github.com → Edit
→ Password フィールドにトークンを入力

# macOS Keychain での更新
Keychain Access → github.com → Edit
→ Password フィールドにトークンを入力

# Linux での一時的な設定
git config --global credential.helper cache
git clone https://github.com/user/repo.git
# Username: GitHubユーザー名
# Password: 個人アクセストークン
```

**SSH鍵認証のエラー**

**症状：**
```bash
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```

**診断コマンド：**
```bash
# SSH接続のテスト
ssh -T git@github.com

# 詳細なデバッグ情報
ssh -vT git@github.com

# SSH鍵の確認
ls -la ~/.ssh/
```

**解決方法：**

**1. SSH鍵の存在確認**
```bash
# 鍵ファイルの確認
ls ~/.ssh/id_*

# 公開鍵の内容確認
cat ~/.ssh/id_ed25519.pub
```

**2. SSH鍵の新規作成（必要な場合）**
```bash
# ED25519鍵の作成（推奨）
ssh-keygen -t ed25519 -C "your_email@example.com"

# RSA鍵の作成（古いシステム用）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

**3. GitHubへの公開鍵登録**
```bash
# 公開鍵をクリップボードにコピー
cat ~/.ssh/id_ed25519.pub | pbcopy  # macOS
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard  # Linux

# GitHub Settings → SSH and GPG keys → New SSH key
# Title: 識別しやすい名前
# Key: コピーした公開鍵を貼り付け
```

**4. SSH設定の確認**
```bash
# ~/.ssh/config ファイルの作成/編集
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
```

### Git操作のエラー

**マージコンフリクトの解決**

**症状：**
```bash
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt
Automatic merge failed; fix conflicts and then commit the result.
```

**段階的解決方法：**

**1. コンフリクトファイルの特定**
```bash
# コンフリクト状況の確認
git status

# コンフリクトファイルの内容確認
git diff
```

**2. コンフリクトマーカーの理解**
```
<<<<<<< HEAD
現在のブランチの内容
=======
マージ元ブランチの内容
>>>>>>> branch-name
```

**3. コンフリクトの解決**
```bash
# 手動編集後の確認
git add <resolved-file>

# すべてのコンフリクト解決後
git commit -m "Resolve merge conflicts"
```

**4. コンフリクト解決ツールの使用**
```bash
# VS Code での解決
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# マージツールの起動
git mergetool
```

**プッシュ時の拒否エラー**

**症状：**
```bash
! [rejected] main -> main (fetch first)
error: failed to push some refs to 'https://github.com/user/repo.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally.
```

**解決方法：**

**1. リモートの変更を取得**
```bash
# リモートブランチの確認
git remote -v
git branch -r

# リモートの変更を取得
git fetch origin

# リモートとローカルの差分確認
git log --oneline --graph --all
```

**2. マージまたはリベース**
```bash
# マージ方式（推奨・安全）
git pull origin main
# または
git merge origin/main

# リベース方式（履歴が綺麗）
git pull --rebase origin main
# または
git rebase origin/main
```

**3. 強制プッシュ（注意が必要）**
```bash
# 危険：他の人の作業を上書きする可能性
git push --force-with-lease origin main

# 非推奨：完全に強制（緊急時のみ）
git push --force origin main
```

### GitHub Pages関連の問題

![ネットワーク接続問題]({{ '/assets/images/diagrams/chapter10/03_network_connection_issues.svg' | relative_url }})

**404エラーの診断と解決**

**よくある原因と解決方法：**

**1. 設定確認**
```bash
# GitHub Pages設定の確認手順
1. Repository → Settings → Pages
2. Source: Deploy from a branch
3. Branch: main (または gh-pages)
4. Folder: / (root) または /docs
```

**2. ファイル構造の確認**
```
# 正しいファイル構造例
repository/
├── index.html          # トップページ
├── about/
│   └── index.html      # /about/ でアクセス可能
├── _config.yml         # Jekyll設定（オプション）
└── .nojekyll          # Jekyll処理を無効化（必要に応じて）
```

**3. Jekyll処理の問題**
```bash
# Jekyll処理を無効化
touch .nojekyll
git add .nojekyll
git commit -m "Disable Jekyll processing"
git push origin main
```

**4. ベースURLの設定**
```yaml
# _config.yml
baseurl: "/repository-name"
url: "https://username.github.io"
```

**ビルドエラーの対処**

**症状：GitHub Pages のビルドが失敗する**

**診断方法：**
```bash
# GitHub Actions のログ確認
Repository → Actions → Pages build and deployment

# ローカルでのJekyllテスト
gem install bundler jekyll
jekyll new test-site
cd test-site
bundle exec jekyll serve
```

**一般的な解決方法：**

![診断ツールの使用]({{ '/assets/images/diagrams/chapter10/06_diagnostic_tools_usage.svg' | relative_url }})

```yaml
# Gemfile の作成
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "jekyll-include-cache", group: :jekyll_plugins

# _config.yml の基本設定
title: Your Site Title
description: Site description
baseurl: "/your-repo-name"
url: "https://your-username.github.io"

plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag

markdown: kramdown
highlighter: rouge
```

---

## 12.2 パフォーマンス問題の対処

### 大きなファイルの管理

**Git LFS（Large File Storage）の導入**

**症状：大きなファイルのプッシュが失敗する**
```bash
remote: error: File large-file.zip is 123.45 MB; this exceeds GitHub's file size limit of 100.00 MB
```

**Git LFS のセットアップ：**

**1. Git LFS のインストール**
```bash
# macOS
brew install git-lfs

# Windows
winget install --id Git.Git-LFS

# Ubuntu/Debian
sudo apt install git-lfs

# 初期化
git lfs install
```

**2. 追跡するファイルタイプの指定**
```bash
# 特定の拡張子を追跡
git lfs track "*.psd"
git lfs track "*.zip"
git lfs track "*.pdf"

# 特定のディレクトリを追跡
git lfs track "assets/**"

# .gitattributes の確認
cat .gitattributes
```

**3. ファイルの追加とコミット**
```bash
# 通常通りの Git 操作
git add large-file.zip
git commit -m "Add large file with LFS"
git push origin main
```

**既存の大きなファイルをLFSに移行：**
```bash
# 既存ファイルをLFS化
git lfs migrate import --include="*.zip" --everything

# 履歴の再書き込み
git push --force-with-lease origin main
```

### リポジトリサイズの最適化

**リポジトリクリーンアップ**

**サイズ診断：**
```bash
# リポジトリサイズの確認
du -sh .git/

# 大きなオブジェクトの特定
git rev-list --objects --all | 
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' |
  awk '/^blob/ {print substr($0,6)}' |
  sort --numeric-sort --key=2 |
  tail -10
```

**履歴のクリーンアップ：**
```bash
# BFG Repo-Cleaner の使用（推奨）
# https://rtyley.github.io/bfg-repo-cleaner/

# 大きなファイルの削除（100MB以上）
java -jar bfg.jar --strip-blobs-bigger-than 100M .git

# 特定ファイルの削除
java -jar bfg.jar --delete-files "*.log" .git

# パスワードなどの機密情報の削除
java -jar bfg.jar --replace-text passwords.txt .git

# クリーンアップの実行
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

**Git filter-branch の使用：**
```bash
# 特定ファイルを履歴から完全削除
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/large-file.zip' \
  --prune-empty --tag-name-filter cat -- --all

# 強制プッシュ（チーム作業では要注意）
git push --all --force
git push --tags --force
```

### ネットワーク関連の問題

**Clone/Fetchの高速化**

**部分クローンの活用：**
```bash
# 最新コミットのみクローン
git clone --depth 1 https://github.com/user/repo.git

# 特定ブランチのみクローン
git clone --branch main --single-branch https://github.com/user/repo.git

# 大きなリポジトリの部分取得
git clone --filter=blob:none https://github.com/user/repo.git
```

**プロキシ設定：**
```bash
# HTTP プロキシの設定
git config --global http.proxy http://proxy.company.com:8080
git config --global https.proxy https://proxy.company.com:8080

# SOCKS プロキシの設定
git config --global http.proxy socks5://proxy.company.com:1080

# プロキシの削除
git config --global --unset http.proxy
git config --global --unset https.proxy
```

**接続タイムアウトの調整：**
```bash
# タイムアウト時間の延長
git config --global http.postBuffer 524288000
git config --global http.timeout 600
git config --global core.compression 0
```

---

## 12.3 デバッグ手法とログ分析

### Git の詳細ログ出力

**デバッグモードでの実行**

```bash
# Git 操作の詳細ログ
GIT_TRACE=1 git push origin main

# HTTP通信の詳細
GIT_CURL_VERBOSE=1 git push origin main

# パック/アンパック処理の詳細
GIT_TRACE_PACK_ACCESS=1 git push origin main

# 全般的なトレース
GIT_TRACE=2 GIT_CURL_VERBOSE=1 git push origin main
```

**ログファイルへの出力：**
```bash
# ログファイルに出力
GIT_TRACE=1 git push origin main 2>&1 | tee git-debug.log

# 複数の診断情報を収集
{
  echo "=== Git Version ==="
  git --version
  echo "=== Git Config ==="
  git config --list
  echo "=== Remote Info ==="
  git remote -v
  echo "=== Branch Info ==="
  git branch -a
  echo "=== Status ==="
  git status
} > diagnosis.txt
```

### GitHub API を使った診断

**API経由での情報取得：**

```bash
# GitHub CLI による診断
gh api user
gh api repos/owner/repo
gh api repos/owner/repo/branches

# curl による直接API呼び出し
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo

# リポジトリ統計の取得
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo/stats/contributors
```

**レート制限の確認：**
```bash
# 現在のレート制限状況
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit

# GitHub CLI での確認
gh api rate_limit
```

### 一般的な診断スクリプト

**包括的な診断スクリプト：**

```bash
#!/bin/bash
# github-diagnosis.sh - GitHub関連問題の診断スクリプト

echo "=== GitHub 診断レポート ==="
echo "実行日時: $(date)"
echo "実行者: $(whoami)"
echo "作業ディレクトリ: $(pwd)"
echo

echo "=== システム情報 ==="
echo "OS: $(uname -s)"
echo "Git バージョン: $(git --version)"
echo "GitHub CLI: $(gh --version 2>/dev/null || echo 'Not installed')"
echo

echo "=== Git 設定 ==="
echo "ユーザー名: $(git config user.name)"
echo "メールアドレス: $(git config user.email)"
echo "認証方法: $(git config credential.helper)"
echo

echo "=== リポジトリ情報 ==="
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Git リポジトリ: Yes"
  echo "現在のブランチ: $(git branch --show-current)"
  echo "リモート URL: $(git remote get-url origin 2>/dev/null || echo 'Not set')"
  echo "未コミット変更: $(git status --porcelain | wc -l) files"
  echo "未プッシュコミット: $(git log origin/$(git branch --show-current)..HEAD --oneline 2>/dev/null | wc -l) commits"
else
  echo "Git リポジトリ: No"
fi
echo

echo "=== ネットワーク診断 ==="
echo "GitHub 接続テスト:"
if curl -s --connect-timeout 5 https://github.com > /dev/null; then
  echo "  HTTP: OK"
else
  echo "  HTTP: Failed"
fi

if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
  echo "  SSH: OK"
else
  echo "  SSH: Failed or not configured"
fi

echo
echo "=== ディスク使用量 ==="
if [ -d .git ]; then
  echo "リポジトリサイズ: $(du -sh .git | cut -f1)"
fi
echo "利用可能領域: $(df -h . | tail -1 | awk '{print $4}')"

echo
echo "=== 推奨アクション ==="
if ! git config user.name >/dev/null; then
  echo "- Git ユーザー名を設定してください: git config --global user.name 'Your Name'"
fi
if ! git config user.email >/dev/null; then
  echo "- Git メールアドレスを設定してください: git config --global user.email 'your@email.com'"
fi
if ! ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
  echo "- SSH鍵認証を設定することを推奨します"
fi
```

---

## 12.4 コミュニティサポートの活用

### 効果的な質問の仕方

**Stack Overflow での質問**

**良い質問の構成要素：**

1. **明確なタイトル**
   - ❌ "Git doesn't work"
   - ✅ "Git push fails with 'Permission denied (publickey)' after SSH key setup"

2. **問題の詳細な説明**
```markdown
## 問題の概要
GitHub に SSH でプッシュしようとすると、認証エラーが発生します。

## 環境情報
- OS: macOS 13.0
- Git version: 2.39.0
- GitHub アカウント: 新規作成（1週間前）

## 実行したコマンドとエラー
```
git push origin main
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```

## 試したこと
1. SSH鍵を新規作成: `ssh-keygen -t ed25519 -C "my@email.com"`
2. GitHub に公開鍵を登録
3. SSH設定ファイルを作成

## 期待する結果
正常にプッシュできること

## 追加情報
`ssh -T git@github.com` の実行結果: [エラーメッセージ]
```

**3. 再現可能な最小例**
```bash
# 問題を再現する最小限のコマンドセット
git init
git remote add origin git@github.com:user/repo.git
git push origin main
```

### GitHub Discussions の活用

**適切な議論の場の選択：**

**GitHub Issues vs Discussions の使い分け**

**Issues を使うべき場合：**
- 明確なバグの報告
- 具体的な機能要求
- ドキュメントの誤り
- セキュリティ問題の報告

**Discussions を使うべき場合：**
- 使用方法の質問
- ベストプラクティスの相談
- アイデアの共有
- 一般的な議論

**効果的な Discussions の作成：**

```markdown
# カテゴリ: Q&A
## 質問: GitHub Actions で条件付きデプロイを実装する方法

### 背景
React アプリケーションで、mainブランチにプッシュされた場合のみ
本番環境にデプロイしたいと考えています。

### 現在のワークフロー
[現在の .github/workflows/deploy.yml の内容]

### 期待する動作
- mainブランチ: 本番環境へデプロイ
- develop ブランチ: ステージング環境へデプロイ
- その他のブランチ: デプロイしない

### 調査した内容
- GitHub Actions の条件付き実行について公式ドキュメントを確認
- if 文の使用について調べました

どなたかアドバイスをいただけませんでしょうか？
```

### オープンソースプロジェクトへの貢献

**Issue 報告のベストプラクティス：**

**1. 事前調査の実施**
```bash
# 既存の Issue を検索
GitHub の検索機能で関連キーワードを検索
is:issue is:open "authentication error"

# ドキュメントの確認
README.md、CONTRIBUTING.md、Wiki を確認
```

**2. 再現可能な例の提供**
```markdown
## Bug Report

### Description
[問題の明確な説明]

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Expected Behavior
[期待する動作]

### Actual Behavior
[実際の動作]

### Environment
- OS: [Operating System]
- Version: [Software Version]
- Browser: [Browser and Version, if applicable]

### Additional Context
[スクリーンショット、ログ、その他の関連情報]
```

**Pull Request の作成：**

```markdown
## Description
[変更内容の概要]

## Related Issues
Closes #123
Related to #456

## Changes Made
- [変更点1]
- [変更点2]
- [変更点3]

## Testing
- [ ] 既存テストが通ることを確認
- [ ] 新しいテストを追加（該当する場合）
- [ ] 手動テストを実施

## Screenshots (if applicable)
[変更前後のスクリーンショット]

## Checklist
- [ ] コードが PEP8/ESLint 等の規約に準拠
- [ ] ドキュメントを更新（該当する場合）
- [ ] CHANGELOG を更新（該当する場合）
```

### 学習リソースの活用

**公式ドキュメント**
- [GitHub Docs](https://docs.github.com/)
- [Git Documentation](https://git-scm.com/docs)
- [Pro Git Book](https://git-scm.com/book)

**コミュニティフォーラム**
- [GitHub Community](https://github.community/)
- [Stack Overflow - Git](https://stackoverflow.com/questions/tagged/git)
- [Reddit - r/git](https://www.reddit.com/r/git/)

**インタラクティブ学習**
- [Learn Git Branching](https://learngitbranching.js.org/)
- [GitHub Skills](https://skills.github.com/)
- [Katacoda Git Scenarios](https://www.katacoda.com/courses/git)

**ビデオ学習**
- [GitHub Training](https://lab.github.com/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)

---

## 12.5 予防策とメンテナンス

### 定期的なメンテナンス

**リポジトリの健全性チェック**

```bash
#!/bin/bash
# repository-health-check.sh

echo "=== リポジトリ健全性チェック ==="

# 1. Git の整合性チェック
echo "Git オブジェクトの整合性をチェック中..."
git fsck --full --strict

# 2. リポジトリサイズの確認
echo "リポジトリサイズ: $(du -sh .git | cut -f1)"

# 3. 未追跡ファイルの確認
untracked_files=$(git ls-files --others --exclude-standard | wc -l)
echo "未追跡ファイル数: $untracked_files"

# 4. 大きなファイルの検出
echo "大きなファイル（1MB以上）:"
find . -name .git -prune -o -type f -size +1M -print

# 5. ブランチの状況確認
echo "ローカルブランチ数: $(git branch | wc -l)"
echo "リモートブランチ数: $(git branch -r | wc -l)"

# 6. 古いブランチの検出
echo "30日以上更新されていないブランチ:"
git for-each-ref --format='%(refname:short) %(committerdate)' refs/heads | 
  awk '$2 < "'$(date -d '30 days ago' --iso-8601)'"'

# 7. コミット頻度の分析
echo "過去30日のコミット数: $(git log --since='30 days ago' --oneline | wc -l)"

# 8. リモート接続の確認
echo "リモート接続テスト:"
git ls-remote origin > /dev/null && echo "OK" || echo "Failed"
```

**自動バックアップの設定**

```bash
#!/bin/bash
# backup-repositories.sh

BACKUP_DIR="$HOME/github-backups/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"

# GitHub CLI を使用した全リポジトリの取得
gh repo list --limit 1000 --json name,sshUrl > repos.json

# 各リポジトリのクローンまたは更新
jq -r '.[] | "\(.name) \(.sshUrl)"' repos.json | while read name url; do
  if [ -d "$BACKUP_DIR/$name" ]; then
    echo "Updating $name..."
    cd "$BACKUP_DIR/$name"
    git fetch --all
    git pull
  else
    echo "Cloning $name..."
    git clone --mirror "$url" "$BACKUP_DIR/$name"
  fi
done

# 圧縮アーカイブの作成
tar -czf "$BACKUP_DIR.tar.gz" -C "$HOME/github-backups" "$(basename $BACKUP_DIR)"

# 古いバックアップの削除（30日以上前）
find "$HOME/github-backups" -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR.tar.gz"
```

### セキュリティ監査

**定期的なセキュリティチェック**

```bash
#!/bin/bash
# security-audit.sh

echo "=== GitHub セキュリティ監査 ==="

# 1. SSH鍵の確認
echo "SSH鍵の状況:"
ls -la ~/.ssh/id_* 2>/dev/null | while read perm links owner group size date time file; do
  if [[ $file == *".pub" ]]; then
    echo "公開鍵: $file (作成日: $date $time)"
  else
    echo "秘密鍵: $file (作成日: $date $time)"
    # 鍵の強度確認
    if ssh-keygen -l -f "$file" 2>/dev/null | grep -q "4096"; then
      echo "  強度: 4096bit (推奨)"
    elif ssh-keygen -l -f "$file" 2>/dev/null | grep -q "2048"; then
      echo "  強度: 2048bit (要更新検討)"
    fi
  fi
done

# 2. 個人アクセストークンの監査
echo
echo "GitHub CLI 認証状況:"
gh auth status

# 3. 危険なファイルの検索
echo
echo "機密情報を含む可能性のあるファイル:"
find . -name .git -prune -o -type f \( -name "*.env" -o -name "*secret*" -o -name "*password*" -o -name "id_rsa" \) -print

# 4. commit 履歴での機密情報チェック
echo
echo "コミット履歴での危険パターン検索:"
git log --all -p | grep -i "password\|secret\|key\|token" | head -5

# 5. 2FA 状況の確認
echo
echo "2要素認証の確認を推奨します:"
echo "https://github.com/settings/security にアクセスして確認してください"
```

### 設定の標準化

**チーム用の Git 設定テンプレート**

```bash
#!/bin/bash
# setup-git-config.sh - チーム標準設定スクリプト

echo "=== Git 設定セットアップ ==="

# 基本設定
read -p "お名前を入力してください: " name
read -p "メールアドレスを入力してください: " email

git config --global user.name "$name"
git config --global user.email "$email"

# 推奨設定
git config --global init.defaultBranch main
git config --global core.autocrlf input  # macOS/Linux
# git config --global core.autocrlf true   # Windows

git config --global pull.rebase false
git config --global push.default simple
git config --global core.editor "code --wait"

# セキュリティ設定
git config --global credential.helper cache
git config --global credential.cache.timeout 3600

# エイリアス設定
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.ps push
git config --global alias.pl pull
git config --global alias.lg "log --oneline --graph --all"

# .gitignore_global の設定
cat > ~/.gitignore_global << 'EOF'
# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Editor files
.vscode/
.idea/
*~
*.swp
*.swo

# Temporary files
*.tmp
*.temp
.cache/
EOF

git config --global core.excludesfile ~/.gitignore_global

echo "Git 設定が完了しました！"
git config --list --global
```

**pre-commit フックの設定**

```bash
#!/bin/sh
# .git/hooks/pre-commit - コミット前チェック

# シークレットスキャン
echo "シークレットのスキャン中..."
if grep -r --include="*.js" --include="*.py" --include="*.json" -E "(password|secret|key|token).*=" . | grep -v node_modules; then
    echo "⚠️  機密情報の可能性があるコードが見つかりました"
    echo "コミットを中止します。ファイルを確認してください。"
    exit 1
fi

# 大きなファイルのチェック
echo "ファイルサイズのチェック中..."
large_files=$(find . -name .git -prune -o -type f -size +10M -print)
if [ -n "$large_files" ]; then
    echo "⚠️  大きなファイルが見つかりました:"
    echo "$large_files"
    echo "Git LFS の使用を検討してください。"
    exit 1
fi

# コードフォーマットのチェック（Node.js プロジェクトの場合）
if [ -f package.json ] && [ -f .prettierrc ]; then
    echo "コードフォーマットのチェック中..."
    npx prettier --check . || exit 1
fi

echo "✅ プレコミットチェック完了"
exit 0
```

---

## まとめ

この章では、GitHubの使用中に発生する可能性のある問題の解決方法について学びました：

**よくある問題と解決方法**
- 認証関連エラーの診断と修正
- Git操作エラーの段階的解決
- GitHub Pages の問題対処
- 適切なデバッグ手法の習得

**パフォーマンス問題の対処**
- 大きなファイルのGit LFS管理
- リポジトリサイズの最適化
- ネットワーク問題の解決
- 効率的なクローン方法の活用

**デバッグとログ分析**
- Git の詳細ログ出力
- GitHub API を使った診断
- 包括的な診断スクリプト
- 問題の体系的な分析方法

**コミュニティサポートの活用**
- 効果的な質問の仕方
- Stack Overflow での問題解決
- GitHub Discussions の活用
- オープンソースプロジェクトへの貢献

**予防策とメンテナンス**
- 定期的なリポジトリ健全性チェック
- 自動バックアップの設定
- セキュリティ監査の実施
- チーム標準の設定管理

**問題解決の基本アプローチ**
- 問題の正確な特定
- 段階的な解決手順
- 適切な情報収集
- コミュニティリソースの活用
- 予防的なメンテナンス

これらの知識により、GitHubを使用中に問題が発生しても、冷静に対処し、効率的に解決できるようになりました。また、問題の発生を未然に防ぐための予防策も身につけることができました。

![予防ベストプラクティス]({{ '/assets/images/diagrams/chapter10/16_prevention_best_practices.svg' | relative_url }})

**理解度確認：**
□ 一般的なGitHub/Git問題を特定し、解決できる  
□ デバッグ手法を使って問題の原因を特定できる  
□ コミュニティサポートを効果的に活用できる  
□ 定期的なメンテナンスで問題を予防できる  
□ 自信を持ってGitHubの高度な機能を使用できる


