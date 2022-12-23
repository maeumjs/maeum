import { FastifyInstance } from 'fastify';
import {
  IReqPokeDetailParams,
  IReqPokeDetailQuerystring,
} from '../dto/v1/poke-detail/IReqPokeDetail';
import errorHandler_PJ1ZVdvZdoDszi9bEsBZ3kK1Ps9exYz1, {
  option as option_PJ1ZVdvZdoDszi9bEsBZ3kK1Ps9exYz1,
} from './get/error';
import healthHandler_HV5ha8PCzlDdmdKDkhwBSIEpVVgHBZUP, {
  option as option_HV5ha8PCzlDdmdKDkhwBSIEpVVgHBZUP,
} from './get/health';
import indexHandler_S3bRkzOADg7woeHV595CNvAFpaqtKGP9, {
  option as option_S3bRkzOADg7woeHV595CNvAFpaqtKGP9,
} from './get/index';
import readPokeDetailByNameHandler_azm7AyTKp3gXvsxGx1OUnVrEH7b0dgLE, {
  option as option_azm7AyTKp3gXvsxGx1OUnVrEH7b0dgLE,
} from './get/v1/poke-detail/[name]';

export default function routing(fastify: FastifyInstance): void {
  fastify.get<{ Querystring: { ee?: string } }>(
    '/error',
    option_PJ1ZVdvZdoDszi9bEsBZ3kK1Ps9exYz1,
    errorHandler_PJ1ZVdvZdoDszi9bEsBZ3kK1Ps9exYz1,
  );
  fastify.get(
    '/health',
    option_HV5ha8PCzlDdmdKDkhwBSIEpVVgHBZUP,
    healthHandler_HV5ha8PCzlDdmdKDkhwBSIEpVVgHBZUP,
  );
  fastify.get(
    '/',
    option_S3bRkzOADg7woeHV595CNvAFpaqtKGP9,
    indexHandler_S3bRkzOADg7woeHV595CNvAFpaqtKGP9,
  );
  fastify.get<{ Querystring: IReqPokeDetailQuerystring; Params: IReqPokeDetailParams }>(
    '/v1/poke-detail/:name',
    option_azm7AyTKp3gXvsxGx1OUnVrEH7b0dgLE,
    readPokeDetailByNameHandler_azm7AyTKp3gXvsxGx1OUnVrEH7b0dgLE,
  );
}
