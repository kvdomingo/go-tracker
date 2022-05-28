import { Provider } from "./provider";

export enum OrderStatus {
  UNPAID,
  PARTIALLY_PAID,
  FULLY_PAID,
  SHIPPED,
  DELIVERED,
}

export const ReverseOrderStatus = [
  {
    label: "UNPAID",
    color: "error.main",
  },
  {
    label: "PARTIALLY_PAID",
    color: "warning.main",
  },
  {
    label: "FULLY_PAID",
    color: "success.main",
  },
  {
    label: "SHIPPED",
    color: "secondary.main",
  },
  {
    label: "DELIVERED",
    color: "primary.main",
  },
];

export interface GroupOrder {
  pk: string;
  item: string;
  provider: Provider;
  order_number: string;
  order_date: number;
  downpayment_deadline: number;
  payment_deadline: number;
  status: OrderStatus;
}

export interface GroupOrderForm {
  item: string;
  provider: Provider | null;
  order_number: string;
  order_date: Date | null;
  downpayment_deadline: Date | null;
  payment_deadline: Date | null;
  status: OrderStatus;
}
