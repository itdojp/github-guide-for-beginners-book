---
title: "Git基礎 - バージョン管理の仕組み"
layout: book
order: 1
---

# Git基礎 - バージョン管理の仕組み

## 学習目標

この章を読み終える頃には、Gitの基本概念を理解し、「バージョン管理」とは何かが明確になります。また、GitHubで自分専用のリポジトリを作成し、基本的な設定を完了できるようになります。

---

## Git の3つのエリア

### バージョン管理の基本概念

Gitは、ファイルの変更を3つの段階で管理します。この概念を理解することが、Git習得の第一歩です。

![リポジトリコンセプト]({{ '/assets/images/diagrams/chapter01/04_repository_concept.svg' | relative_url }})

#### 1. Working Directory（作業ディレクトリ）
あなたが実際にファイルを編集している場所です。普通のフォルダと同じように、ファイルを作成・編集・削除できます。

#### 2. Staging Area（ステージングエリア）
「次のコミットに含めたい変更」を一時的に保管する場所です。作業ディレクトリでの変更を、選択的にステージングエリアに追加できます。

#### 3. Repository（リポジトリ）
変更履歴が永続的に保存される場所です。コミットされた変更は、ここに記録されます。

### 3つのエリアの関係

```
Working Directory → Staging Area → Repository
    （編集）        （git add）    （git commit）
```

**具体例で理解しよう：**

1. **ファイルを編集**（Working Directory）
   - `index.html` に新しい段落を追加
   - `style.css` の色を変更

2. **変更を選択**（Staging Area）
   - `index.html` の変更はコミットに含めたい → `git add index.html`
   - `style.css` の変更はまだ実験中 → ステージしない

3. **変更を記録**（Repository）
   - ステージした `index.html` のみをコミット → `git commit`

この仕組みにより、「すべての変更をまとめてコミット」ではなく、「関連する変更だけを論理的な単位でコミット」できます。

![開発ワークフロー概要]({{ '/assets/images/diagrams/chapter01/08_development_workflow_overview.svg' | relative_url }})

## リポジトリの作成と基本操作

### 新しいリポジトリの作成手順

**Step 1: GitHubにログイン**
1. https://github.com にアクセス
2. 作成したアカウントでログイン
3. ダッシュボード画面が表示されることを確認

**Step 2: 新規リポジトリ作成**
1. 画面右上の「+」ボタンをクリック
2. ドロップダウンメニューから「New repository」を選択
3. リポジトリ作成画面が開く

![コラボレーションフロー]({{ '/assets/images/diagrams/chapter01/05_collaboration_flow.svg' | relative_url }})

**Step 3: リポジトリの基本情報を入力**

**Repository name（リポジトリ名）**
良い名前の例：
- `my-first-website`（私の最初のWebサイト）
- `learning-html-css`（HTML・CSS学習用）
- `personal-portfolio`（個人ポートフォリオ）
- `javascript-practice`（JavaScript練習用）

**Description（説明文）**
例：
- "My first HTML/CSS website for learning web development"
- "Personal portfolio website showcasing my projects"
- "Practice repository for JavaScript fundamentals"

**Step 4: 公開設定の選択**

**Public（公開）vs Private（非公開）**

**Public（公開）を選ぶべき場合：**
- 学習成果を公開したい
- ポートフォリオとして活用したい
- オープンソースプロジェクトとして共有したい

**Private（非公開）を選ぶべき場合：**
- 個人的な練習・実験
- 機密性の高い内容
- 公開する準備ができていない

**Step 5: 初期ファイルの設定**

**README.md**
✅ チェックを入れることを推奨
プロジェクトの説明文書が自動生成されます。

**.gitignore**
プログラミング言語を選択すると、不要なファイルを自動的に無視する設定が追加されます。

**License**
オープンソースプロジェクトの場合に選択します。初心者は「None」で問題ありません。

## コミットの概念と実践

### コミットとは何か

コミットは「プロジェクトの特定時点でのスナップショット」です。以下の情報が記録されます：

- **変更内容**：どのファイルが、どのように変更されたか
- **変更者**：誰が変更したか
- **変更日時**：いつ変更したか
- **コミットメッセージ**：なぜ変更したか

### 良いコミットメッセージの書き方

**基本原則：**
- 1行目：変更内容を簡潔に（50文字以内）
- 2行目：空行
- 3行目以降：詳細な説明（必要に応じて）

**良い例：**
```
Add navigation menu to header

- Add responsive navigation bar
- Include links to all main pages
- Implement mobile hamburger menu
```

**悪い例：**
```
Update files
```

### コミット頻度の考え方

**適切なコミット頻度：**
- 小さな機能単位でコミットする
- 論理的にまとまった変更をまとめる
- 動作する状態でコミットする

**例：Webサイトのヘッダーを作成する場合**
1. `Add basic HTML structure for header`
2. `Style header with CSS`
3. `Add responsive design for mobile`
4. `Implement navigation menu functionality`

## ブランチの基本概念

### ブランチとは

ブランチは、メインの開発ラインから分岐して、並行して作業を進める仕組みです。

**メリット：**
- メインコードに影響を与えずに実験できる
- 複数の機能を同時に開発できる
- 安全に新機能をテストできる

### 基本的なブランチ操作

**新しいブランチの作成：**
```bash
git branch feature-new-design
git checkout feature-new-design
```

**または、作成と切り替えを同時に：**
```bash
git checkout -b feature-new-design
```

**ブランチの一覧確認：**
```bash
git branch
```

**メインブランチに戻る：**
```bash
git checkout main
```

### ブランチの活用例

**シナリオ：**個人ブログのデザインを変更したい

1. **mainブランチ**：現在公開中の安定版
2. **design-update**ブランチ：新しいデザインを試す
3. **mobile-optimization**ブランチ：モバイル対応を改善

各ブランチで独立して作業し、完成したものからmainブランチに統合（マージ）します。

## 実習：最初のリポジトリを作成しよう

### 実習課題

以下の手順で、あなたの最初のリポジトリを作成してください：

1. **リポジトリ名**：`my-github-learning`
2. **説明文**：「Learning GitHub basics step by step」
3. **公開設定**：Public
4. **README.md**：✅ 追加する
5. **.gitignore**：なし
6. **License**：なし

### 作成後の確認項目

✅ リポジトリページが正常に表示される  
✅ README.mdが作成されている  
✅ リポジトリのURLをブラウザで開ける  
✅ 「Create new file」ボタンが表示される  

### 次のステップ

リポジトリの作成が完了したら、次の章でREADME.mdファイルを編集し、ファイルの追加・変更の基本操作を学習します。

---

## まとめ

この章では、Gitの基本概念について学習しました：

- **3つのエリア**：Working Directory、Staging Area、Repository
- **コミット**：変更履歴の記録単位
- **ブランチ**：並行開発のための分岐機能
- **リポジトリ作成**：GitHubでのプロジェクト開始方法

これらの概念は、最初は複雑に感じるかもしれません。しかし、実際に操作を重ねることで、自然と理解が深まります。

次の章では、実際にファイルを編集・追加し、コミット操作を体験してみましょう。

**理解度確認：**
□ Gitの3つのエリアを説明できる  
□ コミットの役割を理解している  
□ ブランチの基本概念を把握している  
□ GitHubでリポジトリを作成できる  
□ 良いコミットメッセージの書き方を理解している