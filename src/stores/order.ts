import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Content,WorkItem } from '@/models/content'
import { useOrderService } from '@/services/orderService'

export const useOrderStore = defineStore('order', {
    state: () => ({
      service:useOrderService(),
    }),
    getters: {
    },
    actions: {
    },
})