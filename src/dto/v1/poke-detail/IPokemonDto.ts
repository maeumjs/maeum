import IPokemonSpeciesDto from '#dto/v1/poke-detail/IPokemonSpeciesDto';

/**
 * Pokemon DTO
 *
 * @asDto true
 */
export default interface IPokemonDto {
  /** pokemon id */
  id: number;
  is_default: boolean;
  base_experience: number;
  /** pokemon height */
  height: number;

  location_area_encounters: string;
  name: string;
  order: number;

  species: IPokemonSpeciesDto;
}
