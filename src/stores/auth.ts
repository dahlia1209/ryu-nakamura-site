import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useAuthService } from '@/services/authService';
import type { AccountInfo } from '@azure/msal-browser';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    userInfo: null as AccountInfo | null,
    authService: useAuthService(),
  }),
  
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    user: (state) => state.userInfo,
    userName: (state) => state.userInfo?.name || 'ユーザー',
  },
  
  actions: {
    async initialize() {
        try {
          // 認証サービスの初期化を待つ
          await this.authService.initialize();
          
          // 初期化後に認証状態をチェック
          await this.checkAuthStatus();
          
          return true;
        } catch (error) {
          console.error('Auth store initialization error:', error);
          this.isAuthenticated = false;
          this.userInfo = null;
          throw error;
        }
      },
    
    async checkAuthStatus() {
      const account = this.authService.getAccount();
      this.isAuthenticated = !!account;
      this.userInfo = account;
    },
    
    async login() {
      try {
        const response = await this.authService.login();
        return true;
        // if (response) {
        //   await this.checkAuthStatus();
        //   return true;
        // }
        // return false;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },
    
    async logout() {
      this.authService.logout();
      this.isAuthenticated = false;
      this.userInfo = null;
    },
    
    async getToken() {
      return await this.authService.getToken();
    }
  }
});