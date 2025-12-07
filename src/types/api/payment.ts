/**
 * Payment Types (SSL Commerz)
 */

// Payment Request
export interface PaymentRequest {
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  productName?: string;
  productCategory?: string;
  shippingMethod?: string;
}

// Payment Response
export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    gatewayPageURL?: string;
    redirectGatewayURL?: string;
    GatewayPageURL?: string;
    transaction_id?: string;
    status?: string;
    failedreason?: string;
  };
}

// Payment Verification Response
export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    transaction_id: string;
    amount: string;
    currency: string;
    tran_date: string;
    card_type?: string;
    card_no?: string;
    bank_tran_id?: string;
    val_id?: string;
  };
}

// SSL Commerz Payment Status (different from order payment status)
export type SSLCommerzStatus =
  | "VALID"
  | "VALIDATED"
  | "INVALID"
  | "FAILED"
  | "CANCELLED"
  | "PENDING";
