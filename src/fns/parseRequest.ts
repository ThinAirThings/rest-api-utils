

import { APIGatewayProxyEvent } from "aws-lambda"
import { MethodNotAllowedError } from "../Errors"


export const parseRequest = <P>(event: APIGatewayProxyEvent): P => {
    switch(event.httpMethod){
        case 'POST': return typeof event.body === 'object' ? event.body : JSON.parse(event.body)
        case 'GET' : return event.queryStringParameters as P
        default: throw new MethodNotAllowedError("Only GET and POST requests are allowed.")
    }
}