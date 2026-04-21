import { SetMetadata } from '@nestjs/common';
import { Country } from '../../common/enums';


export const COUNTRIES_KEY = 'countries';
export const Countries = (...countries: Country[]) => SetMetadata(COUNTRIES_KEY, countries);
