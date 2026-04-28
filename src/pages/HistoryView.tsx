/**
 * History View Page
 *
 * Read-only view of a historical assessment snapshot.
 * Reuses assessment components but displays historical data.
 */

import { JSX, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Chip } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { getAreaWithDomain } from '../services/capabilities';
import {
  getOrbitModel,
  getTechnologySubDimensions,
  getAspectsForDimension,
  getAspectsForSubDimension,
  getAggregatedDimensionForDomain,
} from '../services/orbit';
import { AssessmentSidebar, DimensionPage, AggregateDimensionView } from '../components/assessment';
import type {
  OrbitDimensionId,
  TechnologySubDimensionId,
  OrbitRating,
  HistoricalRating,
} from '../types';

/**
 * Navigation item for sidebar
 */
interface NavItem {
  dimensionId: OrbitDimensionId;
  subDimensionId?: TechnologySubDimensionId;
  name: string;
  description: string;
  isRequired: boolean;
  aspectCount: number;
  isAggregate?: boolean;
}

/**
 * Build navigation items from ORBIT model
 * @param domainId - The domain ID to check for aggregate dimensions
 */
function buildNavItems(domainId?: string): NavItem[] {
  const items: NavItem[] = [];
  const orbitModel = getOrbitModel();

  // Get the aggregated dimension for this domain (if any)
  const aggregatedDimension = domainId ? getAggregatedDimensionForDomain(domainId) : null;

  // Standard dimensions (B, I - non-Technology)
  for (const dimId of ['businessArchitecture', 'information'] as const) {
    const dim = orbitModel.dimensions[dimId];
    const isAggregate = aggregatedDimension === dimId;

    items.push({
      dimensionId: dimId,
      name: dim.name,
      description: isAggregate
        ? `Aggregate ${dim.name} score from all finalized capability assessments`
        : dim.description,
      isRequired: dim.required,
      aspectCount: dim.aspects.length,
      isAggregate,
    });
  }

  // Technology dimension - check if it's aggregated
  const isTechAggregate = aggregatedDimension === 'technology';

  if (isTechAggregate) {
    // Show Technology as a single aggregate item
    const techDim = orbitModel.dimensions.technology;
    items.push({
      dimensionId: 'technology',
      name: techDim.name,
      description: `Aggregate ${techDim.name} score from all finalized capability assessments`,
      isRequired: true,
      aspectCount: techDim.subDimensions.reduce((sum, sd) => sum + sd.aspects.length, 0),
      isAggregate: true,
    });
  } else {
    // Show Technology sub-dimensions
    const techSubDims = getTechnologySubDimensions();
    for (const subDim of techSubDims) {
      items.push({
        dimensionId: 'technology',
        subDimensionId: subDim.id,
        name: subDim.name,
        description: subDim.description,
        isRequired: true,
        aspectCount: subDim.aspects.length,
      });
    }
  }

  return items;
}

/**
 * Convert HistoricalRating to OrbitRating format for display
 */
function historicalToOrbitRating(
  historyId: string,
  historical: HistoricalRating,
  index: number
): OrbitRating {
  return {
    id: `${historyId}-${index}`,
    capabilityAssessmentId: historyId,
    dimensionId: historical.dimensionId,
    subDimensionId: historical.subDimensionId,
    aspectId: historical.aspectId,
    currentLevel: historical.currentLevel,
    targetLevel: historical.targetLevel,
    questionResponses: historical.questionResponses,
    evidenceResponses: historical.evidenceResponses,
    notes: historical.notes,
    barriers: historical.barriers,
    plans: historical.plans,
    carriedForward: false,
    attachmentIds: [],
    updatedAt: new Date(),
  };
}

/**
 * History view page component
 */
