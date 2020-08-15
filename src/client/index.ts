import axios from 'axios';
import queryString from 'querystring';
import { ListController, SubscriptionController } from '../controllers';
import config from '../config';

export const ACCESS_KEY_HEADER: string = 'x-access-key';
export const ACCESS_KEY_TOKEN_HEADER: string = 'x-access-key-token';

export interface NubostoreClientOptions {
  apiKey: string;
}

export interface NubostoreGraphqlResponse {
  data?: any;
  extensions?: any;
}

class NubostoreClient {
  private static instance: NubostoreClient;
  public apiKey: string = '';
  public list: ListController;
  public subscription: SubscriptionController;

  constructor(options: NubostoreClientOptions) {
    this.apiKey = options.apiKey || '';

    if (!this.apiKey) {
      console.warn('> Warning: Missing API key.');
    }

    this.list = new ListController({ client: this });
    this.subscription = new SubscriptionController({ client: this });
  }

  public static getInstance(options: NubostoreClientOptions): NubostoreClient {
    if (!NubostoreClient.instance) {
      NubostoreClient.instance = new NubostoreClient(options);
    }

    return NubostoreClient.instance;
  }

  async graphql({
    regionId,
    query,
    apiKey,
    variables,
  }: {
    query: any;
    variables?: object;
    apiKey?: string;
    regionId?: string;
  }) {
    try {
      const apiKeyId = apiKey || this.apiKey;
      regionId = regionId || 'global';
      const url = `${config[regionId].GRAPHQL_URL}?${queryString.stringify(
        query,
      )}`;
      const response = await axios({
        method: 'POST',
        url,
        headers: {
          'x-api-key': apiKeyId,
        },
        data: {
          query,
          variables,
        },
      });

      return response.data.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

export default NubostoreClient;
