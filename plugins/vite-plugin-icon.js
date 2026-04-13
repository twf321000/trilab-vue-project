import path from 'path'
import fs from 'fs/promises'

const cwd = path.resolve(__dirname, '../src/assets/icons')

const getFile = async (p, arr = [], parentName = '') => {
  const res = await fs.readdir(p)
  const requests = res.map((item, index) => {
    const tempPath = path.join(p, item)
    arr[index] = { type: 0, name: item, tempPath: tempPath }
    return fs.stat(tempPath)
  })
  const stats = await Promise.all(requests)
  const requests2 = stats.map((stat, index) => {
    if (stat.isDirectory()) {
      arr[index].children = []
      return getFile(arr[index].tempPath, arr[index].children, arr[index].name)
    }
    arr[index].type = 1
    arr[index].name = `${parentName ? parentName + '-' : ''}` + arr[index].name.split('.')[0]
  })
  await Promise.all(requests2)
}

export default function readIconFile(options) {
  const virtualModuleId = 'virtual:icon'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  // 返回的是插件对象
  console.log('readFile', options)
  return {
    name: 'icon', // 名称用于警告和错误展示
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const arr = []
        await getFile(cwd, arr)
        // console.log('getFile', arr)
        return `
        export const icons = ${JSON.stringify(arr)}
        `
      }
    }
  }
}
