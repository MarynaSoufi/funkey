import { serial, text, varchar, integer, primaryKey, pgTable } from 'drizzle-orm/pg-core'

export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
})

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
})

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  link: varchar('link', { length: 2048 }).notNull(),
})

// pivot tables
export const activityCategories = pgTable(
  'activity_categories',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.activityId, table.categoryId] }),
  }),
)

// Pivot: activity_media (many-to-many)
export const activityMedia = pgTable(
  'activity_media',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    mediaId: integer('media_id')
      .notNull()
      .references(() => media.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.activityId, table.mediaId] }),
  }),
)

// Pivot: category_media (many-to-many)
export const categoryMedia = pgTable(
  'category_media',
  {
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
    mediaId: integer('media_id')
      .notNull()
      .references(() => media.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.categoryId, table.mediaId] }),
  }),
)
