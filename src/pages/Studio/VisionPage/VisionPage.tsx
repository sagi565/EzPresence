import React, { useState, useEffect, useRef, DragEvent, ChangeEvent } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useVisionPlan, SocialVideoContext, saveVisionMeta, readVisionMeta, VisionPlan, fetchVisionPlanVersion } from '@hooks/useVisionPlan';
import { saveLocalStatus } from '@hooks/useVisionHistory';

import VisionBackground from '@components/Studio/VisionCreator/VisionBackground/VisionBackground';
import VisionHeader from '@components/Studio/VisionCreator/VisionHeader/VisionHeader';
import PromptBox, { FileAtt } from '@components/Studio/VisionCreator/PromptBox/PromptBox';
import PlanningView from '@components/Studio/VisionCreator/PlanningView/PlanningView';
import ReadyViewV2 from '@/components/Studio/VisionCreator/ReadyView/ReadyView';
import ConfirmDialog from '@components/Studio/VisionCreator/ConfirmDialog/ConfirmDialog';
import PlanHistoryPanel from '@components/Studio/VisionCreator/PlanHistoryPanel/PlanHistoryPanel';
import { PlanStatus } from '@components/Studio/VisionCreator/PlanHistoryPanel/PlanHistoryPanel';
import { SIDEBAR_W_OPEN, SIDEBAR_W_COLLAPSED, SIDEBAR_W_MIN, SIDEBAR_W_MAX } from '@components/Studio/VisionCreator/PlanHistoryPanel/styles';

import {
  VisionContainer, BackBtn, BackBtnLabel, BackBtnAccent,
  LogoMark, ContentWrapper, Banner,
} from './styles';

type ConfirmAction = 'back' | 'delete' | null;

