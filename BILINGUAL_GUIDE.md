# 盛芯网站双语操作与维护说明

## 查看与分享

- 英文首页：http://127.0.0.1:8000/
- 中文首页：http://127.0.0.1:8000/?lang=zh
- 点击右上角 EN / 中文切换。手机端语言按钮在菜单图标旁。
- 复制浏览器地址即可分享当前语言；中文地址保留 `lang=zh`。
- 不要使用 `/zh/`：现有 Django 路由不接收这种地址。
- 点击中文站内链接继续保持中文；切换语言保留当前页面、筛选及产品预填。打开不带语言参数的地址，默认为英文。

## 询盘

从产品详情的“获取报价”进入，自动选择对应材料和产品。材料变化会清除不匹配的产品。

切换语言不会清空尚未提交的表单。中文标签只是显示翻译，后台收到的材料与产品名称继续使用原英文值，避免形成重复分类。

附件最大 10 MB，支持 PDF、DWG、DXF、DOC、DOCX、JPG/JPEG、PNG。必填项包括姓名、公司、国家/地区、商务邮箱。只有接口确认创建成功才显示已收到，显示错误时不能视为已提交。

本轮没有向真实联系表单写入测试记录，也没有验证邮件送达。

## 内容修改位置

目前前台内容仍由源码管理，并未完成产品 CMS。后台“联系表单”不等于产品内容管理功能。

- `frontend/src/site-data.js`：原始英文产品资料、尺寸表、图片映射。新增产品必须以盛芯资料为依据。
- `frontend/src/product-labels.js`：中文产品名称、材料/形态显示标签。
- `frontend/src/localized-product.js`：23 产品中文简介及本地化显示。绝不在翻译时改动技术数值。
- `frontend/src/translations.js`：公共文本、内页、规格标签、错误提示、SEO 文案。
- `frontend/src/views/HomeView.vue`：首页排版与中英文短文案。
- `frontend/src/App.vue`：导航、页尾、Alibaba 占位。收到正式店铺地址后再改为真实链接，不得使用参考公司的店铺。
- `frontend/src/corporate.css`：新版企业风格样式及手机布局。

## 构建与检查

在项目根目录运行：

```powershell
npm --prefix frontend test
npm --prefix frontend run build
.\.venv\Scripts\python.exe manage.py check
npm --prefix frontend run check:site
```

构建自动更新静态资源版本。若 8000 服务使用 `--noreload`，构建后重启该项目 Django 服务，再执行 check:site，以免仍提供缓存的旧入口。

## 边界

版式与交互为自行实现，仅使用现有盛芯资料和照片，没有导入参考网站素材、参数、标识或代码。新增素材也应保留来源和使用授权。

当前并非生产上线交付：正式域名、Alibaba 地址待提供；服务器 SEO、CMS、邮件、防垃圾、隐私、备份及 Analytics 等仍需后续完成。不得将本地测试通过描述为正式 Google 收录或上线验收。