export default function HistoryView(): JSX.Element {
  const { historyId } = useParams<{ historyId: string }>();
  const navigate = useNavigate();

  // Load history entry from DB
  const historyEntry = useLiveQuery(
    () => (historyId ? db.assessmentHistory.get(historyId) : undefined),
    [historyId]
  );

  // Get capability info (needed for domain ID)
  const capabilityInfo = useMemo(() => {
    if (!historyEntry) return null;
    return getAreaWithDomain(historyEntry.capabilityAreaId);
  }, [historyEntry]);

  // Navigation state - build with domain ID for aggregate detection
  const navItems = useMemo(
    () => buildNavItems(capabilityInfo?.domain.id),
    [capabilityInfo?.domain.id]
  );
  const [currentNavIndex, setCurrentNavIndex] = useState(0);
  const currentNav = navItems[currentNavIndex] ?? navItems[0];

  // Convert historical ratings to OrbitRating format
  const ratings = useMemo(() => {
    if (!historyEntry || !historyId) return [];
    return historyEntry.ratings.map((r, i) => historicalToOrbitRating(historyId, r, i));
  }, [historyEntry, historyId]);

  // Build ratings map for current dimension
  const ratingsMap = useMemo(() => {
    const map = new Map<string, OrbitRating>();
    if (!currentNav) return map;
    for (const rating of ratings) {
      if (currentNav.subDimensionId) {
        if (
          rating.dimensionId === currentNav.dimensionId &&
          rating.subDimensionId === currentNav.subDimensionId
        ) {
          map.set(rating.aspectId, rating);
        }
      } else {
        if (rating.dimensionId === currentNav.dimensionId && !rating.subDimensionId) {
          map.set(rating.aspectId, rating);
        }
      }
    }
    return map;
  }, [ratings, currentNav]);

  // Get aspects for current dimension
  const currentAspects = useMemo(() => {
    if (!currentNav) return [];
    if (currentNav.subDimensionId) {
      return getAspectsForSubDimension(currentNav.subDimensionId);
    }
    return getAspectsForDimension(currentNav.dimensionId);
  }, [currentNav]);

  // Calculate sidebar progress data
  const sidebarDimensions = useMemo(() => {
    return navItems.map((nav) => {
      let assessedCount = 0;
      const totalCount = nav.aspectCount;
      let avgScore: number | null = null;

      // For aggregate dimensions, use stored aggregate data from snapshot
      if (nav.isAggregate && historyEntry?.aggregateData?.dimensionId === nav.dimensionId) {
        return {
          dimensionId: nav.dimensionId,
          subDimensionId: nav.subDimensionId,
          name: nav.name,
          assessedCount: historyEntry.aggregateData.contributingCount,
          totalCount: historyEntry.aggregateData.contributingCount,
          averageScore: historyEntry.aggregateData.score,
          isRequired: nav.isRequired,
          isAggregate: true,
        };
      }

      const dimRatings = ratings.filter((r) => {
        if (nav.subDimensionId) {
          return r.dimensionId === nav.dimensionId && r.subDimensionId === nav.subDimensionId;
        }
        return r.dimensionId === nav.dimensionId && !r.subDimensionId;
      });

      assessedCount = dimRatings.filter((r) => r.currentLevel !== 0).length;
      const scored = dimRatings.filter((r) => r.currentLevel > 0);
      if (scored.length > 0) {
        avgScore = scored.reduce((sum, r) => sum + r.currentLevel, 0) / scored.length;
      }

      return {
        dimensionId: nav.dimensionId,
        subDimensionId: nav.subDimensionId,
        name: nav.name,
        assessedCount,
        totalCount,
        averageScore: avgScore,
        isRequired: nav.isRequired,
        isAggregate: nav.isAggregate,
      };
    });
  }, [navItems, ratings, historyEntry?.aggregateData]);

  // Calculate overall progress
  const totalAspects = navItems.reduce((sum, nav) => sum + nav.aspectCount, 0);
  const assessedCount = ratings.filter((r) => r.currentLevel !== 0).length;
  const overallProgress = totalAspects > 0 ? Math.round((assessedCount / totalAspects) * 100) : 0;

  // Navigation handler
  const handleDimensionSelect = useCallback(
    (dimensionId: OrbitDimensionId, subDimensionId?: TechnologySubDimensionId) => {
      const index = navItems.findIndex(
        (nav) => nav.dimensionId === dimensionId && nav.subDimensionId === subDimensionId
      );
      if (index >= 0) {
        setCurrentNavIndex(index);
      }
    },
    [navItems]
  );

  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Loading state
  if (!historyEntry || !capabilityInfo || !currentNav) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading history...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </Typography>
        </Box>
        <Typography variant="h5" component="h1">
          {capabilityInfo.domain.name} → {capabilityInfo.area.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <Chip label="Historical Snapshot" size="small" color="secondary" />
          <Typography variant="body2" color="text.secondary">
            {formatDate(historyEntry.snapshotDate)}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            Score: {historyEntry.overallScore.toFixed(1)}
          </Typography>
          {historyEntry.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
      </Box>

      {/* View Mode Alert */}
      <Alert severity="info" sx={{ borderRadius: 0 }}>
        Historical View — This is a read-only snapshot from {formatDate(historyEntry.snapshotDate)}
      </Alert>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <AssessmentSidebar
          overallScore={historyEntry.overallScore}
          overallProgress={overallProgress}
          dimensions={sidebarDimensions}
          currentDimensionId={currentNav.dimensionId}
          currentSubDimensionId={currentNav.subDimensionId}
          onDimensionSelect={handleDimensionSelect}
          onReviewSelect={() => {}}
          isReviewSelected={false}
          showFinalize={false}
        />

        {/* Main Content Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {currentNav.isAggregate && historyEntry.aggregateData ? (
            <AggregateDimensionView
              dimensionId={currentNav.dimensionId}
              dimensionName={currentNav.name}
              aggregateData={{
                score: historyEntry.aggregateData.score,
                contributingCount: historyEntry.aggregateData.contributingCount,
                assessmentIds: historyEntry.aggregateData.contributingAssessmentIds,
                breakdown: [], // Historical view doesn't show breakdown details
              }}
            />
          ) : (
            <DimensionPage
              dimensionId={currentNav.dimensionId}
              subDimensionId={currentNav.subDimensionId}
              dimensionName={currentNav.name}
              dimensionDescription={currentNav.description}
              isRequired={currentNav.isRequired}
              aspects={currentAspects}
              ratings={ratingsMap}
              attachments={new Map()}
              onLevelChange={() => Promise.resolve()}
              onTargetLevelChange={() => Promise.resolve()}
              onQuestionChange={() => Promise.resolve()}
              onEvidenceChange={() => Promise.resolve()}
              onNotesChange={() => Promise.resolve()}
              onBarriersChange={() => Promise.resolve()}
              onPlansChange={() => Promise.resolve()}
              onAttachmentUpload={() => Promise.resolve()}
              onAttachmentDelete={() => Promise.resolve()}
              onAttachmentDownload={() => Promise.resolve()}
              disabled={true}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
