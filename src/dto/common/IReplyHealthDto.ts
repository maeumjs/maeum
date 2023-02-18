import IServer from '#configs/interfaces/IServer';

export default interface IReplyHealthDto {
  envMode: IServer['envMode'];
  runMode: IServer['runMode'];
  port: IServer['port'];

  i18n: {
    language: string;
  };
}
