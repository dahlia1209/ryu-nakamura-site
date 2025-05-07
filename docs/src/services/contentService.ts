
export function useContentService(apiBaseUrl: string = import.meta.env.VITE_API_ENDPOINT) {
    const url = new URL(`${apiBaseUrl}/contents`);
    
    async function getContentByNo(titleNo: number) {
        url.searchParams.append('title_no', `${titleNo}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            
          });
          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }
          
          return response;
    }

    return {
        getContentByNo,
    }
}