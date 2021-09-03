import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getAdvertImageURL} from '../../businessLogic/advertismentBusinessLogic'
import {createLogger} from '../../utils/logger'

const logger = createLogger('adverts')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`received a generate upload url request`, event)

  const advertId = event.pathParameters.advertId
  let item = await getAdvertImageURL(advertId,event)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: item
    })
  }
}
