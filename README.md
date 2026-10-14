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
- ⚡ Zero build, zero dependencies (only marked.js via CDN)

### Structure

```
.
├── index.html      # Whole blog (HTML + CSS + JS in one file)
├── README.md
└── posts/          # Markdown posts
    ├── hello.md
    └── second.md
```

### Add a Post

**1. Create a Markdown file** in `posts/`, e.g. `posts/my-trip.md`

> Use only English letters, numbers and hyphens in the filename.

**2. Add an entry** to the `POSTS` array in `index.html`:

```js
{
  slug: 'my-trip',           // must match the filename (without .md)
  title: 'My Trip',
  date: '2026-10-20',        // YYYY-MM-DD
  tags: ['Travel'],          // optional
  excerpt: 'A short note.',  // optional
}
```

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

### Deploy to Cloudflare Pages

1. Push the repo to GitHub / Gitee
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Build settings:

   | Field | Value |
   |-------|-------|
   | Framework preset | None |
   | Build command | `exit 0` |
   | Build output directory | `/` |

4. Deploy → get `xxx.pages.dev`

**Updates**: just `git push`. Cloudflare auto-redeploys.

### Notes

- `POSTS` and `PROJECTS` are **manually maintained**. Adding a post = 1 `.md` file + 1 array entry.
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
- ⚡ 零构建、零依赖（仅 CDN 引入 marked.js）

### 项目结构

```
.
├── index.html      # 整个博客（HTML + CSS + JS 全在一个文件）
├── README.md
└── posts/          # Markdown 文章
    ├── hello.md
    └── second.md
```

### 新增文章

**1. 在 `posts/` 下创建 Markdown 文件**，例如 `posts/my-trip.md`

> 文件名只能用英文字母、数字和连字符。

**2. 在 `index.html` 的 `POSTS` 数组里加一条**：

```js
{
  slug: 'my-trip',           // 必须与文件名一致（不含 .md）
  title: 'My Trip',
  date: '2026-10-20',        // 格式 YYYY-MM-DD
  tags: ['Travel'],          // 可选
  excerpt: '一句话摘要。',    // 可选
}
```

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

### 部署到 Cloudflare Pages

1. 把仓库推到 GitHub / Gitee
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 构建配置：

   | 配置项 | 填写 |
   |--------|------|
   | Framework preset | None |
   | Build command | `exit 0` |
   | Build output directory | `/` |

4. 部署 → 得到 `xxx.pages.dev`

**后续更新**：只需 `git push`，Cloudflare 自动重新部署。

### 注意事项

- `POSTS` 和 `PROJECTS` 都是**手动维护**的。加一篇文章 = 1 个 `.md` 文件 + 1 条数组记录。
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