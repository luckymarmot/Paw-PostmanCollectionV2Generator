import Paw from '../../types-paw-api/paw'
import { convertUrlBaseEnvString } from '../convertUrl'


describe('convertUrlBaseEnvString', () => {
  test('works with a simple URL', () => {
    const pmUrl = convertUrlBaseEnvString('https://echo.paw.cloud/get')
    expect(pmUrl.protocol).toEqual('https')
    expect(pmUrl.host).toEqual([
      'echo',
      'paw',
      'cloud',
    ])
    expect(pmUrl.port).toBeNull()
    expect(pmUrl.path).toEqual([
      'get'
    ])
  })

  test('works with an IP URL', () => {
    const pmUrl = convertUrlBaseEnvString('http://127.0.0.1/get')
    expect(pmUrl.protocol).toEqual('http')
    expect(pmUrl.host).toEqual([
      '127',
      '0',
      '0',
      '1',
    ])
    expect(pmUrl.port).toBeNull()
    expect(pmUrl.path).toEqual([
      'get'
    ])
  })

  test('works with an IP URL with port', () => {
    const pmUrl = convertUrlBaseEnvString('http://127.0.0.1:8080/get')
    expect(pmUrl.protocol).toEqual('http')
    expect(pmUrl.host).toEqual([
      '127',
      '0',
      '0',
      '1',
    ])
    expect(pmUrl.port).toEqual('8080')
    expect(pmUrl.path).toEqual([
      'get'
    ])
  })

  test('works with an empty URL', () => {
    const pmUrl = convertUrlBaseEnvString('')
    expect(pmUrl.protocol).toBeNull()
    expect(pmUrl.host).toEqual([
      '',
    ])
    expect(pmUrl.port).toBeNull()
    expect(pmUrl.path).toBeNull()
  })

  test('works with an env var URL', () => {
    const pmUrl = convertUrlBaseEnvString('{{baseUrl}}')
    expect(pmUrl.protocol).toBeNull()
    expect(pmUrl.host).toEqual([
      '{{baseUrl}}',
    ])
    expect(pmUrl.port).toBeNull()
    expect(pmUrl.path).toBeNull()
  })

  test('works with an mixed URL', () => {
    const pmUrl = convertUrlBaseEnvString('https://{{host}}/my/path')
    expect(pmUrl.protocol).toEqual('https')
    expect(pmUrl.host).toEqual([
      '{{host}}',
    ])
    expect(pmUrl.port).toBeNull()
    expect(pmUrl.path).toEqual([
      'my',
      'path'
    ])
  })

  test('works with no path', () => {
    const pmUrl = convertUrlBaseEnvString('https://hostname')
    expect(pmUrl.protocol).toEqual('https')
    expect(pmUrl.host).toEqual([
      'hostname',
    ])
    expect(pmUrl.port).toBeNull()
    expect(pmUrl.path).toEqual([])
  })

  test('works with an empty path', () => {
    const pmUrl = convertUrlBaseEnvString('https://hostname/')
    expect(pmUrl.protocol).toEqual('https')
    expect(pmUrl.host).toEqual([
      'hostname',
    ])
    expect(pmUrl.port).toBeNull()
    expect(pmUrl.path).toEqual([])
  })

  test('works with a path env', () => {
    const pmUrl = convertUrlBaseEnvString('https://hostname/{{myPath}}')
    expect(pmUrl.protocol).toEqual('https')
    expect(pmUrl.host).toEqual([
      'hostname',
    ])
    expect(pmUrl.port).toBeNull()
    expect(pmUrl.path).toEqual([
      '{{myPath}}'
    ])
  })

  test('works with all as env', () => {
    const pmUrl = convertUrlBaseEnvString('{{myProtocol}}://{{myHost}}/{{myPath}}')
    expect(pmUrl.protocol).toEqual('{{myProtocol}}')
    expect(pmUrl.host).toEqual([
      '{{myHost}}',
    ])
    expect(pmUrl.port).toBeNull()
    expect(pmUrl.path).toEqual([
      '{{myPath}}'
    ])
  })
})
