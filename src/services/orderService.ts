import  { type OrderStatus,Order,type IOrderResponse,type IOrderItemRequest,OrderItem } from '@/models/order'

export function useOrderService(apiBaseUrl: string = import.meta.env.VITE_API_ENDPOINT) {
  const orderEndpoint = new URL(`${apiBaseUrl}/orders`)

  async function getPurchasedOrders(userId:string,contentId:string,status:OrderStatus="complete") {
    const endpoint=new URL(orderEndpoint)
    endpoint.searchParams.append("user_id",userId)
    endpoint.searchParams.append("content_id",contentId)
    endpoint.searchParams.append("status",status)
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data= await response.json() as [IOrderResponse];

    return data.map(x=>Order.fromOrderResponse(x))
  }

  async function purchaseOrder(orderItem: OrderItem, successUrl: string, cancelUrl: string) {
    const endpoint=new URL(orderEndpoint.toString()+"/checkout")
    console.log("endpoint",endpoint)

    endpoint.searchParams.append("success_url",successUrl)
    endpoint.searchParams.append("cancel_url",cancelUrl)
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderItem.toOrderItemRequest()),
    })

    if (!response.ok) {
      throw new Error(`Checkout API error: ${response.status} ${response.statusText}`)
    }

    const data= await response.json();
    const checkoutUrl=data.url as string

    return checkoutUrl
  }

  return {
    getPurchasedOrders,
    purchaseOrder,
  }
}
