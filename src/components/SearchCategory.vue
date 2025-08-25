<script setup>
import SearchResultItem from './SearchResultItem.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['song', 'artist', 'album', 'playlist'].includes(value)
  },
  selectedItem: {
    type: String,
    default: ''
  },
  unplayableTracks: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['item-click', 'item-hover', 'item-leave'])

// Event handlers
const handleItemClick = (item, event) => {
  emit('item-click', item, event)
}

const handleItemHover = (event) => {
  emit('item-hover', event)
}

const handleItemLeave = (event) => {
  emit('item-leave', event)
}
</script>

<template>
  <div class="search-category">
    <h3 class="search-category-title">{{ title }}</h3>
    <div class="search-category-items">
      <div v-for="(item, index) in items"
           :key="index"
           class="search-item-wrapper">
        <SearchResultItem
          :item="item"
          :type="type"
          :selected="selectedItem === `${type}${item.id}`"
          :unplayable-tracks="unplayableTracks"
          @click="handleItemClick"
          @hover="handleItemHover"
          @leave="handleItemLeave"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
