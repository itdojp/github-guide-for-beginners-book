---
title: "付録B GitHubショートカット集"
layout: book
---

# 付録B GitHubショートカット集

GitHubをより効率的に使うためのキーボードショートカットとTipsを紹介します。

## 基本のキーボードショートカット

### 全般

| ショートカット | 動作 |
|---------------|------|
| `?` | ショートカットヘルプを表示 |
| `g` `h` | ホームページに移動 |
| `g` `n` | 通知ページに移動 |
| `g` `i` | Issuesページに移動 |
| `g` `p` | Pull Requestsページに移動 |
| `/` | 検索ボックスにフォーカス |
| `Ctrl/Cmd + K` | コマンドパレットを開く |

### リポジトリ内

| ショートカット | 動作 |
|---------------|------|
| `g` `c` | Codeタブに移動 |
| `g` `i` | Issuesタブに移動 |
| `g` `p` | Pull Requestsタブに移動 |
| `g` `w` | Wikiタブに移動 |
| `t` | ファイル検索を開く |
| `w` | ブランチ・タグ選択 |
| `y` | 現在のURLを永続リンクに変換 |

## コードブラウジング

### ファイル表示

| ショートカット | 動作 |
|---------------|------|
| `l` | 特定の行にジャンプ |
| `b` | Blameビューを表示 |
| `Shift + B` | Blameビューを終了 |
| `Ctrl/Cmd + F` | ファイル内検索 |
| `Ctrl/Cmd + G` | 次の検索結果 |
| `Ctrl/Cmd + Shift + G` | 前の検索結果 |

### コード編集

| ショートカット | 動作 |
|---------------|------|
| `.` | GitHub Codespacesまたはgithub.devを開く |
| `e` | ファイルを編集モードで開く |
| `Ctrl/Cmd + S` | ファイルを保存（編集時） |
| `Ctrl/Cmd + Shift + P` | コマンドパレット（編集時） |
| `Escape` | 編集モードを終了 |

## Issues・Pull Requests

### Issue・PR一覧

| ショートカット | 動作 |
|---------------|------|
| `c` | 新しいIssue/PRを作成 |
| `Ctrl/Cmd + Enter` | Issue/PRを送信 |
| `a` | 担当者を設定 |
| `l` | ラベルを設定 |
| `m` | マイルストーンを設定 |

### Issue・PR詳細

| ショートカット | 動作 |
|---------------|------|
| `r` | 返信を開始 |
| `q` | 引用返信を開始 |
| `Ctrl/Cmd + Enter` | コメントを送信 |
| `Ctrl/Cmd + Shift + P` | プレビューとライトを切り替え |
| `Alt + Click` | 行をクリックで複数行選択 |

## Pull Request レビュー

### レビュー画面

| ショートカット | 動作 |
|---------------|------|
| `c` | コメントを開始 |
| `r` | レビューコメントを開始 |
| `n` | 次のコメント・変更に移動 |
| `p` | 前のコメント・変更に移動 |
| `j` | 次の差分ブロックに移動 |
| `k` | 前の差分ブロックに移動 |

### ファイル差分

| ショートカット | 動作 |
|---------------|------|
| `f` | 次のファイルに移動 |
| `Shift + F` | 前のファイルに移動 |
| `o` | ファイルを展開・折りたたみ |
| `Alt + Click` | 差分の行をクリックでコメント |

## 検索のコツ

### 基本検索

```
# リポジトリ内でファイル名検索
filename:README

# 特定のユーザーのリポジトリ検索
user:octocat

# 組織のリポジトリ検索
org:github

# 言語で絞り込み
language:python

# スター数で絞り込み
stars:>1000

# 更新日で絞り込み
pushed:>2023-01-01
```

### Issue・PR検索

```
# 自分に割り当てられたIssue
assignee:@me

# 自分が作成したPR
author:@me is:pr

# レビュー待ちのPR
is:pr review-requested:@me

# マイルストーン指定
milestone:"v1.0"

# ラベル指定
label:bug

# ステータス指定
is:open
is:closed
is:merged
```

### コード検索

```
# 関数名検索
function getUserInfo

# クラス検索
class:UserModel

# インポート文検索
import axios

# 拡張子指定
extension:js
```

## ブラウザ拡張機能

### 推奨拡張機能

1. **Octotree**
   - リポジトリをツリー表示
   - ファイル間の移動が簡単

2. **Refined GitHub**
   - GitHubの機能を拡張
   - より使いやすいUI改善

3. **GitHub File Icons**
   - ファイルタイプごとのアイコン表示
   - 視認性向上

4. **GitZip for GitHub**
   - フォルダ単位でのダウンロード
   - サブディレクトリのダウンロード

## GitHub CLI活用

### 基本コマンド

```bash
# 認証
gh auth login

# リポジトリをクローン
gh repo clone owner/repo

# Issue作成
gh issue create --title "Bug report" --body "Description"

# PR作成
gh pr create --title "Feature" --body "Description"

# PR一覧表示
gh pr list

# PR詳細表示
gh pr view 123

# PRをマージ
gh pr merge 123

# レビュー依頼
gh pr review 123 --approve
```

### エイリアス設定

```bash
# よく使うコマンドのエイリアス
gh alias set prc 'pr create --fill'
gh alias set prv 'pr view --web'
gh alias set prs 'pr status'
gh alias set is 'issue list --assignee "@me"'
```

## VS Code連携

### 拡張機能

1. **GitHub Pull Requests and Issues**
   - VS Code内でPR・Issue管理
   - インライン コメント・レビュー

2. **GitLens**
   - 強化されたGit機能
   - コード履歴の可視化

### 設定例

```json
{
    "github.pullRequests.queries": [
        {
            "label": "Waiting For My Review",
            "query": "is:open is:pr review-requested:${user}"
        },
        {
            "label": "Assigned To Me",
            "query": "is:open is:pr assignee:${user}"
        }
    ]
}
```

## モバイルアプリ

### GitHub Mobile

- **iOS・Android対応**
- 基本的な操作が可能
- 通知の確認
- Issue・PRの管理
- コードレビュー

### 主な機能

- リポジトリブラウジング
- Issue・PR作成・編集
- コメント・レビュー
- 通知管理
- ダークモード対応

## 生産性向上のTips

### 1. テンプレート活用

```markdown
<!-- Issue テンプレート -->
## 概要
問題の概要を記述

## 再現手順
1. 
2. 
3. 

## 期待する動作


## 実際の動作


## 環境
- OS: 
- ブラウザ: 
- バージョン: 
```

### 2. ラベル体系

```
優先度:
- priority:high
- priority:medium  
- priority:low

種類:
- type:bug
- type:enhancement
- type:question

ステータス:
- status:in-progress
- status:needs-review
- status:blocked
```

### 3. プロジェクトボード活用

- **To Do**: 未着手のタスク
- **In Progress**: 作業中のタスク  
- **Review**: レビュー待ち
- **Done**: 完了したタスク

### 4. 自動化設定

```yaml
# .github/workflows/label.yml
name: Label PR
on:
  pull_request:
    types: [opened]

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

## 参考リンク

- [GitHub キーボードショートカット](https://docs.github.com/ja/get-started/using-github/keyboard-shortcuts)
- [GitHub CLI マニュアル](https://cli.github.com/manual/)
- [GitHub Mobile](https://github.com/mobile)
- [GitHub Desktop](https://desktop.github.com/)

---

これらのショートカットやツールを活用して、GitHubでの作業効率を大幅に向上させましょう！