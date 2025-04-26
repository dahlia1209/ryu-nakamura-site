import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Content,WorkItem } from '@/models/content'
import { useUserService } from '@/services/userService'
import { User } from '@/models/user'
import type { AccountInfo } from '@azure/msal-browser'

export const useUserStore = defineStore('user', {
    state: () => ({
      service:useUserService(),
      user:null as User|null,
    }),
    getters: {
    },
    actions: {
      updateUserFromAccountInfo(accountInfo:AccountInfo) {
        this.user=User.fromAccountInfo(accountInfo)
      },
    },
})