#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const ROUTE = '/appendices/appendix-glossary/';
const TITLE = '付録D：Git/GitHub用語集';
const MANUSCRIPT_FILE = 'manuscript/appendix-glossary/index.md';
const DOCS_FILE = 'docs/appendices/appendix-glossary/index.md';
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8').replace(/\r\n?/g, '\n');
}

function assert(condition, message) {
  if (!condition) errors.push(message);
}

for (const file of [MANUSCRIPT_FILE, DOCS_FILE]) {
  if (!fs.existsSync(path.join(ROOT, file))) {
    console.error(`Glossary contract check failed:\n- ${file}: file is missing`);
    process.exit(1);
  }
}

const book = JSON.parse(read('book-config.json'));
const manuscript = read(MANUSCRIPT_FILE);
const docs = read(DOCS_FILE);
const navigation = read('docs/_data/navigation.yml');
const topPage = read('docs/index.md');

const glossaryConfig = (book.structure && book.structure.appendices || [])
  .find((appendix) => appendix.id === 'glossary');
const appendixPaths = [...navigation.matchAll(/^\s+path:\s*(\/appendices\/[^\s]+\/)$/gm)]
  .map((match) => match[1]);

assert(glossaryConfig, 'book-config.json: structure.appendices must include id "glossary"');
assert(glossaryConfig && glossaryConfig.title === TITLE,
  `book-config.json: glossary title must be ${JSON.stringify(TITLE)}`);
assert(book.ux && book.ux.modules && book.ux.modules.glossary === true,
  'book-config.json: ux.modules.glossary must be true');

assert(navigation.includes(`- title: ${TITLE}`),
  'docs/_data/navigation.yml: glossary title is missing');
assert(appendixPaths.includes(ROUTE),
  `docs/_data/navigation.yml: canonical glossary route ${ROUTE} is missing`);
assert(topPage.includes(ROUTE),
  `docs/index.md: top-page link to ${ROUTE} is missing`);

assert(manuscript === docs, `${MANUSCRIPT_FILE} and ${DOCS_FILE}: mirror content differs`);
assert(manuscript.includes(`title: "${TITLE}"`), `${MANUSCRIPT_FILE}: title is missing`);
assert(manuscript.includes(`order: 103`), `${MANUSCRIPT_FILE}: appendix order must be 103`);

const requiredTerms = [
  '### Git\n',
  '### GitHub\n',
  '### Repository（リポジトリ）\n',
  '### Commit（コミット）\n',
  '### Branch（ブランチ）\n',
  '### Remote（リモート）\n',
  '### Clone（クローン）\n',
  '### Pull（プル）\n',
  '### Push（プッシュ）\n',
  '### Issue（イシュー）\n',
  '### Pull Request（プルリクエスト、PR）\n',
  '### Review（レビュー）\n',
  '### Merge（マージ）\n',
  '### Conflict（コンフリクト、競合）\n',
  '### GitHub Actions\n'
];
for (const term of requiredTerms) {
  const heading = term.trim();
  const headingStart = manuscript.indexOf(term);
  assert(headingStart >= 0, `${MANUSCRIPT_FILE}: required term heading is missing: ${heading}`);
  if (headingStart < 0) continue;

  const sectionStart = headingStart + term.length;
  const nextHeading = manuscript.slice(sectionStart).search(/^#{2,3} /m);
  const section = nextHeading >= 0
    ? manuscript.slice(sectionStart, sectionStart + nextHeading)
    : manuscript.slice(sectionStart);
  assert(/\*\*定義：\*\*\s+\S/.test(section),
    `${MANUSCRIPT_FILE}: ${heading} must include a non-empty definition`);
  assert(/\*\*関連章：\*\*[\s\S]*\{\{ '\/chapters\/[^']+\/' \| relative_url \}\}/.test(section),
    `${MANUSCRIPT_FILE}: ${heading} must include a related chapter link`);
}

const relatedChapterRoutes = [
  '/chapters/chapter-introduction/',
  '/chapters/chapter-git-basics/',
  '/chapters/chapter-repository-creation/',
  '/chapters/chapter-branch-operations/',
  '/chapters/chapter-issue-management/',
  '/chapters/chapter-docs-as-code/',
  '/chapters/chapter-github-actions/',
  '/chapters/chapter-advanced-features/',
  '/chapters/chapter-troubleshooting/'
];
for (const route of relatedChapterRoutes) {
  assert(manuscript.includes(route), `${MANUSCRIPT_FILE}: related chapter link is missing: ${route}`);
}

const resourcesIndex = appendixPaths.indexOf('/appendices/appendix-resources/');
const glossaryIndex = appendixPaths.indexOf(ROUTE);
assert(resourcesIndex >= 0 && glossaryIndex === resourcesIndex + 1,
  'docs/_data/navigation.yml: glossary must immediately follow the resources appendix for previous-page navigation');
assert(glossaryIndex === appendixPaths.length - 1,
  'docs/_data/navigation.yml: glossary must be the last appendix for next-page navigation');

if (errors.length > 0) {
  console.error('Glossary contract check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Glossary contract check passed.');
