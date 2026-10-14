import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extract } from '../src/index.js';

test('splits a simple file with extension', () => {
  const result = extract('file.txt');
  assert.deepEqual(result, {
    directory: '',
    basename: 'file.txt',
    filename: 'file',
    extension: '.txt',
  });
});

test('splits an absolute path', () => {
  const result = extract('/usr/local/bin/program');
  assert.deepEqual(result, {
    directory: '/usr/local/bin',
    basename: 'program',
    filename: 'program',
    extension: '',
  });
});

test('splits a relative path with directory', () => {
  const result = extract('docs/readme.md');
  assert.deepEqual(result, {
    directory: 'docs',
    basename: 'readme.md',
    filename: 'readme',
    extension: '.md',
  });
});

test('treats hidden files as having no extension', () => {
  const result = extract('/home/user/.bashrc');
  assert.deepEqual(result, {
    directory: '/home/user',
    basename: '.bashrc',
    filename: '.bashrc',
    extension: '',
  });
});

test('handles dotted filenames with multiple dots', () => {
  const result = extract('archive.tar.gz');
  assert.deepEqual(result, {
    directory: '',
    basename: 'archive.tar.gz',
    filename: 'archive.tar',
    extension: '.gz',
  });
});

test('handles hidden file with extension', () => {
  const result = extract('/config/.app.conf');
  assert.deepEqual(result, {
    directory: '/config',
    basename: '.app.conf',
    filename: '.app',
    extension: '.conf',
  });
});

test('returns empty filename for path with trailing slash', () => {
  const result = extract('/var/log/');
  assert.deepEqual(result, {
    directory: '/var/log',
    basename: '',
    filename: '',
    extension: '',
  });
});

test('handles root path', () => {
  const result = extract('/');
  assert.deepEqual(result, {
    directory: '',
    basename: '',
    filename: '',
    extension: '',
  });
});

test('handles empty string', () => {
  const result = extract('');
  assert.deepEqual(result, {
    directory: '',
    basename: '',
    filename: '',
    extension: '',
  });
});

test('handles filename starting with dot and no other dots', () => {
  const result = extract('.gitignore');
  assert.deepEqual(result, {
    directory: '',
    basename: '.gitignore',
    filename: '.gitignore',
    extension: '',
  });
});

test('handles filename ending with a dot', () => {
  const result = extract('noext.');
  assert.deepEqual(result, {
    directory: '',
    basename: 'noext.',
    filename: 'noext',
    extension: '.',
  });
});

test('throws TypeError for non-string input', () => {
  assert.throws(() => extract(null), /extract\(\) expected a string, got null/);
  assert.throws(() => extract(42), /extract\(\) expected a string, got number/);
});
