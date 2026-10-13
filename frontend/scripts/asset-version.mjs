import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

export function stampTemplate(template, js, css) {
  const version = createHash('sha256').update(js).update('\0').update(css).digest('hex').slice(0, 16)
  let output = template
  for (const name of ['index.js', 'index.css']) {
    const pattern = new RegExp(`(\\{% static 'vue/assets/${name.replace('.', '\\.')}' %\\})(?:\\?v=[a-zA-Z0-9-]+)?`, 'g')
    if ((output.match(pattern) || []).length !== 1) throw new Error(`Expected one Django reference for ${name}; template left unchanged`)
    output = output.replace(pattern, `$1?v=${version}`)
  }
  return { output, version }
}

async function main() {
  const target = new URL('../../templates/index.html', import.meta.url)
  const [template, js, css] = await Promise.all([
    readFile(target, 'utf8'),
    readFile(new URL('../../static/vue/assets/index.js', import.meta.url)),
    readFile(new URL('../../static/vue/assets/index.css', import.meta.url)),
  ])
  const { output, version } = stampTemplate(template, js, css)
  if (output !== template) await writeFile(target, output)
  console.log(`Django asset version: ${version}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
