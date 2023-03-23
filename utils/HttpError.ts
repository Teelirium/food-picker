class HttpError extends Error {
  readonly code: number;

  constructor(msg: string, code: number) {
    super(msg);
    this.code = code;
  }
}

export default HttpError;
