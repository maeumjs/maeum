import { Def5, Def8 } from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class Health<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Common
   * @name HealthList
   * @summary Server health check and configuration getting
   * @request GET:/health
   * @response `200` `Def5` Default Response
   * @response `400` `Def8` Default Response
   * @response `500` `Def8` Default Response
   */
  healthList = (params: RequestParams = {}) =>
    this.request<Def5, Def8>({
      path: `/health`,
      method: 'GET',
      format: 'json',
      ...params,
    });
}
