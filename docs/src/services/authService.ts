import {
  PublicClientApplication,
  LogLevel,
  type SilentRequest,
  type AccountInfo,
} from '@azure/msal-browser'



export function useAuthService() {
  // ログインリクエスト設定
  const loginRequest = {
    scopes: [
      'profile',
      'email',
      'api://0cc603b5-6641-4b33-9984-93462339fd6d/orders.read',
      'api://0cc603b5-6641-4b33-9984-93462339fd6d/orders.write',
      'api://0cc603b5-6641-4b33-9984-93462339fd6d/users.read',
      'api://0cc603b5-6641-4b33-9984-93462339fd6d/users.write',
    ],
  }

  // MSAL インスタンスの作成
  const msalInstance = new PublicClientApplication({
    auth:{
      clientId:import.meta.env.VITE_AZURE_CLIENT_ID,
      authority:`https://ryun.ciamlogin.com/ryun.onmicrosoft.com`,
      redirectUri:`${import.meta.env.VITE_FRONT_URL}/authcallback`
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true,

    },
    system: {
      loggerOptions: {
        loggerCallback: (level: LogLevel, message: string) => {
          if (level === LogLevel.Error) {
            console.error(message)
          }
        },
        logLevel: LogLevel.Error,
      },
    },
  })
  let msalInitialized = false

  async function login(path:string="/") {
    try {
      // pathをsessionStorageに保存
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectPath', path)
      }

      const response = await msalInstance.loginRedirect({
        scopes:loginRequest.scopes,
        redirectStartPage:`${import.meta.env.VITE_FRONT_URL}/authcallback?path=${path}`,
        prompt: 'login',
      })
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async function signup(path:string="/") {
    try {
      // pathをsessionStorageに保存
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectPath', path)
      }

      const response = await msalInstance.loginRedirect({
        scopes:loginRequest.scopes,
        redirectStartPage:`${import.meta.env.VITE_FRONT_URL}/authcallback?path=${path}`,
        prompt: 'create',
      })
      return response
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  async function logout(userInfo: AccountInfo) {
    if (userInfo != null) {
      const response = await msalInstance.logoutRedirect({
        account: userInfo,
        
      })
      return response
    }
  }

  function getAccount() {
    const currentAccounts = msalInstance.getAllAccounts()
    if (currentAccounts.length === 0) {
      throw new Error("アカウント情報が取得できません")
    }
    
    return currentAccounts[0]
  }

  async function acquireTokenSilent() {
    const account = getAccount()
    
    const silentRequest: SilentRequest = {
      scopes: loginRequest.scopes,
      account,
    }

    try {
      const response = await msalInstance.acquireTokenSilent(silentRequest)
      // console.log("response",response)
      return response
    } catch (error) {
      // サイレント取得に失敗した場合はポップアップで再取得
      try {
        const response = await msalInstance.acquireTokenPopup(silentRequest)
        return response
      } catch (popupError) {
        throw new Error(`Token acquisition failed: ${popupError}`)
      }
    }
  }

  function isAuthenticated(): boolean {
    return !!getAccount()
  }

  // 初期化時に既存のアカウントをチェック
  async function initialize() {
    if (!msalInitialized) {
      try {
        // MSAL自体を初期化
        await msalInstance.initialize()
        msalInitialized = true

        // リダイレクト結果を処理
        await msalInstance.handleRedirectPromise()

        // アカウント情報を設定
        const accounts = msalInstance.getAllAccounts()
        if (accounts.length > 0) {
          msalInstance.setActiveAccount(accounts[0])
        }
      } catch (error) {
        console.error('MSAL initialization error:', error)
        throw error
      }
    }
    return true
  }

  return {
    login,
    signup,
    logout,
    getAccount,
    acquireTokenSilent,
    isAuthenticated,
    initialize,
  }
}
