/* eslint-disable no-param-reassign */
import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'
import { convertEnvString } from './dynamicStringUtils'


const convertRaw = (dynamicString: DynamicString, context: Paw.Context): Postman.Body => {
  const value = convertEnvString(dynamicString, context)
  const pmBody: Postman.Body = {
    mode: 'raw',
    disabled: false,
    raw: value,
  }
  return pmBody
}

const convertBodyUrlEncoded = (pawUrlEncodedBody: {[key:string]: DynamicString}, context: Paw.Context): Postman.Body => {
  const pmParams = Object.entries(pawUrlEncodedBody).map(([key, value]): Postman.BodyUrlEncodedParameter => {
    const pmParam: Postman.BodyUrlEncodedParameter = {
      key: (key || ''),
      value: convertEnvString(value, context),
      disabled: false,
      description: null,
    }
    return pmParam
  })
  const pmBody: Postman.Body = {
    mode: 'urlencoded',
    disabled: false,
    urlencoded: pmParams,
  }
  return pmBody
}

const convertBodyMultipart = (pawMultipartBody: {[key:string]: DynamicString}, context: Paw.Context): Postman.Body => {
  const pmParams = Object.entries(pawMultipartBody).map(([key, value]): Postman.BodyFormParameter => {
    // file
    const valueOnlyDv = (value ? value.getOnlyDynamicValue() : null)
    if (valueOnlyDv && valueOnlyDv.type === 'com.luckymarmot.FileContentDynamicValue') {
      const pmParam: Postman.BodyFormParameter = {
        key: (key || ''),
        disabled: false,
        type: 'file',
        description: null,
        src: null,
      }
      return pmParam
    }

    // string/text
    const pmParam: Postman.BodyFormParameter = {
      key: (key || ''),
      value: convertEnvString(value, context),
      disabled: false,
      type: 'text',
      description: null,
    }
    return pmParam
  })
  const pmBody: Postman.Body = {
    mode: 'formdata',
    disabled: false,
    formdata: pmParams,
  }
  return pmBody
}

const convertBodyFile = (pawRequest: Paw.Request): Postman.Body => {
  const pmBodyFile: Postman.BodyFile = {
    src: null,
    content: ((pawRequest.body as string|null) || null)
  }
  const pmBody: Postman.Body = {
    mode: 'file',
    disabled: false,
    file: pmBodyFile,
  }
  return pmBody
}

const convertBody = (pawRequest: Paw.Request, context: Paw.Context): Postman.Body|null => {
  // URL-Encoded (urlencoded)
  const pawUrlEncodedBody = (pawRequest.getUrlEncodedBody(true) as {[key:string]: DynamicString}|null)
  if (pawUrlEncodedBody) {
    return convertBodyUrlEncoded(pawUrlEncodedBody, context)
  }

  // Multipart (formdata)
  const pawMultipartBody = (pawRequest.getMultipartBody(true) as {[key:string]: DynamicString}|null)
  if (pawMultipartBody) {
    return convertBodyMultipart(pawMultipartBody, context)
  }

  // Body as DV
  const pawBody = (pawRequest.getBody(true) as DynamicString|null)
  if (!pawBody) {
    return null
  }
  const pawBodyDv = pawBody.getOnlyDynamicValue()

  // File
  if (pawBodyDv && pawBodyDv.type === 'com.luckymarmot.FileContentDynamicValue') {
    return convertBodyFile(pawRequest)
  }

  // Raw
  return convertRaw(pawBody, context)
}

export default convertBody
