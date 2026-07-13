---
title: "付録D：Git/GitHub用語集"
layout: book
order: 103
---

# 付録D：Git/GitHub用語集

この用語集では、本書で繰り返し登場するGitとGitHubの基本用語を、初学者向けに短く定義します。各項目から、実際の操作や考え方を詳しく説明している関連章へ移動できます。

## 使い方

本文を読み進めていて意味を確認したくなったときは、ブラウザーの検索機能またはこのページの見出しを使って用語を探してください。Gitの仕組みを確認したい場合は第2章、GitHub上での共同作業を確認したい場合は第7章・第8章を参照すると、用語同士の関係も理解しやすくなります。

## GitとGitHubの基本

### Git

**定義：** ファイルの変更履歴を記録し、過去の状態を確認・復元できる分散型バージョン管理システムです。GitHubとは異なり、Git自体は手元のコンピューターでも動作します。

**関連章：** [第2章：Git基礎 - バージョン管理の仕組み]({{ '/chapters/chapter-git-basics/' | relative_url }}) ／ [付録A：Gitコマンドリファレンス]({{ '/appendices/appendix-git-commands-reference/' | relative_url }})

### GitHub

**定義：** Gitリポジトリをインターネット上で共有し、IssueやPull Requestなどを使って共同作業できるサービスです。Gitで管理する履歴を保存するだけでなく、レビューや自動化の機能も提供します。

**関連章：** [第1章：はじめに - なぜGitHubを学ぶのか]({{ '/chapters/chapter-introduction/' | relative_url }}) ／ [第3章：初めてのリポジトリ作成]({{ '/chapters/chapter-repository-creation/' | relative_url }})

### Repository（リポジトリ）

**定義：** ファイルとその変更履歴、ブランチなどをまとめて管理する場所です。ローカルリポジトリは手元にあり、GitHub上のリモートリポジトリは他のメンバーとの共有に使います。

**関連章：** [第2章：Git基礎 - バージョン管理の仕組み]({{ '/chapters/chapter-git-basics/' | relative_url }}) ／ [第3章：初めてのリポジトリ作成]({{ '/chapters/chapter-repository-creation/' | relative_url }})

## 履歴と共有先

### Commit（コミット）

**定義：** 変更内容をひとまとまりの履歴として記録する操作、またはその記録です。コミットには、何を変更したかを後から確認するためのメッセージを付けます。

**関連章：** [第2章：Git基礎 - バージョン管理の仕組み]({{ '/chapters/chapter-git-basics/' | relative_url }}) ／ [第7章：ブランチの基本操作]({{ '/chapters/chapter-branch-operations/' | relative_url }})

### Branch（ブランチ）

**定義：** 変更履歴の流れを分岐させる仕組みです。作業用ブランチを使うと、mainブランチを保ったまま新機能や修正を試せます。

**関連章：** [第7章：ブランチの基本操作]({{ '/chapters/chapter-branch-operations/' | relative_url }}) ／ [第2章：Git基礎 - バージョン管理の仕組み]({{ '/chapters/chapter-git-basics/' | relative_url }})

### Remote（リモート）

**定義：** ローカルリポジトリから参照する、別の場所にあるリポジトリです。`origin` は、GitHub上のリポジトリを登録したときによく使われる名前です。

**関連章：** [第2章：Git基礎 - バージョン管理の仕組み]({{ '/chapters/chapter-git-basics/' | relative_url }}) ／ [第3章：初めてのリポジトリ作成]({{ '/chapters/chapter-repository-creation/' | relative_url }})

### Clone（クローン）

**定義：** リモートリポジトリのファイルと履歴を、ローカル環境へコピーして作業を始める操作です。`git clone` を実行すると、通常はリモートとの接続情報も設定されます。

**関連章：** [第3章：初めてのリポジトリ作成]({{ '/chapters/chapter-repository-creation/' | relative_url }}) ／ [付録A：Gitコマンドリファレンス]({{ '/appendices/appendix-git-commands-reference/' | relative_url }})

### Pull（プル）

