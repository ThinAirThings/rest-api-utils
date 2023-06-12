import { APIGatewayProxyEventHeaders, APIGatewayProxyEvent } from 'aws-lambda';
export declare const restRequestHandler: (handler: <T>({ payload, headers }: {
    payload?: T | undefined;
    headers?: APIGatewayProxyEventHeaders | undefined;
}) => Promise<any>, verify?: boolean) => (event: APIGatewayProxyEvent) => Promise<{
    statusCode: number;
    body: string;
}>;
