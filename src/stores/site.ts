import { ref, computed, onMounted, onUnmounted } from 'vue'
import { defineStore } from 'pinia'

export const useSiteStore = defineStore('site', {
  state: () => ({
    isMenuOpen:false,
    isMobile:false
  }),
  getters: {
    updateIsMobile:(state)=>state.isMobile=window.innerWidth < 768
  },
  actions: {},
})