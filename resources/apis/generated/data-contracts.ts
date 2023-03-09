/** CE_RUN_MODE */
export enum Def0 {
  Local = 'local',
  Develop = 'develop',
  Qa = 'qa',
  Stage = 'stage',
  Production = 'production',
}

/**
 * IConfiguration
 * 서버 설정
 */
export interface Def1 {
  /** Maeum Boilerplate Server Application configuration */
  server: Def9;
  /** Connected RESTful server endpoint */
  endpoint: Record<string, string>;
}

/**
 * IPokemonDto
 * Pokemon DTO
 */
export interface Def2 {
  /** pokemon id */
  id: number;
  is_default: boolean;
  base_experience: number;
  /** pokemon height */
  height: number;
  location_area_encounters: string;
  name: string;
  order: number;
  species: Def4;
}

/** IPokemonError */
export interface Def3 {
  code: string;
  message: string;
  data?: any;
  /** additional error code */
  acode: string;
}

/** IPokemonSpeciesDto */
export interface Def4 {
  name: string;
  url: string;
}

/** IReplyHealthDto */
export interface Def5 {
  /** NODE_ENV */
  envMode: string;
  /** server run mode */
  runMode: Def0;
  /** server port */
  port: number;
  i18n: {
    language: string;
  };
}

/** IReqPokeDetailParams */
export interface Def6 {
  /** Pokemon name */
  name: string;
}

/** IReqPokeDetailQuerystring */
export interface Def7 {
  /**
   * transaction id on each request
   * @format uuid
   * @example "16DB8729-7113-42DF-A898-687537040ACC"
   */
  tid: string;
}

/** IRestError */
export interface Def8 {
  code: string;
  message: string;
  data?: any;
}

/**
 * IServer
 * Maeum Boilerplate Server Application configuration
 */
export interface Def9 {
  /** server run mode */
  runMode: Def0;
  /** NODE_ENV */
  envMode: string;
  /** log level */
  logLevel: string;
  /** caller configuration, server name */
  caller: string;
  /** server port */
  port: number;
}

/** fileUploadSchema */
export interface Def10 {
  fieldname?: string;
  encoding?: string;
  filename?: string;
  mimetype?: string;
}
