import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ContentItem,WorkItem } from '@/models/content'
import { useUserService } from '@/services/userService'

export const useUserStore = defineStore('user', {
    state: () => ({
      service:useUserService(),
    }),
    getters: {
    },
    actions: {
    },
})