# README（ポータル）テンプレ

このテンプレは、README を「入口（ポータル）」として機能させるための最小構成です。  
目的は、詳細本文を README に溜めず、`docs/` に誘導して二重管理を避けることです。

---

# （プロジェクト名）

## 目的（このリポジトリは何か）

- （例）チーム内の運用手順と意思決定ログを一元管理する

## 最短導線（Quick Start）

1. **まず読む**：`docs/index.md`（文書ポータル）
2. **次にやる**：`docs/templates/` のテンプレで文書を作成する
3. **困ったら**：Issue を起票する（`type: question` など）

## どこに何を書くか（置き場所）

- README：入口・最短導線・主要リンク
- `docs/`：版管理する本文（仕様・運用手順・ナレッジ）
- Issues：決める/やる（議論とタスク）
- Projects：進捗の見える化
- Discussions：Q&A、相談（任意）

## 文書ポータル

- `docs/index.md`

## 運用ルール（最小セット）

- 文書の追加・更新は Pull Request でレビューする
- Issue に「目的」と「完了条件（DoD）」を書く
- 廃止した文書は削除ではなく「廃止」と明記し、後継リンクを残す

## ラベル（推奨）

- `type:` / `priority:` / `area:` / `status:` など、軸を分けて運用する
- 例：`type: docs`、`priority: medium`、`area: docs`

## AI支援（任意）

- AI を使う場合は、機密入力の禁止と検証観点を守る  
  - `AI_USAGE_POLICY.md`

## ライセンス

- （例）MIT / CC BY-NC-SA など

