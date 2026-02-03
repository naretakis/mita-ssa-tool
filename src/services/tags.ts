/**
 * Tag Service
 *
 * Provides utilities for managing tag usage tracking.
 * Centralizes tag operations to avoid duplication across hooks.
 */

import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import type { Tag } from '../types';

/**
 * Increment usage count for a tag, creating it if it doesn't exist.
 * This is the canonical way to track tag usage across the application.
 *
 * @param tagName - The name of the tag to increment
 */
export async function incrementTagUsage(tagName: string): Promise<void> {
  const existing = await db.tags.where('name').equals(tagName).first();
  const now = new Date();

  if (existing) {
    await db.tags.update(existing.id, {
      usageCount: existing.usageCount + 1,
      lastUsed: now,
    });
  } else {
    await db.tags.add({
      id: uuidv4(),
      name: tagName,
      usageCount: 1,
      lastUsed: now,
    });
  }
}

/**
 * Increment usage for multiple tags at once.
 *
 * @param tagNames - Array of tag names to increment
 */
export async function incrementMultipleTagUsage(tagNames: string[]): Promise<void> {
  for (const tagName of tagNames) {
    await incrementTagUsage(tagName);
  }
}

/**
 * Create a new tag if it doesn't exist.
 * Returns the existing tag if one with the same name already exists.
 *
 * @param name - The name of the tag to create
 * @returns The created or existing tag
 */
export async function createTag(name: string): Promise<Tag> {
  const existing = await db.tags.where('name').equals(name).first();
  if (existing) {
    return existing;
  }

  const now = new Date();
  const tag: Tag = {
    id: uuidv4(),
    name,
    usageCount: 0,
    lastUsed: now,
  };

  await db.tags.add(tag);
  return tag;
}

/**
 * Delete a tag by ID.
 * Note: This doesn't remove the tag from assessments that use it.
 *
 * @param tagId - The ID of the tag to delete
 */
export async function deleteTag(tagId: string): Promise<void> {
  await db.tags.delete(tagId);
}

/**
 * Rename a tag across all assessments.
 *
 * @param oldName - The current tag name
 * @param newName - The new tag name
 */
export async function renameTag(oldName: string, newName: string): Promise<void> {
  await db.transaction('rw', [db.tags, db.capabilityAssessments], async () => {
    // Update tag record
    const tag = await db.tags.where('name').equals(oldName).first();
    if (tag) {
      await db.tags.update(tag.id, { name: newName });
    }

    // Update all assessments with this tag
    const assessments = await db.capabilityAssessments
      .filter((a) => a.tags.includes(oldName))
      .toArray();

    for (const assessment of assessments) {
      const newTags = assessment.tags.map((t) => (t === oldName ? newName : t));
      await db.capabilityAssessments.update(assessment.id, { tags: newTags });
    }
  });
}

/**
 * Clean up unused tags (usageCount = 0).
 *
 * @returns The number of tags deleted
 */
export async function cleanupUnusedTags(): Promise<number> {
  const unused = await db.tags.where('usageCount').equals(0).toArray();
  await db.tags.bulkDelete(unused.map((t) => t.id));
  return unused.length;
}
