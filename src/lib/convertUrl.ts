import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'
import convertEnvString from './convertEnvString'


const convertUrlBaseEnvString = (urlString: string): {protocol: string|null, host: string|string[]|null, port: string|null, path: string|string[]|null} => {
  if (!urlString) {
    return {
      protocol: null,
      host: [''],
      port: null, 
      path: null,
    }
  }

  // parse URL string
  const match = urlString.match(/^([^:]+):\/\/([^:/]+)(?::([0-9]*))?(?:(\/.*))?$/i)
  if (!match) {
    return {
      protocol: null,
      host: [urlString],
      port: null,
      path: null,
    }
  }

  // split host
  let host: string[] = []
  if (match[2]) {
    host = match[2].split('.')
  }

  // split path
  let path: string[] = []
  if (match[4]) {
    path = match[4].split('/').filter((component) => {
      return !!component
    })
  }

  return {
    protocol: (match[1] || null),
    host,
    port: (match[3] || null),
    path,
  }
}

const convertUrlBase = (pawRequest: Paw.Request, context: Paw.Context): {protocol: string|null, host: string|string[]|null, port: string|null, path: string|string[]|null} => {
  // first convert to a Postman Env String which will be easier to parse
  const urlString = convertEnvString(pawRequest.getUrlBase(true) as DynamicString, context)
  return convertUrlBaseEnvString(urlString)
}

const convertQueryParam = (pawQueryParam: Paw.KeyValue, pawRequest: Paw.Request, context: Paw.Context): Postman.UrlQueryParam => {
  // find any request variable
  let { value } = pawQueryParam
  let description = null
  const onlyDv = (value ? value.getOnlyDynamicValue() : null)
  if (onlyDv && onlyDv.type === 'com.luckymarmot.RequestVariableDynamicValue') {
    const requestVariableId = (onlyDv as any).variableUUID
    const requestVariable = pawRequest.getVariableById(requestVariableId)
    if (requestVariable) {
      value = (requestVariable.value as DynamicString)
      description = (requestVariable.description || null)
    }
  }

  const pmQueryParam: Postman.UrlQueryParam = {
    key: (pawQueryParam.name ? pawQueryParam.name.getEvaluatedString() : ''),
    value: convertEnvString(value, context),
    disabled: !pawQueryParam.enabled,
    description,
  }
  return pmQueryParam
}

const convertQueryParams = (pawRequest: Paw.Request, context: Paw.Context): Postman.UrlQueryParam[]|null => {
  const pawQueryParams = pawRequest.getUrlParametersArray()
  if (!pawQueryParams || pawQueryParams.length === 0) {
    return null
  }
  return pawQueryParams.map((pawQueryParam) => {
    return convertQueryParam(pawQueryParam, pawRequest, context)
  })
}

const convertUrl = (pawRequest: Paw.Request, context: Paw.Context): Postman.Url => {
  const { protocol, host, port, path } = convertUrlBase(pawRequest, context)
  const pmUrl: Postman.Url = {
    raw: convertEnvString(pawRequest.getUrl(true) as DynamicString, context),
    query: convertQueryParams(pawRequest, context),
    protocol,
    host,
    port,
    path,
  }
  return pmUrl
}

export { convertUrlBaseEnvString }
export default convertUrl
