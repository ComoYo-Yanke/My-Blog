/* ============================================================
   1. 站点配置
   ============================================================ */
const SITE = {
    name: 'CoMoYo-Yanke',
    avatar: 'CY',
    bio: 'A place to record learning, thoughts and life.',
    github: 'https://github.com/ComoYo-Yanke',
    gitee: 'https://gitee.com/yanke_4_0',
    email: 'comoyoyanke@outlook.com',
};

/* ============================================================
   2. 文章清单
   ── 不再手写数组：清单由 scripts/build-posts.mjs 扫描 posts/*.md 生成，
      文章元信息写在每个 .md 顶部的 front matter 里
   ── 新增文章 = 往 posts/ 丢一个 .md（然后跑一次脚本）
============================================================ */
const POSTS_INDEX = 'posts/index.json';
let POSTS = [];
let postsError = null;
let postsLoaded = false;

/* 去掉 .md 顶部的 front matter，否则会被 marked 当成正文渲染出来 */
function stripFrontMatter(md) {
    return md.replace(/^﻿?---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(\r?\n|$)/, '');
}

/* 载入清单。no-cache 保证重新部署后立刻能看到新文章，而不是吃缓存 */
async function loadPosts() {
    if (postsLoaded) return POSTS;
    try {
        const res = await fetch(POSTS_INDEX, { cache: 'no-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        POSTS = Array.isArray(data) ? data : (data.posts || []);
        postsLoaded = true;
        postsError = null; // 上次失败过，这次成功了就把错误清掉
    } catch (e) {
        /* 不设 postsLoaded，这样切页面时还会再试一次 */
        postsError = e.message;
        console.error('[posts] 载入 ' + POSTS_INDEX + ' 失败：' + e.message);
    }
    return POSTS;
}

/* 清单载入失败时给个能自救的提示，而不是干巴巴一句 "No posts yet" */
function postsErrorHTML() {
    return `
    <div class="empty">
      <p>😕 Could not load <code>${POSTS_INDEX}</code> (${postsError})</p>
      <p style="margin-top:10px;font-size:.9em">
        Run <code>node scripts/build-posts.mjs</code> to regenerate it, then reload.
      </p>
    </div>`;
}

/* ============================================================
   3. 开源项目清单
   ── 数据来源：GitHub API / Gitee API，抓取于 2026-10-14
   ── langs 里带 pct 的为仓库语言占比统计；不带 pct 的为仓库文件构成
============================================================ */
/* 语言配色，取自 GitHub Linguist */
const LANG_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Vue: '#41b883',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    Sass: '#a53b70',
    HTML: '#e34c26',
    Python: '#3572A5',
    Java: '#b07219',
    Markdown: '#083fa1',
};

const PROJECTS = [
    {
        name: 'MOA',
        desc: 'Minecraft Online Assistant — a desktop tool that simplifies online multiplayer, supporting LAN, VPN, server and intranet penetration. Fully free and non-profit.',
        url: 'https://github.com/ComoYo-Yanke/MOA',
        icon: '⛏️',
        host: 'github',
        featured: true,
        langs: [
            { name: 'Vue', pct: 72.5 },
            { name: 'JavaScript', pct: 11.9 },
            { name: 'CSS', pct: 7.6 },
            { name: 'TypeScript', pct: 6.4 },
            { name: 'HTML', pct: 1.6 },
        ],
        stars: 2,
    },
    {
        name: 'my-daw',
        desc: 'A digital audio workstation (DAW), similar to FL Studio.',
        url: 'https://github.com/ComoYo-Yanke/my-daw',
        icon: '🎹',
        host: 'github',
        featured: true,
        langs: [
            { name: 'TypeScript', pct: 90.3 },
            { name: 'CSS', pct: 9.6 },
        ],
        stars: 6,
    },
    {
        name: 'CCHabit',
        desc: 'Fully local · No server · No account · No network. A TapHabit-style habit tracker — all data lives in WeChat Mini Program storage.',
        url: 'https://github.com/ComoYo-Yanke/CCHabit',
        icon: '🌱',
        host: 'github',
        featured: true,
        langs: [{ name: 'JavaScript', pct: 100 }],
        stars: 4,
    },
    {
        name: 'AI-Blog',
        desc: 'An enterprise-grade full-stack blog platform with real-time capabilities.',
        url: 'https://github.com/ComoYo-Yanke/AI-Blog',
        icon: '📰',
        host: 'github',
        langs: [
            { name: 'Vue', pct: 48.0 },
            { name: 'Java', pct: 44.4 },
            { name: 'JavaScript', pct: 5.0 },
            { name: 'CSS', pct: 2.4 },
        ],
        stars: 2,
    },
    {
        name: 'flight-control-ground-station',
        desc: 'A ground control station for drones with WebSocket communication, real-time map display and autonomous navigation.',
        url: 'https://github.com/ComoYo-Yanke/flight-control-ground-station',
        icon: '🛩️',
        host: 'github',
        langs: [
            { name: 'Python', pct: 82.2 },
            { name: 'HTML', pct: 17.8 },
        ],
        stars: 1,
    },
    {
        name: 'hly-system',
        desc: "Records the user's health status, including daily meals, water intake, wake-up and sleep times, and exercise.",
        url: 'https://github.com/ComoYo-Yanke/hly-system',
        icon: '🩺',
        host: 'github',
        langs: [
            { name: 'Java', pct: 98.2 },
            { name: 'JavaScript', pct: 1.2 },
        ],
        stars: 0,
    },
    {
        name: 'HCIA-Practice-miniProgramme',
        desc: 'A practice mini-program tailored for HCIA exam preparation. Native WeChat mini-program, zero backend, entirely local — import your own question bank and drill it on the memory curve.',
        url: 'https://gitee.com/yanke_4_0/base_bank_practice',
        icon: '📚',
        host: 'gitee',
        langs: [{ name: 'TypeScript' }, { name: 'Sass' }],
        stars: 2,
    },
    {
        name: 'Class Fee System',
        desc: 'A class common-account bookkeeping tool built with Spring Boot 3, Vue 3, Element Plus, ECharts and SQLite.',
        url: 'https://gitee.com/yanke_4_0/class-fee-system',
        icon: '💰',
        host: 'gitee',
        langs: [{ name: 'Java' }, { name: 'Vue' }],
        stars: 5,
    },
    {
        name: 'LiMind',
        desc: 'A lightweight, free mind-mapping tool based on Electron.',
        url: 'https://gitee.com/yanke_4_0/imf-post',
        icon: '🧠',
        host: 'gitee',
        langs: [{ name: 'Vue' }, { name: 'JavaScript' }],
        stars: 2,
    },
    {
        name: 'Self_Official_Web',
        desc: 'The website I use for my official and personal presence.',
        url: 'https://github.com/ComoYo-Yanke/self_-official_-web',
        icon: '🌐',
        host: 'github',
        langs: [
            { name: 'Vue', pct: 58.5 },
            { name: 'CSS', pct: 17.1 },
            { name: 'Java', pct: 13.8 },
            { name: 'HTML', pct: 6.7 },
            { name: 'JavaScript', pct: 3.9 },
        ],
        stars: 0,
    },
    {
        name: 'comprehensive-test-result',
        desc: 'lzy-zongce',
        url: 'https://github.com/ComoYo-Yanke/comprehensive-test-result',
        icon: '🧑‍🎓',
        host: 'github',
        langs: [
            { name: 'Java', pct: 63.9 },
            { name: 'Vue', pct: 31.8 },
            { name: 'JavaScript', pct: 4.1 },
            { name: 'HTML', pct: 0.2 },
        ],
        stars: 1,
    },
    {
        name: 'Ubuntu-Web-SSH-Local',
        desc: 'A local web-page about shh to remote Ubuntu server',
        url: 'https://github.com/ComoYo-Yanke/Ubuntu-Web-SSH-Local',
        icon: '🖥️',
        host: 'github',
        langs: [
            { name: 'HTML', pct: 71.8 },
            { name: 'JavaScript', pct: 28.2 },
        ],
        stars: 0,
    }
];

/* ============================================================
   4. 主题持久化
   ============================================================ */
const THEMES = ['light', 'sepia', 'dark'];

function applyTheme(theme) {
    if (!THEMES.includes(theme)) theme = 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('blog-theme', theme);
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.themeBtn === theme);
    });
}

