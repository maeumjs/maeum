import config from '#configs/config';
import IPokemonDto from '#dto/v1/poke-detail/IPokemonDto';
import { JinConstructorType, JinEitherFrame } from 'jin-frame';
import path from 'path';

export default class PokeDetailFrame extends JinEitherFrame<IPokemonDto> {
  @JinEitherFrame.param()
  name: string;

  constructor(data: JinConstructorType<PokeDetailFrame>) {
    super({
      $$host: path.posix.join(config.endpoint.pokeapi, 'api/v2/pokemon/:name'),
      $$method: 'get',
    });

    this.name = data.name;
  }
}
