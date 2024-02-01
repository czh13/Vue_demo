<template>
  <div class="app">
    <div class="container" ref="fContainerRef">
      <IWaterFall :bottom="20" :column="column" :gap="10" :page-size="20" :request="getData">
        <template #item="{ item, index, imageHeight }">
          <Card
            :detail="{
              imageHeight,
              title: item.title,
              author: item.author,
              bgColor: colorArr[index % (colorArr.length - 1)]
            }"
          />
        </template>
      </IWaterFall>
    </div>
  </div>
</template>

<script setup lang="ts">
import data1 from './data1.json'
import data2 from './data2.json'
import IWaterFall from './IWaterFall.vue'
import Card from './Card.vue'
import type { ICardItem } from './type'
const colorArr = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399']

const list1: ICardItem[] = data1.data.items.map((i) => ({
  id: i.id,
  url: i.note_card.cover.url_pre,
  width: i.note_card.cover.width,
  height: i.note_card.cover.height,
  title: i.note_card.display_title,
  author: i.note_card.user.nickname
}))
const list2: ICardItem[] = data2.data.items.map((i) => ({
  id: i.id,
  url: i.note_card.cover.url_pre,
  width: i.note_card.cover.width,
  height: i.note_card.cover.height,
  title: i.note_card.display_title,
  author: i.note_card.user.nickname
}))

const list = [...list1, ...list2]

const fContainerRef = ref<HTMLDivElement | null>(null)
const column = ref(5)
const fContainerObserver = new ResizeObserver((entries) => {
  changeColumn(entries[0].target.clientWidth)
})

const changeColumn = (width: number) => {
  if (width > 960) {
    column.value = 5
  } else if (width >= 690 && width < 960) {
    column.value = 4
  } else if (width >= 500 && width < 690) {
    column.value = 3
  } else {
    column.value = 2
  }
}

const getData = (page: number, pageSize: number) => {
  return new Promise<ICardItem[]>((resolve) => {
    setTimeout(() => {
      resolve(list.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize))
    }, 1000)
  })
}

onMounted(() => {
  fContainerRef.value && fContainerObserver.observe(fContainerRef.value)
})

onUnmounted(() => {
  fContainerRef.value && fContainerObserver.unobserve(fContainerRef.value)
})
</script>

<style scoped lang="scss">
.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .container {
    width: 1000px;
    height: 600px;
    border: 1px solid red;
  }
  .box {
    width: 250px;
  }
}
</style>
