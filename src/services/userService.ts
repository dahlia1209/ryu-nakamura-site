import { PublicClientApplication, LogLevel,  type SilentRequest, type AccountInfo } from '@azure/msal-browser';
import { User,type IUserResponse } from '@/models/user';

export function useUserService(apiBaseUrl: string = import.meta.env.VITE_API_ENDPOINT){
    const userEndpoint = new URL(`${apiBaseUrl}/users`);

    async function upsertUser(accessToekn:string,user: User) {
      const endpoint=new URL(`${userEndpoint.toString()}/${user.id}`)
      endpoint.searchParams.append('mode', 'upsert');
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${accessToekn}`,
            },
            body:JSON.stringify(user.toUserRequest()) 
          });
          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }

          const data= await response.json() as IUserResponse;
          
          return User.fromUserResponse(data);
    }

    return{
      upsertUser
    }
}