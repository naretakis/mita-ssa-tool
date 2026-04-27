/**
 * Dexie Database Setup for MITA 4.0 State Self-Assessment Tool
 *
 * Uses IndexedDB via Dexie.js for local-only data persistence.
 * All assessment data stays in the browser.
 */

import Dexie, { type EntityTable } from 'dexie';
import type {
  CapabilityAssessment,
  OrbitRating,
  Attachment,
  AssessmentHistory,
  Tag,
} from '../types';

/**
 * MITA 4.0 Database
 */
const db = new Dexie('Mita4Database') as Dexie & {
  capabilityAssessments: EntityTable<CapabilityAssessment, 'id'>;
  orbitRatings: EntityTable<OrbitRating, 'id'>;
  attachments: EntityTable<Attachment, 'id'>;
  assessmentHistory: EntityTable<AssessmentHistory, 'id'>;
  tags: EntityTable<Tag, 'id'>;
};

/**
 * Database schema v1 (original)
 */
db.version(1).stores({
  capabilityAssessments: 'id, capabilityAreaId, capabilityDomainId, status, updatedAt, *tags',
  orbitRatings:
    'id, capabilityAssessmentId, [capabilityAssessmentId+dimensionId+aspectId], [capabilityAssessmentId+dimensionId+subDimensionId+aspectId]',
  attachments: 'id, capabilityAssessmentId, orbitRatingId, uploadedAt',
  assessmentHistory: 'id, capabilityAssessmentId, capabilityAreaId, snapshotDate',
  tags: 'id, name, usageCount, lastUsed',
});

/**
 * Database schema v2 — Clean break for maturity model v3.0.0
 *
 * Schema is unchanged but all data is cleared because the maturity model
 * was restructured (new dimensions, consolidated aspects, new IDs).
 * Existing assessment data is incompatible with the new model.
 */
db.version(2)
  .stores({
    capabilityAssessments: 'id, capabilityAreaId, capabilityDomainId, status, updatedAt, *tags',
    orbitRatings:
      'id, capabilityAssessmentId, [capabilityAssessmentId+dimensionId+aspectId], [capabilityAssessmentId+dimensionId+subDimensionId+aspectId]',
    attachments: 'id, capabilityAssessmentId, orbitRatingId, uploadedAt',
    assessmentHistory: 'id, capabilityAssessmentId, capabilityAreaId, snapshotDate',
    tags: 'id, name, usageCount, lastUsed',
  })
  .upgrade(async (tx) => {
    await tx.table('capabilityAssessments').clear();
    await tx.table('orbitRatings').clear();
    await tx.table('attachments').clear();
    await tx.table('assessmentHistory').clear();
    await tx.table('tags').clear();
  });

export { db };

/**
 * Clear all data from the database
 * Useful for testing or user-initiated reset
 */
export async function clearDatabase(): Promise<void> {
  await db.transaction(
    'rw',
    [db.capabilityAssessments, db.orbitRatings, db.attachments, db.assessmentHistory, db.tags],
    async () => {
      await db.capabilityAssessments.clear();
      await db.orbitRatings.clear();
      await db.attachments.clear();
      await db.assessmentHistory.clear();
      await db.tags.clear();
    }
  );
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<{
  assessments: number;
  ratings: number;
  attachments: number;
  history: number;
  tags: number;
  totalSize: number;
}> {
  const [assessments, ratings, attachments, history, tags] = await Promise.all([
    db.capabilityAssessments.count(),
    db.orbitRatings.count(),
    db.attachments.count(),
    db.assessmentHistory.count(),
    db.tags.count(),
  ]);

  // Estimate total size from attachments
  const allAttachments = await db.attachments.toArray();
  const totalSize = allAttachments.reduce((sum, a) => sum + a.fileSize, 0);

  return {
    assessments,
    ratings,
    attachments,
    history,
    tags,
    totalSize,
  };
}
