import httpLogging from '@logger/httpLogging';
import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatusCodes from 'http-status-codes';

export default function onHookResponse(req: FastifyRequest, reply: FastifyReply): void {
  if (reply.statusCode < httpStatusCodes.BAD_REQUEST) {
    setImmediate(() => httpLogging(req, reply));
  }
}
