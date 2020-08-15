import axios from 'axios';
import queryString from 'querystring';
import config from '../../config';
import ListItemController from './list-item';
import NubostoreClient from '../../client';

class ListController {
  private client: NubostoreClient;
  public item: ListItemController;

  constructor({ client }: { client: NubostoreClient }) {
    this.client = client;
    this.item = new ListItemController({ client });
  }

  public hello() {
    console.log('hello');
  }

  async create({
    spaceId,
    listId,
    data,
    uniqueItemId,
    fields,
    apiKey,
    regionId,
    localeId,
  }: {
    spaceId: string;
    listId: string;
    data: object;
    uniqueItemId?: string;
    fields?: string;
    apiKey?: string;
    regionId?: string;
    localeId?: string;
  }) {
    try {
      const apiKeyId = apiKey || this.client.apiKey;
      regionId = regionId || 'global';
      const query = {
        localeId,
        fields,
        uniqueItemId,
      };
      const url = `${
        config[regionId].CONTENT_URL
      }/spaces/${spaceId}/lists/${listId}?${queryString.stringify(query)}`;
      const response = await axios({
        method: 'PUT',
        url,
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKeyId,
        },
        data,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async add({
    spaceId,
    listId,
    data,
    uniqueItemId,
    fields,
    apiKey,
    regionId,
    localeId,
  }: {
    spaceId: string;
    listId: string;
    data: object;
    uniqueItemId?: string;
    fields?: string;
    apiKey?: string;
    regionId?: string;
    localeId?: string;
  }) {
    try {
      const apiKeyId = apiKey || this.client.apiKey;
      regionId = regionId || 'global';
      const query = {
        localeId,
        fields,
        uniqueItemId,
      };
      const url = `${
        config[regionId].CONTENT_URL
      }/spaces/${spaceId}/lists/${listId}?${queryString.stringify(query)}`;
      const response = await axios({
        method: 'POST',
        url,
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKeyId,
        },
        data,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async get({
    regionId,
    spaceId,
    listId,
    localeId,
    pageSize,
    page,
    apiKey,
  }: {
    spaceId: string;
    listId: string;
    regionId?: string;
    localeId?: string;
    pageSize?: number;
    page?: number;
    apiKey?: string;
  }) {
    try {
      const apiKeyId = apiKey || this.client.apiKey;
      regionId = regionId || 'global';
      const query = {
        localeId,
        pageSize,
        page,
      };
      const url = `${
        config[regionId].CONTENT_URL
      }/spaces/${spaceId}/lists/${listId}?${queryString.stringify(query)}`;
      const response = await axios({
        method: 'GET',
        url,
        headers: {
          'x-api-key': apiKeyId,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async query({
    regionId,
    spaceId,
    listId,
    localeId,
    pageSize,
    page,
    apiKey,
    query,
    orderBy,
    orderByDirection,
  }: {
    spaceId: string;
    listId: string;
    query: string;
    apiKey?: string;
    orderBy?: string;
    orderByDirection?: string;
    regionId?: string;
    localeId?: string;
    pageSize?: string;
    page?: string;
  }) {
    try {
      const apiKeyId = apiKey || this.client.apiKey;
      regionId = regionId || 'global';
      const queryObject = {
        localeId,
        pageSize,
        page,
      };
      const url = `${
        config[regionId].CONTENT_URL
      }/spaces/${spaceId}/lists/${listId}/query?${queryString.stringify(
        queryObject,
      )}`;
      const response = await axios({
        method: 'POST',
        url,
        headers: {
          'x-api-key': apiKeyId,
        },
        data: {
          query,
          orderBy,
          orderByDirection,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async search({
    regionId,
    spaceId,
    listId,
    localeId,
    pageSize,
    page,
    fields,
    query,
    apiKey,
  }: {
    spaceId: string;
    listId: string;
    query: string;
    regionId?: string;
    localeId?: string;
    fields?: string;
    page?: number;
    pageSize?: number;
    apiKey?: string;
  }) {
    try {
      const apiKeyId = apiKey || this.client.apiKey;
      regionId = regionId || 'global';
      const queryData = {
        localeId,
        pageSize,
        page,
        fields,
        query,
      };
      const url = `${
        config[regionId].CONTENT_URL
      }/spaces/${spaceId}/lists/${listId}/search?${queryString.stringify(
        queryData,
      )}`;
      const response = await axios({
        method: 'GET',
        url,
        headers: {
          'x-api-key': apiKeyId,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async remove({
    regionId,
    spaceId,
    listId,
    localeId,
    apiKey,
  }: {
    spaceId: string;
    listId: string;
    regionId?: string;
    localeId?: string;
    apiKey?: string;
  }) {
    try {
      const apiKeyId = apiKey || this.client.apiKey;
      regionId = regionId || 'global';
      const query = {
        localeId,
      };
      const url = `${
        config[regionId].CONTENT_URL
      }/spaces/${spaceId}/lists/${listId}?${queryString.stringify(query)}`;
      const response = await axios({
        method: 'DELETE',
        url,
        headers: {
          'x-api-key': apiKeyId,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

export default ListController;
