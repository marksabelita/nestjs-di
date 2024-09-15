export class CustomError extends Error {
  constructor(
    message: string,
    public readonly transactionId: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = 'CustomError';
  }
}
