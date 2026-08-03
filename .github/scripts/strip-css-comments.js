#!/usr/bin/env node
/*
 * strip-css-comments.js — remove C-style /* … comments from a COPY of the CSS,
 * at deploy time only.
 *
 * ─── Why this file exists ────────────────────────────────────────────────────
 *
 * The comments in assets/verdure.css and assets/style.css are the real
 * documentation of this project: measured contrast ratios, the date a palette
 * changed and why, traps that cost a real bug to find. They must never be
 * deleted from the source. But they are also the single largest thing the
 * browser downloads: in verdure.css the comment blocks are roughly 63% of the
 * gzipped bytes, and a visitor to the home page pays for every one of them
 * without ever reading one.
 *
 * So: the source keeps the comments, and the *published artifact* does not.
 * The workflow checks the repo out onto a throwaway runner, runs this script
 * over that checkout, and uploads the result. Nothing is committed, nothing is
 * installed, no bundler appears. Anyone who clones the repo still gets the CSS
 * with every comment intact. See .github/workflows/deploy.yml.
 *
 * ─── DO NOT RUN THIS ON YOUR WORKING COPY ────────────────────────────────────
 *
 * It rewrites the files you give it IN PLACE. On the runner that is a
 * disposable checkout; on your machine it is the source, and the comments are
 * not recoverable from anywhere except git. If you want to see what it does,
 * copy the file somewhere else first — that is exactly what the test does:
 *
 *     node .github/scripts/strip-css-comments.test.js
 *
 * ─── Why not a regex ─────────────────────────────────────────────────────────
 *
 * /\/\*[\s\S]*?\*\//g looks like it works and then quietly eats live CSS,
 * because a comment opener and a comment closer are ordinary characters inside
 * a string or an unquoted url(). The CSS here already has all three hazards:
 *
 *     content: '…'                     — strings everywhere
 *     content: ''                      — empty strings
 *     url("data:image/svg+xml,…url(%23n)…")  — a url() inside a quoted url()
 *
 * so the stripper is a character-by-character scanner that knows which state it
 * is in: code, comment, single/double-quoted string, or unquoted url() body.
 *
 * ─── The build must die rather than ship broken CSS ──────────────────────────
 *
 * Every run re-scans its own output and compares structural counts with the
 * input — braces, semicolons, at-rules, brace balance, and the absence of any
 * surviving comment opener. A mismatch is process.exit(1). A CSS file that
 * fails to parse is a blank page, and a blank page is worse than 20 KB.
 *
 * Usage:  node strip-css-comments.js <file.css> [more.css …]
 *         node strip-css-comments.js --verify <file.css> [more.css …]
 *
 * --verify writes nothing. It re-parses the given files and insists they hold
 * no comments and balance their braces — the check the workflow runs after the
 * strip, so a second opinion stands between a mangled stylesheet and Pages.
 */

'use strict';

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

/* ── the scanner ─────────────────────────────────────────────────────────────
 *
 * scan() walks the input once and returns three views of it:
 *
 *   code  — the input with comments removed, everything else byte-identical
 *   mask  — one boolean per character of `code`: true when that character sits
 *           inside a string or url() body (so the whitespace pass must not
 *           touch it)
 *   skel  — same length as `code`, but every masked character replaced by 'x'.
 *           Counting braces / semicolons / at-rules on `skel` is automatically
 *           "outside strings", which is the only counting that means anything.
 *
 * Comments are also stripped from `skel`, which matters more than it looks:
 * this file has a comment containing `the@address` and comments containing
 * `;` and `{`, so counting those tokens on the raw text would compare
 * documentation against code and fail for no reason.
 */
