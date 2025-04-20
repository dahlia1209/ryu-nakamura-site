import { PublicClientApplication, LogLevel,  type SilentRequest, type AccountInfo } from '@azure/msal-browser';
import { User } from '@/models/user';

export function useUserService(apiBaseUrl: string = import.meta.env.VITE_API_ENDPOINT){
    const url = new URL(`${apiBaseUrl}/users`);

    async function upsertUser(user: User) {
        url.pathname = `/users/${user.id}`;
        url.searchParams.append('mode', 'upsert');
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(user) 
          });
          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }
          
          return response;
    }

    return{
      upsertUser
    }
}