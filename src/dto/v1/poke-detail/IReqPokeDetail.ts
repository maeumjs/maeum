export interface IReqPokeDetailQuerystring {
  /**
   * transaction id on each request
   * @format uuid
   * @example 16DB8729-7113-42DF-A898-687537040ACC
   */
  tid: string;
}

export interface IReqPokeDetailParams {
  /**
   * Pokemon name
   */
  name: string;
}
