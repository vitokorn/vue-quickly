import { ref } from 'vue'

export function useFiltering() {
  const search = ref('')

  const filterres = (event) => {
    const input = event.target
    const filter = input.value.toUpperCase()
    const pl = document.querySelectorAll('#sptplaylists > div:not(.rectrack,.head) > div.pl > div')

    for (let i = 0; i < pl.length; i++) {
      if (pl[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        pl[i].style.display = "block"
      } else {
        pl[i].style.display = "none"
      }
    }
  }

  const clearSearch = () => {
    search.value = ''
  }

  return {
    search,
    filterres,
    clearSearch
  }
}

