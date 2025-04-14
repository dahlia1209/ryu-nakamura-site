import { PublicClientApplication, LogLevel,  type SilentRequest, type AccountInfo } from '@azure/msal-browser';

// MSAL設定
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: import.meta.env.VITE_AZURE_AUTHORITY,
    knownAuthorities: ["ryunakamura.b2clogin.com"],
    redirectUri: "http://localhost:5173/", 
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string) => {
        if (level === LogLevel.Error) {
          console.error(message);
        }
      },
      logLevel: LogLevel.Error,
    }
  }
};

// ログインリクエスト設定
const loginRequest = {
  scopes: ['openid', 'profile', 'offline_access','https://ryunakamura.onmicrosoft.com/ryu-nakamura-api/tasks.read'],
};

// MSAL インスタンスの作成
const msalInstance = new PublicClientApplication(msalConfig);
let msalInitialized = false;

export function useAuthService() {
  /**
   * ログインを実行する
   */
  async function login() {
    try {
      // ポップアップでログイン
      const response = await msalInstance.loginRedirect(loginRequest);
      // if (response) {
      //   // ログイン成功時の処理
      //   return response;
      // }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * ログアウトを実行する
   */
  function logout() {
    const currentAccount = msalInstance.getActiveAccount();
    if (currentAccount) {
      msalInstance.logoutRedirect({
        account: currentAccount,
      });
    }
  }

  /**
   * 現在サインインしているユーザー情報を取得
   */
  function getAccount(): AccountInfo | null {
    const currentAccounts = msalInstance.getAllAccounts();
    if (currentAccounts.length === 0) {
      return null;
    }
    return currentAccounts[0];
  }

  /**
   * トークンを取得する
   */
  async function getToken(): Promise<string | null> {
    const account = getAccount();
    if (!account) {
      return null;
    }

    const silentRequest: SilentRequest = {
      // scopes: ['api://b1c69e9f-d996-472c-9f8b-9f495d5ebba3/tasks.read'],
      scopes: loginRequest.scopes,
      account,
    };

    try {
      const response = await msalInstance.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (error) {
      // サイレント取得に失敗した場合はポップアップで再取得
      try {
        const response = await msalInstance.acquireTokenPopup(silentRequest);
        return response.accessToken;
      } catch (popupError) {
        console.error('Token acquisition failed:', popupError);
        return null;
      }
    }
  }

  /**
   * ユーザーがログインしているか確認
   */
  function isAuthenticated(): boolean {
    return !!getAccount();
  }

  // 初期化時に既存のアカウントをチェック
  async function initialize() {
    if (!msalInitialized) {
      try {
        // MSAL自体を初期化
        await msalInstance.initialize();
        msalInitialized = true;
        
        // リダイレクト結果を処理
        await msalInstance.handleRedirectPromise();
        
        // アカウント情報を設定
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          msalInstance.setActiveAccount(accounts[0]);
        }
      } catch (error) {
        console.error('MSAL initialization error:', error);
        throw error;
      }
    }
    return true;
  }

  return {
    login,
    logout,
    getAccount,
    getToken,
    isAuthenticated,
    initialize
  };
}