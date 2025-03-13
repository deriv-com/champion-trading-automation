export interface WebSocketResponse {
  req_id?: number;
  msg_type: string;
  error?: {
    code: string;
    message: string;
  };
  [key: string]: unknown;
}

export interface WebSocketRequest {
  req_id?: number;
  [key: string]: unknown;
}

export interface AuthorizeResponse extends WebSocketResponse {
  authorize: {
    email: string;
    currency: string;
    balance: number;
    loginid: string;
    fullname: string;
    account_list: Array<{
      loginid: string;
      currency: string;
      balance: number;
    }>;
    [key: string]: unknown;
  };
}
