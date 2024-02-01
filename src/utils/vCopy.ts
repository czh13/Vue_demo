// vCopy.ts

import type { Directive } from 'vue'

interface CopyOptions extends HTMLDivElement {
  text: string
  fn?: () => void
}

export const copyDirective: Directive<CopyOptions> = {
  mounted(el, binding) {
    const { text, fn } = binding.value
    const textToCopy = text

    el.addEventListener('click', async () => {
      try {
        await copyToClipboard(textToCopy)
        if (fn) fn()
      } catch (error) {
        console.log('🚀 ~ el.addEventListener ~ error:', error)
      }
    })
  }
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    // 使用 Clipboard API
    await navigator.clipboard.writeText(text)
  } catch (error) {
    // 如果不支持 Clipboard API，退回到 execCommand 方法
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text

      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')

      document.body.removeChild(textArea)
    } catch (error) {
      // 复制失败，抛出异常
      throw new Error('Copying to clipboard failed.')
    }
  }
}
