import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant, MenuItem } from './models';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CountryGuard } from '../auth/country.guard';
import { Countries } from '../common/decorators/countries.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role, Country } from '../common/enums';


@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private restaurantsService: RestaurantsService) {}

  @Query(() => [Restaurant])
  @UseGuards(JwtAuthGuard, CountryGuard)
  async restaurants(@CurrentUser() user: any): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(user.country);
  }

  @Query(() => Restaurant, { nullable: true })
  @UseGuards(JwtAuthGuard, CountryGuard)
  async restaurant(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ): Promise<Restaurant | null> {
    return this.restaurantsService.findOne(id, user.country);
  }

  @Query(() => [MenuItem])
  @UseGuards(JwtAuthGuard, CountryGuard)
  async menuItems(
    @Args('restaurantId') restaurantId: string,
    @CurrentUser() user: any,
  ): Promise<MenuItem[]> {
    return this.restaurantsService.findMenuItems(restaurantId, user.country);
  }

  @Mutation(() => Restaurant)
  @UseGuards(JwtAuthGuard, RolesGuard, CountryGuard)
  @Roles(Role.ADMIN)
  async createRestaurant(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('country', { type: () => Country }) country: Country,
  ): Promise<Restaurant> {
    return this.restaurantsService.createRestaurant({
      name,
      description,
      country,
    });
  }

  @Mutation(() => MenuItem)
  @UseGuards(JwtAuthGuard, RolesGuard, CountryGuard)
  @Roles(Role.ADMIN)
  async createMenuItem(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('price') price: number,
    @Args('restaurantId') restaurantId: string,
  ): Promise<MenuItem> {
    return this.restaurantsService.createMenuItem({
      name,
      description,
      price,
      restaurantId,
    });
  }
}
