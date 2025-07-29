---
title: "付録A Gitコマンドリファレンス"
layout: book
---

# 付録A Gitコマンドリファレンス

このページでは、Git の基本的で重要なコマンドをカテゴリ別に整理して紹介します。

## 基本操作

### リポジトリの初期化・複製

```bash
# 新しいリポジトリを初期化
git init

# 既存のリポジトリを複製
git clone <repository-url>

# 特定のブランチを複製
git clone -b <branch-name> <repository-url>
```

### ファイルの追加・コミット

```bash
# ファイルをステージングエリアに追加
git add <file-name>
git add .  # すべての変更をステージング

# コミットの作成
git commit -m "コミットメッセージ"

# ステージングとコミットを同時に実行
git commit -am "コミットメッセージ"
```

## ブランチ操作

### ブランチ管理

```bash
# ブランチ一覧を表示
git branch
git branch -a  # リモートブランチも含める

# 新しいブランチを作成
git branch <branch-name>

# ブランチを作成して切り替え
git checkout -b <branch-name>
git switch -c <branch-name>  # Git 2.23以降

# ブランチを切り替え
git checkout <branch-name>
git switch <branch-name>  # Git 2.23以降

# ブランチを削除
git branch -d <branch-name>  # マージ済みブランチ
git branch -D <branch-name>  # 強制削除
```

### マージ・リベース

```bash
# ブランチをマージ
git merge <branch-name>

# リベースの実行
git rebase <base-branch>

# インタラクティブリベース
git rebase -i HEAD~3  # 直近3つのコミット
```

## リモート操作

### リモートリポジトリ管理

```bash
# リモートリポジトリを追加
git remote add origin <repository-url>

# リモートリポジトリ一覧を表示
git remote -v

# リモートから変更を取得
git fetch
git fetch origin

# リモートから変更を取得してマージ
git pull
git pull origin <branch-name>

# リモートに変更をプッシュ
git push
git push origin <branch-name>

# 初回プッシュ時の追跡設定
git push -u origin <branch-name>
```

## 履歴・状態確認

### ログ・状態表示

```bash
# コミット履歴を表示
git log
git log --oneline  # 1行で表示
git log --graph    # グラフ表示

# 作業ツリーの状態を表示
git status

# 変更差分を表示
git diff
git diff --staged   # ステージング済みの差分
git diff HEAD~1    # 1つ前のコミットとの差分
```

### ファイル履歴

```bash
# ファイルの変更履歴を表示
git log --follow <file-name>

# ファイルの各行の最終更新者を表示
git blame <file-name>

# 特定のコミットの詳細を表示
git show <commit-hash>
```

## 変更の取り消し・修正

### 作業ツリーの変更取り消し

```bash
# ファイルの変更を取り消し
git checkout -- <file-name>
git restore <file-name>  # Git 2.23以降

# ステージングを取り消し
git reset HEAD <file-name>
git restore --staged <file-name>  # Git 2.23以降
```

### コミットの修正・取り消し

```bash
# 直前のコミットを修正
git commit --amend

# コミットを取り消し（履歴は残す）
git revert <commit-hash>

# コミットを取り消し（履歴を削除）
git reset --soft HEAD~1   # コミットのみ取り消し
git reset --mixed HEAD~1  # コミット+ステージング取り消し
git reset --hard HEAD~1   # すべての変更を取り消し
```

## タグ操作

```bash
# タグ一覧を表示
git tag

# 軽量タグを作成
git tag <tag-name>

# 注釈付きタグを作成
git tag -a <tag-name> -m "タグメッセージ"

# タグをリモートにプッシュ
git push origin <tag-name>
git push origin --tags  # すべてのタグ

# タグを削除
git tag -d <tag-name>
git push origin --delete <tag-name>  # リモートから削除
```

## 設定管理

```bash
# ユーザー設定
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 設定の確認
git config --list
git config user.name

# エディタの設定
git config --global core.editor "code --wait"  # VS Code

# 改行コードの設定
git config --global core.autocrlf true   # Windows
git config --global core.autocrlf input  # Mac/Linux
```

## 便利なコマンド

### ショートカット設定

```bash
# よく使うコマンドのエイリアス設定
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.lg "log --oneline --graph --all"
```

### 一時保存

```bash
# 変更を一時保存
git stash

# 一時保存リストを表示
git stash list

# 一時保存を復元
git stash pop     # 最新の保存を復元して削除
git stash apply   # 復元（保存は残す）

# 特定の一時保存を復元
git stash apply stash@{0}

# 一時保存を削除
git stash drop stash@{0}
git stash clear  # すべて削除
```

## トラブルシューティング

### よくある問題と解決方法

```bash
# マージコンフリクトが発生した場合
git status  # コンフリクトファイルを確認
# ファイルを手動編集してコンフリクトを解決
git add <resolved-file>
git commit

# 間違ったブランチにコミットした場合
git log --oneline  # コミットハッシュを確認
git reset --soft HEAD~1  # コミットを取り消し
git stash  # 変更を一時保存
git checkout <correct-branch>
git stash pop  # 変更を復元
git add . && git commit -m "正しいメッセージ"

# リモートブランチが削除された場合
git remote prune origin
git branch -vv  # 追跡ブランチの状態確認
```

## 参考リンク

- [Pro Git Book](https://git-scm.com/book/ja/v2)
- [Git公式リファレンス](https://git-scm.com/docs)
- [GitHub Git チートシート](https://education.github.com/git-cheat-sheet-education.pdf)

---

このリファレンスを活用して、効率的にGitを使いこなしましょう！