import { type ContactMessage } from '../models/contact';

export function useContactService(apiBaseUrl: string = import.meta.env.VITE_API_ENDPOINT) {
    const endpoint = `${apiBaseUrl}/contact`;

    async function sendmail(contactMessage: ContactMessage) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactMessage),
          });
          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }
          
          return response;
    }

    return {
        sendmail,
    }
}