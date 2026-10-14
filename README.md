# CoMoYo-Yanke's Blog

A pure static personal blog · 一个纯静态个人博客 

[English](#english) | [中文](#中文)

---

## English

A minimal static blog built with pure **HTML + CSS + JavaScript**, hosted on **Cloudflare Pages**.

### Features

- 🌐 Default English, one-click translate to Chinese (Google Translate)
- 🎨 Three themes: Light / Sepia / Dark, remembered via localStorage
- 📝 Posts written in Markdown
- 🚀 Projects showcase
- 📋 One-click copy for contact info
- ⚡ Zero dependencies (only marked.js via CDN) · one Node script regenerates the post list

### Structure

```
.
├── index.html            # Whole blog (HTML + CSS + JS in one file)
├── scripts/
│   └── build-posts.mjs   # Scans posts/*.md, writes posts/index.json
├── posts/
│   ├── index.json        # GENERATED — the post list the site fetches
│   ├── hello.md
│   └── my-trip.md
└── README.md
```

### Add a Post

**1. Create a Markdown file** in `posts/` with front matter at the top:

```markdown
---
title: My Trip
date: 2026-10-20
tags: [Travel]
excerpt: A short note about my first solo trip.
---

Arrived in Tokyo. The weather was great.
```

**2. Regenerate the list**:

```bash
node scripts/build-posts.mjs
```

That's the whole flow. The post shows up on the home page — **nothing in `index.html` needs editing.**

| Field | Required | Notes |
|-------|----------|-------|
| `title` | ❌ | Falls back to the filename: `my-trip.md` → "My Trip" |
| `date` | ❌ | `YYYY-MM-DD`. Falls back to the file's modified time |
| `tags` | ❌ | `[Travel]` or `Travel, Notes` |
| `excerpt` | ❌ | Falls back to the first real paragraph of the body |
| `slug` | ❌ | The URL id. Defaults to the filename — set it when the filename isn't URL-friendly |
| `draft` | ❌ | `true` keeps the file out of the list |

**Notes** — a few things worth knowing before you write one:

- **Non-ASCII filenames work.** `posts/羞耻文章.md` is served by its real name (the browser percent-encodes it), so Chinese titles are fine. Add `slug: shameful-draft` if you want a clean ASCII URL — the file itself stays as it is.
- Files starting with `_` are ignored, so `_notes.md` won't be published.
- Front matter is stripped before rendering, so the `---` block never shows up in the article body.
- There is no `POSTS` array any more. Metadata lives with the post, so there's exactly one place to edit.

### Add a Project

Add an entry to the `PROJECTS` array in `index.html`:

```js
{
  name: 'My-Project',
  desc: 'What this project does.',
  url: 'https://github.com/ComoYo-Yanke/My-Project',
  icon: '🚀',                       // emoji
  host: 'github',                   // 'github' | 'gitee' — picks the card badge
  featured: true,                   // optional — show on the home page
  langs: [                          // optional
    { name: 'TypeScript', pct: 90.3 },
    { name: 'CSS', pct: 9.6 },
  ],
  stars: 12,                        // optional — shown whenever it's a number
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `name` | ✅ | Project name |
| `desc` | ✅ | Clamped to 3 lines on the card |
| `url` | ✅ | GitHub or Gitee repo link |
| `icon` | ❌ | Emoji |
| `host` | ❌ | `'github'` (default) or `'gitee'` — the badge in the corner and the star tooltip |
| `featured` | ❌ | The home page shows featured projects; if none are marked, the first 3 are used |
| `langs` | ❌ | `langs[0]` is the primary language. Percentage bars are drawn only when `pct` is present — without real stats, just list the names |
| `stars` | ❌ | Rendered whenever it's a number, **including `0`** |

**Colors are not set per project** — `LANG_COLORS` in `index.html` maps a language name to its GitHub Linguist color. Add new languages there.

**Where the numbers come from**: the GitHub `/languages` endpoint and the Gitee repo API. Every entry in this repo was pulled on **2026-10-14**; refresh by hand as stars and languages drift.

### Edit Personal Info

Modify the `SITE` object in `index.html`:

```js
const SITE = {
  name:   'CoMoYo-Yanke',
  avatar: 'CY',
  bio:    'A place to record learning, thoughts and life.',
  github: 'https://github.com/ComoYo-Yanke',
  gitee:  'https://gitee.com/yanke_4_0',
  email:  'comoyoyanke@outlook.com',
};
```

### Local Preview

Must use an HTTP server (due to `fetch()` CORS):

```bash
python -m http.server 8000   # then open http://localhost:8000
# or
npx serve
```

`posts/index.json` is committed, so the site previews as-is. After writing a new post, run `node scripts/build-posts.mjs` before reloading.

### Deploy to Cloudflare Pages

1. Push the repo to GitHub / Gitee
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Build settings:

   | Field | Value |
   |-------|-------|
   | Framework preset | None |
   | Build command | `node scripts/build-posts.mjs` |
   | Build output directory | `/` |

4. Deploy → get `xxx.pages.dev`

**Updates**: just `git push`. Cloudflare reruns the build command and auto-redeploys, so a new `.md` goes live without touching anything else.

### Notes

- `PROJECTS` is still a **hand-maintained array** in `index.html`. Posts are not — they're discovered from `posts/*.md` by the build script.
- Google Translate may be **unstable in mainland China**. For CN readers, browser built-in translation is a good fallback.
- Themes use `localStorage`; translation uses Google's own `googtrans` cookie.

---

## 中文

一个使用纯 **HTML + CSS + JavaScript** 构建的极简静态博客，托管在 **Cloudflare Pages**。

### 功能

- 🌐 默认英文，一键翻译成中文（Google 翻译）
- 🎨 三套主题：浅色 / 护眼 / 深色，自动记忆
- 📝 文章用 Markdown 编写
- 🚀 项目作品展示
- 📋 联系方式一键复制
- ⚡ 零依赖（仅 CDN 引入 marked.js）· 一个 Node 脚本负责生成文章清单

### 项目结构

```
.
├── index.html            # 整个博客（HTML + CSS + JS 全在一个文件）
├── scripts/
│   └── build-posts.mjs   # 扫描 posts/*.md，生成 posts/index.json
├── posts/
│   ├── index.json        # 自动生成，页面读的就是它
│   ├── hello.md
│   └── my-trip.md
└── README.md
```

### 新增文章

**1. 在 `posts/` 下创建 Markdown 文件**，开头写上 front matter：

```markdown
---
title: My Trip
date: 2026-10-20
tags: [Travel]
excerpt: 一句话摘要。
---

正文内容……
```

**2. 重新生成清单**：

```bash
node scripts/build-posts.mjs
```

就这两步，文章会自动出现在首页。**不用再动 `index.html` 里的任何东西。**

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ❌ | 不写就用文件名，`my-trip.md` → "My Trip" |
| `date` | ❌ | `YYYY-MM-DD`。不写就用文件的修改时间 |
| `tags` | ❌ | `[Travel]` 或 `Travel, Notes` 都行 |
| `excerpt` | ❌ | 不写就自动取正文第一段 |
| `slug` | ❌ | URL 标识。默认用文件名，文件名不适合放 URL 时再设 |
| `draft` | ❌ | 填 `true` 就不发布这篇 |

**几点提醒**：

- **文件名可以是中文**。`posts/羞耻文章.md` 会按真实文件名请求（浏览器自动百分号编码），所以中文标题完全没问题。想换成干净的英文短链就加一行 `slug: shameful-draft`，文件本身不用改名。
- 以 `_` 开头的文件会被忽略，可以拿 `_notes.md` 当草稿箱。
- front matter 在渲染前会被剥掉，不会跑到正文里显示成 `---`。
- `POSTS` 数组已经删掉了，文章信息跟着文章走，只有一个地方要改。

### 新增项目

在 `index.html` 的 `PROJECTS` 数组里加一条：

```js
{
  name: 'My-Project',
  desc: '这个项目是做什么的。',
  url: 'https://github.com/ComoYo-Yanke/My-Project',
  icon: '🚀',                       // emoji 图标
  host: 'github',                   // 'github' | 'gitee'，决定卡片角标
  featured: true,                   // 可选：是否在首页展示
  langs: [                          // 可选
    { name: 'TypeScript', pct: 90.3 },
    { name: 'CSS', pct: 9.6 },
  ],
  stars: 12,                        // 可选：填了数字就会显示
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | 项目名称 |
| `desc` | ✅ | 项目描述，卡片上最多显示 3 行 |
| `url` | ✅ | 仓库链接（GitHub / Gitee 均可） |
| `icon` | ❌ | emoji 图标 |
| `host` | ❌ | `'github'`（默认）或 `'gitee'`，决定卡片角标和 star 悬浮提示的文案 |
| `featured` | ❌ | 首页只展示标了 `featured` 的项目；一个都没标就退回前 3 个 |
| `langs` | ❌ | `langs[0]` 为主语言。**带 `pct` 才会画语言占比条**，没有统计数据的就只列语言名 |
| `stars` | ❌ | 只要填了数字就会显示，**包括 `0`** |

**颜色不用每个项目单独写**：`index.html` 里的 `LANG_COLORS` 负责按语言名查色（取自 GitHub Linguist），加新语言改那一处即可。

**数据从哪来**：GitHub API 的 `/languages` 接口 + Gitee 仓库接口。本仓库的项目数据抓取于 **2026-10-14**，星标和语言变动后记得手动更新。

### 修改个人信息

修改 `index.html` 里的 `SITE` 对象：

```js
const SITE = {
  name:   'CoMoYo-Yanke',
  avatar: 'CY',
  bio:    'A place to record learning, thoughts and life.',
  github: 'https://github.com/ComoYo-Yanke',
  gitee:  'https://gitee.com/yanke_4_0',
  email:  'comoyoyanke@outlook.com',
};
```

### 本地预览

必须用 HTTP 服务器（因为用了 `fetch()`，有 CORS 限制）：

```bash
python -m http.server 8000   # 然后访问 http://localhost:8000
# 或
npx serve
```

`posts/index.json` 是提交进仓库的，所以直接预览就有内容。写了新文章后，先跑一次 `node scripts/build-posts.mjs` 再刷新。

### 部署到 Cloudflare Pages

1. 把仓库推到 GitHub / Gitee
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 构建配置：

   | 配置项 | 填写 |
   |--------|------|
   | Framework preset | None |
   | Build command | `node scripts/build-posts.mjs` |
   | Build output directory | `/` |

4. 部署 → 得到 `xxx.pages.dev`

**后续更新**：只需 `git push`。Cloudflare 会重跑构建命令并自动重新部署，所以写好一篇 `.md` 推上去就上线了，别的什么都不用动。

### 注意事项

- `PROJECTS` 仍然是 `index.html` 里**手动维护**的数组；文章不是，文章由构建脚本从 `posts/*.md` 自动发现。
- Google 翻译在**中国大陆可能不稳定**。国内读者建议用浏览器自带翻译作为备选。
- 主题用 `localStorage` 存储；翻译用 Google 自带的 `googtrans` cookie。

---

## License

MIT
```

---

## 📌 说明

- **一个文件、中英合一**，顶部有 `English | 中文` 锚点跳转
- 篇幅控制在 **约 150 行**，比上一版精简了一半
- 保留了最核心的四件事：**新增文章、新增项目、改个人信息、部署**
- 去掉了"为什么用 localStorage"这类解释性内容，只留操作

需要我再配一个更短的 **`LICENSE`** 文件（MIT 标准文本）吗？