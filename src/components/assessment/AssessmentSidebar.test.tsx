/**
 * AssessmentSidebar Component Tests
 *
 * Focused on the combined organizational assessment navigation:
 * section headers, aspect rows, and aspect selection.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { AssessmentSidebar } from './AssessmentSidebar';
import type { OrbitDimensionId, OrganizationalAssessmentId } from '../../types';

/**
 * Build organizational sidebar entries mirroring what the Assessment and
 * HistoryView pages produce for the combined Enterprise Governance area.
 */
function buildOrgDimensions(): Array<{
  dimensionId: OrbitDimensionId;
  aspectId: string;
  name: string;
  assessedCount: number;
  totalCount: number;
  averageScore: number | null;
  isRequired: boolean;
  isAggregate: boolean;
  isOrganizational: boolean;
  organizationalType: OrganizationalAssessmentId;
}> {
  const entry = (
    organizationalType: OrganizationalAssessmentId,
    aspectId: string,
    name: string,
    score: number | null = null
  ): ReturnType<typeof buildOrgDimensions>[number] => ({
    dimensionId: organizationalType as OrbitDimensionId,
    aspectId,
    name,
    assessedCount: score !== null ? 1 : 0,
    totalCount: 1,
    averageScore: score,
    isRequired: true,
    isAggregate: false,
    isOrganizational: true,
    organizationalType,
  });

  return [
    entry('outcomes', 'culture-mindset', 'Culture Mindset', 3),
    entry('outcomes', 'capability', 'Capability'),
    entry('roles', 'communication', 'Communication', 4),
    entry('enterprise-architecture', 'business-capability', 'Business Capability'),
  ];
}

function renderOrgSidebar(
  onDimensionSelect = vi.fn()
): ReturnType<typeof render> & { onDimensionSelect: ReturnType<typeof vi.fn> } {
  const result = render(
    <AssessmentSidebar
      overallScore={3.5}
      overallProgress={40}
      dimensions={buildOrgDimensions()}
      currentDimensionId={'culture-mindset' as OrbitDimensionId}
      currentAspectId="culture-mindset"
      onDimensionSelect={onDimensionSelect}
      onReviewSelect={vi.fn()}
      isOrganizationalAssessment
    />
  );
  return { ...result, onDimensionSelect };
}

describe('AssessmentSidebar (organizational mode)', () => {
  it('should render a header for each organizational section', () => {
    renderOrgSidebar();

    expect(screen.getByText('Organizational Outcomes')).toBeInTheDocument();
    expect(screen.getByText('Organizational Roles')).toBeInTheDocument();
    expect(screen.getByText('Organizational Enterprise Architecture')).toBeInTheDocument();
  });

  it('should render section headers only when the section changes', () => {
    renderOrgSidebar();

    // Two consecutive outcomes aspects share one "Organizational Outcomes" header
    expect(screen.getAllByText('Organizational Outcomes')).toHaveLength(1);
  });

  it('should render all aspect rows with their names', () => {
    renderOrgSidebar();

    expect(screen.getByText('Culture Mindset')).toBeInTheDocument();
    expect(screen.getByText('Capability')).toBeInTheDocument();
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('Business Capability')).toBeInTheDocument();
  });

  it('should call onDimensionSelect with the aspect id when an aspect is clicked', () => {
    const { onDimensionSelect } = renderOrgSidebar();

    fireEvent.click(screen.getByText('Communication'));

    expect(onDimensionSelect).toHaveBeenCalledWith('communication');
  });

  it('should mark the current aspect as selected', () => {
    renderOrgSidebar();

    const selected = screen.getByRole('button', { current: true });
    expect(selected).toHaveTextContent('Culture Mindset');
  });

  it('should have no accessibility violations', async () => {
    const { container } = renderOrgSidebar();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
