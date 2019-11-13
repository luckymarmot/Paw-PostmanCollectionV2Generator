/* eslint-disable no-param-reassign */
import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'
import { convertEnvString } from './dynamicStringUtils'


const convertHeader = (pawHeader: Paw.KeyValue, pawRequest: Paw.Request, context: Paw.Context): Postman.Header => {
  // find any request variable
  let { value } = pawHeader
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

  const pmHeader: Postman.Header = {
    key: (pawHeader.name ? pawHeader.name.getEvaluatedString() : ''),
    value: convertEnvString(value, context),
    disabled: !pawHeader.enabled,
    description,
  }
  return pmHeader
}

const convertHeaders = (pawRequest: Paw.Request, context: Paw.Context): Postman.Header[] => {
  return pawRequest.getHeadersArray().map((pawHeader) => {
    return convertHeader(pawHeader, pawRequest, context)
  })
}

export default convertHeaders
