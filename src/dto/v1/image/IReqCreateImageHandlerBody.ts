import TFileUpload from '#dto/common/TFileUpload';

export default interface IReqCreateImageHandlerBody {
  /** image files */
  files: TFileUpload[];
}