/* ============================================================
   5. 路由
   ============================================================ */
function navigate(path) { location.hash = '#/' + path; }

/* slug 里的中文等字符在 URL 里是百分号编码的，取出来要还原 */
function decodeSlug(s) {
    try { return decodeURIComponent(s); } catch (e) { return s; }
}

function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    if (parts.length === 0) return { page: 'home' };
    if (parts[0] === 'posts') return { page: 'posts' };
    if (parts[0] === 'projects') return { page: 'projects' };
    if (parts[0] === 'about') return { page: 'about' };
    if (parts[0] === 'post' && parts[1]) return { page: 'post', slug: decodeSlug(parts[1]) };
    return { page: 'home' };
}

/* 文章之间会互相引用（[01_xxx](01_xxx.md)）。浏览器把这种链接当普通相对路径请求，
   落到 /01_xxx.md 直接 404。这里换成站内路由 #/post/<slug>，交给 hashchange 处理。 */
function postHref(target) {
    const clean = decodeURIComponent(String(target).split('#')[0].split('?')[0]).replace(/^\.?\//, '');
    if (!/\.md$/i.test(clean)) return null;
    const stem = clean.replace(/\.md$/i, '');
    const hit = POSTS.find(p => (p.file || '').toLowerCase() === clean.toLowerCase())
        || POSTS.find(p => p.slug === clean)
        || POSTS.find(p => p.slug === stem)
        || POSTS.find(p => (p.file || '').replace(/\.md$/i, '') === stem);
    return hit ? '#/post/' + encodeURIComponent(hit.slug) : null;
}

/* 渲染完正文后把 .md 链接改成站内跳转。
   万一指向一个没发布的文件（比如 _draft.md），就退回指向 posts/ 下的原始 .md。 */
function rewritePostLinks(html) {
    return html.replace(/href=(["'])([^"']+\.md(?:#[^"']*)?)\1/gi, (all, q, target) => {
        const href = postHref(target);
        if (href) return 'href=' + q + href + q;
        const clean = decodeURIComponent(String(target).split('#')[0]).replace(/^\.?\//, '');
        return 'href=' + q + 'posts/' + clean + q;
    });
}

/* ============================================================
   6. 工具函数
   ============================================================ */
const app = document.getElementById('app');

function setActiveNav(page) {
    document.querySelectorAll('[data-nav]').forEach(el => {
        el.classList.toggle('active', el.dataset.nav === page);
    });
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 1800);
}

async function copyText(text, btn) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // 兼容旧浏览器 / 非 HTTPS
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        showToast('✅ Copied: ' + text);
        if (btn) {
            const original = btn.innerHTML;
            btn.classList.add('copied');
            btn.innerHTML = '✓ Copied';
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = original;
            }, 1500);
        }
    } catch (e) {
        showToast('❌ Copy failed');
    }
}

/* SVG 图标 */
const ICONS = {
    github: `<svg viewBox="0 0 24 24"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.5.2 2.7.1 3 .8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>`,
    gitee: `<svg viewBox="0 0 24 24"><path d="M11.984 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0011.984 0zm6.09 6.28a.51.51 0 01.49.42c.02.13-.24 2.15-.4 3.05a.78.78 0 01-.77.65H8.3a.41.41 0 00-.4.42v.06c0 .23.18.41.4.41h8.48a.77.77 0 01.77.65c.06.36.16 1.03.16 1.03a.78.78 0 01-.77.9H8.24a2.4 2.4 0 01-2.4-2.4v-3.3a2.4 2.4 0 012.4-2.4h9.34c.26 0 .47.19.49.42z"/></svg>`,
    mail: `<svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor"><path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z"/></svg>`,
    star: `<svg viewBox="0 0 24 24" style="width:13px;height:13px;fill:currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    search: `<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l4.99 4.99L20.48 19l-4.98-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
};

/* 生成社交按钮 HTML */
function socialButtons() {
    return `
    <a class="social-btn" href="${SITE.github}" target="_blank" rel="noopener">
      ${ICONS.github} GitHub
    </a>
    <a class="social-btn" href="${SITE.gitee}" target="_blank" rel="noopener">
      ${ICONS.gitee} Gitee
    </a>
    <button class="social-btn" onclick="copyText('${SITE.email}', this)">
      ${ICONS.mail} Email
    </button>
  `;
}

