
declare global {
    interface Error {
        statusCode?: number;
        prodErrorMessage?: string;
    }
}
export class BadRequestError extends Error {
    prodErrorMessage: string = 'Bad Request';
    constructor(message = 'Bad Request') {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = 400;
    }
}
  
export class UnauthorizedError extends Error {
    prodErrorMessage: string = 'Unauthorized';
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}

export class ForbiddenError extends Error {
    prodErrorMessage?: string = 'Forbidden';
    constructor(message = 'Forbidden') {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;
    }
}

export class NotFoundError extends Error {
    prodErrorMessage?: string = 'Not Found';
    constructor(message = 'Not Found') {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

export class MethodNotAllowedError extends Error {
    prodErrorMessage?: string = 'Method Not Allowed';
    constructor(message = 'Method Not Allowed') {
        super(message);
        this.name = 'MethodNotAllowedError';
        this.statusCode = 405;
    }
}

export class BadGatewayError extends Error {
    prodErrorMessage?: string = 'Bad Gateway';
    constructor(message = 'Bad Gateway') {
        super(message);
        this.name = 'BadGatewayError';
        this.statusCode = 502;
    }
}

  
  
  
  
  
  
  