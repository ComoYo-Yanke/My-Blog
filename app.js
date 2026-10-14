// ====== 文章清单 ======
// 每写一篇新文章，就在这里加一条记录
const POSTS = [
    {
        slug: 'hello',
        title: '你好，世界',
        date: '2026-10-14',
    },
    {
        slug: 'second',
        title: '我的第二篇文章',
        date: '2026-10-15',
    },
];

// ====== 渲染文章列表 ======
function showList() {
    const app = document.getElementById('app');
    const listHTML = POSTS
        .sort((a, b) => b.date.localeCompare(a.date)) // 按日期倒序
        .map(post => `
      <div class="post-item">
        <h2><a href="#${post.slug}" onclick="showPost('${post.slug}')">${post.title}</a></h2>
        <div class="date">${post.date}</div>
      </div>
    `)
        .join('');
    app.innerHTML = listHTML || '<p>还没有文章。</p>';
    document.title = '我的博客';
}

// ====== 渲染文章详情 ======
async function showPost(slug) {
    const app = document.getElementById('app');
    const meta = POSTS.find(p => p.slug === slug);
    if (!meta) {
        app.innerHTML = '<p>文章不存在。</p>';
        return;
    }

    app.innerHTML = '<p>加载中...</p>';

    try {
        const res = await fetch(`posts/${slug}.md`);
        if (!res.ok) throw new Error('加载失败');
        const md = await res.text();
        const html = marked.parse(md);

        app.innerHTML = `
      <a class="back-btn" onclick="showList()">← 返回列表</a>
      <article class="article">
        <h1>${meta.title}</h1>
        <div class="date">${meta.date}</div>
        <div class="content">${html}</div>
      </article>
    `;
        document.title = meta.title + ' - 我的博客';
        window.scrollTo(0, 0);
    } catch (e) {
        app.innerHTML = '<p>文章加载失败，请检查文件是否存在。</p>';
    }
}

// ====== 路由：根据 URL hash 决定显示什么 ======
function router() {
    const hash = location.hash.replace('#', '');
    if (hash) {
        showPost(hash);
    } else {
        showList();
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);