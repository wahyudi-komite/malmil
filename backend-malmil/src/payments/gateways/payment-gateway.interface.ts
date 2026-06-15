export interface PaymentGatewayInterface {
  createTransaction(params: {
    orderId: string;
    amount: number;
    customerDetails?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    items?: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
  }): Promise<{
    transactionId: string;
    snapUrl?: string;
    token?: string;
    redirectUrl?: string;
  }>;

  handleWebhook(payload: any, signatureKey: string): Promise<{
    orderId: string;
    transactionStatus: string;
    gatewayRef: string;
    paymentMethod: string;
    rawResponse: any;
  }>;

  checkStatus(transactionId: string): Promise<{
    orderId: string;
    transactionStatus: string;
    amount: number;
  }>;
}
