const stream = require("stream");
const LimitExceededError = require("./LimitExceededError");

class LimitSizeStream extends stream.Transform {
  limit;
  totalChunkSize = 0;
  constructor(options) {
    super(options);
    if ("limit" in options) {
      this.limit = options.limit;
    }
  }

  _transform(chunk, encoding, callback) {
    if (this.limit) {
      const chunkSize = Buffer.byteLength(chunk, encoding);
      this.totalChunkSize += chunkSize;
      if (this.totalChunkSize > this.limit) {
        return callback(
          new LimitExceededError(
            `Stream size limit exceeded:\r\n max limit ${this.limit}`
          )
        );
      }
    }
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