/* ============================================================
   7. 渲染页面
   ============================================================ */

/* -------- 首页 -------- */
/* -------- 文章卡片（首页 / 文章页共用） -------- */
/* hl 只在搜索结果里传进来（负责转义 + 高亮）；平时走原样插值，行为不变。
   用 typeof 判断而不是真值判断：.map(renderPostCard) 会把下标当成第二个参数传进来。 */
function renderPostCard(p, hl) {
    const T = (field, s) => (typeof hl === 'function' ? hl(field, s) : s);
    const tags = (p.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');
    return `
    <a class="post-card" onclick="navigate('post/${encodeURIComponent(p.slug)}')">
      <div class="pc-main">
        <h2>${T('title', p.title)}</h2>
        ${p.excerpt ? `<div class="excerpt">${T('excerpt', p.excerpt)}</div>` : ''}
        ${tags ? `<div class="post-meta">${tags}</div>` : ''}
      </div>
      <div class="pc-side">
        <time class="pc-date">${p.date}</time>
        <span class="pc-arrow">→</span>
      </div>
    </a>
  `;
}

/* 按日期倒序，文章页和首页都用同一个顺序 */
function sortedPosts() {
    return POSTS.slice().sort((a, b) => b.date.localeCompare(a.date));
}

function postCardsHTML() {
    const sorted = sortedPosts();
    if (!sorted.length) return postsError ? postsErrorHTML() : '<div class="empty">No posts yet.</div>';
    return sorted.map(renderPostCard).join('');
}

/* -------- 站点统计（首页数据块 / 侧栏共用） -------- */
function siteStats() {
    const langs = new Set();
    let stars = 0;
    for (const p of PROJECTS) {
        if (typeof p.stars === 'number') stars += p.stars;
        (p.langs || []).forEach(l => langs.add(l.name));
    }
    return { posts: POSTS.length, projects: PROJECTS.length, stars, languages: langs.size };
}

/* 所有文章标签按出现次数排序，取前 n 个 */
function topTags(n = 8) {
    const counts = new Map();
    for (const p of POSTS) {
        for (const tag of (p.tags || [])) counts.set(tag, (counts.get(tag) || 0) + 1);
    }
    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, n)
        .map(([name, count]) => ({ name, count }));
}

function chipsHTML(tags) {
    return tags.map(t => `<span class="chip">${esc(t.name)}<span class="n">${t.count}</span></span>`).join('');
}

/* -------- 动效小工具 -------- */
const reducedMotion = () => {
    try {
        return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
        return false;
    }
};

/* 换了页面就让内容区重新播一次入场动画 */
function enterPage() {
    if (!app || !app.classList) return;
    app.classList.remove('page-enter');
    void app.offsetWidth; /* 强制回流，动画才会重新开始 */
    app.classList.add('page-enter');
    updateBackTop();
}

/* 数字从 0 数到目标值 */
function countUp(el, target, dur) {
    const n = Number(target);
    if (!el || !isFinite(n) || reducedMotion() || typeof requestAnimationFrame !== 'function') {
        if (el) el.textContent = target;
        return;
    }
    const now = () => (window.performance && performance.now ? performance.now() : Date.now());
    const t0 = now(), d = dur || 650;
    el.textContent = '0';
    const tick = () => {
        const p = Math.min(1, (now() - t0) / d);
        const eased = 1 - Math.pow(1 - p, 3); /* easeOutCubic */
        el.textContent = String(Math.round(n * eased));
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = String(n);
    };
    requestAnimationFrame(tick);
}

/* 把当前页面里带数字的元素都数一遍 */
function animateTiles() {
    if (reducedMotion() || typeof document.querySelectorAll !== 'function') return;
    document.querySelectorAll('.tiles .tile b').forEach(el => {
        const n = Number(el.textContent.trim());
        if (isFinite(n) && n > 0) countUp(el, n);
    });
}

/* 侧栏那三个数字 */
function animateCounts() {
    if (reducedMotion() || typeof document.querySelectorAll !== 'function') return;
    document.querySelectorAll('.stat-row .stat b').forEach(el => {
        const n = Number(el.textContent.trim());
        if (isFinite(n) && n > 0) countUp(el, n);
    });
}

/* 文章页顶部的阅读进度条 */
function hideReadProgress() {
    const bar = document.getElementById('read-progress');
    if (!bar) return;
    bar.classList.remove('on');
    bar.style.transform = 'scaleX(0)';
}

function updateReadProgress() {
    const bar = document.getElementById('read-progress');
    if (!bar) return;
    const body = document.getElementById('post-body');
    if (!body || typeof body.getBoundingClientRect !== 'function') {
        hideReadProgress();
        return;
    }
    const rect = body.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 40) { /* 一屏能放下就没必要显示 */
        hideReadProgress();
        return;
    }
    const p = Math.min(1, Math.max(0, -rect.top / total));
    bar.classList.add('on');
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
}

/* 右下角「回到顶部」：滚过一段才出现，圆环显示整页进度 */
const BACKTOP_CIRC = 59.06; /* 2π × 9.4 */
let rocketBusy = false;

function updateBackTop() {
    const btn = document.getElementById('backtop');
    if (!btn || rocketBusy) return;
    const y = typeof window.pageYOffset === 'number' ? window.pageYOffset : (window.scrollY || 0);
    const el = document.documentElement;
    const total = el && typeof el.scrollHeight === 'number' ? el.scrollHeight - window.innerHeight : 0;
    const p = total > 0 ? Math.min(1, Math.max(0, y / total)) : 0;
    if (y > 320) btn.classList.add('show');
    else btn.classList.remove('show');
    const ring = document.getElementById('backtop-ring');
    if (ring && ring.style) ring.style.strokeDashoffset = (BACKTOP_CIRC * (1 - p)).toFixed(2);
}

function scrollToTop() {
    const smooth = !reducedMotion() && 'scrollBehavior' in document.documentElement.style;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
}

