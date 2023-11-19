import { APIGatewayProxyEvent } from "aws-lambda"
import { CdkConfig } from "../../.."

export const setCorsHeaders = (event: APIGatewayProxyEvent, config: Pick<CdkConfig, 'rootDomain' | 'localHostPort' | 'allowedCorsPrefixes'>) => {
    const origin = event.headers.origin || event.headers.Origin
    const whitelist = [...config.allowedCorsPrefixes.map(prefix => `https://${prefix}.${config.rootDomain}`), `https://${config.rootDomain}`]
    return {
        'Access-Control-Allow-Origin': origin && process.env.NODE_ENV === 'production'
            ? whitelist.includes(origin)
                ? origin
                : `https://${config.rootDomain}`
            : `http://localhost:${config.localHostPort}`,
        'Access-Control-Allow-Credentials': true,
    }
}