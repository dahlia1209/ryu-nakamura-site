import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {useContactService} from '@/services/contactService'


export const useContactStore = defineStore('contact', {
    state: () => ({
      service:useContactService(),
    }),
    getters: {
    },
    actions: {
    },
})