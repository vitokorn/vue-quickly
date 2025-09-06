<script setup>
import {computed} from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['page-change'])

const handlePageChange = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}
const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  const end = props.currentPage * props.itemsPerPage
  return Math.min(end, props.totalPages)
})
const paginationInfo = computed(() => {
  if (props.totalPages === 0) return 'No items'
  return `${props.currentPage} of ${props.totalPages}`
})
</script>

<template>
  <div class="pagination-container">
    <button
      @click="handlePageChange(currentPage - 1)"
      :disabled="currentPage === 1"
      class="action-button"
    >
      Previous
    </button>
    <span class="pagination-info">{{paginationInfo}}</span>
    <button
      @click="handlePageChange(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="action-button"
    >
      Next
    </button>
  </div>
</template>

<style scoped>

</style>