function scan(css) {
  const codeChars = [];
  const skelChars = [];
  const mask = [];
  let comments = 0;
  let commentChars = 0;

  // ch goes into `code`; masked=true means "inside a literal, hands off"
  function push(ch, masked) {
    codeChars.push(ch);
    skelChars.push(masked ? 'x' : ch);
    mask.push(masked);
  }

  const isWs = (ch) => ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f';
  // characters that can end an identifier, so `url(` preceded by one of them
  // is not a url token (e.g. a hypothetical `blur(` / `--my-url(`)
  const isIdent = (ch) => /[A-Za-z0-9_\-\\]/.test(ch);

  const lineOf = (idx) => css.slice(0, idx).split('\n').length;

  let i = 0;
  const n = css.length;

  while (i < n) {
    const c = css[i];

    /* comment */
    if (c === '/' && css[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < n && !(css[i] === '*' && css[i + 1] === '/')) i++;
      if (i >= n) {
        throw new Error(`unterminated comment opened on line ${lineOf(start)}`);
      }
      i += 2; // past the closing */
      comments++;
      commentChars += i - start;

      // A comment is a token separator. `margin:0/*c*/10px` must not become
      // `margin:010px`, so drop in a space when both neighbours are solid.
      const prev = codeChars.length ? codeChars[codeChars.length - 1] : '';
      const next = i < n ? css[i] : '';
      if (prev && next && !isWs(prev) && !isWs(next)) push(' ', false);
      continue;
    }

    /* string — `/*` in here is not a comment, and a backslash hides the next
       character whatever it is (including the closing quote) */
    if (c === '"' || c === "'") {
      const quote = c;
      const start = i;
      push(c, false); // the quote itself carries no countable token
      i++;
      let closed = false;
      while (i < n) {
        const d = css[i];
        if (d === '\\') {
          push(d, true);
          if (i + 1 < n) push(css[i + 1], true);
          i += 2;
          continue;
        }
        if (d === quote) {
          push(d, false);
          i++;
          closed = true;
          break;
        }
        if (d === '\n') break; // a raw newline cannot appear in a CSS string
        push(d, true);
        i++;
      }
      if (!closed) {
        throw new Error(`unterminated string opened on line ${lineOf(start)}`);
      }
      continue;
    }

    /* url( … ) with no quotes — the body is raw and may legally contain
       comment openers, comment closers, `;` or braces. Quoted forms fall
       through to the string
       branch above, which is how the data:image/svg+xml value in
       verdure.css (a url(%23n) nested inside a quoted url()) is handled. */
    if ((c === 'u' || c === 'U') && css.slice(i, i + 4).toLowerCase() === 'url(') {
      const before = codeChars.length ? codeChars[codeChars.length - 1] : '';
      if (!before || !isIdent(before)) {
        const start = i;
        for (let k = 0; k < 4; k++) push(css[i + k], false);
        i += 4;
        while (i < n && isWs(css[i])) { push(css[i], false); i++; } // leading space
        if (i < n && (css[i] === '"' || css[i] === "'")) continue; // quoted: let the string branch take it
        let closed = false;
        while (i < n) {
          const d = css[i];
          if (d === '\\') {
            push(d, true);
            if (i + 1 < n) push(css[i + 1], true);
            i += 2;
            continue;
          }
          if (d === ')') { push(d, false); i++; closed = true; break; }
          push(d, true);
          i++;
        }
        if (!closed) {
          throw new Error(`unterminated url() opened on line ${lineOf(start)}`);
        }
        continue;
      }
    }

    push(c, false);
    i++;
  }

  return {
    code: codeChars.join(''),
    skel: skelChars.join(''),
    codeChars,
    mask,
    comments,
    commentChars,
  };
}

/* ── whitespace tidy ─────────────────────────────────────────────────────────
 *
 * Removing a comment that owned a whole line leaves the line behind, empty —
 * and removing one that sat between two spaces leaves both spaces. Outside a
 * literal, whitespace in CSS is only a separator: a run of it means exactly
 * what one space means, so a run collapses to one and indentation goes. It
 * never collapses to nothing, because `.a .b` and `.a.b` are different
 * selectors and `calc(1px - -1px)` needs its spaces.
 *
 * The mask is what keeps this honest: whitespace inside a string or an
 * unquoted url() is marked, and never touched.
 */
