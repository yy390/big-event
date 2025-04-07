import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'


const pinia = createPinia()
pinia.use(persist)
export default pinia

// 导出
// import { useUserStore } from './modules/user'
// export{useUserStore}
// 等价于下面代码
export * from './modules/user'