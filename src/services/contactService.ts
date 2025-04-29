import { type EmailMessage } from '@/models/contact';

export function useContactService(apiBaseUrl: string = import.meta.env.VITE_API_ENDPOINT) {
    const endpoint = `${apiBaseUrl}/email`;

    async function sendmail(emailMessage: EmailMessage) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailMessage),
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