function tidy(codeChars, mask) {
  const out = [];
  const outMask = [];
  const isSpace = (ch) => ch === ' ' || ch === '\t';

  for (let i = 0; i < codeChars.length; i++) {
    const ch = codeChars[i];
    const m = mask[i];

    if (!m && isSpace(ch)) {
      const prev = out.length ? out[out.length - 1] : '';
      const prevMasked = out.length ? outMask[out.length - 1] : false;
      // already separated by a space, or sitting at the start of a line
      if (!out.length) continue;
      if (!prevMasked && (isSpace(prev) || prev === '\n')) continue;
      out.push(' '); // tabs become one space
      outMask.push(false);
      continue;
    }

    if (!m && (ch === '\n' || ch === '\r')) {
      // drop trailing spaces/tabs on the line we are closing
      while (out.length && !outMask[out.length - 1] && isSpace(out[out.length - 1])) {
        out.pop();
        outMask.pop();
      }
      if (ch === '\r') continue; // normalise CRLF/CR to \n
      // collapse a run of blank lines into one newline
      if (out.length && !outMask[out.length - 1] && out[out.length - 1] === '\n') continue;
      if (!out.length) continue; // no leading blank lines
    }

    out.push(ch);
    outMask.push(m);
  }

  // trailing whitespace at end of file
  while (out.length && !outMask[out.length - 1] && /\s/.test(out[out.length - 1])) {
    out.pop();
    outMask.pop();
  }

  return out.join('') + '\n';
}

/* ── counts that must survive ────────────────────────────────────────────── */

const AT_RULES = [
  '@media', '@supports', '@container', '@keyframes', '@font-face',
  '@import', '@layer', '@property', '@charset', '@view-transition', '@page',
];

function count(skel) {
  const c = {
    open: 0, close: 0, semi: 0,
    parenOpen: 0, parenClose: 0,
    depthMin: 0, depthEnd: 0,
    at: {},
  };
  let depth = 0;
  for (let i = 0; i < skel.length; i++) {
    const ch = skel[i];
    if (ch === '{') { c.open++; depth++; }
    else if (ch === '}') { c.close++; depth--; if (depth < c.depthMin) c.depthMin = depth; }
    else if (ch === ';') c.semi++;
    else if (ch === '(') c.parenOpen++;
    else if (ch === ')') c.parenClose++;
  }
  c.depthEnd = depth;
  for (const name of AT_RULES) {
    const m = skel.match(new RegExp(name.replace('-', '\\-'), 'gi'));
    c.at[name] = m ? m.length : 0;
  }
  return c;
}

/* ── the public operation ────────────────────────────────────────────────────
 * Returns { output, before, after, problems[] }. `problems` non-empty means
 * the caller must not write the file.
 */
function strip(css, label) {
  const problems = [];

  const first = scan(css);
  const output = tidy(first.codeChars, first.mask);
  const second = scan(output); // re-scan what we would actually ship

  const a = count(first.skel);
  const b = count(second.skel);

  const eq = (what, x, y) => {
    if (x !== y) problems.push(`${label}: ${what} changed — ${x} before, ${y} after`);
  };

  eq('{ count', a.open, b.open);
  eq('} count', a.close, b.close);
  eq('; count', a.semi, b.semi);
  eq('( count', a.parenOpen, b.parenOpen);
  eq(') count', a.parenClose, b.parenClose);
  for (const name of AT_RULES) eq(`${name} count`, a.at[name], b.at[name]);

  if (b.open !== b.close) {
    problems.push(`${label}: braces do not balance — ${b.open} { vs ${b.close} }`);
  }
  if (b.depthMin < 0) {
    problems.push(`${label}: a } appears before its { (nesting went to ${b.depthMin})`);
  }
  if (b.depthEnd !== 0) {
    problems.push(`${label}: file ends inside ${b.depthEnd} unclosed block(s)`);
  }
  if (second.comments !== 0) {
    problems.push(`${label}: ${second.comments} comment(s) survived the strip`);
  }
  if (second.skel.includes('/*')) {
    problems.push(`${label}: a /* is still present outside a string`);
  }
  if (output.length > css.length) {
    problems.push(`${label}: output grew — ${css.length} → ${output.length} chars`);
  }
  if (output.length === css.length) {
    problems.push(`${label}: output is the same size as the input — nothing was stripped`);
  }

  return {
    output,
    problems,
    comments: first.comments,
    commentChars: first.commentChars,
  };
}

/* ── cli ─────────────────────────────────────────────────────────────────── */

function human(n) {
  return n.toLocaleString('en-US');
}

function gz(str) {
  return zlib.gzipSync(Buffer.from(str, 'utf8'), { level: 9 }).length;
}

