import { APIGatewayProxyEvent } from "aws-lambda"


type CorsConfig = {
    rootDomain: string,
    localHostPort: number,
    allowedCorsPrefixes: string[],
}

export const setCorsHeaders = (event: APIGatewayProxyEvent, config: CorsConfig) => {
    const origin = event.headers.origin || event.headers.Origin
    const whitelist = [...config.allowedCorsPrefixes.map(prefix => `https://${prefix}.${config.rootDomain}`), `https://${config.rootDomain}`]
    return {
        'Access-Control-Allow-Origin': origin && process.env.NODE_ENV === 'production'
            ? whitelist.includes(origin)
                ? origin
                : `https://${config.rootDomain}`
            : [
                `http://localhost:${config.localHostPort}`, 
                `http://localhost:${config.localHostPort+1}`, 
                `https://app.dev.${config.rootDomain}`, ...whitelist].includes(origin!)
                ? origin!
                : `http://localhost:${config.localHostPort}`,
        'Access-Control-Allow-Credentials': true,
    }
}