**定義：** リモートリポジトリの新しい履歴を取得し、現在のローカルブランチへ取り込む操作です。共同作業では、作業前に `git pull` で共有先の変更を確認します。

**関連章：** [第2章：Git基礎 - バージョン管理の仕組み]({{ '/chapters/chapter-git-basics/' | relative_url }}) ／ [第7章：ブランチの基本操作]({{ '/chapters/chapter-branch-operations/' | relative_url }})

### Push（プッシュ）

**定義：** ローカルで作成したコミットをリモートリポジトリへ送る操作です。`git push` によって、GitHub上のブランチに変更を共有できます。

**関連章：** [第3章：初めてのリポジトリ作成]({{ '/chapters/chapter-repository-creation/' | relative_url }}) ／ [第7章：ブランチの基本操作]({{ '/chapters/chapter-branch-operations/' | relative_url }})

## GitHubでの共同作業

### Issue（イシュー）

**定義：** バグ、タスク、質問、機能要望などを記録し、担当や議論を管理するGitHubの機能です。Issueを作業の起点にすると、変更理由と完了条件を残せます。

**関連章：** [第8章：Issue 管理とプロジェクト管理]({{ '/chapters/chapter-issue-management/' | relative_url }}) ／ [特別編：Docs-as-Code]({{ '/chapters/chapter-docs-as-code/' | relative_url }})

### Pull Request（プルリクエスト、PR）

**定義：** あるブランチの変更を別のブランチへ取り込む前に、差分を提示してレビューを依頼するGitHubの機能です。PRには変更の目的や関連Issueを記載します。

**関連章：** [第7章：ブランチの基本操作]({{ '/chapters/chapter-branch-operations/' | relative_url }}) ／ [第8章：Issue 管理とプロジェクト管理]({{ '/chapters/chapter-issue-management/' | relative_url }})

### Review（レビュー）

**定義：** Pull Requestの変更内容を確認し、改善点や承認を返す作業です。動作だけでなく、目的との一致、読みやすさ、テスト、セキュリティも確認します。

**関連章：** [第7章：ブランチの基本操作]({{ '/chapters/chapter-branch-operations/' | relative_url }}) ／ [特別編：Docs-as-Code]({{ '/chapters/chapter-docs-as-code/' | relative_url }})

### Merge（マージ）

**定義：** ブランチで作成した変更を、別のブランチの履歴へ統合する操作です。Pull Requestのレビューと必要なチェックが完了した後に実行します。

**関連章：** [第7章：ブランチの基本操作]({{ '/chapters/chapter-branch-operations/' | relative_url }}) ／ [第3章：初めてのリポジトリ作成]({{ '/chapters/chapter-repository-creation/' | relative_url }})

### Conflict（コンフリクト、競合）

**定義：** 複数の変更が同じファイルの同じ箇所などに入り、Gitが自動的に統合できない状態です。内容を確認してどの変更を残すか決め、解消後に再度コミットします。

**関連章：** [第7章：ブランチの基本操作]({{ '/chapters/chapter-branch-operations/' | relative_url }}) ／ [第12章：トラブルシューティング]({{ '/chapters/chapter-troubleshooting/' | relative_url }})

## 自動化

### GitHub Actions

**定義：** GitHub上で、`push` やPull Requestなどをきっかけにテスト、ビルド、デプロイといった処理を自動実行する仕組みです。処理はworkflow、job、stepなどの設定で定義します。

**関連章：** [第9章：GitHub Actions入門 - 自動化の基礎]({{ '/chapters/chapter-github-actions/' | relative_url }}) ／ [第11章：高度な機能活用]({{ '/chapters/chapter-advanced-features/' | relative_url }})

## 用語のつながり

典型的な変更の流れは、リモートリポジトリを **clone** し、**branch** を作成して変更を **commit** し、**push** で共有した後、**Pull Request** と **review** を経て **merge** するというものです。共有前に **pull** で最新状態を取り込み、統合時に **conflict** が起きた場合は内容を解消します。GitHub Actionsは、この流れの中でテストやビルドを自動化します。
