import {
  PublicClientApplication,
  LogLevel,
  type SilentRequest,
  type AccountInfo,
} from '@azure/msal-browser'



export function useAuthService() {
  // MSAL設定
  const msalConfig = {
    auth: {
      clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
      authority: `https://ryunakamura.b2clogin.com/ryunakamura.onmicrosoft.com/B2C_1_signupsignin1`,
      redirectUri:import.meta.env.VITE_FRONT_URL,
      knownAuthorities: ['ryunakamura.b2clogin.com'],
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
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
  }

  // ログインリクエスト設定
  const loginRequest = {
    scopes: [
      'openid',
      'profile',
      'offline_access',
      'https://ryunakamura.onmicrosoft.com/ryu-nakamura-api/orders.read',
      'https://ryunakamura.onmicrosoft.com/ryu-nakamura-api/orders.write',
      'https://ryunakamura.onmicrosoft.com/ryu-nakamura-api/users.read',
      'https://ryunakamura.onmicrosoft.com/ryu-nakamura-api/users.write',
    ],
  }

  // MSAL インスタンスの作成
  const msalInstance = new PublicClientApplication(msalConfig)
  let msalInitialized = false

  async function login() {
    try {
      const response = await msalInstance.loginRedirect(loginRequest)
      return response
    } catch (error) {
      console.error('Login error:', error)
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
    logout,
    getAccount,
    acquireTokenSilent,
    isAuthenticated,
    initialize,
  }
}
