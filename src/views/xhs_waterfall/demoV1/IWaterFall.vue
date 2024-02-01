<template>
  <div class="fs-waterfall-container" ref="containerRef" @scroll="handleScroll">
    <div class="fs-waterfall-list">
      <div
        class="fs-waterfall-item"
        v-for="(item, index) in state.cardList"
        :key="item.id"
        :style="{
          width: `${state.cardPos[index].width}px`,
          height: `${state.cardPos[index].height}px`,
          transform: `translate3d(${state.cardPos[index].x}px, ${state.cardPos[index].y}px, 0)`
        }"
      >
        <slot name="item" :item="{ item, index }"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { ICardItem, ICardPos, IWaterFallProps } from './type'

const props = defineProps({
  column: {
    type: Number,
    require: true
  },
  gap: {
    type: Number,
    require: true
  },
  pageSize: {
    type: Number,
    require: true
  },
  bottom: {
    type: Number,
    require: true
  },
  request: {
    type: Function,
    require: true
  }
})

const containerRef = ref<HTMLDivElement | null>(null) // 绑定 template 上的 container，需要容器宽度
const state = reactive({
  isFinish: false, // 判断是否已经没有数据，后续不再发送请求
  page: 1,
  cardWidth: 0, // // 容器内卡片宽度
  cardList: [] as ICardItem[], // 卡片数据源
  cardPos: [] as ICardPos[], // 卡片摆放位置信息
  columnHeight: new Array(props.column).fill(0) as number[], // 存储每列的高度，进行初始化操作
  loading: false
})

const handleScroll = () => {
  const { scrollTop, clientHeight, scrollHeight } = containerRef.value!
  // scrollHeight：整个页面的高度，包括未看到的部分，最大
  // clientHeight：当前窗口可视化的高度
  // scrollTop：滚动的距离
  const bottom = scrollHeight - clientHeight - scrollTop
  if (bottom <= props.bottom!) {
    !state.loading && getCardList(state.page, props.pageSize!)
  }
}

const minColumn = computed(() => {
  let minIndex = -1
  let minHeight = Infinity

  state.columnHeight.forEach((item, index) => {
    // item < minHeight => 227 < Infinity => 289 < 227 => 227<227
    // minHeight => 227 => 227 => 227
    // 可以实现获取最小值
    if (item < minHeight) {
      minHeight = item
      minIndex = index
    }
  })

  return {
    minIndex,
    minHeight
  }
})

const computedCardPos = (list: ICardItem[]) => {
  list.forEach((item, index) => {
    // imgWidth / imgHeight = itemWidth / itemHeight
    // 1920 / 2560 = 163.25 / itemHeight => 217 其中一条列子
    // 通过比例获取高度
    const cardHeight = Math.floor((item.height * state.cardWidth) / item.width)

    // 比如大于4（4列）的时候，证明不是在第一行
    // 第一行
    if (index < props.column! && state.cardList.length <= props.pageSize!) {
      state.cardPos.push({
        width: state.cardWidth,
        height: cardHeight,
        // 前4(index)个0，1，2，3
        // 获取前index个的x轴位移
        x: index % props.column! !== 0 ? index * (state.cardWidth + props.gap!) : 0,
        y: 0
      })
      state.columnHeight[index] = cardHeight + props.gap!
    } else {
      // 第2行以后
      // console.log(minColumn.value, index)
      // minColumn.value取至第一行，第一行的index不会大于colomn列数
      // 所以每次的minIndex只会是0，1，2，3
      // 为什么要这样，因为无论是第N行，他的X轴的值都是相同的
      const { minIndex, minHeight } = minColumn.value

      state.cardPos.push({
        width: state.cardWidth,
        height: cardHeight,
        x: minIndex % props.column! !== 0 ? minIndex * (state.cardWidth + props.gap!) : 0,
        y: minHeight
      })
      // 以至于state.columnHeight只会有4个值
      // state.columnHeight存放的是每一根4个图片的高度
      state.columnHeight[minIndex] += cardHeight + props.gap!
    }
  })
}

const getCardList = async (page: number, pageSize: number) => {
  if (state.isFinish) return
  state.loading = true
  const list = await props.request!(page, pageSize)
  state.loading = false
  state.page++
  if (!list.length) {
    state.isFinish = true
    return
  }
  state.cardList = [...state.cardList, ...list]
  computedCardPos(list) // key：根据请求的数据计算卡片位置
}

const init = () => {
  if (containerRef.value) {
    // 获取屏幕宽度，clientWidth不计算滚动条，offsetwidth计算
    const containerWidth = containerRef.value.clientWidth

    //  获取单列宽度，每列宽度相同 - 空白间隙
    state.cardWidth = (containerWidth - props.gap! * (props.column! - 1)) / props.column!
    getCardList(state.page, props.pageSize!)
  }
}

onMounted(() => {
  init()
})
</script>

<style scoped lang="scss">
.fs-waterfall {
  &-container {
    width: 100%;
    height: 100%;
    overflow-y: scroll; // 注意需要提前设置展示滚动条，如果等数据展示再出现滚动造成计算偏差
    overflow-x: hidden;
  }

  &-list {
    width: 100%;
    position: relative;
  }
  &-item {
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
  }
}
</style>
