import { AuthorizeResponse as BaseAuthorizeResponse } from './websocket';

export interface ExtendedAuthorize {
  email: string;
  currency: string;
  balance: number;
  loginid: string;
  fullname: string;
  token1: string;
  account_list: Array<{
    loginid: string;
    currency: string;
    balance: number;
  }>;
  [key: string]: unknown;
}

export interface AuthorizeResponse extends BaseAuthorizeResponse {
  authorize: ExtendedAuthorize;
  msg_type: 'authorize';
}
