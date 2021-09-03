import * as uuid from 'uuid'

import { advertisementItem } from '../models/AdvertItemModel'
import { AdvertAccess } from '../dataLayer/advertAccess'
import { CreateAdvertRequest } from '../requests/CreateAdvertRequest'
import { UpdateAdvertRequest } from '../requests/UpdateAdvertRequest'
import { APIGatewayProxyEvent} from 'aws-lambda'
import { getUserId } from '../lambda/utils'
import {createLogger} from '../utils/logger'

const logger = createLogger('adverts')
const advertAccess = new AdvertAccess()


export async function createAdvert(createAdvertRequest: CreateAdvertRequest, event: APIGatewayProxyEvent): Promise<advertisementItem> {

  const itemId = uuid.v4()
  const userId = getUserId(event)

  logger.info(`received createAdvert request from user id  ${userId}, make: ${createAdvertRequest.make}, model: ${createAdvertRequest.model}`)

  return await advertAccess.createAdvert({
    advertisementId:itemId,    
    userId: userId,
    description: createAdvertRequest.description,
    make: createAdvertRequest.make,
    model:createAdvertRequest.model,
    mileage: createAdvertRequest.mileage,
    year:createAdvertRequest.year,
    price: createAdvertRequest.price,
    createdAt: new Date().toISOString(),
    contactInfo: createAdvertRequest.contactInfo,
    attachmentUrl:""
  })

}

export async function deleteAdvert(advertId: string, event: APIGatewayProxyEvent): Promise<string> {

    const userId = getUserId(event)

    logger.info(`received deleteAdvert request from user id  ${userId}, advertId: ${advertId}`)

    return await advertAccess.deleteAdvert(advertId, userId)
}

export async function getAllAdverts(event: APIGatewayProxyEvent): Promise<advertisementItem[]> {
  const userId = getUserId(event)
  logger.info(`user ${userId} is requesting adverts list`)
  return await advertAccess.getAllAdverts(userId)
}

export async function getUserCreatedAdverts(event: APIGatewayProxyEvent): Promise<advertisementItem[]> {
  const userId = getUserId(event)
  logger.info(`user ${userId} is requesting his created adverts list`)
  return await advertAccess.getUserCreatedAdverts(userId)
}

export async function updateUserAdvert(advertId: string, updateAdvertRequest: UpdateAdvertRequest, event: APIGatewayProxyEvent): Promise<advertisementItem> {
  const userId = getUserId(event)

  logger.info(`received updateAdvert request from user id  ${userId}, advertId: ${advertId}`)

  return await advertAccess.updateUserAdvert(advertId, userId, {
    make: updateAdvertRequest.make,
    model: updateAdvertRequest.model,
    year: updateAdvertRequest.year,
    mileage: updateAdvertRequest.mileage,
    price: updateAdvertRequest.price,
    contactInfo: updateAdvertRequest.contactInfo,
    description: updateAdvertRequest.description
  })
  
}

export async function getAdvertImageURL(advertId: string, event: APIGatewayProxyEvent): Promise<string> {

  const userId = getUserId(event)
  const attachmentId = uuid.v4()

  logger.info(`user ${userId} is requesting a signed url to upload an attachment, generated id is ${attachmentId}`)

  let uploadUrl = await advertAccess.getUploadURL(attachmentId)
  await advertAccess.updateUserAdvertAttachmentUrl(advertId, userId,attachmentId)

  return uploadUrl
}


