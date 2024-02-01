<template>
  <div class="fs-waterfall-container" ref="containerRef" @scroll="handleScroll">
    <!-- 获取 list DOM ref -->
    <div class="fs-waterfall-list" ref="listRef">
      <div
        class="fs-waterfall-item"
        v-for="(item, index) in state.cardList"
        :key="item.id"
        :style="{
          width: `${state.cardWidth}px`,
          transform: `translate3d(${state.cardPos[index].x}px, ${state.cardPos[index].y}px, 0)`
        }"
      >
        <!-- 传递 imageHeight 给小红书卡片组件 -->
        <slot
          name="item"
          :item="item"
          :index="index"
          :imageHeight="state.cardPos[index].imageHeight"
        ></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import type { ICardItem, ICardPos } from './type'

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
const listRef = ref<HTMLDivElement | null>(null)
const state = reactive({
  isFinish: false, // 判断是否已经没有数据，后续不再发送请求
  page: 1,
  cardWidth: 0, // // 容器内卡片宽度
  cardList: [] as ICardItem[], // 卡片数据源
  cardPos: [] as ICardPos[], // 卡片摆放位置信息
  columnHeight: new Array(props.column).fill(0) as number[], // 存储每列的高度，进行初始化操作
  loading: false,
  preLen: 0
})

const handleScroll = () => {
  const { scrollTop, clientHeight, scrollHeight } = containerRef.value!
  const bottom = scrollHeight - clientHeight - scrollTop
  if (bottom <= props.bottom!) {
    !state.loading && getCardList(state.page, props.pageSize!)
  }
}

const minColumn = computed(() => {
  let minIndex = -1
  let minHeight = Infinity

  state.columnHeight.forEach((item, index) => {
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

const computedImageHeight = (list: ICardItem[]) => {
  list.forEach((item) => {
    const imageHeight = Math.floor((item.height * state.cardWidth) / item.width)
    state.cardPos.push({
      width: state.cardWidth,
      imageHeight: imageHeight,
      cardHeight: 0,
      x: 0,
      y: 0
    })
  })
}

const computedRealDomPos = (list: ICardItem[]) => {
  const children = listRef.value!.children //HTMLCollection,没有offsetHeight，HTMLDIVElement才有

  list.forEach((_, index) => {
    const nextIndex = state.preLen + index
    const cardHeight = children[nextIndex].getBoundingClientRect().height //可以获取当前元素的高度

    if (index < props.column! && state.cardList.length <= props.pageSize!) {
      state.cardPos[nextIndex] = {
        ...state.cardPos[nextIndex],
        cardHeight: cardHeight,
        x: nextIndex % props.column! !== 0 ? nextIndex * (state.cardWidth + props.gap!) : 0,
        y: 0
      }
      state.columnHeight[nextIndex] = cardHeight + props.gap!
    } else {
      const { minIndex, minHeight } = minColumn.value
      state.cardPos[nextIndex] = {
        ...state.cardPos[nextIndex],
        cardHeight: cardHeight,
        x: minIndex % props.column! !== 0 ? minIndex * (state.cardWidth + props.gap!) : 0,
        y: minHeight
      }
      state.columnHeight[minIndex] += cardHeight + props.gap!
    }
  })
  state.preLen = state.cardPos.length
}

const computedCardPos = async (list: ICardItem[]) => {
  computedImageHeight(list)
  await nextTick()
  computedRealDomPos(list)
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

// 创建监听对象
const resizeObserver = new ResizeObserver(() => {
  handleResize()
})

// 重置计算卡片宽度以及之前所有的位置信息
const handleResize = () => {
  const containerWidth = containerRef.value!.clientWidth
  state.cardWidth = (containerWidth - props.gap! * (props.column! - 1)) / props.column!
  state.columnHeight = new Array(props.column).fill(0)
  state.cardPos = []
  state.preLen = 0
  computedCardPos(state.cardList)
}

const init = () => {
  if (containerRef.value) {
    // 获取屏幕宽度，clientWidth不计算滚动条，offsetwidth计算
    const containerWidth = containerRef.value.clientWidth

    //  获取单列宽度，每列宽度相同 - 空白间隙
    state.cardWidth = (containerWidth - props.gap! * (props.column! - 1)) / props.column!
    getCardList(state.page, props.pageSize!)
    resizeObserver.observe(containerRef.value)
  }
}

watch(
  () => props.column,
  () => {
    handleResize()
  }
)

onMounted(() => {
  init()
})

// 卸载取消监听
onUnmounted(() => {
  containerRef.value && resizeObserver.unobserve(containerRef.value)
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
    transition: all 0.3s;
  }
}
</style>
