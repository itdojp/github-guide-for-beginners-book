#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPO = 'itdojp/github-guide-for-beginners-book';
const PAGES_URL = 'https://itdojp.github.io/github-guide-for-beginners-book/';
const DESCRIPTION = 'GitとGitHubの基本操作から実践的な運用まで、初心者が段階的に学べる実用ガイド';

const errors = [];

function readText(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(readText(file));
  } catch (error) {
    errors.push(`${file}: JSON parse failed: ${error.message}`);
    return {};
  }
}

function parseScalarYaml(file) {
  const result = {};
  for (const line of readText(file).split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[match[1]] = value;
  }
  return result;
}

function parseFrontMatter(file) {
  const text = readText(file);
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    errors.push(`${file}: front matter not found`);
    return {};
  }
  const result = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[m[1]] = value;
  }
  return result;
}

function parseNavigation(file) {
  const result = { chapters: [], appendices: [] };
  let section = null;
  let current = null;
  for (const line of readText(file).split(/\r?\n/)) {
    const sectionMatch = line.match(/^([A-Za-z0-9_-]+):\s*$/);
    if (sectionMatch) {
      section = sectionMatch[1];
      current = null;
      continue;
    }
    if (!['chapters', 'appendices'].includes(section)) continue;
    const titleMatch = line.match(/^\s*-\s+title:\s*(.*)$/);
    if (titleMatch) {
      current = { title: titleMatch[1].trim() };
      result[section].push(current);
      continue;
    }
    const pathMatch = line.match(/^\s+path:\s*(.*)$/);
    if (pathMatch && current) {
      current.path = pathMatch[1].trim();
    }
  }
  return result;
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    errors.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertTruthy(value, label) {
  if (!value) {
    errors.push(`${label}: expected a non-empty value`);
  }
}

function assertNoDuplicates(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) {
      errors.push(`${label}: duplicate entry ${JSON.stringify(value)}`);
    }
    seen.add(value);
  }
}

function chapterIdFromPath(navPath) {
  const match = navPath && navPath.match(/^\/chapters\/chapter-([^/]+)\/$/);
  return match ? match[1] : null;
}

function appendixIdFromPath(navPath) {
  const match = navPath && navPath.match(/^\/appendices\/appendix-([^/]+)\/$/);
  return match ? match[1] : null;
}

function assertPathExists(navPath, label) {
  if (!navPath || !navPath.startsWith('/')) {
    errors.push(`${label}: invalid path ${JSON.stringify(navPath)}`);
    return;
  }
  const file = path.join(ROOT, 'docs', navPath.replace(/^\//, ''), 'index.md');
  if (!fs.existsSync(file)) {
    errors.push(`${label}: missing docs page ${path.relative(ROOT, file)}`);
  }
}

const pkg = readJson('package.json');
const lock = readJson('package-lock.json');
const book = readJson('book-config.json');
const rootConfig = parseScalarYaml('_config.yml');
const docsConfig = parseScalarYaml('docs/_config.yml');
const indexFrontMatter = parseFrontMatter('docs/index.md');
const navigation = parseNavigation('docs/_data/navigation.yml');

const version = pkg.version;
assertTruthy(version, 'package.json version');

assertEqual(pkg.description, DESCRIPTION, 'package.json description');
assertEqual(pkg.author, 'ITDO Inc.', 'package.json author');
assertEqual(pkg.license, 'CC-BY-NC-SA-4.0', 'package.json license');
assertEqual(pkg.repository && pkg.repository.url, `https://github.com/${REPO}.git`, 'package.json repository.url');
assertEqual(pkg.homepage, PAGES_URL, 'package.json homepage');
assertEqual(pkg.bugs && pkg.bugs.url, `https://github.com/${REPO}/issues`, 'package.json bugs.url');
assertEqual(pkg.scripts && pkg.scripts['check:metadata'], 'node scripts/check-metadata-consistency.js', 'package.json scripts.check:metadata');
assertTruthy((pkg.scripts && pkg.scripts.test || '').includes('npm run check:metadata'), 'package.json scripts.test includes check:metadata');

assertEqual(lock.name, pkg.name, 'package-lock.json name');
assertEqual(lock.version, version, 'package-lock.json version');
assertEqual(lock.packages && lock.packages[''] && lock.packages[''].version, version, 'package-lock.json root package version');
assertEqual(lock.packages && lock.packages[''] && lock.packages[''].license, pkg.license, 'package-lock.json root package license');

assertEqual(book.title, rootConfig.title, 'book-config.json title matches _config.yml');
assertEqual(book.title, docsConfig.title, 'book-config.json title matches docs/_config.yml');
assertEqual(book.description, DESCRIPTION, 'book-config.json description');
assertEqual(book.author, pkg.author, 'book-config.json author');
assertEqual(book.version, version, 'book-config.json version');

for (const [file, config] of [['_config.yml', rootConfig], ['docs/_config.yml', docsConfig]]) {
  assertEqual(config.description, DESCRIPTION, `${file} description`);
  assertEqual(config.author, pkg.author, `${file} author`);
  assertEqual(config.version, version, `${file} version`);
  assertEqual(config.repository, REPO, `${file} repository`);
}
assertEqual(docsConfig.url, 'https://itdojp.github.io', 'docs/_config.yml url');
assertEqual(docsConfig.baseurl, '/github-guide-for-beginners-book', 'docs/_config.yml baseurl');
assertEqual(indexFrontMatter.version, version, 'docs/index.md front matter version');
assertEqual(indexFrontMatter.author, pkg.author, 'docs/index.md front matter author');

const chapterIds = (book.structure && book.structure.chapters || []).map((item) => item.id);
const appendixIds = (book.structure && book.structure.appendices || []).map((item) => item.id);
const navChapterIds = navigation.chapters.map((item) => chapterIdFromPath(item.path));
const navAppendixIds = navigation.appendices.map((item) => appendixIdFromPath(item.path));

assertNoDuplicates(chapterIds, 'book-config.json structure.chapters ids');
assertNoDuplicates(appendixIds, 'book-config.json structure.appendices ids');
assertNoDuplicates(navigation.chapters.map((item) => item.path), 'docs/_data/navigation.yml chapters paths');
assertNoDuplicates(navigation.appendices.map((item) => item.path), 'docs/_data/navigation.yml appendices paths');

assertEqual(JSON.stringify(chapterIds), JSON.stringify(navChapterIds), 'book-config.json chapter id order matches docs navigation paths');
assertEqual(JSON.stringify(appendixIds), JSON.stringify(navAppendixIds), 'book-config.json appendix id order matches docs navigation paths');

navigation.chapters.forEach((item, index) => {
  assertTruthy(chapterIdFromPath(item.path), `navigation chapter ${index + 1} path can be mapped to an id`);
  assertPathExists(item.path, `navigation chapter ${index + 1}`);
  const configItem = (book.structure && book.structure.chapters || [])[index] || {};
  assertEqual(configItem.title, item.title, `book-config.json chapter ${index + 1} title`);
});
navigation.appendices.forEach((item, index) => {
  assertTruthy(appendixIdFromPath(item.path), `navigation appendix ${index + 1} path can be mapped to an id`);
  assertPathExists(item.path, `navigation appendix ${index + 1}`);
  const configItem = (book.structure && book.structure.appendices || [])[index] || {};
  assertEqual(configItem.title, item.title, `book-config.json appendix ${index + 1} title`);
});

if (errors.length > 0) {
  console.error('Metadata consistency check failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Metadata consistency check passed.');
