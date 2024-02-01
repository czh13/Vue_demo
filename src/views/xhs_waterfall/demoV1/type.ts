export interface IWaterFallProps {
  gap: number // 卡片间隔
  column: number // 瀑布流列数
  bottom: number // 距底距离（触底加载更多）
  pageSize: number
  request: (page: number, pageSize: number) => Promise<ICardItem[]>
}

export interface ICardItem {
  id: string | number
  url: string
  width: number
  height: number
  [key: string]: any
}

// 单个卡片计算的位置信息，设置样式
export interface ICardPos {
  width: number
  height: number
  x: number
  y: number
}
