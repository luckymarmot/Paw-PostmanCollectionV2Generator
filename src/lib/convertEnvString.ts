import Paw from '../types-paw-api/paw'


const convertEnvString = (dynamicString: DynamicString, context: Paw.Context): string => {
  if (!dynamicString) {
    return ''
  }
  return dynamicString.components.map((component): string => {
    if (typeof component === 'string') {
      return component
    }
    if (component.type === 'com.luckymarmot.EnvironmentVariableDynamicValue') {
      const envVarId = (component as any).environmentVariable
      const envVar = context.getEnvironmentVariableById(envVarId)
      if (envVar) {
        return `{{${envVar.name}}}`
      }
    }
    return component.getEvaluatedString()
  }).join('')
}

export default convertEnvString
