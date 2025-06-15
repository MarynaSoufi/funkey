import { faker } from '@faker-js/faker';
import { db } from '../src/db/index';
import {
  activities,
  categories,
  media,
  activityCategories,
  activityMedia,
  categoryMedia,
} from '../src/db/schema/schema';

async function seed() {
  const activityData = Array.from({ length: 10 }, () => ({
    title: faker.hacker.verb() + ' ' + faker.hacker.noun(),
    description: faker.lorem.paragraph(),
  }));
  const insertedActivities = await db.insert(activities).values(activityData).returning();

  const categoryData = Array.from({ length: 5 }, () => ({
    title: faker.commerce.department(),
    description: faker.company.catchPhrase(),
  }));
  const insertedCategories = await db.insert(categories).values(categoryData).returning();

  const mediaData = Array.from({ length: 8 }, () => ({
    title: faker.word.words(),
    link: faker.internet.url(),
  }));
  const insertedMedia = await db.insert(media).values(mediaData).returning();

  const activityCategoryData = insertedActivities.flatMap((activity) => {
    const shuffled = faker.helpers.shuffle(insertedCategories);
    return shuffled.slice(0, faker.number.int({ min: 1, max: 3 })).map((category) => ({
      activityId: activity.id,
      categoryId: category.id,
    }));
  });
  await db.insert(activityCategories).values(activityCategoryData);

  const activityMediaData = insertedActivities.flatMap((activity) => {
    const shuffled = faker.helpers.shuffle(insertedMedia);
    return shuffled.slice(0, 2).map((m) => ({
      activityId: activity.id,
      mediaId: m.id,
    }));
  });
  await db.insert(activityMedia).values(activityMediaData);

  const categoryMediaData = insertedCategories.flatMap((category) => {
    const shuffled = faker.helpers.shuffle(insertedMedia);
    return shuffled.slice(0, 2).map((m) => ({
      categoryId: category.id,
      mediaId: m.id,
    }));
  });
  await db.insert(categoryMedia).values(categoryMediaData);
}

seed()
  .then(() => {
    console.log('Finished seeding database!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
