import { useState, useCallback, useMemo } from 'react';
import { api } from '@utils/apiClient';
import { VisionPlan } from '@hooks/useVisionPlan';

const LS_STATUSES_KEY = 'vision_plan_statuses';

export type PlanStatus = 'draft' | 'done' | 'in_process';

export interface PlanHistorySummary {
  planUuid: string;
  clipTitle: string;
  createdAt: string;
  status?: PlanStatus;
  lastVersionNumber?: number;
  mediaContentUuid?: string | null;
  thumbnailObject?: string | null;
}

const normalizeStatus = (s?: string | null): PlanStatus | undefined => {
  if (!s) return undefined;
  const v = s.toLowerCase();
  if (v === 'processing' || v === 'in_process') return 'in_process';
  if (v === 'draft') return 'draft';
  if (v === 'done') return 'done';
  return undefined;
};

export interface HistoryGroup {
  label: string;
  plans: PlanHistorySummary[];
}

export const readLocalStatuses = (): Record<string, PlanStatus> => {
  try { return JSON.parse(localStorage.getItem(LS_STATUSES_KEY) || '{}'); } catch { return {}; }
};

export const saveLocalStatus = (planUuid: string, status: PlanStatus) => {
  const statuses = readLocalStatuses();
  statuses[planUuid] = status;
  try { localStorage.setItem(LS_STATUSES_KEY, JSON.stringify(statuses)); } catch {}
};

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function groupByTime(plans: PlanHistorySummary[]): HistoryGroup[] {
  const now = new Date();
  const todayStart     = startOfDay(now).getTime();
  const yesterdayStart = todayStart - 86_400_000;
  const week7Start     = todayStart - 7  * 86_400_000;
  const month30Start   = todayStart - 30 * 86_400_000;

  const buckets: HistoryGroup[] = [
    { label: 'Today',        plans: [] },
    { label: 'Yesterday',    plans: [] },
    { label: 'Last 7 days',  plans: [] },
    { label: 'Last 30 days', plans: [] },
    { label: 'Older',        plans: [] },
  ];

  for (const plan of plans) {
    const t = new Date(plan.createdAt).getTime();
    if      (t >= todayStart)     buckets[0].plans.push(plan);
    else if (t >= yesterdayStart) buckets[1].plans.push(plan);
    else if (t >= week7Start)     buckets[2].plans.push(plan);
    else if (t >= month30Start)   buckets[3].plans.push(plan);
    else                          buckets[4].plans.push(plan);
  }

  return buckets.filter(b => b.plans.length > 0);
}

const useVisionHistory = () => {
  const [plans, setPlans]   = useState<PlanHistorySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<any[]>('/studio/vision/plans?page=1&pageSize=50');
      const localStatuses = readLocalStatuses();
      const merged: PlanHistorySummary[] = (data || []).map(p => ({
        planUuid: p.planUuid,
        clipTitle: p.clipTitle,
        createdAt: p.createdAt,
        lastVersionNumber: p.lastVersionNumber,
        mediaContentUuid: p.mediaContentUuid ?? null,
        thumbnailObject: p.thumbnailObject ?? null,
        status: normalizeStatus(p.status) ?? localStatuses[p.planUuid] ?? ('done' as PlanStatus),
      }));
      setPlans(merged);
    } catch (err: any) {
      setError(err?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPlanDetail = useCallback(async (uuid: string): Promise<VisionPlan | null> => {
    try {
      return await api.get<VisionPlan>(`/studio/vision/plans/${uuid}`);
    } catch { return null; }
  }, []);

  const groupedPlans = useMemo(() => groupByTime(plans), [plans]);

  return { plans, groupedPlans, loading, error, fetchHistory, fetchPlanDetail };
};

export default useVisionHistory;
