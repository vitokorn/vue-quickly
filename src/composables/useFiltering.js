import { ref } from 'vue'

export function useFiltering() {
  const search = ref('')

  const clearSearch = () => {
    search.value = ''
  }

  return {
    search,
    clearSearch
  }
}

