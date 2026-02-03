/**
 * Hook for managing tags
 *
 * Provides tag autocomplete suggestions and usage tracking.
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import {
  incrementTagUsage as incrementUsageService,
  createTag as createTagService,
  deleteTag as deleteTagService,
  renameTag as renameTagService,
  cleanupUnusedTags as cleanupUnusedTagsService,
} from '../services/tags';
import type { Tag } from '../types';

/**
 * Return type for useTags hook
 */
export interface UseTagsReturn {
  tags: Tag[];
  getSuggestions: (query: string, limit?: number) => Tag[];
  getRecentTags: (limit?: number) => Tag[];
  getPopularTags: (limit?: number) => Tag[];
  createTag: (name: string) => Promise<Tag>;
  incrementUsage: (name: string) => Promise<void>;
  deleteTag: (tagId: string) => Promise<void>;
  renameTag: (oldName: string, newName: string) => Promise<void>;
  getAllTagNames: () => string[];
  tagExists: (name: string) => boolean;
  getTagByName: (name: string) => Tag | undefined;
  cleanupUnusedTags: () => Promise<number>;
}

/**
 * Hook for managing tags
 */
export function useTags(): UseTagsReturn {
  // Get all tags, ordered by usage count (most used first)
  const tags = useLiveQuery(() => db.tags.orderBy('usageCount').reverse().toArray(), []);

  /**
   * Get tag suggestions for autocomplete
   * @param query - Partial tag name to match
   * @param limit - Maximum number of suggestions
   */
  const getSuggestions = (query: string, limit = 10): Tag[] => {
    if (!tags) return [];

    const lowerQuery = query.toLowerCase();
    return tags.filter((t) => t.name.toLowerCase().includes(lowerQuery)).slice(0, limit);
  };

  /**
   * Get most recently used tags
   * @param limit - Maximum number of tags
   */
  const getRecentTags = (limit = 10): Tag[] => {
    if (!tags) return [];

    return [...tags].sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime()).slice(0, limit);
  };

  /**
   * Get most frequently used tags
   * @param limit - Maximum number of tags
   */
  const getPopularTags = (limit = 10): Tag[] => {
    if (!tags) return [];
    return tags.slice(0, limit);
  };

  /**
   * Create a new tag (if it doesn't exist)
   * @param name - Tag name
   */
  const createTag = async (name: string): Promise<Tag> => {
    return createTagService(name);
  };

  /**
   * Increment usage count for a tag
   * @param name - Tag name
   */
  const incrementUsage = async (name: string): Promise<void> => {
    return incrementUsageService(name);
  };

  /**
   * Delete a tag
   * Note: This doesn't remove the tag from assessments
   * @param tagId - Tag ID to delete
   */
  const deleteTag = async (tagId: string): Promise<void> => {
    return deleteTagService(tagId);
  };

  /**
   * Rename a tag across all assessments
   * @param oldName - Current tag name
   * @param newName - New tag name
   */
  const renameTag = async (oldName: string, newName: string): Promise<void> => {
    return renameTagService(oldName, newName);
  };

  /**
   * Get all tag names as a simple array
   */
  const getAllTagNames = (): string[] => {
    return tags?.map((t) => t.name) ?? [];
  };

  /**
   * Check if a tag exists
   * @param name - Tag name to check
   */
  const tagExists = (name: string): boolean => {
    return tags?.some((t) => t.name === name) ?? false;
  };

  /**
   * Get tag by name
   * @param name - Tag name
   */
  const getTagByName = (name: string): Tag | undefined => {
    return tags?.find((t) => t.name === name);
  };

  /**
   * Clean up unused tags (usageCount = 0)
   */
  const cleanupUnusedTags = async (): Promise<number> => {
    return cleanupUnusedTagsService();
  };

  return {
    tags: tags ?? [],
    getSuggestions,
    getRecentTags,
    getPopularTags,
    createTag,
    incrementUsage,
    deleteTag,
    renameTag,
    getAllTagNames,
    tagExists,
    getTagByName,
    cleanupUnusedTags,
  };
}
