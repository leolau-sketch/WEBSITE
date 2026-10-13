<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { locale, t } from '../locale'
import { tr } from '../translations'
import { products } from '../site-data'
import { formatErrors } from '../rfq-utils'
const form = ref(null)
const feedback = ref(null)
const status = ref('idle')
const responseMessage = ref('')
const serverErrors = ref({})
const fallbackError = ref('')
const errorMessages = computed(() => fallbackError.value ? [tr(fallbackError.value)] : formatErrors(serverErrors.value, locale.value))
const route = useRoute()
const topicForProduct = () => products.find(p=>p.slug===route.query.product)?.name || ''
const messageTopic = ref(topicForProduct())
watch(()=>route.query.product,()=>{messageTopic.value=topicForProduct()})
function clearForm() {
  if(status.value==='submitting') return
  form.value?.reset()
  messageTopic.value=''
  status.value='idle'
  responseMessage.value=''
  serverErrors.value={}
  fallbackError.value=''
}
async function focusFeedback() {
  await nextTick()
  feedback.value?.focus()
}

function getCookie(name) {
  return document.cookie.split('; ').find((cookie) => cookie.startsWith(`${name}=`))?.split('=')[1] ?? ''
}

async function submitForm() {
  if (status.value === 'submitting') return
  // Capture values before disabling the fieldset during the secure request.
  const payload = new FormData(form.value)
  status.value = 'submitting'
  responseMessage.value = ''
  serverErrors.value = {}
  fallbackError.value = ''

  try {
    const csrfResponse = await fetch('/api/csrf/', { credentials: 'same-origin' })
    if (!csrfResponse.ok) throw new Error('Unable to initialize secure submission')
    const response = await fetch('/api/rfq/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: payload,
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      serverErrors.value = data.errors || {}
      if (!errorMessages.value.length) fallbackError.value = 'We could not submit your request. Please try again.'
      status.value = 'error'
      await focusFeedback()
      return
    }

    if (response.status !== 201 || !data.id) throw new Error('Unexpected submission response')
    responseMessage.value = 'Thank you. Your RFQ has been received.'
    form.value.reset()
    messageTopic.value = ''
    status.value = 'success'
  } catch {
    fallbackError.value = 'A network error prevented the RFQ from being submitted. Please try again.'
    status.value = 'error'
  }
  await focusFeedback()
}
</script>
<template>
 <section class="quote-hero"><div class="shell"><p class="eyebrow eyebrow--light">{{tr('Request a quote')}}</p><h1>{{t('Let’s talk about your project.','与我们聊聊您的需求。')}}</h1><p>{{t('Leave your contact details and a short message. We’ll take it from there.','留下联系方式和简短需求，我们会进一步与您沟通。')}}</p></div></section>
 <section class="shell simple-quote">
  <form ref="form" class="simple-rfq-form" :aria-busy="status==='submitting'" @submit.prevent="submitForm">
   <h2>{{t('Request a Quote','询价留言')}}</h2><p class="required-note">{{t('* Required fields','* 为必填项')}}</p>
   <div v-if="status==='success'" ref="feedback" tabindex="-1" role="status" class="form-success"><strong>{{tr(responseMessage)}}</strong><p>{{tr('Our team will review the details and respond to your business email.')}}</p></div>
   <div v-if="status==='error'" ref="feedback" tabindex="-1" role="alert" class="form-error"><strong>{{tr('Please review your RFQ.')}}</strong><ul><li v-for="message in errorMessages" :key="message">{{message}}</li></ul></div>
   <fieldset :disabled="status==='submitting'">
    <label class="simple-field"><span>{{t('Company Name','公司名称')}}</span><input name="company" maxlength="200" autocomplete="organization"></label>
    <label class="simple-field"><span>{{t('Contact','联系人')}} *</span><input name="name" required maxlength="120" autocomplete="name"></label>
    <label class="simple-field"><span>{{t('Contact Number','联系电话')}}</span><input name="contact_number" type="tel" maxlength="50" autocomplete="tel"></label>
    <label class="simple-field"><span>{{t('Contact Address','联系地址')}}</span><input name="contact_address" maxlength="300" autocomplete="street-address"></label>
    <label class="simple-field"><span>{{t('E-mail','电子邮箱')}} *</span><input name="business_email" type="email" required maxlength="254" autocomplete="email"></label>
    <label class="simple-field"><span>{{t('Message Topic','留言主题')}}</span><input name="message_topic" v-model="messageTopic" maxlength="200"></label>
    <label class="simple-field"><span>{{t('Message Content','留言内容')}} *</span><textarea name="message" required rows="5" maxlength="10000" :placeholder="t('Tell us which product you need, quantity or any questions.','请简单说明所需产品、数量或其他问题。')"></textarea></label>
   </fieldset>
   <div class="simple-actions"><button class="button button--primary" type="submit" :disabled="status==='submitting'">{{t(status==='submitting'?'Submitting…':'Submit',status==='submitting'?'提交中…':'提交')}}</button><button class="button button--secondary" type="button" :disabled="status==='submitting'" @click="clearForm">{{t('Clear','清空')}}</button></div>
   <p class="form-privacy">{{tr('By sending this request, you agree that we may use the details to respond to your inquiry.')}}</p>
  </form>
 </section>
</template>
<style scoped>
.simple-quote{max-width:1000px;padding-top:45px;padding-bottom:60px}.simple-rfq-form{max-width:850px;margin:auto}.simple-rfq-form h2{font-size:27px;color:#2453a2;margin:0 0 10px}.required-note{font-size:12px;color:#667584;margin:0 0 25px}.simple-rfq-form fieldset{border:0;padding:0;margin:0;min-width:0}.simple-field{display:grid;grid-template-columns:160px minmax(0,1fr);gap:20px;align-items:start;margin-bottom:17px}.simple-field>span{padding-top:13px;font-size:14px;color:#344657}.simple-field input,.simple-field textarea{box-sizing:border-box;width:100%;min-width:0;border:1px solid #ccd5de;border-radius:0;padding:12px;background:#fff;font:inherit;font-size:15px;color:#172c3f}.simple-field input:focus,.simple-field textarea:focus{outline:2px solid #2453a2;outline-offset:2px}.simple-field textarea{resize:vertical}.simple-actions{display:flex;gap:14px;margin-left:180px;margin-top:24px}.simple-actions button{min-width:115px;cursor:pointer}.simple-rfq-form .form-privacy{margin-left:180px;font-size:12px;line-height:1.7}.simple-rfq-form :disabled{opacity:.65;cursor:wait}
@media(max-width:640px){.simple-quote{padding-top:30px}.simple-field{grid-template-columns:1fr;gap:7px;margin-bottom:18px}.simple-field>span{padding-top:0}.simple-actions,.simple-rfq-form .form-privacy{margin-left:0}.simple-actions button{flex:1}}
</style>
