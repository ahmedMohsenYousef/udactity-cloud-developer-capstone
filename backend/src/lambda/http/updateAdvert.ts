import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateAdvertRequest } from '../../requests/UpdateAdvertRequest'
import {updateUserAdvert} from '../../businessLogic/advertismentBusinessLogic'
import {createLogger} from '../../utils/logger'
const logger = createLogger('adverts')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`received a update advert request`, event)

  const advertId = event.pathParameters.advertId
  const updatedAdvert: UpdateAdvertRequest = JSON.parse(event.body)

  let result = await updateUserAdvert(advertId, updatedAdvert, event);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: result
    })
  }
}
