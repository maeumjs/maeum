import httpLogging from '@logger/httpLogging';
import { FastifyReply, FastifyRequest } from 'fastify';

export default function onHookResponse(req: FastifyRequest, reply: FastifyReply): void {
  setImmediate(() => httpLogging(req, reply));
}
