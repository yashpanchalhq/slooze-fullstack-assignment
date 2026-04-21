import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { resolve } from 'path';
import { Role, Country } from '../src/common/enums';

import * as bcrypt from 'bcryptjs';

const dbPath = resolve(process.cwd(), 'prisma', 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // Create users
  const nickFury = await prisma.user.create({
    data: {
      email: 'nick.fury@slooze.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Nick Fury',
      role: Role.ADMIN,
      country: Country.AMERICA,
    },
  });

  const captainMarvel = await prisma.user.create({
    data: {
      email: 'captain.marvel@slooze.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Captain Marvel',
      role: Role.MANAGER,
      country: Country.INDIA,
    },
  });

  const captainAmerica = await prisma.user.create({
    data: {
      email: 'captain.america@slooze.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Captain America',
      role: Role.MANAGER,
      country: Country.AMERICA,
    },
  });

  const thanos = await prisma.user.create({
    data: {
      email: 'thanos@slooze.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Thanos',
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  const thor = await prisma.user.create({
    data: {
      email: 'thor@slooze.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Thor',
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  const travis = await prisma.user.create({
    data: {
      email: 'travis@slooze.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Travis',
      role: Role.MEMBER,
      country: Country.AMERICA,
    },
  });

  console.log('Users created');

  // Create restaurants in India
  const indianRestaurant1 = await prisma.restaurant.create({
    data: {
      name: 'Spice Garden',
      description: 'Authentic Indian cuisine with modern twist',
      country: Country.INDIA,
    },
  });

  const indianRestaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Delhi Darbar',
      description: 'Traditional North Indian dishes',
      country: Country.INDIA,
    },
  });

  // Create restaurants in America
  const americanRestaurant1 = await prisma.restaurant.create({
    data: {
      name: 'Burger Palace',
      description: 'Gourmet burgers and American classics',
      country: Country.AMERICA,
    },
  });

  const americanRestaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Pizza Express',
      description: 'Authentic Italian-American pizza',
      country: Country.AMERICA,
    },
  });

  console.log('Restaurants created');

  // Create menu items for Indian restaurants
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Butter Chicken',
        description: 'Tender chicken in creamy tomato sauce',
        price: 12.99,
        restaurantId: indianRestaurant1.id,
      },
      {
        name: 'Biryani',
        description: 'Fragrant rice with spiced meat and vegetables',
        price: 14.99,
        restaurantId: indianRestaurant1.id,
      },
      {
        name: 'Paneer Tikka',
        description: 'Grilled cottage cheese with spices',
        price: 10.99,
        restaurantId: indianRestaurant1.id,
      },
      {
        name: 'Dal Makhani',
        description: 'Creamy black lentils cooked overnight',
        price: 8.99,
        restaurantId: indianRestaurant2.id,
      },
      {
        name: 'Naan Bread',
        description: 'Freshly baked Indian flatbread',
        price: 3.99,
        restaurantId: indianRestaurant2.id,
      },
      {
        name: 'Samosa',
        description: 'Crispy pastry filled with spiced potatoes',
        price: 5.99,
        restaurantId: indianRestaurant2.id,
      },
    ],
  });

  // Create menu items for American restaurants
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and special sauce',
        price: 12.99,
        restaurantId: americanRestaurant1.id,
      },
      {
        name: 'Cheese Fries',
        description: 'Crispy fries topped with melted cheese',
        price: 6.99,
        restaurantId: americanRestaurant1.id,
      },
      {
        name: 'BBQ Ribs',
        description: 'Slow-cooked ribs with BBQ sauce',
        price: 18.99,
        restaurantId: americanRestaurant1.id,
      },
      {
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato, and basil',
        price: 14.99,
        restaurantId: americanRestaurant2.id,
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni with mozzarella cheese',
        price: 16.99,
        restaurantId: americanRestaurant2.id,
      },
      {
        name: 'Caesar Salad',
        description: 'Romaine lettuce with parmesan and croutons',
        price: 8.99,
        restaurantId: americanRestaurant2.id,
      },
    ],
  });

  console.log('Menu items created');

  // Create payment methods for Nick Fury (Admin)
  await prisma.paymentMethod.createMany({
    data: [
      {
        userId: nickFury.id,
        type: 'credit_card',
        lastFour: '1234',
        provider: 'visa',
        isDefault: true,
      },
      {
        userId: nickFury.id,
        type: 'debit_card',
        lastFour: '5678',
        provider: 'mastercard',
        isDefault: false,
      },
    ],
  });

  console.log('Payment methods created');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
