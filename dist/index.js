"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BadGatewayError: () => BadGatewayError,
  BadRequestError: () => BadRequestError,
  ForbiddenError: () => ForbiddenError,
  MethodNotAllowedError: () => MethodNotAllowedError,
  NotFoundError: () => NotFoundError,
  UnauthorizedError: () => UnauthorizedError,
  isProd: () => isProd,
  restRequestHandler: () => restRequestHandler
});
module.exports = __toCommonJS(src_exports);

// src/Errors.ts
var BadRequestError = class extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.prodErrorMessage = "Bad Request";
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
};
var UnauthorizedError = class extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.prodErrorMessage = "Unauthorized";
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
};
var ForbiddenError = class extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.prodErrorMessage = "Forbidden";
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
};
var NotFoundError = class extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.prodErrorMessage = "Not Found";
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
};
var MethodNotAllowedError = class extends Error {
  constructor(message = "Method Not Allowed") {
    super(message);
    this.prodErrorMessage = "Method Not Allowed";
    this.name = "MethodNotAllowedError";
    this.statusCode = 405;
  }
};
var BadGatewayError = class extends Error {
  constructor(service, message = "Bad Gateway") {
    super(`Error in: ${service}: ${message}`);
    this.prodErrorMessage = "Bad Gateway";
    this.name = "BadGatewayError";
    this.statusCode = 502;
  }
};

// src/fns/parseRequest.ts
var parseRequest = (event) => {
  switch (event.httpMethod) {
    case "POST":
      return typeof event.body === "object" ? event.body : JSON.parse(event.body);
    case "GET":
      return event.queryStringParameters;
    default:
      throw new MethodNotAllowedError("Only GET and POST requests are allowed.");
  }
};

// src/fns/setCorsHeaders.ts
var setCorsHeaders = (event, config) => {
  const origin = event.headers.origin || event.headers.Origin;
  const whitelist = [...config.allowedCorsPrefixes.map((prefix) => `https://${prefix}.${config.rootDomain}`), `https://${config.rootDomain}`];
  return {
    "Access-Control-Allow-Origin": origin && process.env.NODE_ENV === "production" ? whitelist.includes(origin) ? origin : `https://${config.rootDomain}` : `http://localhost:${config.localHostPort}`,
    "Access-Control-Allow-Credentials": true
  };
};

// src/fns/authenticate.ts
var import_aws_jwt_verify = require("aws-jwt-verify");
var authenticate = async (event) => {
  try {
    const payload = await import_aws_jwt_verify.CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO__USERPOOL_ID,
      clientId: process.env.COGNITO__CLIENT_ID,
      tokenUse: "access"
    }).verify(event.headers.Authorization.split(" ")[1]);
    return payload.username;
  } catch (_e) {
    throw new UnauthorizedError("Failure at Cognito Token Verification in 'authenticate' function.");
  }
};

// src/restRequestHandler.ts
var restRequestHandler = (handler) => async (event) => {
  try {
    console.log(event.pathParameters);
    const userId = process.env.AUTHENTICATE === "true" && await authenticate(event);
    const payload = parseRequest(event);
    const result = await handler({
      ...payload,
      userId,
      ...event.pathParameters
    }, event.headers);
    return {
      statusCode: result?.result ? 200 : 204,
      headers: {
        ...result?.headers,
        ...setCorsHeaders(event, {
          rootDomain: process.env.ROOT_DOMAIN,
          localHostPort: parseInt(process.env.LOCAL_HOST_PORT),
          allowedCorsPrefixes: process.env.ALLOWED_CORS_PREFIXES.split(",")
        })
      },
      body: JSON.stringify(result?.result)
    };
  } catch (_e) {
    const error = _e;
    console.error(error);
    return {
      statusCode: error.statusCode ?? 500,
      headers: {
        ...setCorsHeaders(event, {
          rootDomain: process.env.ROOT_DOMAIN,
          localHostPort: parseInt(process.env.LOCAL_HOST_PORT),
          allowedCorsPrefixes: process.env.ALLOWED_CORS_PREFIXES.split(",")
        })
      },
      body: JSON.stringify({
        message: `The following Error occurred: ${process.env.NODE_ENV === "production" ? error.prodErrorMessage ?? "Internal Server Error" : error.message}`
      })
    };
  }
};

// src/index.ts
var isProd = () => {
  return process.env.NODE_ENV === "prod";
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BadGatewayError,
  BadRequestError,
  ForbiddenError,
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
  isProd,
  restRequestHandler
});
