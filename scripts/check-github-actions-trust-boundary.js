#!/usr/bin/env node
'use strict';

const fs = require('node:fs');

const manuscriptPath = 'manuscript/chapter-github-actions/index.md';
const docsPath = 'docs/chapters/chapter-github-actions/index.md';

function normalize(value) {
  return value.replace(/\r\n?/g, '\n');
}

function readRequired(file) {
  try {
    return normalize(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.error(`GitHub Actions trust-boundary contract failed: ${file}を読み込めません (${error.code ?? error.message})`);
    process.exit(1);
  }
}

function validate(content) {
  const errors = [];
  const required = [
    'on:\n  pull_request:',
    'permissions:\n  contents: read',
    'fork からの Pull Request を検証する基本形',
    'public repository の fork PR では、既定で `GITHUB_TOKEN` は read-only',
    'private repository では管理設定により write token や secrets を送れる',
    '`pull_request_target`の境界',
    '`pull_request_target`はfork workflowの承認設定に依存せず',
    'base repositoryのdefault branch',
    'base branch context',
    '`github.event.pull_request.head.sha`をcheckoutし',
    '任意commandを実行してはいけません',
    'PR codeをcheckout/実行しない',
    'privileged writeが必要な場合の2-stage設計',
    '`workflow_run`または手動承認',
    'schema、size、対象PR、producer run、digestを検証',
    '`runner.temp`配下',
    'artifact内のscriptやbinaryを実行せず',
    'https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target',
    'https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows',
    'https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax',
    'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository',
  ];
  for (const marker of required) {
    if (!content.includes(marker)) errors.push(`必須markerがありません: ${marker}`);
  }

  const yamlBlocks = [...content.matchAll(/```yaml\n([\s\S]*?)\n```/g)].map((match) => match[1]);
  if (!yamlBlocks.some((block) => block.includes('pull_request:') && block.includes('contents: read'))) {
    errors.push('pull_request + contents: readの安全な基本例がありません');
  }
  if (yamlBlocks.some((block) => block.includes('pull_request_target:'))) {
    errors.push('copy可能なYAML例にpull_request_targetを含めてはいけません');
  }
  if (yamlBlocks.some((block) => /permissions:\s*(?:write-all|read-all)/.test(block) || /contents:\s*write/.test(block))) {
    errors.push('基本例へ広いwrite権限を付与してはいけません');
  }
  return errors;
}

function expectRejected(content, name, mutate, expected) {
  const mutated = mutate(content);
  if (mutated === content) throw new Error(`self-test ${name}: mutation対象がありません`);
  const errors = validate(mutated);
  if (!errors.some((error) => error.includes(expected))) {
    throw new Error(`self-test ${name}: 違反を拒否できません (${errors.join('; ')})`);
  }
}

function expectAccepted(content, name, mutate) {
  const mutated = mutate(content);
  if (mutated === content) throw new Error(`self-test ${name}: mutation対象がありません`);
  const errors = validate(mutated);
  if (errors.length) {
    throw new Error(`self-test ${name}: 安全な説明を許容できません (${errors.join('; ')})`);
  }
}

const manuscript = readRequired(manuscriptPath);
const docs = readRequired(docsPath);
const errors = [
  ...validate(manuscript).map((error) => `${manuscriptPath}: ${error}`),
  ...validate(docs).map((error) => `${docsPath}: ${error}`),
];
if (manuscript !== docs) errors.push(`${manuscriptPath} and ${docsPath}: mirror content differs`);

const packageJson = JSON.parse(readRequired('package.json'));
for (const command of ['npm run check:actions-trust-boundary', 'npm run check:actions-trust-boundary:self-test']) {
  if (!packageJson.scripts?.test?.includes(command)) errors.push(`npm test must run ${command}`);
}
const workflow = readRequired('.github/workflows/book-qa.yml');
for (const command of [
  'node scripts/check-github-actions-trust-boundary.js',
  'node scripts/check-github-actions-trust-boundary.js --self-test',
]) {
  if (!workflow.includes(command)) errors.push(`Book QA must run ${command}`);
}

if (errors.length) {
  console.error('GitHub Actions trust-boundary contract failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

if (process.argv.includes('--self-test')) {
  expectRejected(manuscript, 'missing pull_request', (value) => value.replace('on:\n  pull_request:', 'on:\n  push:'), 'pull_request:');
  expectRejected(manuscript, 'broad write', (value) => value.replace('contents: read', 'contents: write'), 'write権限');
  expectRejected(manuscript, 'unsafe target YAML', (value) => value.replace('pull_request:', 'pull_request_target:'), 'pull_request_target');
  expectRejected(manuscript, 'missing fork approval boundary', (value) => value.replace('`pull_request_target`はfork workflowの承認設定に依存せず', '`pull_request_target`は承認後に実行され'), '承認設定に依存せず');
  expectRejected(manuscript, 'missing head-code ban', (value) => value.replace('任意commandを実行してはいけません', '任意commandを実行できます'), '任意command');
  expectRejected(manuscript, 'missing two-stage validation', (value) => value.replace('schema、size、対象PR、producer run、digestを検証', 'artifactを利用'), 'schema、size');
  expectRejected(manuscript, 'missing official source', (value) => value.replace('https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target', 'https://example.invalid'), 'securely-using');
  expectAccepted(manuscript, 'write permission warning in prose', (value) => `${value}\n\n説明文ではcontents: writeの危険性を明示できます。`);
  console.log('GitHub Actions trust-boundary contract self-test passed.');
} else {
  console.log('GitHub Actions trust-boundary contract passed: fork PR, privileged context, and two-stage boundaries.');
}
