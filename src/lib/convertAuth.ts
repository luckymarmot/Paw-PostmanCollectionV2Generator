/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'
import { convertEnvString } from './dynamicStringUtils'


const makePmAuthKeyValueRaw = (key: string, value: any, type: string): Postman.AuthKeyValue => {
  const pmAuthKeyValue: Postman.AuthKeyValue = {
    key,
    value,
    type,
  }
  return pmAuthKeyValue
}

const makePmAuthKeyValue = (key: string, value: string|DynamicString|null, context: Paw.Context): Postman.AuthKeyValue => {
  let pmValue = ''
  if (typeof value === 'string') {
    pmValue = value
  }
  else if (value) {
    pmValue = convertEnvString(value, context)
  }
  return makePmAuthKeyValueRaw(key, pmValue, 'string')
}

const convertAuthBasic = (pawBasicAuth: Paw.BasicAuth, context: Paw.Context): Postman.Auth => {
  const pmAuth: Postman.Auth = {
    type: 'basic',
    basic: [
      makePmAuthKeyValue('username', pawBasicAuth.username, context),
      makePmAuthKeyValue('password', pawBasicAuth.password, context),
    ]
  }
  return pmAuth
}

const convertAuthOAuth1 = (pawOAuth1: Paw.OAuth1, context: Paw.Context): Postman.Auth => {
  const pmAuth: Postman.Auth = {
    type: 'oauth1',
    oauth1: [
      makePmAuthKeyValue('consumerKey', pawOAuth1.oauth_consumer_key, context),
      makePmAuthKeyValue('consumerSecret', pawOAuth1.oauth_consumer_secret, context),
      makePmAuthKeyValue('token', pawOAuth1.oauth_token, context),
      makePmAuthKeyValue('tokenSecret', pawOAuth1.oauth_token_secret, context),
      makePmAuthKeyValue('signatureMethod', (pawOAuth1.oauth_signature_method || ''), context),
      makePmAuthKeyValue('version', (pawOAuth1.oauth_version || ''), context),
      makePmAuthKeyValueRaw('addParamsToHeader', false, 'boolean'),
      makePmAuthKeyValueRaw('addEmptyParamsToSign', false, 'boolean'),
    ]
  }
  return pmAuth
}

const convertAuthOAuth2 = (pawOAuth2: Paw.OAuth2, context: Paw.Context): Postman.Auth => {
  const pmAuth: Postman.Auth = {
    type: 'oauth2',
    oauth2: [
      makePmAuthKeyValue('accessToken', (pawOAuth2.token || null), context),
      makePmAuthKeyValue('addTokenTo', 'header', context),
    ]
  }
  return pmAuth
}

const convertAuthDigest = (pawDigestDv: DynamicValue, context: Paw.Context): Postman.Auth => {
  const pmAuth: Postman.Auth = {
    type: 'digest',
    digest: [
      makePmAuthKeyValue('username', (pawDigestDv as any).username, context),
      makePmAuthKeyValue('password', (pawDigestDv as any).password, context),
    ]
  }
  return pmAuth
}

const convertAuthHawk = (pawHawkDv: DynamicValue, context: Paw.Context): Postman.Auth => {
  const pmAuth: Postman.Auth = {
    type: 'hawk',
    hawk: [
      makePmAuthKeyValue('authId', (pawHawkDv as any).id, context),
      makePmAuthKeyValue('authKey', (pawHawkDv as any).key, context),
      makePmAuthKeyValue('algorithm', (pawHawkDv as any).algorithm, context),
    ]
  }
  return pmAuth
}

const convertAuth = (pawRequest: Paw.Request, context: Paw.Context): Postman.Auth|null => {
  // basic auth
  const pawBasicAuth = pawRequest.getHttpBasicAuth(true)
  if (pawBasicAuth) {
    return convertAuthBasic(pawBasicAuth, context)
  }

  // OAuth 1
  const pawOAuth1 = pawRequest.getOAuth1(true)
  if (pawOAuth1) {
    return convertAuthOAuth1(pawOAuth1, context)
  }

  // OAuth 2
  const pawOAuth2 = pawRequest.getOAuth2(true)
  if (pawOAuth2) {
    return convertAuthOAuth2(pawOAuth2, context)
  }

  // Get Auth Header
  const pawAuthHeader = (pawRequest.getHeaderByName('Authorization', true) as DynamicString|null)
  if (!pawAuthHeader) {
    return null
  }
  const pawAuthHeaderDv = pawAuthHeader.getOnlyDynamicValue()
  if (!pawAuthHeaderDv) {
    return null
  }

  // Digest
  if (pawAuthHeaderDv.type === 'com.luckymarmot.PawExtensions.DigestAuthDynamicValue') {
    return convertAuthDigest(pawAuthHeaderDv, context)
  }

  // Hawk
  if (pawAuthHeaderDv.type === 'uk.co.jalada.PawExtensions.HawkDynamicValue') {
    return convertAuthHawk(pawAuthHeaderDv, context)
  }

  return null
}

export default convertAuth