/* Read-only second opinion for the workflow. A plain grep for a comment opener
   cannot do this job — a CSS string is allowed to contain one, and grep would
   fail the deploy over a perfectly good stylesheet. The check has to be the
   same string-aware scanner. */
function verify(files) {
  let failed = false;
  for (const file of files) {
    let css;
    try {
      css = fs.readFileSync(path.resolve(file), 'utf8');
    } catch (err) {
      console.error(`✗ ${file}: cannot read — ${err.message}`);
      failed = true;
      continue;
    }
    let s;
    try {
      s = scan(css);
    } catch (err) {
      console.error(`✗ ${file}: does not parse — ${err.message}`);
      failed = true;
      continue;
    }
    const c = count(s.skel);
    const bad = [];
    if (s.comments) bad.push(`${s.comments} comment(s) still present`);
    if (c.open !== c.close) bad.push(`braces do not balance (${c.open} { vs ${c.close} })`);
    if (c.depthMin < 0) bad.push('a } appears before its {');
    if (c.depthEnd !== 0) bad.push(`ends inside ${c.depthEnd} unclosed block(s)`);
    if (bad.length) {
      console.error(`✗ ${file}: ${bad.join('; ')}`);
      failed = true;
    } else {
      console.log(`✓ ${file}: no comments, ${c.open} balanced rule block(s), ${c.semi} declaration(s)`);
    }
  }
  if (failed) {
    console.error('\nstrip-css-comments --verify: the published CSS would be wrong.');
    process.exit(1);
  }
}

function main(argv) {
  const flags = argv.slice(2).filter((a) => a.startsWith('--'));
  const files = argv.slice(2).filter((a) => !a.startsWith('--'));
  if (!files.length) {
    console.error('usage: node strip-css-comments.js [--verify] <file.css> [more.css …]');
    console.error('       (rewrites the files IN PLACE — never run it on your working copy)');
    process.exit(2);
  }

  if (flags.includes('--verify')) return verify(files);

  let failed = false;
  let totalBefore = 0, totalAfter = 0, totalGzBefore = 0, totalGzAfter = 0;

  for (const file of files) {
    const abs = path.resolve(file);
    let css;
    try {
      css = fs.readFileSync(abs, 'utf8');
    } catch (err) {
      console.error(`✗ ${file}: cannot read — ${err.message}`);
      failed = true;
      continue;
    }

    let result;
    try {
      result = strip(css, path.basename(file));
    } catch (err) {
      console.error(`✗ ${file}: parse failed — ${err.message}`);
      failed = true;
      continue;
    }

    if (result.problems.length) {
      for (const p of result.problems) console.error(`✗ ${p}`);
      failed = true;
      continue;
    }

    const beforeBytes = Buffer.byteLength(css, 'utf8');
    const afterBytes = Buffer.byteLength(result.output, 'utf8');
    const gzBefore = gz(css);
    const gzAfter = gz(result.output);

    fs.writeFileSync(abs, result.output, 'utf8');

    totalBefore += beforeBytes; totalAfter += afterBytes;
    totalGzBefore += gzBefore; totalGzAfter += gzAfter;

    const pct = (x, y) => (100 * (x - y) / x).toFixed(1);
    console.log(
      `✓ ${file}\n` +
      `    ${result.comments} comment block(s), ${human(result.commentChars)} chars of documentation removed\n` +
      `    raw  ${human(beforeBytes)} → ${human(afterBytes)} bytes  (−${pct(beforeBytes, afterBytes)}%)\n` +
      `    gzip ${human(gzBefore)} → ${human(gzAfter)} bytes  (−${pct(gzBefore, gzAfter)}%)`
    );
  }

  if (files.length > 1 && !failed) {
    console.log(
      `— total raw  ${human(totalBefore)} → ${human(totalAfter)} bytes\n` +
      `— total gzip ${human(totalGzBefore)} → ${human(totalGzAfter)} bytes ` +
      `(−${human(totalGzBefore - totalGzAfter)} over the wire)`
    );
  }

  if (failed) {
    console.error('\nstrip-css-comments: refusing to continue. The published CSS would be wrong.');
    process.exit(1);
  }
}

module.exports = { strip, scan, tidy, count, verify };

if (require.main === module) main(process.argv);
