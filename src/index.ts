/* eslint-disable class-methods-use-this */
import Paw from './types-paw-api/paw'
import Postman from './types-paw-api/postman'
import convertBody from './lib/convertBody'
import convertHeaders from './lib/convertHeaders'
import convertAuth from './lib/convertAuth'
import convertUrl, { convertUrlParams } from './lib/convertUrl'
import EnvironmentManager from './lib/EnvironmentManager'
import { convertEnvString } from './lib/dynamicStringUtils'
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
    const pmUrl: Postman.Url = {
      raw: convertEnvString(pawRequest.getUrl(true) as DynamicString, this.context),
      query: null,
    }
    const pmRequest: Postman.Request = {
      method: (pawRequest.getMethod(false) as string),
      url: pmUrl,
      description: pawRequest.description,
      header: [], // @TODO
      body: null, // @TODO
      auth: null, // @TODO
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
