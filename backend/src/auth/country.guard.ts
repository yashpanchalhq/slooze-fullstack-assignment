import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { COUNTRIES_KEY } from '../common/decorators/countries.decorator';
import { Country } from '../common/enums';


@Injectable()
export class CountryGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredCountries = this.reflector.getAllAndOverride<Country[]>(COUNTRIES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredCountries) {
      return true;
    }
    
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    
    // Admin can access all countries
    if (user.role === 'ADMIN') {
      return true;
    }
    
    // Check if user's country matches the required countries
    const hasAccess = requiredCountries.some((country) => user.country === country);
    
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this resource in your country');
    }
    
    return true;
  }
}
