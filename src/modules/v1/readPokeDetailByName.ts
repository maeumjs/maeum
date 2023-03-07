import { IReqPokeDetailParams } from '#dto/v1/poke-detail/IReqPokeDetail';
import PokeDetailFrame from '#frames/PokeDetailFrame';
import { RestError } from '@maeum/error-handler';
import httpStatusCodes from 'http-status-codes';
import { isError } from 'my-easy-fp';

export default async function readPokeDetailByName(name: IReqPokeDetailParams['name']) {
  try {
    if (name.toLowerCase() === 'guilmon') {
      throw RestError.create({
        status: httpStatusCodes.BAD_REQUEST,
        message: 'guilmon is digimon character',
      });
    }

    const frame = new PokeDetailFrame({ name });
    const resp = await frame.execute();

    if (resp.type === 'fail') {
      throw RestError.create({
        message: 'poke api call error',
        status: resp.fail.status,
      });
    }

    return resp.pass;
  } catch (catched) {
    const err = isError(catched) ?? new Error('unknown error raised from readPokeDetailByName');
    const restErr = RestError.create({
      message: err.message,
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
    });

    restErr.stack = err.stack;

    throw restErr;
  }
}