/* 一枚小火箭的 SVG：机身 / 舷窗 / 尾翼 / 喷焰 */
const ROCKET_SVG = `
  <svg viewBox="0 0 32 44" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="fxBody" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
        <stop stop-color="#fff" stop-opacity=".95"/>
        <stop offset="1" stop-color="currentColor"/>
      </linearGradient>
    </defs>
    <path d="M16 2c5.2 4.2 7.4 10.2 7.4 16.2 0 3.9-.9 7-2.1 9.4H10.7c-1.2-2.4-2.1-5.5-2.1-9.4C8.6 12.2 10.8 6.2 16 2z"
          fill="url(#fxBody)"/>
    <circle cx="16" cy="14.5" r="3.1" fill="#0b1220" fill-opacity=".55"/>
    <circle cx="16" cy="14.5" r="3.1" stroke="#fff" stroke-opacity=".85" stroke-width="1"/>
    <path d="M10.9 24.6 6.6 32.3l5.2-1.4" fill="currentColor" fill-opacity=".85"/>
    <path d="M21.1 24.6l4.3 7.7-5.2-1.4" fill="currentColor" fill-opacity=".85"/>
    <path class="fx-flame" d="M16 28.4c-2.3 3.6-2.5 7.3-.2 10.6.2-3 1-4.6 2.4-6.4-1.4 3.4-.6 5.6.1 6.6 2.2-3.3 2-7-.3-10.8z"
          fill="currentColor" fill-opacity=".7"/>
  </svg>`;

/* 点按钮：火箭带着一串粒子冲出屏幕顶部，同时页面滚回去 */
function launchRocket() {
    const btn = document.getElementById('backtop');
    const canAnim = typeof Element.prototype.animate === 'function';
    if (!btn || !canAnim || !document.body || typeof document.body.appendChild !== 'function') {
        scrollToTop();
        return;
    }
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    const layer = document.createElement('div');
    layer.className = 'fx-layer';
    document.body.appendChild(layer);

    const rocket = document.createElement('div');
    rocket.className = 'fx-rocket';
    rocket.innerHTML = ROCKET_SVG;
    rocket.style.left = cx + 'px';
    rocket.style.top = cy + 'px';
    layer.appendChild(rocket);

    /* 一小撮火星，往上散开 */
    const N = 18;
    const colors = ['var(--accent)', 'var(--accent-2)', '#ffffff'];
    for (let i = 0; i < N; i++) {
        const dot = document.createElement('span');
        const size = 4 + Math.random() * 6;
        dot.className = 'fx-spark';
        dot.style.left = cx + 'px';
        dot.style.top = cy + 'px';
        dot.style.width = dot.style.height = size + 'px';
        dot.style.margin = (-size / 2) + 'px 0 0 ' + (-size / 2) + 'px';
        dot.style.background = colors[i % colors.length];
        dot.style.boxShadow = '0 0 8px ' + colors[i % colors.length];
        layer.appendChild(dot);

        const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.4; /* 上方扇形 */
        const dist = 50 + Math.random() * 130;
        dot.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(ang) * dist * 0.55}px, ${Math.sin(ang) * dist * 0.55}px) scale(.7)`, opacity: .8, offset: .55 },
            { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist + 40}px) scale(.15)`, opacity: 0 },
        ], {
            duration: 620 + Math.random() * 480,
            delay: Math.random() * 120,
            easing: 'cubic-bezier(.16,.7,.3,1)',
            fill: 'forwards',
        });
    }

    /* 火箭本体：笔直向上，飞到顶部再淡出 */
    const rise = 88 - cy; /* 让机头刚好停在导航条下方 */
    const flight = rocket.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: `translateY(${rise * .35}px) scale(1.06)`, opacity: 1, offset: .35 },
        { transform: `translateY(${rise * .8}px) scale(1.02)`, opacity: 1, offset: .8 },
        { transform: `translateY(${rise}px) scale(.7)`, opacity: 0 },
    ], {
        duration: 950,
        easing: 'cubic-bezier(.34,.1,.4,1)',
        fill: 'forwards',
    });

    const done = () => { if (layer.parentNode) layer.parentNode.removeChild(layer); };
    flight.onfinish = done;
    setTimeout(done, 1600); /* 兜底：动画被系统掐掉也要清场 */
}

function onBackToTop() {
    if (rocketBusy) return;
    if (reducedMotion()) { scrollToTop(); return; }
    rocketBusy = true;
    const btn = document.getElementById('backtop');
    if (btn) btn.classList.remove('show'); /* 按钮化身火箭，先让位 */
    launchRocket();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { rocketBusy = false; updateBackTop(); }, 1000);
}

/* -------- 联系方式行（文章页 / 项目页 / 关于页共用） -------- */
function contactRowsHTML() {
    const rows = [
        ['GitHub', SITE.github, SITE.github, true],
        ['Gitee', SITE.gitee, SITE.gitee, true],
        ['Email', SITE.email, 'mailto:' + SITE.email, false],
    ];
    return rows.map(([label, text, href, external]) => `
        <div class="contact-row">
          <span class="contact-label">${label}</span>
          <span class="contact-value"><a href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}>${text}</a></span>
          <button class="copy-btn" onclick="copyText('${text}', this)">${ICONS.copy} Copy</button>
        </div>`).join('');
}

function contactCardHTML() {
    return `
      <div class="about-card">${contactRowsHTML()}
      </div>`;
}

/* -------- 首页 -------- */
const HOME_POST_LIMIT = 3; // 首页只放最新的几篇，全部在 Posts 页

