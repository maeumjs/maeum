import IPokemonDto from '#dto/v1/poke-detail/IPokemonDto';

function fromTid(pokemon: IPokemonDto, tid: string): IPokemonDto & { tid: string } {
  return { ...pokemon, tid };
}

export default {
  fromTid,
};
