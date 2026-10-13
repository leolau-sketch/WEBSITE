export const allowedAttachmentExtensions = ['pdf', 'dwg', 'dxf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
export const maxAttachmentSize = 10 * 1024 * 1024

export function attachmentError(file) {
  if (!file) return ''
  if (file.size > maxAttachmentSize) return 'Attachment must be 10 MB or smaller.'
  if (!allowedAttachmentExtensions.includes(file.name.split('.').pop().toLowerCase())) {
    return 'Choose a PDF, DWG, DXF, DOC, DOCX, JPG or PNG file.'
  }
  return ''
}

const fieldLabels = {
  contact_number: 'Contact number', contact_address: 'Contact address', message_topic: 'Message topic',
  name: 'Name', company: 'Company', country: 'Country', business_email: 'Business email',
  whatsapp: 'WhatsApp', material: 'Material', product: 'Product', diameter_size: 'Diameter / size',
  required_strength: 'Required strength', required_length: 'Required length',
  estimated_quantity: 'Estimated quantity', application: 'Application',
  custom_requirements: 'Custom requirements', drawing_specification_pdf: 'Attachment', message: 'Message',
}

// Never expose backend internals. English remains the default public language.
export function formatErrors(errors = {}, language = 'en') {
  if (!errors || typeof errors !== 'object') return []
  const zh = { name:'姓名', company:'公司', country:'国家 / 地区', business_email:'商务邮箱', whatsapp:'WhatsApp', material:'材料', product:'产品', diameter_size:'直径 / 尺寸', required_strength:'所需强度', required_length:'所需长度', estimated_quantity:'预计数量', application:'应用场景', custom_requirements:'定制要求', drawing_specification_pdf:'附件', message:'留言' }
  return Object.entries(errors).flatMap(([field, entries]) => (Array.isArray(entries) ? entries : []).map(error => {
    error = error && typeof error === 'object' ? error : {}
    if (language === 'zh') {
      const label = ({contact_number:'联系电话',contact_address:'联系地址',message_topic:'留言主题'})[field] || zh[field] || '此字段'
      if (error.code === 'required') return `请填写${label}。`
      if (error.code === 'invalid') return `请输入有效的${label}。`
      if (error.code === 'max_length') return `${label}过长，请缩短。`
      return `请检查${label}后重试。`
    }
    const label = fieldLabels[field] || 'This field'
    if (error.code === 'required') return `${label} is required.`
    if (error.code === 'invalid') return `Please enter a valid ${label.toLowerCase()}.`
    if (error.code === 'max_length') return `${label} is too long. Please shorten it.`
    return typeof error.message === 'string' && /^[\x20-\x7E]+$/.test(error.message)
      ? error.message : `Please check ${label.toLowerCase()} and try again.`
  }))
}
