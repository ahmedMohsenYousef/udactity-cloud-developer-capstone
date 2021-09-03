import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateAdvertRequest } from '../../requests/CreateAdvertRequest'
import {createAdvert} from '../../businessLogic/advertismentBusinessLogic'
import {createLogger} from '../../utils/logger'

const logger = createLogger('adverts')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`received a create advert request`, event)

  const newAdvert: CreateAdvertRequest = JSON.parse(event.body)
  let newItem = await createAdvert(newAdvert, event);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
