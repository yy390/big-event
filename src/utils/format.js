// 进行日期函数的封装
import { dayjs } from 'element-plus'
// 将时间进行格式化
export const formatTime =(time)=> dayjs(time).format('YYYY年MM月DD日')