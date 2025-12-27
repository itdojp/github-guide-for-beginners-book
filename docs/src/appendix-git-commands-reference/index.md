---
title: "付録A：Gitコマンドリファレンス"
layout: book
order: 100
---

# 付録A：Gitコマンドリファレンス

本付録では、GitHub初心者ガイドで学習したGitコマンドを体系的にまとめ、日常的な開発作業での参照用として活用できるよう整理しています。

---

## A.1 基本的なリポジトリ操作

### リポジトリの初期化・取得

```bash
# 新しいGitリポジトリを初期化
git init

# リモートリポジトリをクローン
git clone <リポジトリURL>

# 特定のブランチをクローン
git clone -b <ブランチ名> <リポジトリURL>

# 浅いクローン（履歴を制限）
git clone --depth 1 <リポジトリURL>
```

### リモートリポジトリの管理

```bash
# リモートリポジトリを追加
git remote add origin <リポジトリURL>

# リモートリポジトリのURL変更
git remote set-url origin <新しいURL>

# リモートリポジトリ一覧を表示
git remote -v

# リモートリポジトリを削除
git remote remove <リモート名>
```

---

## A.2 ファイルの変更管理

### ステージング操作

```bash
# ファイルをステージングエリアに追加
git add <ファイル名>

# すべての変更ファイルを追加
git add .

# すべての変更（削除含む）を追加
git add -A

# インタラクティブに追加
git add -i

# 変更の一部のみを追加
git add -p
```

### コミット操作

```bash
# 変更をコミット
git commit -m "コミットメッセージ"

# ステージングとコミットを同時実行
git commit -am "コミットメッセージ"

# 空のコミットを作成
git commit --allow-empty -m "メッセージ"

# 前回のコミットを修正
git commit --amend

# 前回のコミットメッセージのみ修正
git commit --amend -m "新しいメッセージ"
```

### ファイルの取り消し・復元

```bash
# ワーキングディレクトリの変更を取り消し
git checkout -- <ファイル名>

# ステージングから除外（変更は保持）
git reset HEAD <ファイル名>

# 最新コミットから特定ファイルを復元
git checkout HEAD -- <ファイル名>

# 指定コミットから特定ファイルを復元
git checkout <コミットハッシュ> -- <ファイル名>
```

---

## A.3 ブランチ操作

### ブランチの作成・切り替え

```bash
# 新しいブランチを作成
git branch <ブランチ名>

# ブランチを作成して切り替え
git checkout -b <ブランチ名>

# リモートブランチベースで作成・切り替え
git checkout -b <ローカルブランチ名> origin/<リモートブランチ名>

# ブランチの切り替え
git checkout <ブランチ名>

# Git 2.23以降の新しい構文
git switch <ブランチ名>
git switch -c <新しいブランチ名>
```

### ブランチの管理

```bash
# ローカルブランチ一覧
git branch

# リモートブランチも含めて一覧
git branch -a

# マージ済みブランチを表示
git branch --merged

# 未マージブランチを表示
git branch --no-merged

# ブランチを削除
git branch -d <ブランチ名>

# 強制的にブランチを削除
git branch -D <ブランチ名>

# リモートブランチを削除
git push origin --delete <ブランチ名>
```

### マージ操作

```bash
# 指定ブランチを現在のブランチにマージ
git merge <ブランチ名>

# マージコミットを作成しない（早送りマージ）
git merge --ff-only <ブランチ名>

# 必ずマージコミットを作成
git merge --no-ff <ブランチ名>

# マージを中止
git merge --abort

# コンフリクト解決後のマージ完了
git merge --continue
```

---

## A.4 リモートリポジトリとの同期

### プッシュ操作

```bash
# 現在のブランチをプッシュ
git push

# 初回プッシュ時にリモートブランチを設定
git push -u origin <ブランチ名>

# 特定のブランチをプッシュ
git push origin <ブランチ名>

# すべてのブランチをプッシュ
git push --all

# タグをプッシュ
git push --tags

# 強制プッシュ（注意が必要）
git push --force
git push --force-with-lease  # より安全
```

### プル・フェッチ操作

```bash
# リモートの変更を取得してマージ
git pull

# 特定のブランチからプル
git pull origin <ブランチ名>

# リベースしながらプル
git pull --rebase

# リモートの情報のみ取得（マージしない）
git fetch

# すべてのリモートブランチ情報を取得
git fetch --all

# プルーン（削除されたリモートブランチ情報を整理）
git fetch --prune
```

---

## A.5 履歴の確認・操作

### ログとhistory

```bash
# コミット履歴を表示
git log

# 一行表示で履歴を表示
git log --oneline

# グラフ形式で履歴を表示
git log --graph

# 詳細な統計情報付きで表示
git log --stat

# 特定ファイルの履歴を表示
git log -- <ファイル名>

# 特定期間の履歴を表示
git log --since="2024-01-01" --until="2024-12-31"

# 作成者による絞り込み
git log --author="ユーザー名"
```

### 差分の確認