function renderHome() {
    setActiveNav('home');
    document.title = SITE.name + "'s Blog";

    const preview = sortedPosts().slice(0, HOME_POST_LIMIT);
    const postsHTML = preview.length
        ? preview.map(renderPostCard).join('')
        : (postsError ? postsErrorHTML() : '<div class="empty">No posts yet.</div>');

    /* 首页只放 featured 的项目，没标注就退回前 3 个 */
    const featured = PROJECTS.filter(p => p.featured);
    const projectsPreview = (featured.length ? featured : PROJECTS.slice(0, 3))
        .map(renderProjectCard).join('');

    const stats = siteStats();
    const tags = topTags(9);

    app.innerHTML = `
    <section class="hero glass fade-in">
      <div class="hero-eyebrow">// welcome</div>
      <h1>Notes on <span class="grad">code, games &amp; everything in between</span></h1>
      <p>${SITE.bio}</p>
${searchBoxHTML()}
    </section>

    <div class="tiles fade-in">
      <div class="tile glass"><b>${stats.posts}</b><span>Posts</span></div>
      <div class="tile glass"><b>${stats.projects}</b><span>Projects</span></div>
      <div class="tile glass"><b>${stats.stars}</b><span>Stars</span></div>
      <div class="tile glass"><b>${stats.languages}</b><span>Languages</span></div>
    </div>

    <div id="search-results" hidden></div>

    <div id="home-default">
      <div class="section-title">Latest Posts${POSTS.length ? `<a class="view-all" onclick="navigate('posts')">View all →</a>` : ''}</div>
      <div class="post-list fade-in">${postsHTML}</div>

      <div class="section-title">Featured Projects${PROJECTS.length ? `<a class="view-all" onclick="navigate('projects')">View all →</a>` : ''}</div>
      <div class="project-grid fade-in">${projectsPreview}</div>

      ${tags.length ? `<div class="section-title">Topics</div>
      <div class="chips fade-in">${chipsHTML(tags)}</div>` : ''}
    </div>
  `;
    attachSearch();
    window.scrollTo(0, 0);
    enterPage();
    animateTiles();
}

/* -------- 文章页（和项目页同构） -------- */
function renderPosts() {
    setActiveNav('posts');
    document.title = 'Posts - ' + SITE.name;

    const tags = topTags(9);

    app.innerHTML = `
    <div class="fade-in">
      <div class="section-title">All Posts${POSTS.length ? `<span class="count">${POSTS.length}</span>` : ''}</div>
      ${tags.length ? `<div class="chips" style="margin-bottom:18px">${chipsHTML(tags)}</div>` : ''}
      <div class="post-list">${postCardsHTML()}</div>

      <div class="section-title">Find me on</div>
${contactCardHTML()}
    </div>
  `;
    window.scrollTo(0, 0);
    enterPage();
}

/* -------- 项目卡片 -------- */
function langColor(name) {
    return LANG_COLORS[name] || '#8b949e';
}

/* hl 同 renderPostCard：.map(renderProjectCard) 会把下标传进来，所以用 typeof 判断 */
function renderProjectCard(p, hl) {
    const T = (field, s) => (typeof hl === 'function' ? hl(field, s) : s);
    const langs = p.langs || [];
    const measured = langs.filter(l => typeof l.pct === 'number');
    const primary = langs[0];
    const hostName = p.host === 'gitee' ? 'Gitee' : 'GitHub';

    /* 语言占比条：只在拿到平台统计数据时才画 */
    const langBar = measured.length > 1
        ? `<div class="lang-bar" title="${measured.map(l => `${l.name} ${l.pct}%`).join(' · ')}">
          ${measured.map(l => `<span style="flex:${l.pct};background:${langColor(l.name)}"></span>`).join('')}
        </div>`
        : '';

    /* 有占比 → 只列主语言（附带百分比）；无占比 → 平铺所有语言 */
    let langHTML = '';
    if (primary && measured.length) {
        langHTML = `<span class="project-lang">
          <span class="lang-dot" style="background:${langColor(primary.name)}"></span>
          ${primary.name}${measured.length > 1 ? ` ${primary.pct}%` : ''}
        </span>`;
    } else if (primary) {
        langHTML = langs.map(l => `<span class="project-lang">
          <span class="lang-dot" style="background:${langColor(l.name)}"></span>
          ${l.name}
        </span>`).join('');
    }

    /* stars 用 typeof 判断，0 也要显示出来 */
    const starsHTML = typeof p.stars === 'number'
        ? `<span class="project-stars" title="${p.stars} star${p.stars === 1 ? '' : 's'} on ${hostName}">${ICONS.star} ${p.stars}</span>`
        : '';

    return `
    <a class="project-card" href="${p.url}" target="_blank" rel="noopener">
      <div class="project-head">
        <div class="project-icon">${p.icon}</div>
        <div class="project-name">${T('name', p.name)}</div>
        <span class="project-host" title="Hosted on ${hostName}">${p.host === 'gitee' ? ICONS.gitee : ICONS.github}</span>
      </div>
      <div class="project-desc">${T('desc', p.desc)}</div>
      ${langBar}
      <div class="project-foot">
        ${langHTML}
        ${starsHTML}
      </div>
    </a>
  `;
}

function renderProjects() {
    setActiveNav('projects');
    document.title = 'Projects - ' + SITE.name;

    const grid = PROJECTS.length
        ? PROJECTS.map(renderProjectCard).join('')
        : '<div class="empty">No projects yet.</div>';

    const stats = siteStats();
    const onGitee = PROJECTS.filter(p => p.host === 'gitee').length;

    app.innerHTML = `
    <div class="fade-in">
      <div class="section-title">Open Source Projects${PROJECTS.length ? `<span class="count">${PROJECTS.length}</span>` : ''}</div>

      <div class="tiles" style="margin-bottom:20px">
        <div class="tile glass"><b>${stats.projects}</b><span>Repos</span></div>
        <div class="tile glass"><b>${stats.stars}</b><span>Stars</span></div>
        <div class="tile glass"><b>${stats.languages}</b><span>Languages</span></div>
        <div class="tile glass"><b>${onGitee}</b><span>On Gitee</span></div>
      </div>

      <div class="project-grid">${grid}</div>

      <div class="section-title">Find me on</div>
${contactCardHTML()}
    </div>
  `;
    window.scrollTo(0, 0);
    enterPage();
    animateTiles();
}

/* -------- 关于页 -------- */
function renderAbout() {
    setActiveNav('about');
    document.title = 'About - ' + SITE.name;

    app.innerHTML = `
    <div class="fade-in">
      <div class="section-title">About Me</div>
      <div class="about-card">
        <h2>Hi, I'm ${SITE.name} 👋</h2>
        <p>${SITE.bio}</p>
        <p>This blog is built with pure HTML + CSS + JavaScript and hosted on Cloudflare Pages.</p>

        <h3>Tech Stack</h3>
        <ul>
          <li>Hosting: Cloudflare Pages</li>
          <li>Markdown: marked.js</li>
          <li>Themes: Light / Sepia / Dark, remembered via localStorage</li>
          <li>Translation: Google Translate widget (one-click)</li>
        </ul>

        <h3>Contact</h3>${contactRowsHTML()}
      </div>
    </div>
  `;
    window.scrollTo(0, 0);
    enterPage();
}

