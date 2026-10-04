import { Content, type IContentResponse } from '../models/content';

export function useContentService(apiBaseUrl: string = import.meta.env.VITE_API_ENDPOINT) {
  // アプリ内無料公開(is_app_free)または最新記事として、購入不要で読める記事の本文を取得する
  async function getAppFreeContent(titleNo: number): Promise<Content> {
    const response = await fetch(`${apiBaseUrl}/app/contents/${titleNo}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: IContentResponse = await response.json();
    return Content.fromIContentResponse(data);
  }

  return {
    getAppFreeContent,
  }
}
