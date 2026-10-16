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

### Search

The home page has a search box that covers **both posts and projects**. Focus it from anywhere with the `/` key or `Ctrl`/`⌘`+`K`; `Esc` clears it.

| | What's searched | Fuzzy? |
|---|---|---|
| **Posts** | title, tags, excerpt, slug, **and the full body text** | title/slug/tags: yes · excerpt/body: exact substring |
| **Projects** | name, description, language names | name: yes · description/languages: exact substring |

- **Fuzzy means two things**: a plain substring match always wins, and if that fails the letters just have to appear *in order* — so `hw` finds **Hello, World** and `slfweb` finds **Self_Official_Web**.
- **Multiple words are AND-ed** (`hello world` needs both).
- **Post bodies are fetched lazily** the first time you search, then cached for the session — searching costs no extra requests until you actually type something.
- Matches that land in a short field are highlighted with `<mark>`.
- Search only sees posts listed in `posts/index.json`, so **run the build script after adding a post** or it won't be searchable.

### Add Content — the 30-second version

| I want to… | Do this | Then |
|---|---|---|
| **Publish a post** | Create `posts/<name>.md` with front matter ([copy `posts/_template.md`](posts/_template.md)) | `node scripts/build-posts.mjs` → commit & push |
| **Publish a project** | Add one object to the `PROJECTS` array in [`index.html`](index.html) | commit & push |

That's the whole flow — **nothing else in the site needs editing.** Full details below: [Add a Post](#add-a-post) · [Add a Project](#add-a-project) · [Troubleshooting](#troubleshooting).

### Structure

```
.
├── index.html            # Whole blog (HTML + CSS + JS in one file)
├── scripts/
│   └── build-posts.mjs   # Scans posts/*.md, writes posts/index.json
├── posts/
│   ├── index.json        # GENERATED — the post list the site fetches
│   ├── _template.md      # Not published (starts with _) — copy this to start a post
│   ├── hello.md
│   └── 羞耻文章.md
└── README.md
```

Pages: `#/` home (hero + latest posts + featured projects) · `#/posts` all posts · `#/projects` all projects · `#/about` · `#/post/<slug>` a single post.

### Add a Post

**1. Create a Markdown file** in `posts/` with front matter at the top — easiest is to copy the ready-made [`posts/_template.md`](posts/_template.md) to `posts/my-trip.md` and edit it:

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

That's the whole flow. The post appears on the **Posts** page, and the home page shows the latest few — **nothing in `index.html` needs editing.**

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
- The Google Translate feature is **disabled on purpose** (its code block is commented out in `index.html`). Four empty stubs stand in for the functions the rest of the script still calls, so nothing throws. To re-enable it, un-comment that block — the real functions are declared after the stubs, so they win automatically.

### Troubleshooting

| What you see | Why | Fix |
|---|---|---|
| `😕 Could not load posts/index.json` | Opening `index.html` by double-clicking it — `file://` blocks `fetch()` | Serve over HTTP: `python -m http.server 8000` (or `npx serve`) |
| `😕 Could not load posts/index.json` (over HTTP too) | `posts/index.json` missing or empty | `node scripts/build-posts.mjs` |
| `😕 Failed to load post (posts/…)` | The `.md` the manifest points at was renamed or deleted | Re-run the build script; check the filename matches `file` in `posts/index.json` |
| Post stuck on the **Loading** spinner | `posts/index.json` lists it but the file 404s | Same as above — re-run the build script |
| New post never shows up | You forgot to regenerate the manifest | `node scripts/build-posts.mjs`, then hard-reload (Ctrl+F5) |
| A `.md` file is silently ignored | Its name starts with `_`, or it has `draft: true` | Rename it, or drop `draft` |
| Post title shows the filename | No `title:` in the front matter | Add one, or accept the filename-derived title |
| `---` / `title:` shows up in the article body | Front matter block isn't at the very top of the file | It must be the **first** thing in the file, with no blank line above it |
| Search can't find a post you just wrote | The post isn't in `posts/index.json` yet | `node scripts/build-posts.mjs`, then reload |
| Search finds nothing for a word you know is in a post | The body text is being fetched for the first time | Give it a moment — the "searching post contents…" note disappears when it's done |

Quick sanity check after adding a post — the build script should name your file in its output:

```bash
node scripts/build-posts.mjs
#   post   my-trip.md  -> My Trip  (2026-10-20)
#   wrote  posts/index.json  (4 posts)
```

If it printed a `warnings:` line, read it — it says exactly which post has a problem.

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

### 搜索

首页有一个搜索框，**文章和项目一起搜**。任何页面按 `/` 或 `Ctrl`/`⌘`+`K` 都能跳过去，`Esc` 清空。

