import TFileUpload from '#dto/common/TFileUpload';
import { MultipartFile } from '@fastify/multipart';

/** @nozzleIgnore */
export default interface IReqCreateImageHandlerMultipartBody {
  /** image files */
  files: TFileUpload[];

  /** fastify.js files */
  $files: MultipartFile[];
}