/* -------- 文章详情 -------- */
async function renderPost(slug, seq) {
    setActiveNav('posts'); // 文章详情属于 Posts 这一支，导航保持高亮
    const meta = POSTS.find(p => p.slug === slug);

    if (!meta) {
        app.innerHTML = `
      <div class="empty fade-in">
        <p>😕 Post not found</p>
        ${postsError ? postsErrorHTML() : ''}
        <p style="margin-top:10px"><a onclick="navigate('home')" style="cursor:pointer">Back to home</a></p>
      </div>`;
        return;
    }

    document.title = meta.title + ' - ' + SITE.name;

    app.innerHTML = `
    <a class="back-btn" onclick="navigate('home')">← Back to list</a>
    <article class="fade-in">
      <header class="article-header">
        <h1>${meta.title}</h1>
        <div class="post-meta">
          <span>📅 ${meta.date}</span>
          ${(meta.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </header>
      <div class="article-content" id="post-body">
        <div class="loading"><div class="spinner"></div>Loading...</div>
      </div>
    </article>
  `;
    window.scrollTo(0, 0);
    enterPage();

    const body = document.getElementById('post-body');
    /* 用清单里的真实文件名取内容：文件名可以是中文，slug 只负责 URL */
    const file = meta.file || slug + '.md';
    try {
        const res = await fetch('posts/' + encodeURIComponent(file));
        if (!res.ok) throw new Error('not found');
        const md = await res.text();
        if (seq !== navSeq) return; // 正文还在路上时用户又跳走了，别覆盖新页面
        body.innerHTML = rewritePostLinks(marked.parse(stripFrontMatter(md)));
        updateReadProgress();
    } catch (e) {
        if (seq !== navSeq) return;
        body.innerHTML = `<div class="empty">😕 Failed to load post (posts/${file})</div>`;
        return;
    }
    /* 翻译是可选项，单独兜底：它自己出问题也不能把已经渲染好的正文顶掉 */
    try {
        if (isTranslated()) triggerTranslate();
    } catch (e) {
        console.warn('[translate] ' + e.message);
    }
}

/* 每次导航自增。带 await 的渲染回来后先对一下号，
   防止慢的那次把用户已经切过去的新页面覆盖掉。
   例：清单还没载完就点了 Projects，首页那次渲染回来会把项目页顶掉。 */
let navSeq = 0;

async function router() {
    const seq = ++navSeq;
    const route = parseRoute();
    hideReadProgress(); /* 换页时先收掉，文章页渲染完会重新点亮 */
    if (route.page === 'projects') renderProjects();
    else if (route.page === 'about') renderAbout();
    else {
        await loadPosts(); // 首页 / 文章页 / 文章详情都要先拿到清单
        if (seq !== navSeq) return;
        if (route.page === 'posts') renderPosts();
        else if (route.page === 'post') await renderPost(route.slug, seq);
        else renderHome();
    }
}

/* ============================================================
   8. 搜索（首页）—— 模糊匹配文章 + 项目
   ============================================================ */

