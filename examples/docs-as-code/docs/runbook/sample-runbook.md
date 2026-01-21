# Runbook: 文書テンプレの追加手順

## 目的

- 文書テンプレ（ADR/議事録/設計/Runbook）をリポジトリに追加し、運用を開始する。

## 前提条件

- リポジトリへの書き込み権限がある。
- Pull Request を作成できる。

## 手順

1. `docs/templates/` を作成する。
2. テンプレファイルを追加する（例：`adr-template.md`）。
3. Pull Request を作成し、レビューを依頼する。
4. マージ後、`docs/index.md` にテンプレのリンクを追加する。

## 確認方法（Verification）

- `docs/templates/` にテンプレが存在する。
- `docs/index.md` からテンプレにリンクできる。

## ロールバック（失敗時の戻し方）

- Pull Request をクローズして変更を取り消す。
- すでにマージ済みの場合は、テンプレ追加を revert する。

## 参考

- 関連 Issue / Pull Request

