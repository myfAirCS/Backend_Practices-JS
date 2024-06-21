class apiResponse {
  constructor(message = "Success", statusCode, data) {
    this.statusCode = statusCode < 400;
    this.data = data;
    this.success = true;
    this.message = message;
  }
}

export { apiResponse };