/* 分词时忽略、匹配时可以跳过的字符 */
const SEARCH_SEP = /[\s\-_./\\,;:!?()[\]{}"'`~@#$%^&*+=|<>·—–…、，。；：！？（）【】《》“”‘’]/;

/* 命中哪个字段的权重：标题 > 标签 > 摘要 > 正文 */
const FIELD_WEIGHT = { title: 2, name: 2, tags: 1.2, excerpt: 1, desc: 1, slug: .8, body: .6 };

/* 允许模糊（子序列）匹配的字段 —— 标题、名字、标签这种短而确定的。
   摘要/描述/正文只认连续子串：否则 "react" 能在一整段英文描述里凑出
   r..e..a..c..t，把压根没提它的项目也算命中。
   语言名也不做模糊："vue"/"python"/"java" 用户都是照着输入，
   放开只会让 "test" 因为 t..e..s..t 命中 TypeScript。 */
const FUZZY_FIELDS = new Set(['title', 'name', 'tags', 'slug', 'host']);

function esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* 一个词对一段文本打分。命中返回 { score, ranges }，ranges 是 [start, end) 区间，用来画高亮 */
function matchText(text, q, fuzzy) {
    const lower = String(text).toLowerCase();
    const needle = q.toLowerCase();
    if (!needle) return null;

    /* 1) 连续子串优先 */
    const at = lower.indexOf(needle);
    if (at !== -1) {
        let score = 1000 - Math.min(at, 200) + needle.length * 8;
        if (at === 0) score += 120;                            // 就在开头
        else if (SEARCH_SEP.test(lower[at - 1])) score += 80;  // 词首
        return { score, ranges: [[at, at + needle.length]] };
    }

    /* 长字段到此为止，不做模糊 */
    if (!fuzzy) return null;

    /* 2) 退而求其次：子序列。跳字越多分越低，"hw" 也能命中 "Hello, World" */
    let from = 0, prev = -1, start = -1, gaps = 0, adjacent = 0;
    const hits = [];
    for (const c of needle) {
        if (SEARCH_SEP.test(c)) continue;   // query 里的空格/连字符不算数
        let found = -1;
        for (let i = from; i < lower.length; i++) if (lower[i] === c) { found = i; break; }
        if (found === -1) return null;
        if (start === -1) start = found;
        if (prev !== -1) { if (found === prev + 1) adjacent++; else gaps += found - prev - 1; }
        hits.push(found);
        prev = found;
        from = found + 1;
    }
    if (!hits.length) return null;

    /* 命中散得太开就丢掉。否则 "vue" 能在一整段描述里凑出 v..u..e，
       把一个只是碰巧有这三个字母的项目也算命中，结果全是噪音
       （span 是首尾命中之间的跨度）。 */
    if (prev - start + 1 > needle.length * 4 + 4) return null;

    /* 挨着的命中合成一个区间，高亮才不会一格一格的 */
    const ranges = [];
    for (const i of hits) {
        const last = ranges[ranges.length - 1];
        if (last && last[1] === i) last[1] = i + 1;
        else ranges.push([i, i + 1]);
    }
    return { score: 400 + adjacent * 12 - Math.min(gaps, 120) - Math.min(start, 100), ranges };
}

/* 每个词都必须命中（AND），且可以命中不同字段 */
function scoreFields(fields, tokens) {
    let total = 0;
    const ranges = {};
    for (const t of tokens) {
        let best = null, bestField = null;
        for (const [name, text] of Object.entries(fields)) {
            if (!text) continue;
            const m = matchText(text, t, FUZZY_FIELDS.has(name));
            if (!m) continue;
            const sc = m.score * (FIELD_WEIGHT[name] || 1);
            if (!best || sc > best.score) { best = { score: sc, ranges: m.ranges }; bestField = name; }
        }
        if (!best) return null;
        total += best.score;
        (ranges[bestField] = ranges[bestField] || []).push(...best.ranges);
    }
    return { score: total, ranges };
}

const searchTokens = q => q.trim().toLowerCase().split(/\s+/).filter(Boolean);

/* ---------- 正文索引：第一次搜索时才按需抓，抓到就缓存 ---------- */
const POST_BODIES = new Map();   // slug -> 抹平的纯文本
let bodiesLoading = false;
let bodiesDone = false;

/** 把 Markdown 抹成纯文本，只为搜索用 */
function mdToPlain(md) {
    return stripFrontMatter(md)
        .replace(/```[\s\S]*?```/g, ' ')                 // 代码块
        .replace(/`[^`]*`/g, ' ')                        // 行内代码
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')           // 图片
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')         // 链接留文字
        .replace(/^\s{0,3}#{1,6}\s+/gm, ' ')             // 标题符号
        .replace(/^\s{0,3}>\s?/gm, ' ')                  // 引用
        .replace(/^\s*[-*+]\s+/gm, ' ')                  // 列表
        .replace(/[*_~|]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

async function loadPostBodies() {
    if (bodiesLoading || bodiesDone) return;
    bodiesLoading = true;
    await Promise.all(POSTS.map(async p => {
        if (POST_BODIES.has(p.slug)) return;
        try {
            const res = await fetch('posts/' + encodeURIComponent(p.file || p.slug + '.md'));
            if (res.ok) POST_BODIES.set(p.slug, mdToPlain(await res.text()));
        } catch (e) { /* 正文抓不到就算了，标题和摘要照常能搜 */ }
    }));
    bodiesLoading = false;
    bodiesDone = true;
    /* 正文到位了，把当前结果重画一遍，让只命中正文的也冒出来 */
    const input = document.getElementById('search-input');
    if (input && input.value.trim()) renderSearchResults(input.value.trim());
}

/* ---------- 检索 ---------- */

function searchPosts(q) {
    const tokens = searchTokens(q);
    if (!tokens.length) return [];
    const out = [];
    for (const p of POSTS) {
        const hit = scoreFields({
            title: p.title,
            excerpt: p.excerpt,
            tags: (p.tags || []).join(' '),
            slug: p.slug,
            body: POST_BODIES.get(p.slug) || '',
        }, tokens);
        if (hit) out.push({ post: p, ...hit });
    }
    return out.sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date));
}

function searchProjects(q) {
    const tokens = searchTokens(q);
    if (!tokens.length) return [];
    const out = [];
    for (const p of PROJECTS) {
        const hit = scoreFields({
            name: p.name,
            desc: p.desc,
            langs: (p.langs || []).map(l => l.name).join(' '),
            host: p.host === 'gitee' ? 'gitee github' : 'github',
        }, tokens);
        if (hit) out.push({ project: p, ...hit });
    }
    return out.sort((a, b) => b.score - a.score);
}

/* ---------- 结果渲染 ---------- */

function highlightHTML(text, ranges) {
    if (!ranges || !ranges.length) return esc(text);
    let out = '', last = 0;
    for (const [s, e] of ranges) {
        if (s < last || e <= s) continue;   // 区间交叉就跳过，别把标签套乱
        out += esc(text.slice(last, s)) + '<mark>' + esc(text.slice(s, e)) + '</mark>';
        last = e;
    }
    return out + esc(text.slice(last));
}

const hitHL = hit => (field, value) => highlightHTML(value, hit.ranges[field]);

function renderSearchResults(q) {
    const box = document.getElementById('search-results');
    if (!box) return;

    loadPostBodies();   // 第一次搜索时才去抓正文，抓到会再调一次本函数

    const posts = searchPosts(q);
    const projects = searchProjects(q);
    const total = posts.length + projects.length;
    const pending = bodiesDone ? '' : '<span class="search-note">searching post contents…</span>';

    if (!total) {
        box.innerHTML = `
      <div class="search-summary"><span>No matches for “${esc(q)}”</span>${pending}</div>
      <div class="empty">
        <p>😕 Nothing found.</p>
        <p style="margin-top:8px;font-size:.9em">Try a shorter word, or a tag like <code>Essay</code>.</p>
      </div>`;
        return;
    }

    box.innerHTML = `
      <div class="search-summary">
        <span>${total} result${total === 1 ? '' : 's'} for “${esc(q)}”</span>${pending}
      </div>
      ${posts.length ? `
      <div class="section-title">Posts<span class="count">${posts.length}</span></div>
      <div class="post-grid fade-in">${posts.map(h => renderPostCard(h.post, hitHL(h))).join('')}</div>` : ''}
      ${projects.length ? `
      <div class="section-title">Projects<span class="count">${projects.length}</span></div>
      <div class="project-grid fade-in">${projects.map(h => renderProjectCard(h.project, hitHL(h))).join('')}</div>` : ''}
    `;
}

/* ---------- 搜索框 ---------- */

function searchBoxHTML() {
    return `
      <div class="search-wrap">
        <span class="search-icon">${ICONS.search}</span>
        <input id="search-input" class="search-input" type="search" autocomplete="off" spellcheck="false"
               placeholder="Search posts and projects…" aria-label="Search posts and projects">
        <button id="search-clear" class="search-clear" type="button" hidden aria-label="Clear search">✕</button>
      </div>
      <div class="search-hint">Press <kbd>/</kbd> or <kbd>Ctrl</kbd>+<kbd>K</kbd> to jump here</div>`;
}

let lastQuery = '';   // 从结果点进文章再退回来，别把搜的词弄丢了

function attachSearch() {
    const input = document.getElementById('search-input');
    const clear = document.getElementById('search-clear');
    const results = document.getElementById('search-results');
    const fallback = document.getElementById('home-default');
    if (!input || !results) return;

    const run = () => {
        lastQuery = input.value.trim();
        if (clear) clear.hidden = !input.value;
        if (!lastQuery) {
            results.hidden = true;
            results.innerHTML = '';
            if (fallback) fallback.hidden = false;
            return;
        }
        if (fallback) fallback.hidden = true;
        results.hidden = false;
        renderSearchResults(lastQuery);
    };

    input.addEventListener('input', run);
    input.addEventListener('keydown', e => {
        if (e.key === 'Escape') { input.value = ''; run(); input.blur(); }
        if (e.key === 'Enter') e.preventDefault();   // 没有表单，回车别乱跳
    });
    if (clear) clear.addEventListener('click', () => { input.value = ''; run(); input.focus(); });

    if (lastQuery) { input.value = lastQuery; run(); }   // 回到首页时接着上次的结果
}

/* 全局快捷键：/ 或 Ctrl+K 跳到搜索框 */
function focusSearch(tries = 24) {
    const input = document.getElementById('search-input');
    if (input) { input.focus(); input.select(); return; }
    if (tries > 0) setTimeout(() => focusSearch(tries - 1), 50);   // 首页还在渲染就再等等
}

function handleSearchShortcut(e) {
    const el = e.target;
    const tag = ((el && el.tagName) || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || (el && el.isContentEditable);
    const slash = e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey;
    const cmdK = (e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K');
    if (!slash && !cmdK) return;
    e.preventDefault();
    if (!document.getElementById('search-input')) navigate('home');   // 别的页面就先回首页
    focusSearch();
}

/* ============================================================
   9. Google 翻译集成 —— 目前整块被注释掉了

   但调用点还留在 init() 和 renderPost() 里，直接调会抛
   ReferenceError。这里先放几个空实现顶上。

   注意：它们必须写在真正的实现「前面」——同名的函数声明后者生效，
   所以哪天要启用翻译，把下面那整段注释解开即可，这里不用动。
   ============================================================ */

/* ↓↓ 翻译关掉期间的空实现，启用翻译后可删 ↓↓ */
function isTranslated() { return false; }
function triggerTranslate() { }
function updateTranslateBtn() { }
function loadGoogleTranslate() { }
function toggleTranslate() { }   /* 翻译按钮本身也被注释了，留着以防单独解开会报错 */
/* ↑↑ 翻译关掉期间的空实现，启用翻译后可删 ↑↑ */

/* ------------------------------------------------------------
   下面这一整段是原来的 Google 翻译实现，暂时注释掉了
   ------------------------------------------------------------ */
/*
let translateReady = false;

function isTranslated() {
    const v = getCookie('googtrans');
    return v && v.includes('/zh-CN');
}

function getCookie(name) {
    const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[2]) : null;
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${location.hostname}`;
}

function toggleTranslate() {
    if (!translateReady) {
        alert('翻译组件还在加载，请稍候再试。');
        return;
    }
    if (isTranslated()) {
        deleteCookie('googtrans');
        location.reload();
    } else {
        setCookie('googtrans', '/en/zh-CN', 365);
        location.reload();
    }
}

function triggerTranslate() {
    if (window.google && window.google.translate) {
        const sel = document.querySelector('.goog-te-combo');
        if (sel) { sel.value = 'zh-CN'; sel.dispatchEvent(new Event('change')); }
    }
}

function updateTranslateBtn() {
    const btn = document.getElementById('translateBtn');
    if (!btn) return;
    const span = btn.querySelector('span');
    if (isTranslated()) {
        span.textContent = 'English';
        btn.title = 'Show original English';
    } else {
        span.textContent = '中文';
        btn.title = '翻译成中文';
    }
}

function loadGoogleTranslate() {
    window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement(
            { pageLanguage: 'en', includedLanguages: 'zh-CN,en', autoDisplay: false },
            'google_translate_element'
        );
        translateReady = true;
        updateTranslateBtn();
    };
    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);
}
*/
/* ============================================================
   10. 侧栏（静态 HTML，数据在这里填）
   ============================================================ */
