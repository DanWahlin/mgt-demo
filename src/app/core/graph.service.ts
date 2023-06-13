import { Injectable } from '@angular/core';
import { Msal2Provider, Providers, ProviderState } from '@microsoft/mgt';
import { DriveItem } from '@microsoft/microsoft-graph-types';

// Retrieved from .env file value by using webpack.partial.js and ngx-build-plus
declare const AAD_CLIENT_ID: string;

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  init() {

    if (!Providers.globalProvider) {
      console.log('Initializing Microsoft Graph global provider...');
      Providers.globalProvider = new Msal2Provider({
        clientId: AAD_CLIENT_ID,
        scopes: ['User.Read', 'Presence.Read', 'Chat.ReadWrite', 'Calendars.Read', 
                 'ChannelMessage.Read.All', 'ChannelMessage.Send', 'Files.Read.All', 'Mail.Read']
      });
    }
    else {
      console.log('Global provider already initialized');
    }
  }

  loggedIn() {
    if (Providers.globalProvider) {
      return Providers.globalProvider.state === ProviderState.SignedIn;
    }
    return false;
  }

  async searchFiles(query: string) {
    const files: DriveItem[] = [];

    if (!query) return files;

    const filter = {
      "requests": [
        {
          "entityTypes": [
            "driveItem"
          ],
          "query": {
            "queryString": `${query} AND ContentType:Document`
          }
        }
      ]
    };

    const searchResults = await Providers.globalProvider.graph.client.api('/search/query').post(filter);

    if (searchResults.value.length !== 0) {
      for (const hitContainer of searchResults.value[0].hitsContainers) {
        if (hitContainer.hits) {
          for (const hit of hitContainer.hits) {
            files.push(hit.resource);
          }
        }
      }
    }
    return files;
  }

}