| | 搜哪些字段 | 支持模糊？ |
|---|---|---|
| **文章** | 标题、标签、摘要、slug，以及**正文全文** | 标题/slug/标签：支持 · 摘要/正文：只认连续子串 |
| **项目** | 名称、描述、语言名 | 名称：支持 · 描述/语言：只认连续子串 |

- **模糊有两层**：连续子串优先；子串找不到时，字母按顺序出现也算命中 —— 所以 `hw` 能搜到 **Hello, World**，`slfweb` 能搜到 **Self_Official_Web**。
- **多个词是 AND 关系**（`hello world` 两个都得命中）。
- **正文是按需加载的**：第一次搜索时才去抓 `.md`，之后缓存在内存里，所以不搜就不产生额外请求。
- 命中短字段（标题、名称）的地方会用 `<mark>` 标出来。
- 搜索只认 `posts/index.json` 里列出的文章，所以**加了新文章记得先跑构建脚本**，否则搜不到。

### 怎么加内容 —— 30 秒版

| 我想…… | 这样做 | 然后 |
|---|---|---|
| **发一篇文章** | 在 `posts/` 下新建 `名字.md`，开头写 front matter（直接复制 [`posts/_template.md`](posts/_template.md)） | `node scripts/build-posts.mjs` → 提交推送 |
| **加一个项目** | 在 [`index.html`](index.html) 的 `PROJECTS` 数组里加一个对象 | 提交推送 |

就这么多，**站点其他地方都不用动**。详细步骤在下面：[新增文章](#新增文章) · [新增项目](#新增项目) · [常见问题](#常见问题)。

### 项目结构

```
.
├── index.html            # 整个博客（HTML + CSS + JS 全在一个文件）
├── scripts/
│   └── build-posts.mjs   # 扫描 posts/*.md，生成 posts/index.json
├── posts/
│   ├── index.json        # 自动生成，页面读的就是它
│   ├── _template.md      # 不发布（下划线开头）—— 写新文章时复制它
│   ├── hello.md
│   └── 羞耻文章.md
└── README.md
```

页面：`#/` 首页（简介 + 最新文章 + 精选项目）· `#/posts` 全部文章 · `#/projects` 全部项目 · `#/about` 关于 · `#/post/<slug>` 文章详情。

### 新增文章

**1. 在 `posts/` 下创建 Markdown 文件**，开头写上 front matter —— 最省事的做法是把现成的 [`posts/_template.md`](posts/_template.md) 复制成 `posts/我的文章.md` 再改：

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

就这两步，文章会自动出现在 **Posts 页**（首页的 Latest Posts 只显示最新的几篇）。**不用再动 `index.html` 里的任何东西。**

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
- Google 翻译功能是**故意关掉的**（`index.html` 里那一整块代码被注释了）。因为脚本别处还在调用那几个函数，所以留了四个空实现顶上，不会报错。想启用就把那段注释解开 —— 真正的实现写在空实现**后面**，会自动覆盖。

### 常见问题

| 现象 | 原因 | 怎么办 |
|---|---|---|
| `😕 Could not load posts/index.json` | 直接双击打开了 `index.html`，`file://` 协议下 `fetch()` 被浏览器禁掉 | 用 HTTP 服务器打开：`python -m http.server 8000`（或 `npx serve`） |
| `😕 Could not load posts/index.json`（HTTP 下也一样） | `posts/index.json` 丢了或内容为空 | 跑 `node scripts/build-posts.mjs` |
| `😕 Failed to load post (posts/…)` | 清单里指向的那个 `.md` 被改名或删掉了 | 重新跑构建脚本；确认文件名和 `posts/index.json` 里的 `file` 一致 |
| 文章页一直转圈（Loading） | 清单里有这篇，但文件 404 了 | 同上，重新跑构建脚本 |
| 新写的文章不出现 | 忘了重新生成清单 | `node scripts/build-posts.mjs`，然后强刷（Ctrl+F5） |
| 某个 `.md` 被无视了 | 文件名以 `_` 开头，或者写了 `draft: true` | 改名字，或者去掉 `draft` |
| 标题显示成了文件名 | front matter 里没写 `title:` | 补一行，或者就用文件名生成的标题 |
| 正文里冒出了 `---` 或 `title:` | front matter 没放在文件最开头 | 它必须是文件的**第一行内容**，上面不能有空行 |
| 刚写的文章搜不到 | 它还没进 `posts/index.json` | 跑 `node scripts/build-posts.mjs`，再刷新 |
| 明明正文里有这个词却搜不到 | 正文是第一次搜索时才去抓的，还没到位 | 等一下，「searching post contents…」消失后就全了 |

加完文章后想确认一下，看构建脚本的输出里有没有你的文件：

```bash
node scripts/build-posts.mjs
#   post   my-trip.md  -> My Trip  (2026-10-20)
#   wrote  posts/index.json  (4 posts)
```

如果打印了 `warnings:`，照着读 —— 它会直接指出是哪篇文章的问题。

---

## License

MIT