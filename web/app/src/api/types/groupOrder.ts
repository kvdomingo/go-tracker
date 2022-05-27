export enum OrderStatus {
  UNPAID,
  PARTIALLY_PAID,
  FULLY_PAID,
  SHIPPED,
  DELIVERED,
}

export interface GroupOrder {
  item: string;
  provider: string;
  order_number: string;
  order_date: number;
  downpayment_deadline: number;
  payment_deadline: number;
  status: OrderStatus;
}
