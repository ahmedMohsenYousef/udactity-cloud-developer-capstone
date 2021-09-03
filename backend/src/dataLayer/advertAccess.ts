import * as AWS  from 'aws-sdk'
import * as AWSXRay  from 'aws-xray-sdk'
import { advertisementItem } from '../models/AdvertItemModel'
import { AdvertUpdate } from '../models/AdvertUpdate'
import {createLogger} from '../utils/logger'

const XRayAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('adverts')

const docClient = new XRayAWS.DynamoDB.DocumentClient()
const advertIdIndex = process.env.ADVERT_ID_INDEX
const bucketName = process.env.IMAGES_S3_BUCKET
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION


const s3 = new XRayAWS.S3({
  signatureVersion: 'v4'
})


export class AdvertAccess {

  constructor(private readonly advertsTable = process.env.ADVERTS_TABLE) {}

  async createAdvert(advertItem: advertisementItem): Promise<advertisementItem> {

    const newItem = {
      Advert: 'CarAdvert',
      ...advertItem
    }

   let result = await docClient.put({
      TableName: this.advertsTable,
      Item: newItem
    }).promise()

    logger.info(`created an advert for user ${advertItem.userId}, creation result: `+JSON.stringify(result.Attributes))

    return advertItem
  }

  async deleteAdvert(advertId: string, userId:string): Promise<string> {

    const deleteParams = {
      TableName: this.advertsTable,
      Key: {
        Advert : 'CarAdvert',
        advertisementId: advertId
      },
      ConditionExpression: 'userId = :userId',
       ExpressionAttributeValues:{
           ":userId": userId
       }
     };
      await docClient.delete(deleteParams).promise()
      
      logger.info(`deleted an advert with Id ${advertId}`)

     return advertId
  }

  async getAllAdverts (userId:string): Promise<advertisementItem[]>{
    
      const result = await docClient.query({
        TableName : this.advertsTable,
        KeyConditionExpression: 'Advert = :hkey',
        ExpressionAttributeValues: {
          ':hkey': 'CarAdvert'
        }
    }).promise()

    logger.info(`user ${userId} requested adverts and found `+result.Items.length+' adverts')

    return result.Items as advertisementItem[]
  }

  async getUserCreatedAdverts (userId:string): Promise<advertisementItem[]>{
    
    const result = await docClient.query({
      TableName : this.advertsTable,
      IndexName : advertIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
  }).promise()

  logger.info(`getting user ${userId} created adverts, fetch result`+JSON.stringify(result.Items))

  return result.Items as advertisementItem[]
}

  async updateUserAdvert(advertId:string, userId:string, advertUpdate:AdvertUpdate): Promise<advertisementItem> {

   let result = await docClient.update({
      TableName: this.advertsTable,
      Key: {
        Advert : 'CarAdvert',
        advertisementId: advertId
      },
      ExpressionAttributeNames: {
        '#year_attribute': 'year'
      },
      UpdateExpression: `set make =:make, model=:model, 
                              #year_attribute=:year_value , mileage=:mileage , 
                              description=:description, contactInfo=:contactInfo,
                              price=:price`,

      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues:{
          ":make": advertUpdate.make,
          ":model": advertUpdate.model,
          ":year_value": advertUpdate.year,
          ":mileage": advertUpdate.mileage,
          ":description": advertUpdate.description,
          ":contactInfo": advertUpdate.contactInfo,
          ":price": advertUpdate.price,

          ":userId": userId
      },
      ReturnValues:"UPDATED_NEW"
    }).promise()

    logger.info(`updating an advert by Id ${advertId}: update result`+JSON.stringify(result.Attributes))

    return result.Attributes as advertisementItem
  }

  async getUploadURL (attachmentId:string){

    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: attachmentId,
      Expires: signedUrlExpiration
    })

  }

  async updateUserAdvertAttachmentUrl(advertId:string, userId:string, attachmentId:string): Promise<advertisementItem> {

    let result = await docClient.update({
       TableName: this.advertsTable,
       Key: {
        Advert: 'CarAdvert',
        advertisementId: advertId
      },
       UpdateExpression: "set attachmentUrl = :attachmentUrl",
       ConditionExpression: 'userId = :userId',
       ExpressionAttributeValues:{
           ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${attachmentId}`,
           ":userId": userId
       },
       ReturnValues:"UPDATED_NEW"
 
     }).promise()
 
     logger.info(`updating an advert URL by Id ${advertId}: update result`+JSON.stringify(result.Attributes))

     return result.Attributes as advertisementItem
  }




}
