import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {useContactService} from '@/services/contactService'

const contactService=useContactService()

export const useContactStore = defineStore('contact', {
    state: () => ({
      service:useContactService(),
    }),
    getters: {
    },
    actions: {
    },
})