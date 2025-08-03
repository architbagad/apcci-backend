class ExceptionHandler {
  static handle(error: Error): void {
    console.error('An error occurred:', error.message);
  }
}

export default ExceptionHandler;