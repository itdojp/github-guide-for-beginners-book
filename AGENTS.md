# AGENTS.md

このファイルは、Codex 等の AI/エージェントが本リポジトリで作業する際の「単一入口（Single Entry Point）」です。

## Single Source of Truth（正の原稿）

- **本文（正）**: `manuscript/**`
  - 章本文・図参照・章末チェック等は原則ここを編集します。
- **公開サイト（GitHub Pages）**: `docs/**`
  - 互換や公開導線の都合で存在しますが、本文の正とは限りません。Issue で指示がない限り、本文改稿のために `docs/**` を直接編集しないでください。
- **元原稿（互換/残骸）**: `src/**`
  - 過去の構造の名残です。原則編集対象外（必要な場合は Issue に理由を明記）。

## 変更禁止・注意事項（Must Not）

- **Secrets/個人情報/トークンを貼らない**
  - 例: API キー、PAT、秘密鍵、顧客情報、署名付き URL。
  - 詳細は `AI_USAGE_POLICY.md` を参照。
- **生成物をコミットしない**
  - 例: `_site/`, `node_modules/`。
- **大規模なリネームで互換性を壊さない**
  - slug 変更（ディレクトリ名変更）や URL 互換性に影響する改修は、別 Issue で計画して実施します。

## 必ず通すチェック（推奨）

最小セット（PR 作成前）:

- `npm ci`
- 変更した Markdown に対して `npx markdownlint ...`
- 変更した Markdown に対して `python3 scripts/check_markdown_internal_links.py ...`
- Unicode 安全チェック: `python3 scripts/check_bidi_unicode.py`

CI の基準（必須）:

- GitHub Actions の `Book QA` が PASS
- GitHub Actions の `Docs Quality Gate`（変更対象に応じて）が PASS

## hidden/bidirectional Unicode（再発防止）

差分に bidi 制御文字（不可視）が混入すると、レビュー時に見落としやすく、GitHub の表示警告対象になります。将来の自動処理（生成・変換・コピペ）でも事故要因になるため、CI で検出して失敗させます。

- 検出コマンド: `python3 scripts/check_bidi_unicode.py`（追跡ファイルを走査）
- CI: `Book QA` で同チェックを実行

## PR/Issue 運用

- `.github/PULL_REQUEST_TEMPLATE.md` に従い、`Closes #xxx` を記載します。
- `gh pr comment` / `gh issue comment` でコメント投稿する場合、Bash のバッククォート（コマンド置換）事故を避けるため、本文は **`--body-file`（`-F`）** で渡します（例は `AI_USAGE_POLICY.md`）。

## slug と章の対応（誤編集防止）

ディレクトリ名（slug）は、公開サイトの URL 互換や過去構造の名残により、章タイトルと一致しない場合があります。編集対象は「章タイトル」ではなく **ファイルパス（`manuscript/**`）** を基準に判断してください。

対応表（`manuscript/*/index.md` の `order` / `title` より）:

| パス（slug） | order | タイトル |
| --- | ---: | --- |
| `manuscript/chapter-introduction/` | 1 | 第1章：はじめに - なぜGitHubを学ぶのか |
| `manuscript/chapter-git-basics/` | 2 | 第2章：Git基礎 - バージョン管理の仕組み |
| `manuscript/chapter-github-account-setup/` | 3 | 第3章：初めてのリポジトリ作成 |
| `manuscript/chapter-basic-operations/` | 4 | 第4章：アカウントセキュリティの基本 |
| `manuscript/chapter-repository-management/` | 5 | 第5章：ファイルのアップロードと管理 |
| `manuscript/chapter-collaboration-basics/` | 6 | 第6章：GitHub Desktop の活用 |
| `manuscript/chapter-pull-requests/` | 7 | 第7章：ブランチの基本操作 |
| `manuscript/chapter-issue-management/` | 8 | 第8章：Issue管理とプロジェクト管理 |
| `manuscript/chapter-github-actions/` | 9 | 第9章：GitHub Actions入門 - 自動化の基礎 |
| `manuscript/chapter-security-best-practices/` | 10 | 第10章：セキュリティのベストプラクティス |
| `manuscript/chapter-advanced-features/` | 11 | 第11章：高度な機能活用 |
| `manuscript/chapter-troubleshooting/` | 12 | 第12章：トラブルシューティング |
| `manuscript/chapter-docs-as-code/` | 13 | 特別編：Docs-as-Code - GitHubをドキュメント管理・ナレッジ基盤として使う |
| `manuscript/appendix-git-commands-reference/` | 100 | 付録A：Gitコマンドリファレンス |
| `manuscript/appendix-github-shortcuts/` | 101 | 付録B：GitHubショートカット集 |
| `manuscript/appendix-resources/` | 102 | 付録C：学習リソースと参考文献 |
| `manuscript/chapter-security/` | 999 | 第10章：セキュリティ対策と安全なGitHub利用（互換/残骸。原則編集しない） |

slug 改名（ディレクトリ名変更）を行う場合は、公開サイトの既存 URL 互換（リダイレクト/リンク更新）と外部参照への影響を評価し、別 Issue で計画して段階的に実施します。
