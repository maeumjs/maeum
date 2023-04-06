import {
  IReqPokeDetailParams,
  IReqPokeDetailQuerystring,
} from '#dto/v1/poke-detail/IReqPokeDetail';
import readPokeDetailByName from '#modules/v1/readPokeDetailByName';
import iPokemonDto from '#transforms/v1/IPokemonDto';
import { maeumRestErrorSchema } from '@maeum/error-handler';

import { FastifyRequest, RouteShorthandOptions } from 'fastify';

export const option: RouteShorthandOptions = {
  schema: {
    tags: ['Pokemon'],
    summary: 'Pokemon detail',
    operationId: 'get-pokemon-detail-by-name',
    description: 'Pokemon detail information using by name',
    querystring: { $ref: 'IReqPokeDetailQuerystring' },
    params: { $ref: 'IReqPokeDetailParams' },
    response: {
      200: { $ref: 'IPokemonDto' },
      400: { $ref: 'IPokemonError' },
      500: maeumRestErrorSchema,
    },
  },
};

export default async function readPokeDetailByNameHandler(
  req: FastifyRequest<{ Querystring: IReqPokeDetailQuerystring; Params: IReqPokeDetailParams }>,
) {
  const resp = await readPokeDetailByName(req.params.name);
  const serialized = iPokemonDto.fromTid(resp.data, req.query.tid);
  return serialized;
}
