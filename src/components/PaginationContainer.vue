<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 50
  },
  totalItems: {
    type: Number,
    default: 0
  },
  showInfo: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['page-change'])

const handlePageChange = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}

</script>

<template>
  <div class="pagination-container" v-if="totalItems > 0">
    <div v-if="showInfo" class="pagination-info">
      <template v-if="totalItems > 0">Page {{ currentPage }} of {{ totalPages }}</template>
    </div>

    <button
      @click="handlePageChange(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="action-button"
    >
      Load more
    </button>
  </div>
</template>

<style scoped>

</style>
