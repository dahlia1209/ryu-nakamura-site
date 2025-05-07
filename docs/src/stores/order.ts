import { defineStore } from 'pinia'
import { useOrderService } from '../services/orderService'

export const useOrderStore = defineStore('order', {
    state: () => ({
      service:useOrderService(),
    }),
    getters: {
    },
    actions: {
    },
})