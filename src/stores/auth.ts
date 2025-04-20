import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useAuthService } from '@/services/authService';
import type { AccountInfo } from '@azure/msal-browser';



export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    userInfo: null as AccountInfo | null,
    authService: useAuthService(),
    accessToken:null as string |null
  }),
  
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    user: (state) => state.userInfo,
    userName: (state) => state.userInfo?.name || 'ユーザー',
  },
  
  actions: {
    async checkAuthStatus() {
      const account = this.authService.getAccount();
      this.isAuthenticated = !!account;
      this.userInfo = account;
      this.authService.getToken().then((token)=>this.accessToken=token)
    },
    
  }
});