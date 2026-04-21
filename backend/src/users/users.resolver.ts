import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CountryGuard } from '../auth/country.guard';
import { Countries } from '../common/decorators/countries.decorator';
import { Role } from '../common/enums';


@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard, CountryGuard)
  @Roles(Role.ADMIN)
  async users() {
    return this.usersService.findAll();
  }

  @Query(() => User, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async user(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard, CountryGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async usersByCountry(@Args('country') country: string) {
    return this.usersService.findByCountry(country);
  }
}
