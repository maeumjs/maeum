import {
  IReqPokeDetailParams,
  IReqPokeDetailQuerystring,
} from '#dto/v1/poke-detail/IReqPokeDetail';
import readPokeDetailByName from '#modules/v1/readPokeDetailByName';
import iPokemonDto from '#transforms/v1/IPokemonDto';

import { FastifyRequest, RouteShorthandOptions } from 'fastify';

export const option: RouteShorthandOptions = {
  schema: {
    tags: ['Pokemon'],
    summary: 'Pokemon detail information using by name',
    querystring: { $ref: 'IReqPokeDetailQuerystring' },
    params: { $ref: 'IReqPokeDetailParams' },
    response: {
      200: { $ref: 'IPokemonDto' },
      400: { $ref: 'IPokemonError' },
      500: { $ref: 'IRestError' },
    },
  },
};

export default async function readPokeDetailByNameHandler(
  req: FastifyRequest<{ Querystring: IReqPokeDetailQuerystring; Params: IReqPokeDetailParams }>,
) {
  const resp = await readPokeDetailByName(req.params.name);
  const serialized = iPokemonDto.transformPokemonToWithTid(resp.data, req.query.tid);
  return serialized;
}