const VisionPage: React.FC = () => {
  const { isLoading, isPolling, isUpdating, isExecuting, error: apiError, plan, planUuid, generatePlan, updatePlanWithPrompt, updatePlan, executePlan, directExecute, reset } = useVisionPlan();
  const navigate = useNavigate();
  const location = useLocation();
  const { planUuid: urlPlanUuid } = useParams<{ planUuid?: string }>();

  const _savedMeta = readVisionMeta();
  const [prompt,       setPrompt]       = useState(_savedMeta?.prompt ?? '');
  const [focused,      setFocused]      = useState(false);
  const [dragging,     setDragging]     = useState(false);
  const [files,        setFiles]        = useState<FileAtt[]>([]);
  const [ripple,       setRipple]       = useState<{x:number;y:number}|null>(null);
  const [planLeaving]                   = useState(false);
  const [planElapsed,  setPlanElapsed]  = useState(0);
  const [withCaptions, setWithCaptions] = useState(_savedMeta?.withCaptions ?? false);
  const [socialVideo,  setSocialVideo]  = useState<SocialVideoContext | null>(null);
  const [quickMode,    setQuickMode]    = useState(false);
  const [duration,     setDuration]     = useState<'snappy'|'standard'|'extended'|'comprehensive'>(_savedMeta?.duration as any ?? 'standard');
  const [autoMode,      setAutoMode]      = useState(false);
  const [frozenPlan,    setFrozenPlan]    = useState<VisionPlan | null>(null);
  const [updatePrompt,  setUpdatePrompt]  = useState('');
  const [updateFocused, setUpdateFocused] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [historyDetailPlan,   setHistoryDetailPlan]   = useState<VisionPlan | null>(null);
  const [historyDetailStatus, setHistoryDetailStatus] = useState<PlanStatus>('done');
  const [isSidebarResizing, setIsSidebarResizing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    localStorage.getItem('vision_sidebar_collapsed') === 'true'
  );
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const saved = parseInt(localStorage.getItem('vision_sidebar_width') || '', 10);
    if (!Number.isFinite(saved)) return SIDEBAR_W_OPEN;
    return Math.min(SIDEBAR_W_MAX, Math.max(SIDEBAR_W_MIN, saved));
  });

  useEffect(() => {
    localStorage.setItem('vision_sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);
  useEffect(() => {
    localStorage.setItem('vision_sidebar_width', String(sidebarWidth));
  }, [sidebarWidth]);

  // Deep-link: load plan from URL param on mount
  useEffect(() => {
    if (!urlPlanUuid) return;
    fetchVisionPlanVersion(urlPlanUuid).then(loaded => {
      if (loaded) {
        setHistoryDetailPlan(loaded);
        setHistoryDetailStatus(loaded.mediaContentUuid ? 'done' : 'draft');
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync URL to the currently viewed plan UUID
  useEffect(() => {
    const shownUuid = historyDetailPlan?.planUuid ?? plan?.planUuid ?? planUuid ?? null;
    const targetPath = shownUuid ? `/studio/vision/${shownUuid}` : '/studio/vision';
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyDetailPlan?.planUuid, plan?.planUuid, planUuid]);

  const sidebarW = sidebarCollapsed ? SIDEBAR_W_COLLAPSED : sidebarWidth;

  const planTimerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const fileRef      = useRef<HTMLInputElement>(null);

  const isBusy   = isLoading || isPolling;
  const isReady  = prompt.trim().length > 0;
  const isRegenerating   = isBusy && !!frozenPlan;
  const showPlanning     = (isBusy || quickMode) && !frozenPlan;
  const showReady        = (!!plan && !isBusy && !quickMode) || isRegenerating;
  const showIdle         = !plan && !isBusy && !quickMode && !frozenPlan;
  const planToShow       = plan ?? frozenPlan;
  const showSidebar      = showIdle || showReady;

  useEffect(() => {
    if (isPolling) {
      setPlanElapsed(0);
      planTimerRef.current = setInterval(() => setPlanElapsed(e => e + 1), 1000);
    } else {
      if (planTimerRef.current) clearInterval(planTimerRef.current);
    }
    return () => { if (planTimerRef.current) clearInterval(planTimerRef.current); };
  }, [isPolling]);

  useEffect(() => {
    if (plan) setFrozenPlan(null);
  }, [plan]);

  const onDragOver  = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = (e: DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); };
  const onDrop      = (e: DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFiles([{ id: `${f.name}-${Date.now()}`, name: f.name }]);
  };
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = (e.target.files || [])[0];
    if (f) setFiles([{ id: `${f.name}-${Date.now()}`, name: f.name }]);
    e.target.value = '';
  };

  const handleSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isReady || isBusy) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
    saveVisionMeta({ prompt, withCaptions, duration: duration ?? 'standard' });
    if (plan) setFrozenPlan(plan);
    await generatePlan(prompt, { withCaptions, durationLevel: duration ?? 'standard', socialVideo: socialVideo ?? undefined });
  };

  const handleQuickSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isReady || isBusy) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
    saveVisionMeta({ prompt, withCaptions, duration: duration ?? 'standard' });
    const ok = await directExecute(prompt, { withCaptions, durationLevel: duration ?? 'standard', socialVideo: socialVideo ?? undefined });
    if (ok) {
      reset();
      navigate('/studio');
    }
  };

  useEffect(() => {
    if (plan && quickMode) {
      executePlan(plan.planUuid).then(() => { reset(); navigate('/studio'); });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, quickMode]);

  const handleExecutePlan = async (uuid: string, version?: number) => {
    const ok = await executePlan(uuid, version);
    if (ok) {
      saveLocalStatus(uuid, 'done');
      reset();
      navigate('/studio');
    }
    return ok;
  };

  const handleNewConversation = () => {
    reset();
    setPrompt('');
    setFiles([]);
    setSocialVideo(null);
    setWithCaptions(false);
    setQuickMode(false);
    setAutoMode(false);
  };

  const handleBackClick = () => {
    if (showReady) {
      handleSaveDraft();
    } else {
      navigate('/studio');
    }
  };

  const handleConfirm = () => {
    if (confirmAction === 'back') {
      reset(); navigate('/studio');
    } else if (confirmAction === 'delete') {
      handleNewConversation();
    }
    setConfirmAction(null);
  };

  const handleSaveDraft = () => {
    if (plan) saveLocalStatus(plan.planUuid, 'draft');
    reset();
    navigate('/studio');
    setConfirmAction(null);
  };

  const handleUpdateSend = async (_e: React.MouseEvent<HTMLButtonElement>) => {
    if (!updatePrompt.trim() || isBusy) return;
    const currentPlanUuid = plan?.planUuid ?? historyDetailPlan?.planUuid;
    if (!currentPlanUuid) return;
    if (plan) setFrozenPlan(plan);
    await updatePlanWithPrompt(currentPlanUuid, updatePrompt);
    setUpdatePrompt('');
  };

  const renderPromptBox = (minimalist = false) => minimalist ? (
    <PromptBox
      prompt={updatePrompt} setPrompt={setUpdatePrompt}
      focused={updateFocused} setFocused={setUpdateFocused}
      dragging={false} files={[]} setFiles={() => {}}
      handleSend={handleUpdateSend} handleQuickSend={handleUpdateSend}
      isReady={updatePrompt.trim().length > 0} isBusy={isBusy} isLoading={isLoading} isPolling={isPolling}
      ripple={null} fileRef={fileRef} showReady={showReady}
      withCaptions={withCaptions} setWithCaptions={setWithCaptions}
      socialVideo={socialVideo} setSocialVideo={setSocialVideo}
      duration={duration} setDuration={setDuration}
      autoMode={autoMode} setAutoMode={setAutoMode}
      minimalist
    />
  ) : (
    <PromptBox
      prompt={prompt} setPrompt={setPrompt}
      focused={focused} setFocused={setFocused}
      dragging={dragging} files={files} setFiles={setFiles}
      handleSend={handleSend} handleQuickSend={handleQuickSend}
      isReady={isReady} isBusy={isBusy} isLoading={isLoading} isPolling={isPolling}
      ripple={ripple} fileRef={fileRef} showReady={showReady}
      withCaptions={withCaptions} setWithCaptions={setWithCaptions}
      socialVideo={socialVideo} setSocialVideo={setSocialVideo}
      duration={duration} setDuration={setDuration}
      autoMode={autoMode} setAutoMode={setAutoMode}
      minimalist={false}
    />
  );

  return (
    <>
      {/* ── Sidebar — visible in idle/start view and ready/plan view ── */}
      {showSidebar && (
        <PlanHistoryPanel
          collapsed={sidebarCollapsed}
          width={sidebarWidth}
          onResize={setSidebarWidth}
          onToggle={() => setSidebarCollapsed(v => !v)}
          onPlanSelect={(p, status) => {
            if (showReady) reset();
            setHistoryDetailPlan(p);
            setHistoryDetailStatus(status);
            if (window.innerWidth <= 768) setSidebarCollapsed(true);
          }}
          onPlanDeselect={() => setHistoryDetailPlan(null)}
          activePlanUuid={historyDetailPlan?.planUuid}
          onResizingChange={setIsSidebarResizing}
        />
      )}

      {/* ── Main content area — offset by sidebar width ── */}
      <VisionContainer
        $noTransition={isSidebarResizing}
        style={{ left: showSidebar ? sidebarW : 0, '--sidebar-w': showSidebar ? `${sidebarW}px` : '0px' } as React.CSSProperties}
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
      >
        {/* Fixed logo + back btn — only when ReadyViewV2 is NOT handling the top bar */}
        {!showReady && !historyDetailPlan && (
          <>
            <LogoMark href="/" $noTransition={isSidebarResizing}>EZpresence</LogoMark>
            <BackBtn onClick={handleBackClick}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <BackBtnLabel>Back to <BackBtnAccent>Studio</BackBtnAccent></BackBtnLabel>
            </BackBtn>
          </>
        )}

        {/* ── IDLE ── */}
        {showIdle && !historyDetailPlan && (
          <ContentWrapper>
            <VisionBackground />
            <VisionHeader />
            {renderPromptBox()}
            {apiError && <Banner $ok={false}>⚠️ {apiError}</Banner>}
          </ContentWrapper>
        )}

        {/* ── HISTORY DETAIL ── */}
        {showIdle && historyDetailPlan && (
          <ReadyViewV2
            plan={historyDetailPlan}
            updatePlan={updatePlan}
            executePlan={handleExecutePlan}
            isUpdating={isUpdating}
            isExecuting={isExecuting}
            isRegenerating={false}
            apiError={apiError}
            readonly={historyDetailStatus === 'done'}
            promptBoxSlot={historyDetailStatus !== 'done' ? renderPromptBox(true) : undefined}
            onRequestDelete={() => setHistoryDetailPlan(null)}
            onBack={handleBackClick}
          />
        )}

        {/* ── PLANNING ── */}
        {showPlanning && (
          <PlanningView
            isLoading={isLoading}
            planElapsed={planElapsed}
            planLeaving={planLeaving}
          />
        )}

        {/* ── READY ── */}
        {showReady && planToShow && (
          <ReadyViewV2
            plan={planToShow} updatePlan={updatePlan} executePlan={handleExecutePlan}
            isUpdating={isUpdating} isExecuting={isExecuting} isRegenerating={isRegenerating}
            apiError={apiError}
            promptBoxSlot={renderPromptBox(true)}
            onRequestDelete={() => setConfirmAction('delete')}
            onBack={handleBackClick}
          />
        )}

        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
      </VisionContainer>

      {/* ── Dialogs ── */}
      {confirmAction === 'back' && (
        <ConfirmDialog
          title="Leave Vision Creator?"
          message="Your plan is saved on the server. Save it as a draft to find it easily in history, or just leave."
          confirmLabel="Leave"
          secondaryLabel="Save as Draft"
          onSecondary={handleSaveDraft}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {confirmAction === 'delete' && (
        <ConfirmDialog
          title="Delete this plan?"
          message="This will discard the current plan and return you to the idea view. This cannot be undone."
          confirmLabel="Delete Plan"
          danger
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </>
  );
};

export default VisionPage;
