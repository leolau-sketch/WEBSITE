# 盛芯网站开发指南

## 技术栈

- **后端**：Python 3.14.7、Django 6.1.1。
- **后台管理**：Django Admin + django-simpleui 2026.1.13，默认简体中文。
- **前端**：Vue 3.5.43、Vite 8.3.0。
- **运行环境**：Node.js 24.21.0、npm 11.19.0、Python 虚拟环境 `.venv/`。
- **数据存储**：SQLite（本地开发数据库 `db.sqlite3`）。
- **部署方式**：Django 在 `127.0.0.1:8000` 同时提供 Vue 前台、静态资源和 Django 管理后台；Vue 产物构建至 `static/vue/`。

## 项目结构

- `config/`：Django 项目配置、路由与全局设置。
- `core/`：Django 业务应用；新模型、后台配置与 API 优先放在这里。
- `frontend/`：Vue 3 + Vite 前端源码。
- `templates/index.html`：Django 提供的 Vue 单页应用入口。
- `static/vue/`：Vue 的构建产物；由 Vite 自动生成，不要手动编辑。
- `db.sqlite3`：本地开发数据库。

## 本地运行

在项目根目录启动 Django（前台与后台统一由 8000 端口提供）：

```powershell
.\.venv\Scripts\Activate.ps1
python manage.py runserver 127.0.0.1:8000
```

- 前台：`http://127.0.0.1:8000/`
- 后台：`http://127.0.0.1:8000/admin/`

## 前端开发流程

Vue 不单独作为对外开发服务器运行。修改 `frontend/src/` 后，构建静态文件再刷新 Django 页面：

```powershell
cd frontend
npm install
npm run build
```

Vite 构建结果会写入 `static/vue/`。`frontend/vite.config.js` 中的 `base`、输出目录和固定资源文件名必须与 `templates/index.html` 保持一致。

`npm run build` 会自动按 JS/CSS 内容更新 Django 入口的资源版本，无需手工改日期。产品图片使用带内容哈希的文件名；`index.js`、`index.css` 和 LOGO 文件名保持兼容。若 Django 使用 `--noreload`，构建后需重启该项目服务以更新缓存模板。可用 `npm --prefix frontend run check:site` 检测服务是否仍返回旧版本。

## 后端开发流程

```powershell
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py makemigrations
.\.venv\Scripts\python.exe manage.py migrate
```

- `simpleui` 必须在 `INSTALLED_APPS` 的最前面，确保管理后台主题生效。
- 后台默认语言为简体中文：`LANGUAGE_CODE = 'zh-hans'`。
- 新的前台数据接口应使用 `/api/` 前缀，避免与 Vue 前端路由冲突。

## 提交前检查

```powershell
.\.venv\Scripts\python.exe manage.py check
cd frontend
npm run build
```

不要提交 `.venv/`、`frontend/node_modules/`、本地密钥或真实生产数据。修改 Vue 后应包含更新后的 `static/vue/` 构建产物，确保 Django 在 8000 端口能直接提供最新前台页面。
