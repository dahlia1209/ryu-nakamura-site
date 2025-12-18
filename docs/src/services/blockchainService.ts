import { Block, type BlockData } from '../models/blockchain'
import { toCamelCase } from '../utils/caseConverter'

export function useBlockchainService(apiBaseUrl: string = import.meta.env.VITE_API_ENDPOINT) {
  const blockchainEndpoint = new URL(`${apiBaseUrl}/blockchain`)
  // const blockchainEndpoint = new URL(`${apiBaseUrl}/blockchain`)

  async function getCurrentBlock() {
    const endpoint = new URL(blockchainEndpoint + '/block/current')
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = toCamelCase(await response.json()) as BlockData

    return data
  }

  async function getMiningLog(lines:number=1000) {
    const blobUrl = `https://nakamurast20250505.blob.core.windows.net/root/mining-logs/mining.log`
    try {
        // 1. まずHEADリクエストでファイルサイズを取得
        const headResponse = await fetch(blobUrl, { method: 'HEAD' });
        if (!headResponse.ok) {
            throw new Error(`Failed to fetch blob info: ${headResponse.status}`);
        }
        
        const contentLengthHeader = headResponse.headers.get('content-length');
        if (!contentLengthHeader) {
            throw new Error('Content-Length header not found');
        }
        
        const contentLength = parseInt(contentLengthHeader, 10);
        if (isNaN(contentLength)) {
            throw new Error('Invalid Content-Length header');
        }
        
        // 2. 末尾から読み取るバイト数を計算
        // 1行平均100バイトと仮定し、余裕を持って取得
        const estimatedBytesPerLine = 100;
        const bytesToRead = Math.min(
            lines * estimatedBytesPerLine * 2,  // 余裕を持って2倍
            contentLength  // ファイルサイズを超えない
        );
        
        const rangeStart = Math.max(0, contentLength - bytesToRead);
        const rangeEnd = contentLength - 1;
        
        console.log(`Reading range: ${rangeStart}-${rangeEnd} (${bytesToRead.toLocaleString()} bytes)`);
        
        // 3. Rangeリクエストで末尾部分を取得
        const response = await fetch(blobUrl, {
            headers: {
                'Range': `bytes=${rangeStart}-${rangeEnd}`
            }
        });
        
        if (!response.ok && response.status !== 206) {
            throw new Error(`Failed to fetch blob: ${response.status}`);
        }
        
        const text = await response.text();
        
        // 4. 行に分割して最新N行を取得
        const allLines = text.split('\n');
        
        // 最初の行が不完全な可能性があるので除外
        const validLines = rangeStart > 0 ? allLines.slice(1) : allLines;
        
        // 最新N行を取得（空行を除外）
        const latestLines = validLines
            .filter(line => line.trim().length > 0)
            .slice(-lines).reverse();
        
        console.log(`Retrieved ${latestLines.length} lines`);
        
        return latestLines;
        
    } catch (error) {
        console.error('Error fetching blob:', error);
        throw error;
    }
  }

  //   async function purchaseOrder(accessToekn:string,orderItem: OrderItem, successUrl: string, cancelUrl: string) {
  //     const endpoint=new URL(orderEndpoint.toString()+"/checkout")

  //     endpoint.searchParams.append("success_url",successUrl)
  //     endpoint.searchParams.append("cancel_url",cancelUrl)
  //     const response = await fetch(endpoint, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization':`Bearer ${accessToekn}`,
  //       },
  //       body: JSON.stringify(orderItem.toOrderItemRequest()),
  //     })

  //     if (!response.ok) {
  //       throw new Error(`Checkout API error: ${response.status} ${response.statusText}`)
  //     }

  //     const data= await response.json();
  //     const checkoutUrl=data.url as string

  //     return checkoutUrl
  //   }

  //   return {
  //     getPurchasedOrders,
  //     purchaseOrder,
  //   }
  return {
    getCurrentBlock,
    getMiningLog,
  }
}
