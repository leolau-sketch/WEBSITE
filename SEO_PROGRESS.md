# 前端 SEO 与资源发布记录 — 2026-09-29

## 最新双语补充

- 中文独立 URL 采用 `?lang=zh`，英文不带语言参数；两者都有自引用 canonical 与 en/zh-CN/x-default alternate。
- 筛选及 RFQ 产品预填参数不进入 canonical，语言参数保留。
- 标题、描述、HTML lang、页面 schema 和产品 schema 同步翻译；产品数值不变。23 中文产品浏览器核验通过。
- 页面信息仍由 JS 更新；并非 SSR、Google 收录验证或正式站点发布。`/zh/` 方案因当前 Django 路由白名单限制已撤回，没有后端改动。
- 最新测试计数见 QA_REPORT.md；下方 56 项为历史记录。

## 完成

1. `frontend/src/seo.js` 统一构造 JSON-LD；`main.js` 在路由变化时更新/移除唯一的结构化数据脚本。
2. 产品 schema 使用真实产品名、材料、照片、页面已显示的参数及制造商。没有添加未知 SKU、价格、库存、评级、评论或认证。
3. 医疗用途相关的限定说明保留在产品描述中。
4. `frontend/scripts/asset-version.mjs` 依据构建 JS/CSS 计算确定性的 SHA-256 版本号，仅替换 Django 模板的两个入口引用；引用缺失或重复会失败，不写坏模板。
5. Vite 图片使用内容哈希文件名；所有 42 张 WebP 独立输出供页面和结构化数据引用。保留公司原 LOGO。
6. `check:site` 检查运行中的 Django 是否提供匹配当前构建的版本，避免测试旧页面。

## 验证

- 前端 56 项测试通过；后端 5 项测试通过；Django check 无问题。
- 本机浏览器检查全部 23 产品：名称与 H1 一致、照片 URL 指向真实构建资源、没有虚构交易信息或已加载坏图。
- 经 Vue 导航进入 RFQ 后不残留产品 schema，材料仍正确预填；无效产品页移除 schema；控制台无 error/warn。
- 这不是 Google Rich Results Test 或 Search Console 上线验证，本地站点不可被公开搜索引擎抓取。

## 重要限制

- Google 可处理 JavaScript 插入的结构化数据，但此实现不等于 SSR/预渲染。
- Google 商品摘要另有 Offer/Review/AggregateRating 等资格要求。此询价站不编造价格/评价，不能承诺商品富媒体展示或排名提升。
- 正式站点域名尚未确认。目前 URL 从当前页面 origin 生成，不能向 Google 提交 localhost sitemap。
- sitemap/robots、服务端真实 404/301、预渲染、后台 CMS、隐私及上线设施仍未完成。

参考：

- https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript
- https://developers.google.com/search/docs/appearance/structured-data/product-snippet

## 维护操作

运行 `npm --prefix frontend run build`，按需重启使用 `--noreload` 的 Django 服务，再运行 `npm --prefix frontend run check:site`。不得手改 `static/vue/`。
