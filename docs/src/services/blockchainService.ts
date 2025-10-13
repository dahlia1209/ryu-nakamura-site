import  { BlockRequest} from '../models/blockchain'

export function useBlockchainService(apiBaseUrl: string = import.meta.env.VITE_API_ENDPOINT) {
  const blockchainEndpoint = new URL(`${apiBaseUrl}/orders`)

//   async function getPurchasedOrders(accessToekn:string, userId:string, contentId?:string, status:OrderStatus="complete",sas:boolean=true) {
//     const endpoint=new URL(orderEndpoint)
//     endpoint.searchParams.append("user_id", userId)
//     if (contentId) {
//       endpoint.searchParams.append("content_id", contentId)
//     }
//     endpoint.searchParams.append("status", status)
//     endpoint.searchParams.append("sas", String(sas))
    
//     const response = await fetch(endpoint, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization':`Bearer ${accessToekn}`,
//       },
//     })

//     if (!response.ok) {
//       throw new Error(`API error: ${response.status} ${response.statusText}`);
//     }

//     const data= await response.json() as [IOrderResponse];

//     return data.map(x=>Order.fromOrderResponse(x))
//   }

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
}
