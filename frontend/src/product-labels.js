import { t } from './locale'
// Display labels only. Product identifiers, measurements and API values remain unchanged.
export const chineseNames = {
  'uhmwpe-braided-rope':'UHMWPE 编织绳', 'aramid-sewing-thread':'芳纶长丝缝纫线',
  'ptfe-sewing-thread':'PTFE 缝纫线', 'uhmwpe-webbing':'UHMWPE 编织带',
  'aramid-braided-sleeving':'芳纶编织套管', 'ptfe-braided-rope':'PTFE 编织绳',
  'uhmwpe-fiber':'UHMWPE 纤维', 'uhmwpe-chopped-fiber':'UHMWPE 短切纤维',
  'uhmwpe-sewing-thread':'UHMWPE 长丝缝纫线', 'uhmwpe-resin-coated-rope':'树脂涂层 UHMWPE 绳',
  'uhmwpe-braided-sleeving':'UHMWPE 编织套管', 'uhmwpe-fine-braided-thread':'UHMWPE 精细编织线',
  'ptfe-fiber':'PTFE 纤维', 'ptfe-monofilament':'PTFE 单丝', 'ptfe-webbing':'PTFE 织带',
  'ptfe-braided-sleeve':'PTFE 管材与套管', 'aramid-fiber':'芳纶纤维',
  'aramid-staple-fiber':'芳纶短纤维', 'meta-aramid-yarn':'间位芳纶（1313）纱线',
  'para-aramid-yarn':'对位芳纶（1414）纱线', 'steel-wire-aramid-thread':'钢丝增强芳纶线',
  'aramid-braided-rope':'芳纶编织绳', 'aramid-webbing':'芳纶编织带',
}
export const productName = product => t(product.name, chineseNames[product.slug] || product.name)
const labels = {'All':'全部材料','All forms':'全部形态','Aramid':'芳纶','Fiber':'纤维','Yarn':'纱线','Sewing Thread':'缝纫线','Rope & Cord':'绳索','Webbing':'织带','Sleeve':'套管'}
export const productLabel = value => t(value, labels[value] || value)
