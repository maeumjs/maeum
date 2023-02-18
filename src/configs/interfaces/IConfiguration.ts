import IEndpoint from '#configs/interfaces/IEndpoint';
import IServer from '#configs/interfaces/IServer';

/** 서버 설정 */
export default interface IConfiguration {
  server: IServer;
  endpoint: IEndpoint;
}