function updateSidebar() {
    const s = siteStats();
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('stat-posts', s.posts);
    set('stat-projects', s.projects);
    set('stat-stars', s.stars);
    set('sidebar-name', SITE.name);
    set('sidebar-bio', SITE.bio);
    set('sidebar-avatar', SITE.avatar);

    const tagBox = document.getElementById('sidebar-tags');
    if (tagBox) {
        const tags = topTags(8);
        tagBox.innerHTML = tags.length ? chipsHTML(tags) : '<span class="chip">No topics yet</span>';
    }

    const stackBox = document.getElementById('sidebar-stack');
    if (stackBox) {
        const langs = [];
        for (const p of PROJECTS) {
            for (const l of (p.langs || [])) if (!langs.includes(l.name)) langs.push(l.name);
        }
        stackBox.innerHTML = langs.map(n => `<span class="chip">${esc(n)}</span>`).join('');
    }

    const soc = document.getElementById('sidebar-socials');
    if (soc) soc.innerHTML = socialButtons();

    animateCounts(); /* 侧栏 Posts / Projects / Stars 数一遍 */
}

/* ============================================================
   11. 初始化
   ============================================================ */
function init() {
    const savedTheme = localStorage.getItem('blog-theme');
    if (savedTheme && THEMES.includes(savedTheme)) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.querySelectorAll('[data-theme-btn]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.themeBtn === savedTheme);
        });
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
        btn.addEventListener('click', () => applyTheme(btn.dataset.themeBtn));
    });

    /* router 要先等清单载入，先摆个转圈占位 */
    app.innerHTML = '<div class="loading"><div class="spinner"></div>Loading...</div>';

    window.addEventListener('hashchange', router);
    window.addEventListener('scroll', () => {
        updateReadProgress();
        updateBackTop();
    }, { passive: true });
    document.addEventListener('keydown', handleSearchShortcut);

    const backBtn = document.getElementById('backtop');
    if (backBtn) backBtn.addEventListener('click', onBackToTop);
    updateBackTop();
    /* 侧栏的数字要等清单到手，先画骨架再补数据 */
    updateSidebar();
    loadPosts().then(updateSidebar);

    router();
    updateTranslateBtn();
    loadGoogleTranslate();
}

document.addEventListener('DOMContentLoaded', init);
