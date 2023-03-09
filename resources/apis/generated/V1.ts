import { Def2, Def3, Def8 } from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class V1<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Pokemon detail information using by name
   *
   * @tags Pokemon
   * @name PokeDetailDetail
   * @summary Pokemon detail
   * @request GET:/v1/poke-detail/{name}
   * @response `200` `Def2` Default Response
   * @response `400` `Def3` Default Response
   * @response `500` `Def8` Default Response
   */
  pokeDetailDetail = (
    name: string,
    query: {
      /**
       * transaction id on each request
       * @format uuid
       * @example "16DB8729-7113-42DF-A898-687537040ACC"
       */
      tid: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Def2, Def3 | Def8>({
      path: `/v1/poke-detail/${name}`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
}
