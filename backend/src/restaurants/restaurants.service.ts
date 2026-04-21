import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Restaurant, MenuItem } from './models';
import { Country } from '../common/enums';


@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userCountry?: Country | string): Promise<Restaurant[]> {
    const where = userCountry && userCountry !== 'ADMIN' ? { country: userCountry as string } : {};
    
    const results = await this.prisma.restaurant.findMany({
      where,
      include: {
        menuItems: true,
      },
    });
    return results as unknown as Restaurant[];
  }

  async findOne(id: string, userCountry?: Country | string): Promise<Restaurant | null> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: true,
      },
    });

    // Check country access for non-admin users
    if (restaurant && userCountry && userCountry !== 'ADMIN') {
      if (restaurant.country !== userCountry) {
        return null;
      }
    }

    return restaurant as unknown as Restaurant | null;
  }

  async findMenuItems(restaurantId: string, userCountry?: Country | string): Promise<MenuItem[]> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    // Check country access for non-admin users
    if (restaurant && userCountry && userCountry !== 'ADMIN') {
      if (restaurant.country !== userCountry) {
        return [];
      }
    }

    const items = await this.prisma.menuItem.findMany({
      where: { restaurantId },
      include: {
        restaurant: {
          include: { menuItems: true },
        },
      },
    });
    return items as unknown as MenuItem[];
  }

  async createRestaurant(data: any): Promise<Restaurant> {
    const result = await this.prisma.restaurant.create({
      data,
      include: {
        menuItems: true,
      },
    });
    return result as unknown as Restaurant;
  }

  async createMenuItem(data: any): Promise<MenuItem> {
    const result = await this.prisma.menuItem.create({
      data,
      include: {
        restaurant: {
          include: { menuItems: true },
        },
      },
    });
    return result as unknown as MenuItem;
  }
}
