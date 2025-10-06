export class DatabaseError extends Error {
  constructor(message: string) {
    super('Database Error: ' + message);
    this.name = 'DatabaseError';
  }
}

export class InvalidRequestError extends Error {
  constructor(parameters: string[]) {
    super('Invalid Request Error: Missing one or more parameters (' + parameters.join(', ') + ')');
    this.name = 'InvalidRequestError';
  }
}

export class MissingResourceError extends Error {
  constructor(resource: string) {
    super('Missing Resource Error: The resource <' + resource + '> was not found');
    this.name = 'MissingResourceError';
  }
}

export class AdditionalContextError extends Error {
  constructor(context: string) {
    super(`Additional Context Error: Failed to get the additional context ${context}`);
    this.name = 'AdditionalContextError';
  }
}
