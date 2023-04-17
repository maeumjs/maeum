/* eslint-disable no-console */
import ajv from '#configs/ajvbox';
import IReqCreateImageHandlerMultipartBody from '#dto/v1/image/IReqCreateImageHandlerMultipartBody';
import { MultipartFile } from '@fastify/multipart';
import { maeumRestErrorSchema } from '@maeum/error-handler';
import {
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
  RawServerBase,
  RouteShorthandOptions,
} from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';
import { SetOptional } from 'type-fest';

export const option: RouteShorthandOptions<
  RawServerBase,
  IncomingMessage,
  ServerResponse,
  { Body: SetOptional<IReqCreateImageHandlerMultipartBody, '$files'> }
> = {
  schema: {
    tags: ['images'],
    summary: 'upload image upload',
    operationId: 'create-image',
    consumes: ['multipart/form-data'],
    body: { $ref: 'IReqCreateImageHandlerBody' },
    response: {
      400: maeumRestErrorSchema,
      500: maeumRestErrorSchema,
    },
  },
  preValidation: (
    req: FastifyRequest<{ Body: SetOptional<IReqCreateImageHandlerMultipartBody, '$files'> }>,
    _reply: FastifyReply,
    done: HookHandlerDoneFunction,
  ) => {
    // 이렇게 무작정 추가를 하면 memory leak이 발생하는 것이 아닌가?
    const { body } = req;
    body.$files = Array.isArray(body.files)
      ? (body.files as any as MultipartFile[])
      : ([body.files] as MultipartFile[]);

    body.files = body.$files.map((file) => file.filename);
    const imageSchema = { type: 'array', items: req.server.getSchema('fileUploadSchema') };
    const result = ajv.validate(imageSchema, body.$files);

    if (!result) {
      throw new Error('validation error');
    }

    done();
  },
};

export default async function createImageHandler(req: FastifyRequest) {
  const { body }: { body: any } = req;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log(body.files);
}
