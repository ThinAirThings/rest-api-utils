import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders } from "aws-lambda"
import { parseRequest } from "./fns/parseRequest"
import { setCorsHeaders } from "./fns/setCorsHeaders"

type HandlerResult = {
    result?: Record<string, any>,
    headers?: APIGatewayProxyEventHeaders
}

export type RestRequestConfig = {
    rootDomain: string,
    localHostPort: number,
    allowedCorsPrefixes: string[],
}

export const restRequestHandler = <P>(handler: ( 
        payload: P, 
        headers: APIGatewayProxyEventHeaders
    ) => Promise<HandlerResult|void>, 
) => async (event: APIGatewayProxyEvent, _context: any) => {
    try { 
        // Parse the request
        const payload = parseRequest<P>(event)
        // Handle the request
        const result = await handler({
            ...payload, 
            userId: event.requestContext.authorizer?.userId,
            ...event.pathParameters
        }, event.headers)
        // Return the result
        return {
            statusCode: result?.result?200:204,
            headers: { 
                ...result?.headers,
                ...setCorsHeaders(event, {
                    rootDomain: process.env.ROOT_DOMAIN as string,
                    localHostPort: parseInt(process.env.LOCAL_HOST_PORT as string),
                    allowedCorsPrefixes: (process.env.ALLOWED_CORS_PREFIXES as string).split(','),
                }),
            },
            body: JSON.stringify(result?.result)
        }
    } catch (_e) {
        const error = _e as Error
        // Log the error
        console.error(error)
        // Return the error
        return {
            statusCode: error.statusCode ?? 500,
            headers: {
                ...setCorsHeaders(event, {
                    rootDomain: process.env.ROOT_DOMAIN as string,
                    localHostPort: parseInt(process.env.LOCAL_HOST_PORT as string),
                    allowedCorsPrefixes: (process.env.ALLOWED_CORS_PREFIXES as string).split(','),
                }),
            },
            body: JSON.stringify({
                message: `The following Error occurred: ${process.env.NODE_ENV === 'production'
                    ? error.prodErrorMessage ?? "Internal Server Error"
                    : error.message
                }` 
            })
        }
    }
}




