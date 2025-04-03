import { Order, Product } from '@devvit/payments';
import { UsePayments } from '@devvit/payments/hooks/use-payments';

export type PaymentsContext = {
  payments: UsePayments;
  orders: Order[];
  catalog: Product[];
};
