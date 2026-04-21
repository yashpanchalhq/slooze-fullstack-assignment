export default {
  datasource: {
    url: 'file:./prisma/dev.db',
  },
  migrations: {
    seed: 'ts-node ./prisma/seed.ts',
  },
};