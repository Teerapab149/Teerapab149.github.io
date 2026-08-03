#!/usr/bin/env node
/*
 * strip-css-comments.test.js — proof that the stripper does not eat live CSS.
 *
 * Plain Node, no test framework, no dependency; the repo has no build step and
 * this does not become one. The workflow runs this BEFORE it strips anything,
 * so a parser that has stopped being correct fails the deploy instead of
 * publishing a broken stylesheet.
 *
 *     node .github/scripts/strip-css-comments.test.js
 *
 * The last block runs the stripper over the project's own assets/verdure.css
 * and assets/style.css. Those two are opened READ-ONLY; the stripped copies go
 * to the OS temp directory. This test never writes inside the repo.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const zlib = require('zlib');
const { strip } = require('./strip-css-comments.js');

let pass = 0;
let fail = 0;

function check(name, fn) {
  try {
    fn();
    pass++;
    console.log(`  ok   ${name}`);
  } catch (err) {
    fail++;
    console.log(`  FAIL ${name}\n         ${err.message}`);
  }
}

function eq(actual, expected, what) {
  if (actual !== expected) {
    throw new Error(`${what || 'value'}\n         expected: ${JSON.stringify(expected)}\n         actual:   ${JSON.stringify(actual)}`);
  }
}

// run strip() and insist it had no complaints
function run(css, label) {
  const r = strip(css, label || 'test');
  if (r.problems.length) throw new Error('invariant failed: ' + r.problems.join('; '));
  return r.output;
}

// strip() refuses no-op input by design, so short fixtures get a comment
// appended to guarantee something is removed; we compare the part before it.
function stripKeep(css) {
  const marker = '\n/* padding comment so the size check has something to eat */\n';
  return run(css + marker).trim();
}

console.log('strip-css-comments — parser');

check('plain comment goes, declaration stays', () => {
  eq(stripKeep('.a { color: red; /* why */ }'), '.a { color: red; }');
});

check('content: "/* not a comment */" is left alone', () => {
  const css = '.a::after { content: "/* not a comment */"; }';
  eq(stripKeep(css), css);
});

check("content: '*/' does not derail the parser", () => {
  const css = ".a::after { content: '*/'; color: red; }";
  eq(stripKeep(css), css);
});

check('a comment after a string with */ in it is still removed', () => {
  const css = ".a::after { content: '*/'; /* gone */ color: red; }";
  eq(stripKeep(css), ".a::after { content: '*/'; color: red; }");
});

check("content: '' (empty string) survives", () => {
  const css = '.a::before { content: \'\'; position: absolute; }';
  eq(stripKeep(css), css);
});

check('escaped quote inside a string does not end it', () => {
  const css = '.a::after { content: "he said \\" /* nope */ done"; }';
  eq(stripKeep(css), css);
});

check('escaped backslash at end of string still ends the string', () => {
  const css = '.a::after { content: "back\\\\"; /* gone */ color: red; }';
  eq(stripKeep(css), '.a::after { content: "back\\\\"; color: red; }');
});

check('multi-line comment block goes entirely', () => {
  const css = [
    '/* line one',
    '   line two — with a { and a ; in it',
    '   line three */',
    '.a { color: red; }',
  ].join('\n');
  eq(stripKeep(css), '.a { color: red; }');
});

check('/*** banner *** with many stars ***/ goes', () => {
  eq(stripKeep('/*** banner *** stars ***/\n.a { color: red; }'), '.a { color: red; }');
});

check('/**/ (empty comment) goes', () => {
  eq(stripKeep('.a { color:/**/red; }'), '.a { color: red; }');
});

check('a comment between two tokens leaves a separator behind', () => {
  // margin:0/*c*/10px must not collapse into margin:010px
  eq(stripKeep('.a { margin: 0/* c */10px; }'), '.a { margin: 0 10px; }');
});

check('quoted data: URI containing url(%23n) is untouched', () => {
  const css = ".a { background-image: url(\"data:image/svg+xml,%3Csvg%3E%3Crect filter='url(%23n)'/%3E%3C/svg%3E\"); }";
  eq(stripKeep(css), css);
});

check('unquoted url() body may contain a comment opener', () => {
  const css = '.a { background: url(img/*name*/x.png); }';
  eq(stripKeep(css), css);
});

check('unquoted url() with spaces and a semicolon survives', () => {
  const css = '.a { background: url( data:image/svg+xml;utf8,<svg/> ); }';
  eq(stripKeep(css), css);
});

check('blur( is not mistaken for url(', () => {
  const css = '.a { filter: blur(2px); /* gone */ }';
  eq(stripKeep(css), '.a { filter: blur(2px); }');
});

