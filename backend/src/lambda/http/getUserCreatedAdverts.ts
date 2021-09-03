import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserCreatedAdverts} from '../../businessLogic/advertismentBusinessLogic'
import {createLogger} from '../../utils/logger'
const logger = createLogger('adverts')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`received a get user's adverts request`, event)

  let result = await getUserCreatedAdverts(event)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({items : result})
  }
}
