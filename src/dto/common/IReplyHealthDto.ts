import IServer from '@config/interface/IServer';

export default interface IReplyHealthDto {
  envMode: IServer['envMode'];
  runMode: IServer['runMode'];
  port: IServer['port'];

  i18n: {
    language: string;
  };
}
