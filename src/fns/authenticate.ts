import { APIGatewayProxyEvent } from "aws-lambda"
import { UnauthorizedError } from "../Errors"
import { CognitoJwtVerifier } from "aws-jwt-verify"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";


const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
export const authenticate = async (event: APIGatewayProxyEvent) => {
    try {
        const authToken = event.headers.Authorization!.split(' ')[1]
        if (!authToken) throw new UnauthorizedError("No Authorization Token found. Endpoint requires either API Key or Access Token.")
        if (authToken.startsWith('sk_')) {
            // API Key Verification
            const { Item } = await db.send(new GetCommand({
                TableName: process.env.API_KEY_TABLE_NAME!,
                Key: {
                    apiKey: authToken,
                }
            }))
            if (!Item) throw new UnauthorizedError("Invalid API Key")
            return Item.userId
        }
        // Access Token Verification
        const payload = await CognitoJwtVerifier.create({
            userPoolId: process.env.COGNITO__USERPOOL_ID!,
            clientId: process.env.COGNITO__CLIENT_ID!,
            tokenUse: 'access',
        }).verify(event.headers.Authorization!.split(' ')[1])
        return payload.username
    } catch (_e) {
        const e = _e as Error
        throw new UnauthorizedError(`Failure at authentication: ${e.message}`)
    }
}