/**
 * Tag Service Tests
 *
 * Tests for tag management operations including usage tracking,
 * creation, deletion, and renaming.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db, clearDatabase } from './db';
import {
  incrementTagUsage,
  incrementMultipleTagUsage,
  createTag,
  deleteTag,
  renameTag,
  cleanupUnusedTags,
} from './tags';

describe('tags service', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('incrementTagUsage', () => {
    it('should create a new tag if it does not exist', async () => {
      await incrementTagUsage('new-tag');

      const tag = await db.tags.where('name').equals('new-tag').first();

      expect(tag).toBeDefined();
      expect(tag?.name).toBe('new-tag');
      expect(tag?.usageCount).toBe(1);
      expect(tag?.lastUsed).toBeInstanceOf(Date);
    });

    it('should increment usage count for existing tag', async () => {
      // Create initial tag
      await db.tags.add({
        id: 'tag-1',
        name: 'existing-tag',
        usageCount: 5,
        lastUsed: new Date('2025-01-01'),
      });

      await incrementTagUsage('existing-tag');

      const tag = await db.tags.get('tag-1');

      expect(tag?.usageCount).toBe(6);
      expect(tag?.lastUsed.getTime()).toBeGreaterThan(new Date('2025-01-01').getTime());
    });

    it('should update lastUsed timestamp', async () => {
      const oldDate = new Date('2025-01-01');
      await db.tags.add({
        id: 'tag-1',
        name: 'test-tag',
        usageCount: 1,
        lastUsed: oldDate,
      });

      await incrementTagUsage('test-tag');

      const tag = await db.tags.get('tag-1');
      expect(tag?.lastUsed.getTime()).toBeGreaterThan(oldDate.getTime());
    });
  });

  describe('incrementMultipleTagUsage', () => {
    it('should increment usage for multiple tags', async () => {
      await incrementMultipleTagUsage(['tag1', 'tag2', 'tag3']);

      const tags = await db.tags.toArray();

      expect(tags).toHaveLength(3);
      expect(tags.find((t) => t.name === 'tag1')?.usageCount).toBe(1);
      expect(tags.find((t) => t.name === 'tag2')?.usageCount).toBe(1);
      expect(tags.find((t) => t.name === 'tag3')?.usageCount).toBe(1);
    });

    it('should handle empty array', async () => {
      await incrementMultipleTagUsage([]);

      const tags = await db.tags.toArray();
      expect(tags).toHaveLength(0);
    });

    it('should increment existing tags and create new ones', async () => {
      await db.tags.add({
        id: 'existing',
        name: 'existing-tag',
        usageCount: 3,
        lastUsed: new Date(),
      });

      await incrementMultipleTagUsage(['existing-tag', 'new-tag']);

      const existingTag = await db.tags.where('name').equals('existing-tag').first();
      const newTag = await db.tags.where('name').equals('new-tag').first();

      expect(existingTag?.usageCount).toBe(4);
      expect(newTag?.usageCount).toBe(1);
    });
  });

  describe('createTag', () => {
    it('should create a new tag with zero usage count', async () => {
      const tag = await createTag('brand-new');

      expect(tag.name).toBe('brand-new');
      expect(tag.usageCount).toBe(0);
      expect(tag.id).toBeDefined();
    });

    it('should return existing tag if name already exists', async () => {
      await db.tags.add({
        id: 'existing-id',
        name: 'existing',
        usageCount: 5,
        lastUsed: new Date(),
      });

      const tag = await createTag('existing');

      expect(tag.id).toBe('existing-id');
      expect(tag.usageCount).toBe(5);
    });

    it('should not create duplicate tags', async () => {
      await createTag('unique');
      await createTag('unique');

      const tags = await db.tags.where('name').equals('unique').toArray();
      expect(tags).toHaveLength(1);
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag by ID', async () => {
      await db.tags.add({
        id: 'to-delete',
        name: 'deleteme',
        usageCount: 1,
        lastUsed: new Date(),
      });

      await deleteTag('to-delete');

      const tag = await db.tags.get('to-delete');
      expect(tag).toBeUndefined();
    });

    it('should not throw when deleting non-existent tag', async () => {
      await expect(deleteTag('non-existent')).resolves.not.toThrow();
    });
  });

  describe('renameTag', () => {
    it('should rename a tag', async () => {
      await db.tags.add({
        id: 'tag-1',
        name: 'old-name',
        usageCount: 3,
        lastUsed: new Date(),
      });

      await renameTag('old-name', 'new-name');

      const oldTag = await db.tags.where('name').equals('old-name').first();
      const newTag = await db.tags.where('name').equals('new-name').first();

      expect(oldTag).toBeUndefined();
      expect(newTag).toBeDefined();
      expect(newTag?.usageCount).toBe(3);
    });

    it('should update tag name in all assessments', async () => {
      await db.tags.add({
        id: 'tag-1',
        name: 'old-tag',
        usageCount: 2,
        lastUsed: new Date(),
      });

      await db.capabilityAssessments.bulkAdd([
        {
          id: 'a1',
          capabilityDomainId: 'd1',
          capabilityDomainName: 'Domain 1',
          capabilityAreaId: 'area-1',
          capabilityAreaName: 'Area 1',
          status: 'finalized',
          tags: ['old-tag', 'other-tag'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a2',
          capabilityDomainId: 'd1',
          capabilityDomainName: 'Domain 1',
          capabilityAreaId: 'area-2',
          capabilityAreaName: 'Area 2',
          status: 'finalized',
          tags: ['old-tag'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a3',
          capabilityDomainId: 'd1',
          capabilityDomainName: 'Domain 1',
          capabilityAreaId: 'area-3',
          capabilityAreaName: 'Area 3',
          status: 'in_progress',
          tags: ['different-tag'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await renameTag('old-tag', 'new-tag');

      const a1 = await db.capabilityAssessments.get('a1');
      const a2 = await db.capabilityAssessments.get('a2');
      const a3 = await db.capabilityAssessments.get('a3');

      expect(a1?.tags).toEqual(['new-tag', 'other-tag']);
      expect(a2?.tags).toEqual(['new-tag']);
      expect(a3?.tags).toEqual(['different-tag']); // Unchanged
    });

    it('should handle renaming non-existent tag gracefully', async () => {
      await expect(renameTag('non-existent', 'new-name')).resolves.not.toThrow();
    });

    it('should not affect assessments without the tag', async () => {
      await db.tags.add({
        id: 'tag-1',
        name: 'rename-me',
        usageCount: 1,
        lastUsed: new Date(),
      });

      await db.capabilityAssessments.add({
        id: 'a1',
        capabilityDomainId: 'd1',
        capabilityDomainName: 'Domain 1',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Area 1',
        status: 'finalized',
        tags: ['unrelated-tag'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await renameTag('rename-me', 'renamed');

      const assessment = await db.capabilityAssessments.get('a1');
      expect(assessment?.tags).toEqual(['unrelated-tag']);
    });
  });

  describe('cleanupUnusedTags', () => {
    it('should delete tags with usageCount of 0', async () => {
      await db.tags.bulkAdd([
        { id: 't1', name: 'unused1', usageCount: 0, lastUsed: new Date() },
        { id: 't2', name: 'unused2', usageCount: 0, lastUsed: new Date() },
        { id: 't3', name: 'used', usageCount: 5, lastUsed: new Date() },
      ]);

      const deletedCount = await cleanupUnusedTags();

      expect(deletedCount).toBe(2);

      const remaining = await db.tags.toArray();
      expect(remaining).toHaveLength(1);
      expect(remaining[0]?.name).toBe('used');
    });

    it('should return 0 when no unused tags exist', async () => {
      await db.tags.bulkAdd([
        { id: 't1', name: 'used1', usageCount: 1, lastUsed: new Date() },
        { id: 't2', name: 'used2', usageCount: 10, lastUsed: new Date() },
      ]);

      const deletedCount = await cleanupUnusedTags();

      expect(deletedCount).toBe(0);
      expect(await db.tags.count()).toBe(2);
    });

    it('should handle empty tags table', async () => {
      const deletedCount = await cleanupUnusedTags();
      expect(deletedCount).toBe(0);
    });
  });
});
