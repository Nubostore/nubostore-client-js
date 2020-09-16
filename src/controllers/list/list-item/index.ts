import axios from 'axios';
import queryString from 'querystring';
import config from '../../../config';
import NubostoreClient from '../../../client';

class ListItemController {
  private client: NubostoreClient;

  constructor({ client }: { client: NubostoreClient }) {
    this.client = client;
  }

  async get({
    regionId,
    spaceId,
    listId,
    itemId,
    localeId,
    apiKey,
  }: {
    spaceId: string;
    listId: string;
    itemId: string;
    localeId?: string;
    apiKey?: string;
    regionId?: string;
  }) {
    try {
      const apiKeyId = apiKey || this.client.apiKey;
      regionId = regionId || 'global';
      const query = {
        localeId,
      };
      const url = `${
        config[regionId].CONTENT_URL
      }/spaces/${spaceId}/lists/${listId}/${itemId}?${queryString.stringify(
        query,
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

  async update({
    regionId,
    spaceId,
    listId,
    itemId,
    localeId,
    data,
    apiKey,
  }: {
    spaceId: string;
    listId: string;
    itemId: string;
    data: object;
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
      }/spaces/${spaceId}/lists/${listId}/${itemId}?${queryString.stringify(
        query,
      )}`;
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

  async remove({
    regionId,
    spaceId,
    listId,
    localeId,
    itemId,
    apiKey,
  }: {
    spaceId: string;
    listId: string;
    itemId: string;
    localeId?: string;
    regionId?: string;
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
      }/spaces/${spaceId}/lists/${listId}/${itemId}?${queryString.stringify(
        query,
      )}`;
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

export default ListItemController;
