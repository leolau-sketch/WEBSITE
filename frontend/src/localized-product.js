import { locale } from './locale'
import { tr } from './translations'
import { productName, productLabel } from './product-labels'
export const descriptions = {
  "uhmwpe-braided-rope": "柔性编织绳提供多种直径和颜色，可为设备制造商定制包装及插接方式。",
  "aramid-sewing-thread": "适用于技术织物组件的多股芳纶长丝线，提供多种直径及线轴包装形式。",
  "ptfe-sewing-thread": "用于严苛工艺环境下的工业纺织品缝制。可根据缝制作业选择线材规格和包装。",
  "uhmwpe-webbing": "用于轻质绑带及集成纺织部件的扁平编织带，宽度、颜色和包装可按项目要求确定。",
  "aramid-braided-sleeving": "用于部件防护的芳纶编织套管，为线缆及机械组件提供多种编织结构和颜色选择。",
  "ptfe-braided-rope": "白色 PTFE 编织绳，以卷盘形式供应，适用于工艺设备和工业纺织应用。",
  "uhmwpe-fiber": "用于后续纺织加工的 UHMWPE 连续长丝，覆盖从较细纱线到较粗工业结构的规格。",
  "uhmwpe-chopped-fiber": "白色 UHMWPE 短切纤维，供制造商开发纤维增强和混合材料体系。",
  "uhmwpe-sewing-thread": "多股 UHMWPE 线提供多种颜色，适用于技术缝制与轻质缝合组件。",
  "uhmwpe-resin-coated-rope": "树脂涂层绳可定制颜色、包装和插接。可根据设备需求确定涂层及成品结构。",
  "uhmwpe-braided-sleeving": "柔性 UHMWPE 编织套管，用于机械、汽车和健身设备中的线缆及部件包覆。",
  "uhmwpe-fine-braided-thread": "精细 UHMWPE 编织线提供白、蓝、绿三种颜色。结构与预期用途须在技术咨询中逐项评估。",
  "ptfe-fiber": "筒装 PTFE 纤维，可用于加工技术纱线和纺织结构。",
  "ptfe-monofilament": "以线轴形式供应的 PTFE 单丝，用于工业纺织品及部件开发。",
  "ptfe-webbing": "用于工业组件的扁平 PTFE 织带，可按要求确定宽度和厚度。",
  "ptfe-braided-sleeve": "手册中的 PTFE 管材系列包含用于线缆及技术部件的编织防护套管。",
  "aramid-fiber": "面向纺织加工企业的芳纶复丝纱线，提供连续长丝及加捻结构。",
  "aramid-staple-fiber": "用于混合及增强材料开发的芳纶短纤维。请提供所需切段长度和加工方法。",
  "meta-aramid-yarn": "提供多种纺纱规格的间位芳纶纱线，用于技术缝制及纺织加工。",
  "para-aramid-yarn": "用于工程纺织结构的对位芳纶纱线，可根据后续加工需求选择纱支。",
  "steel-wire-aramid-thread": "芳纶与钢丝复合结构，适用于特种工业缝制。请与我们的团队确认增强结构及缝制要求。",
  "aramid-braided-rope": "芳纶绳提供黄、黑、红等颜色，可定制结构、包装和缝制方式。",
  "aramid-webbing": "用于工业绑带及纺织组件的芳纶织带，可定制宽度和结构。"
}
export function localizedProduct(product) {
  if (!product || locale.value !== 'zh') return product
  return { ...product, name: productName(product), form: productLabel(product.form),
    short: descriptions[product.slug] || product.short, overview: descriptions[product.slug] || product.overview, size: tr(product.size),
    properties: product.properties.map(tr), applications: product.applications.map(tr),
    specs: product.specs.map(([key,value]) => [tr(key), tr(productLabel(value))]),
    table: product.table ? {...product.table, headings: product.table.headings.map(tr)} : undefined,
    note: product.note ? tr(product.note) : undefined,
  }
}
