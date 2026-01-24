import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useAuthService } from '../services/authService';
import type { AccountInfo,AuthenticationResult } from '@azure/msal-browser';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    userInfo: null as AccountInfo | null,
    authService: useAuthService(),
    accessToken:null as string |null
  }),
  
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getAccessToken:(state)=>{
      if (!state.accessToken) throw new Error("アクセストークンが取得できません")
      return state.accessToken
    }
  },
  
  actions: {
    updateAuthStatus(auth:AuthenticationResult){
      this.accessToken=auth.accessToken
      this.userInfo=auth.account
      this.isAuthenticated=true
    },
    async checkAuthStatus() {
      try {
        // MSALを初期化してリダイレクト結果を処理
        await this.authService.initialize()

        // 認証済みの場合、トークンを取得
        const auth=await this.authService.acquireTokenSilent()
        this.updateAuthStatus(auth)
      } catch (error) {
        //未ログイン
      }

    },

  }

  
});