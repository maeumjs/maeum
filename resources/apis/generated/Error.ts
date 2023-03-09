import { Def5, Def8 } from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class Error<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Common
   * @name ErrorList
   * @summary Server health check and configuration getting
   * @request GET:/error
   * @response `200` `Def5` Default Response
   * @response `400` `Def8` Default Response
   * @response `500` `Def8` Default Response
   */
  errorList = (
    query?: {
      ee?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Def5, Def8>({
      path: `/error`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
}