```bash
# ワーキングディレクトリとステージングエリアの差分
git diff

# ステージングエリアと最新コミットの差分
git diff --staged

# 特定のコミット間の差分
git diff <コミット1> <コミット2>

# 特定ファイルの差分
git diff <ファイル名>

# ブランチ間の差分
git diff <ブランチ1>..<ブランチ2>
```

### リセット操作

```bash
# ソフトリセット（コミットのみ取り消し）
git reset --soft <コミット>

# ミックスリセット（ステージングもリセット）
git reset --mixed <コミット>
git reset <コミット>  # --mixedがデフォルト

# ハードリセット（すべてを指定コミットの状態に戻す）
git reset --hard <コミット>

# 直前のコミットを取り消し
git reset HEAD~1

# 特定のファイルのみリセット
git reset HEAD <ファイル名>
```

---

## A.6 タグ管理

### タグの作成・管理

```bash
# 軽量タグを作成
git tag <タグ名>

# 注釈付きタグを作成
git tag -a <タグ名> -m "タグメッセージ"

# 特定のコミットにタグを作成
git tag -a <タグ名> <コミットハッシュ>

# タグ一覧を表示
git tag

# パターンマッチでタグを検索
git tag -l "v1.0.*"

# タグを削除
git tag -d <タグ名>

# リモートのタグを削除
git push origin --delete <タグ名>
```

---

## A.7 トラブルシューティング用コマンド

### 情報確認

```bash
# 現在の状態を確認
git status

# 設定を確認
git config --list

# 特定の設定値を確認
git config user.name
git config user.email

# リモートの詳細情報
git remote show origin

# ブランチの追跡情報
git branch -vv
```

### データの復旧

```bash
# 削除されたブランチやコミットを探す
git reflog

# 特定の時点に戻る
git reset --hard HEAD@{n}

# コンフリクトファイルの確認
git diff --name-only --diff-filter=U

# マージツールを起動
git mergetool

# 特定コミットの変更を適用
git cherry-pick <コミット>

# 特定コミットの変更を取り消し
git revert <コミット>
```

### クリーンアップ

```bash
# 追跡されていないファイルを表示
git clean -n

# 追跡されていないファイルを削除
git clean -f

# ディレクトリも含めて削除
git clean -fd

# gitignoreされたファイルも削除
git clean -fx

# ガベージコレクション実行
git gc

# リポジトリの整合性チェック
git fsck
```

---

## A.8 高度なコマンド

### リベース

```bash
# 現在のブランチを指定ブランチにリベース
git rebase <ベースブランチ>

# インタラクティブリベース
git rebase -i <ベースコミット>

# リベースを中止
git rebase --abort

# リベースを続行
git rebase --continue

# リベース中のコンフリクトをスキップ
git rebase --skip
```

### Stash（一時保存）

```bash
# 現在の変更を一時保存
git stash

# メッセージ付きで一時保存
git stash save "作業中の機能"

# 一時保存の一覧を表示
git stash list

# 一時保存を適用
git stash apply

# 一時保存を適用して削除
git stash pop

# 特定の一時保存を適用
git stash apply stash@{n}

# 一時保存を削除
git stash drop stash@{n}

# すべての一時保存を削除
git stash clear
```

---

## A.9 設定関連

### ユーザー設定

```bash
# 名前を設定
git config --global user.name "Your Name"

# メールアドレスを設定  
git config --global user.email "your.email@example.com"

# エディタを設定
git config --global core.editor "code --wait"

# デフォルトブランチ名を設定
git config --global init.defaultBranch main

# 改行コード設定（Windows）
git config --global core.autocrlf true

# 改行コード設定（Mac/Linux）
git config --global core.autocrlf input
```

### エイリアス設定

```bash
# よく使うコマンドのエイリアス設定
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.ps push
git config --global alias.pl pull
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.unstage "reset HEAD --"
git config --global alias.last "log -1 HEAD"
```

---

## A.10 便利なオプション組み合わせ

### 日常的なワークフロー

```bash
# 全体状況の把握
git status && git log --oneline -5

# リモートの最新情報取得後にマージ
git fetch && git merge origin/main

# 作業開始前の準備
git pull && git status

# 作業完了後の一連の流れ
git add -A && git commit -m "機能実装完了" && git push

# ブランチ切り替え前の安全確認
git status && git stash && git checkout main
```

### デバッグ・調査用

```bash
# 特定ファイルの変更履歴を詳細表示
git log -p -- <ファイル名>

# 誰がいつ変更したかを確認
git blame <ファイル名>

# 特定の変更がいつ導入されたかを検索
git log -S "検索文字列" --source --all

# バイナリサーチでバグの原因を特定
git bisect start
git bisect bad          # 現在のコミットが悪い
git bisect good <コミット>  # このコミットは良い
```

---

このリファレンスは、GitHub初心者ガイドの学習を補完し、実際の開発作業での参照用として設計されています。各コマンドの詳細な説明や高度なオプションについては、`git help <コマンド名>` で公式ドキュメントを参照してください。

**コマンド使用時の注意点：**
- `--force` 系のオプションは慎重に使用する
- 共有リポジトリでの履歴改変は避ける
- 重要な変更前は必ずバックアップを取る
- チーム開発では事前にルールを決めて運用する