check('at-rules and nesting are preserved', () => {
  const css = [
    '@media (min-width: 48rem) { /* wide */',
    '  @supports (display: grid) { .a { display: grid; } }',
    '}',
    '@keyframes spin { from { rotate: 0deg; } to { rotate: 360deg; } }',
  ].join('\n');
  const out = stripKeep(css);
  eq(/@media/.test(out), true, '@media kept');
  eq(/@supports/.test(out), true, '@supports kept');
  eq(/@keyframes/.test(out), true, '@keyframes kept');
  eq(out.includes('/*'), false, 'no comment left');
});

check('a comment containing @media does not upset the at-rule count', () => {
  // the invariant counts at-rules OUTSIDE comments — verdure.css really does
  // have HTML and at-signs inside its documentation blocks
  const css = '/* the @media below, and the@address example */\n@media print { .a { color: #000; } }';
  const out = stripKeep(css);
  eq((out.match(/@media/g) || []).length, 1, 'one @media survives');
});

check('CRLF input comes out with LF', () => {
  const out = run('.a {\r\n  color: red; /* x */\r\n}\r\n');
  eq(out.includes('\r'), false, 'no CR left');
});

check('comment-only lines do not leave blank lines behind', () => {
  const css = '.a { color: red; }\n/* note */\n/* note */\n.b { color: blue; }\n';
  eq(stripKeep(css), '.a { color: red; }\n.b { color: blue; }');
});

console.log('strip-css-comments — invariants must fail loudly');

check('unterminated comment throws', () => {
  let threw = false;
  try { strip('.a { color: red; } /* never closed', 'x'); } catch (e) { threw = true; }
  eq(threw, true, 'threw');
});

check('unterminated string throws', () => {
  let threw = false;
  try { strip('.a::after { content: "oops;\n}\n/* c */', 'x'); } catch (e) { threw = true; }
  eq(threw, true, 'threw');
});

check('unbalanced braces are reported, not written', () => {
  const r = strip('.a { color: red; /* c */', 'x');
  eq(r.problems.length > 0, true, 'problems reported');
});

check('a stray } is reported', () => {
  const r = strip('} .a { color: red; } /* c */', 'x');
  eq(r.problems.some((p) => /before its/.test(p)), true, 'negative nesting reported');
});

check('input with no comments at all is reported as a no-op', () => {
  const r = strip('.a { color: red; }\n', 'x');
  eq(r.problems.some((p) => /nothing was stripped/.test(p)), true, 'no-op reported');
});

/* ── the real files ──────────────────────────────────────────────────────── */

console.log('strip-css-comments — the project\'s own CSS (read-only; output goes to temp)');

const repoRoot = path.resolve(__dirname, '..', '..');
const targets = ['assets/verdure.css', 'assets/style.css', 'assets/rail.css'];
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'strip-css-'));

for (const rel of targets) {
  const abs = path.join(repoRoot, rel);
  if (!fs.existsSync(abs)) {
    console.log(`  skip ${rel} (not present)`);
    continue;
  }
  check(rel, () => {
    const css = fs.readFileSync(abs, 'utf8');
    const r = strip(css, rel);
    if (r.problems.length) throw new Error(r.problems.join('; '));

    const before = Buffer.byteLength(css, 'utf8');
    const after = Buffer.byteLength(r.output, 'utf8');
    const gzBefore = zlib.gzipSync(Buffer.from(css, 'utf8'), { level: 9 }).length;
    const gzAfter = zlib.gzipSync(Buffer.from(r.output, 'utf8'), { level: 9 }).length;

    fs.writeFileSync(path.join(tmpDir, path.basename(rel)), r.output, 'utf8');

    // stripping twice must produce the same bytes as stripping once, minus the
    // second run's "nothing to strip" complaint — proof the pass is stable
    const again = strip(r.output, rel + ' (second pass)');
    if (again.output.trim() !== r.output.trim()) {
      throw new Error('not idempotent: a second pass changed the file again');
    }

    console.log(
      `         ${r.comments} comments, ${r.commentChars.toLocaleString('en-US')} chars of docs\n` +
      `         raw  ${before.toLocaleString('en-US')} → ${after.toLocaleString('en-US')}  ` +
      `(−${(100 * (before - after) / before).toFixed(1)}%)\n` +
      `         gzip ${gzBefore.toLocaleString('en-US')} → ${gzAfter.toLocaleString('en-US')}  ` +
      `(−${(100 * (gzBefore - gzAfter) / gzBefore).toFixed(1)}%)`
    );
  });
}

// the source must be exactly where we found it
check('the repo\'s CSS was not modified by this test', () => {
  for (const rel of targets) {
    const abs = path.join(repoRoot, rel);
    if (!fs.existsSync(abs)) continue;
    const css = fs.readFileSync(abs, 'utf8');
    if (!css.includes('/*')) throw new Error(`${rel} lost its comments — the test wrote to the source`);
  }
});

console.log(`\nstripped copies left in ${tmpDir}`);
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
