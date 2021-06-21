const ClientError = require('./ClientError');

class InvariatError extends ClientError{
  constructor(message){
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariatError;