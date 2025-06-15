import { relations } from 'drizzle-orm'
import {
  activities,
  categories,
  media,
  activityCategories,
  activityMedia,
  categoryMedia,
} from './schema'

// Activity Relations
export const activityRelations = relations(activities, ({ many }) => ({
  categories: many(activityCategories),
  media: many(activityMedia),
}))

// Category Relations
export const categoryRelations = relations(categories, ({ many }) => ({
  activities: many(activityCategories),
  media: many(categoryMedia),
}))

// Media Relations
export const mediaRelations = relations(media, ({ many }) => ({
  activities: many(activityMedia),
  categories: many(categoryMedia),
}))

// Pivot: activity ↔ category
export const activityCategoriesRelations = relations(activityCategories, ({ one }) => ({
  activity: one(activities, {
    fields: [activityCategories.activityId],
    references: [activities.id],
  }),
  category: one(categories, {
    fields: [activityCategories.categoryId],
    references: [categories.id],
  }),
}))

// Pivot: activity ↔ media
export const activityMediaRelations = relations(activityMedia, ({ one }) => ({
  activity: one(activities, {
    fields: [activityMedia.activityId],
    references: [activities.id],
  }),
  media: one(media, {
    fields: [activityMedia.mediaId],
    references: [media.id],
  }),
}))

// Pivot: category ↔ media
export const categoryMediaRelations = relations(categoryMedia, ({ one }) => ({
  category: one(categories, {
    fields: [categoryMedia.categoryId],
    references: [categories.id],
  }),
  media: one(media, {
    fields: [categoryMedia.mediaId],
    references: [media.id],
  }),
}))
