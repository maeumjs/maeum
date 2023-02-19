/* eslint-disable @typescript-eslint/naming-convention */
import 'fastify';

declare module 'fastify' {
  export interface FastifyRequest {
    isLogged: boolean;
    setRequestLogging: () => void;
    getIsRequestLogging: () => boolean;
  }
}
