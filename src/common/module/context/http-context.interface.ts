export interface IHttpContextService {
  setTransactionId(id: string): void;
  getTransactionId(): string;
}

export const IHttpContextService = Symbol('IHttpContextService');
