import { ref } from 'vue'
import { defineStore } from 'pinia'

const useCommonStore = defineStore('common', () => {
  const brandColor = ref('#FB803C') // Cor da marca (laranja)

  return {
    brandColor
  }
})

export default useCommonStore;