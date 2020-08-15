import NubostoreClient, { NubostoreClientOptions } from './client';

export const createClient = (
  options: NubostoreClientOptions,
): NubostoreClient => {
  return NubostoreClient.getInstance(options);
};
