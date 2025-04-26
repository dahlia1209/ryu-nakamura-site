import { Content, type IContentResponse } from './content'
import { User, type IUserResponse } from './user'

export type OrderStatus = 'complete' | 'expired' | 'open'

export class Order {
  constructor(
    public id: string,
    public content: Content,
    public user: User,
    public quantity: number,
    public checkout_status: OrderStatus = 'open',
    public checkout_id?: string,
    public created_at?: Date,
    public updated_at?: Date,
    public notes?: string,
  ) {}

  static fromOrderResponse(response:IOrderResponse){
    const created_at=response.created_at==null?response.created_at:new Date(response.created_at) 
    const updated_at=response.updated_at==null?response.updated_at:new Date(response.updated_at) 
    

    return new Order(
      response.id,
      Content.fromIContentResponse(response.content),
      User.fromUserResponse(response.user),
      response.quantity,
      response.checkout_status,
      response.checkout_id,
      created_at,
      updated_at,
      response.notes
    )
  }
}

export interface IOrderResponse {
  id: string
  content: IContentResponse
  user: IUserResponse
  quantity: number
  checkout_status: OrderStatus
  checkout_id?: string
  created_at?: string
  updated_at?: string
  notes?: string
}


export class OrderItem {
  constructor(
    public userId: string,
    public contentId: string,
    public id?: string,
    public checkoutId?: string,
    public quantity: number = 1,
    public checkoutStatus: OrderStatus="open",
    public notes?: string,
  ) {}

  toOrderItemRequest(){
    return {
      id:this.id,
      user_id:this.userId,
      content_id:this.contentId,
      quantity:this.quantity,
      checkout_status:this.checkoutStatus,
      notes:this.notes
    } as IOrderItemRequest
  }
}

export interface IOrderItemRequest {
    id: string
    user_id: string
    content_id: string
    checkout_id?: string
    quantity: number
    checkout_status: OrderStatus
    notes?: string
}




