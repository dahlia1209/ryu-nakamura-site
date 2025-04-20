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
    if (!accountInfo.idTokenClaims || !accountInfo.idTokenClaims.sub || !accountInfo.idTokenClaims.idp || !accountInfo.idTokenClaims.emails) return null

      return new User(
        accountInfo.idTokenClaims.sub,
        accountInfo.idTokenClaims.idp,
        accountInfo.idTokenClaims.emails[0],
      )
  }
}