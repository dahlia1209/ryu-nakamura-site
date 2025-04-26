import {
  PublicClientApplication,
  LogLevel,
  type SilentRequest,
  type AccountInfo,
} from '@azure/msal-browser'

export class User {
  constructor(
    public id: string,
    public provider: string,
    public email: string,
    public createdAt?: Date,
    public lastLogin?: Date,
  ) {}

  static fromAccountInfo(accountInfo:AccountInfo) {
    if (!accountInfo.idTokenClaims || !accountInfo.idTokenClaims.sub || !accountInfo.idTokenClaims.idp || !accountInfo.idTokenClaims.emails) {
      throw  new Error(`アカウント情報に不足情報があります.`)
    }

      return new User(
        accountInfo.idTokenClaims.sub,
        accountInfo.idTokenClaims.idp,
        accountInfo.idTokenClaims.emails[0],
      )
  }

  static fromUserResponse(response:IUserResponse){
    const created_at=response.created_at==null?response.created_at:new Date(response.created_at) 
    const last_login=response.last_login==null?response.last_login:new Date(response.last_login) 

    return new User(
      response.id,
      response.provider,
      response.email,
      created_at,
      last_login
    )
  }
}

export interface IUserResponse{
  id: string
  provider: string
  email: string
  created_at?: string
  last_login?: string
}