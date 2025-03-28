import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {useContactService} from '@/services/contactService'

export const useServiceStore = defineStore('service', {
    state: () => ({
      contact:useContactService(),
    }),
    getters: {
    },
    actions: {},
})