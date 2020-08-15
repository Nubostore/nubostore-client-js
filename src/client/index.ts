import axios from 'axios';
import queryString from 'querystring';
import { ListController } from '../controllers';
import { isBrowser } from '../utils';
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
  private subscriptionRetryAttempts: number = 0;

  constructor(options: NubostoreClientOptions) {
    this.apiKey = options.apiKey || '';

    if (!this.apiKey) {
      console.warn('> Warning: Missing API key.');
    }

    this.list = new ListController({ client: this });
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

  async subscription(args: any) {
    const _this = this;
    const { regionId, apiKey } = args;
    const emptyMethod = () => {};
    const onData = args.onData || emptyMethod;
    const onError = args.onError || emptyMethod;
    const onConnect = args.onConnect || emptyMethod;
    const onDisconnect = args.onDisconnect || emptyMethod;
    const onFinalDisconnect = args.onFinalDisconnect || emptyMethod;
    const retryDelay = args.retryDelay || 5000;
    const maxRetryAttempts = args.maxRetryAttempts || 10;
    const options = { localeId: args.localeId, records: args.records };
    const apiKeyId = apiKey || this.apiKey;
    const optionsString = JSON.stringify(options);
    const query = {
      apiKey: apiKeyId,
      options: optionsString,
      type: 'records-subscription',
    };
    const url = `${
      config[regionId].CONTENT_SUBSCRIPTION_URL
    }/subscribe?${queryString.stringify(query)}`;

    const _onConnect = () => {
      _this.subscriptionRetryAttempts = 0;
      onConnect();
    };
    const _onDisconnect = () => {
      _this.subscriptionRetryAttempts++;
      onDisconnect();

      setTimeout(() => {
        if (_this.subscriptionRetryAttempts < maxRetryAttempts) {
          _this.subscription(args);
        } else {
          onFinalDisconnect();
        }
      }, retryDelay);
    };

    if (isBrowser) {
      const ws = new WebSocket(url);

      ws.onopen = _onConnect;
      ws.onerror = onError;
      ws.onmessage = (event) => {
        onData(JSON.parse(event.data));
      };
      ws.onclose = _onDisconnect;
    } else {
      const WebSocket = require('ws');
      const ws = new WebSocket(url);

      ws.on('open', _onConnect);
      ws.on('message', (data: any) => {
        onData(JSON.parse(data));
      });
      ws.on('error', onError);
      ws.on('close', _onDisconnect);
    }
  }
}

export default NubostoreClient;
