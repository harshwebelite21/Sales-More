import { IMap } from 'razorpay/dist/types/api';

export interface PaymentOrderDto {
  id: string;
  entity: string;
  amount: string | number; // Allow for string or number
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt?: string | null | undefined;
  offer_id?: string | null | undefined;
  status: string;
  attempts: number;
  notes?: IMap<string | number> | undefined; // You can define a more specific type for notes if needed
  created_at: number;
}
