/* eslint-disable class-methods-use-this */
import Paw from './types-paw-api/paw'
import Postman from './types-paw-api/postman'
import convertUrl from './lib/convertUrl'
import convertBody from './lib/convertBody'
import convertHeaders from './lib/convertHeaders'
import convertAuth from './lib/convertAuth'
import convertEnvString from './lib/convertEnvString'
import makeCollection from './lib/makeCollection'


class PostmanGenerator implements Paw.Generator {
  static identifier = 'com.luckymarmot.PawExtensions.PostmanCollectionGenerator'
  static title = 'Postman Collection Generator'
  static languageHighlighter = 'json'

  // @TODO change later to 'postman_collection.json'
  // there's currently a bug in Paw that prevents file extensions to be
  // with multiple components
  static fileExtension = 'json'

  context: Paw.Context

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public generate(context: Paw.Context, requests: Paw.Request[], options: Paw.ExtensionOption): string {
    this.context = context

    let items: Postman.Item[]
    if (context.runtimeInfo.task === 'exportAllRequests') {
      items = this.convertItems(context.getRootRequestTreeItems())
    }
    else {
      items = this.convertItems(requests)
    }
    const pmCollection = makeCollection(items, context)
    return JSON.stringify(pmCollection, null, 2)
  }

  private convertItems(pawItems: Paw.RequestTreeItem[]): Postman.Item[] {
    return pawItems.map((pawItem): Postman.Item => {
      if (pawItem.toString().match(/^RequestGroup/)) {
        return this.convertRequestGroup(pawItem as Paw.RequestGroup)
      }
      return this.convertRequest(pawItem as Paw.Request)
    })
  }

  private convertRequestGroup(pawGroup: Paw.RequestGroup): Postman.Item {
    const pawChildren = pawGroup.getChildren().sort((a, b) => {
      return a.order - b.order
    })
    const pmChildren = this.convertItems(pawChildren)
    const pmItem: Postman.Item = {
      name: pawGroup.name,
      item: pmChildren,
      protocolProfileBehavior: null,
    }
    return pmItem
  }

  private convertRequest(pawRequest: Paw.Request): Postman.Item {
    // url
    const pmUrl = convertUrl(pawRequest, this.context)

    // body
    let [pmBody, pmBodyExtraHeaders] = convertBody(pawRequest, this.context)

    // auth
    const pmAuth = convertAuth(pawRequest, this.context)

    // header
    let pmHeaders = convertHeaders(pawRequest, this.context)
    const hasContentTypeHeader = pmHeaders.reduce((acc, pmHeader) => {
      return acc || (pmHeader.key && pmHeader.key.trim().toLowerCase() === 'content-type')
    }, false)
    if (hasContentTypeHeader) {
      pmBodyExtraHeaders = []
    }

    // filter out `Authorization` header
    if (pmAuth) {
      pmHeaders = pmHeaders.filter((header) => {
        return (!header.key || header.key.trim().toLowerCase() !== 'authorization')
      })
    }

    const pmRequest: Postman.Request = {
      method: (pawRequest.getMethod(false) as string),
      url: pmUrl,
      description: pawRequest.description,
      header: (pmBodyExtraHeaders || []).concat(pmHeaders),
      body: pmBody,
      auth: pmAuth,
    }
    const pmOptions: Postman.ProtocolProfileBehavior = {
      followRedirects: pawRequest.followRedirects,
      followOriginalHttpMethod: pawRequest.redirectMethod,
      followAuthorizationHeader: pawRequest.redirectAuthorization,
    }
    const pmItem: Postman.Item = {
      name: pawRequest.name,
      request: pmRequest,
      protocolProfileBehavior: pmOptions,
    }
    return pmItem
  }
}

registerCodeGenerator(PostmanGenerator)
