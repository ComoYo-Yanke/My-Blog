/**
 * 扫描 posts/ 下的所有 .md，读取 front matter，生成 posts/index.json
 *
 *   node scripts/build-posts.mjs
 *
 * 零依赖，Node 14+ 即可运行。
 * 文章元信息以 .md 文件顶部的 front matter 为唯一来源，不再手改 index.html。
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = join(ROOT, 'posts');
const OUT_FILE = join(POSTS_DIR, 'index.json');

/* ---------- front matter ---------- */

/** 只认文件最开头的 --- 块，正文里的 --- 不受影响 */
function parseFrontMatter(raw) {
    const m = raw.match(/^﻿?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
    if (!m) return { data: {}, body: raw };

    const data = {};
    for (const line of m[1].split(/\r?\n/)) {
        const t = line.trim();
        if (!t || t.startsWith('#')) continue;
        const i = line.indexOf(':');
        if (i === -1) continue;
        const key = line.slice(0, i).trim().toLowerCase();
        let val = line.slice(i + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }
        data[key] = val;
    }
    return { data, body: raw.slice(m[0].length) };
}

function parseTags(v) {
    if (!v) return [];
    return v
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map(t => t.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
}

const isTrue = v => /^(true|yes|1)$/i.test(String(v ?? '').trim());

/* ---------- 兜底策略：front matter 没写也能用 ---------- */

/** my-first-trip -> My First Trip */
const titleFromSlug = slug =>
    slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const toDate = d => {
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

/** 取正文第一段纯文字当摘要，跳过标题、代码块、列表、引用、HTML */
function excerptFromBody(body, max = 140) {
    for (const block of body.split(/\r?\n[ \t]*\r?\n/)) {
        const t = block.trim();
        if (!t || /^(#{1,6}\s|```|~~~|>|\||[-*+]\s|\d+\.\s|<)/.test(t)) continue;
        const plain = t.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim();
        if (!plain) continue;
        return plain.length > max ? plain.slice(0, max).replace(/\s+\S*$/, '') + '…' : plain;
    }
    return '';
}

/* ---------- 主流程 ---------- */

const warnings = [];
const posts = [];
const seen = new Set();

const entries = await readdir(POSTS_DIR, { withFileTypes: true });

for (const entry of entries) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.md')) continue;

    const stem = basename(entry.name, '.md');
    if (stem.startsWith('_')) continue; // _draft.md 之类的下划线文件直接跳过

    const filePath = join(POSTS_DIR, entry.name);
    const raw = await readFile(filePath, 'utf8');
    const { data, body } = parseFrontMatter(raw);

    if (isTrue(data.draft)) {
        console.log(`  skip   ${entry.name}  (draft: true)`);
        continue;
    }

    /* slug 只用于 URL；file 才是磁盘上的真实文件名。
       文件名是中文时，可以在 front matter 里写 slug: 换个 ASCII 短链。 */
    const slug = (data.slug || stem).trim();
    if (seen.has(slug)) warnings.push(`${entry.name}: slug「${slug}」和别的文章重复了，URL 会撞车`);
    seen.add(slug);

    if (!data.title) warnings.push(`${entry.name}: 没写 title，已用文件名「${titleFromSlug(stem)}」代替`);

    let date = data.date || '';
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        warnings.push(`${entry.name}: date「${date}」不是 YYYY-MM-DD 格式，已改用文件修改时间`);
        date = '';
    }
    if (!date) date = toDate((await stat(filePath)).mtime);

    const excerpt = data.excerpt || data.description || excerptFromBody(body);

    posts.push({
        slug,
        file: entry.name,
        title: data.title || titleFromSlug(stem),
        date,
        tags: parseTags(data.tags),
        excerpt,
    });
    console.log(`  post   ${entry.name}  -> ${posts[posts.length - 1].title}  (${date})`);
}

/* 按日期倒序，同一天再按 slug 排，保证每次生成的 index.json 稳定 */
posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

await writeFile(OUT_FILE, JSON.stringify(posts, null, 2) + '\n', 'utf8');

console.log(`\n  wrote  posts/index.json  (${posts.length} post${posts.length === 1 ? '' : 's'})`);
if (warnings.length) {
    console.log('\n  warnings:');
    for (const w of warnings) console.log(`    - ${w}`);
}
