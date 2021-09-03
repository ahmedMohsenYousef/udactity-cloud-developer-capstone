import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {deleteAdvert} from '../../businessLogic/advertismentBusinessLogic'
import {createLogger} from '../../utils/logger'

const logger = createLogger('adverts')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info(`received a delete advert request`, event)

  const advertId = event.pathParameters.advertId
  await deleteAdvert(advertId,event);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ""
  }
}
