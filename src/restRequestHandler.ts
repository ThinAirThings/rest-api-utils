import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders,APIGatewayProxyResult } from "aws-lambda"
import { parseRequest } from "./fns/parseRequest"
import { setCorsHeaders } from "./fns/setCorsHeaders"
import { authenticate } from "./fns/authenticate"

type HandlerResult = {
    result?: Record<string, any>,
    headers?: APIGatewayProxyEventHeaders
}

export const restApiHandler = <P, R extends HandlerResult>(config: any, handler: ( 
        payload: P, 
        headers: APIGatewayProxyEventHeaders
    ) => Promise<R|void>, opts?: {}
) => async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try { 
        console.log(event)
        // Authenticate the request if needed
        const userId = (process.env.AUTHENTICATE === "true") && await authenticate(event)
        // Parse the request
        const payload = parseRequest<P>(event)
        // Handle the request
        const result = await handler({...payload, userId}, event.headers)
        // Return the result
        return {
            statusCode: result?.result?200:204,
            headers: {
                ...result?.headers,
                ...setCorsHeaders(event, config),
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
                ...setCorsHeaders(event, config),
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

