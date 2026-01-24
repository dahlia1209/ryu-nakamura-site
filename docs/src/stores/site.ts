import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserService } from '../services/userService'
import { User } from '../models/user'
import type { AccountInfo } from '@azure/msal-browser'

export const useSiteStore = defineStore('site', {
    state: () => ({
      isAccountMenuOpen:false,
      isMenuOpen:false,
      isLoading:true
    }),
    getters: {
    },
    actions: {
      toggleAccountMenu() {
        this.isAccountMenuOpen = !this.isAccountMenuOpen
      },
      openAccountMenu() {
        this.isAccountMenuOpen = true
      },
      closeAccountMenu() {
        this.isAccountMenuOpen = false
      },
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen
      },
      closeMenu() { this.closeAccountMenu() ;this.isMenuOpen = false},
    },
})