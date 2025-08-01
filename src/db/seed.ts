// In: src/db/seed.ts
import { db } from '.';
import { users, dishes, groups } from './schema';

async function main() {
  console.log('Seeding database...');

  // --- 1. Create a User ---
  const [testUser] = await db.insert(users).values({
    id: 'user_seed_123',
    name: 'Seeded User',
  }).returning(); // .returning() gives us back the user we just created

  console.log(`Created user: ${testUser.name} (ID: ${testUser.id})`);

  // --- 2. Create a Dish ---
  const [testDish] = await db.insert(dishes).values({
    id: 'dish_seed_abc',
    name: 'Seeded Pizza',
    description: 'A pizza created by the seed script.',
  }).returning();

  console.log(`Created dish: ${testDish.name} (ID: ${testDish.id})`);

  // --- 3. Create a Group and add the User to it ---
  const membersData = [{ id: testUser.id, name: testUser.name }];

  const [testGroup] = await db.insert(groups).values({
    id: 'group_seed_xyz',
    code: 'SEED456',
    leaderId: testUser.id,
    members: membersData, // Drizzle handles JSON stringification here
  }).returning();

  console.log(`Created group: ${testGroup.code} (ID: ${testGroup.id})`);
  console.log('Database seeding complete!');
}

main().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});