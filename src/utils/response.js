class Response {
  static success(res, data = {}) {
    return res.status(200).send({
      ...data
    });
  }

  static error(res, error) {
    return res.status(error.code ? error.code : 400).send({
      errorMessage:
        error && error.message ? error.message : "Something went wrong..."
    });
  }
}

module.exports = Response;
