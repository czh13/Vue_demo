/*
 * @Author: caizhihao
 * @Date: 2023-09-22 10:45:09
 * @LastEditors: caizhihao 177745994@qq.com
 * @LastEditTime: 2023-09-22 16:07:15
 * @FilePath: \AM1-H5-page\src\utils\index.ts
 * @Description:
 *
 */

export const toThousandths = (num: number) => num.toLocaleString('en-US')

export const copyDomText = (val: string) => {
  const text = val
  const input = document.createElement('input')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}
