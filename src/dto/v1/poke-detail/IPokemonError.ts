import IRestError from '#modules/http/IRestError';

export default interface IPokemonError extends IRestError {
  /** additional error code */
  acode: string;
}
