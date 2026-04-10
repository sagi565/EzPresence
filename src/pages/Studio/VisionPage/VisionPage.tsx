import React, { useState, useEffect, useRef, DragEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisionPlan, SocialVideoContext, saveVisionMeta, readVisionMeta } from '@hooks/useVisionPlan';

import VisionBackground from '@components/Studio/VisionCreator/VisionBackground/VisionBackground';
import VisionHeader from '@components/Studio/VisionCreator/VisionHeader/VisionHeader';
import PromptBox, { FileAtt } from '@components/Studio/VisionCreator/PromptBox/PromptBox';
import PlanningView from '@components/Studio/VisionCreator/PlanningView/PlanningView';
import ReadyView from '@components/Studio/VisionCreator/ReadyView/ReadyView';
import ReadyViewV2 from '@components/Studio/VisionCreator/ReadyViewV2/ReadyViewV2';
import ConfirmDialog from '@components/Studio/VisionCreator/ConfirmDialog/ConfirmDialog';

import { VisionContainer, BackBtn, BackBtnLabel, BackBtnAccent, LogoMark, ContentWrapper, Banner, VersionToggle, VersionBtn } from './styles';

type ConfirmAction = 'back' | 'delete' | null;

const VisionPage: React.FC = () => {
  const { isLoading, isPolling, isUpdating, isExecuting, error: apiError, plan, generatePlan, updatePlan, executePlan, reset } = useVisionPlan();
  const navigate = useNavigate();

  const _savedMeta = readVisionMeta();
  const [prompt,       setPrompt]       = useState(_savedMeta?.prompt ?? '');
  const [focused,      setFocused]      = useState(false);
  const [dragging,     setDragging]     = useState(false);
  const [files,        setFiles]        = useState<FileAtt[]>([]);
  const [ripple,       setRipple]       = useState<{x:number;y:number}|null>(null);
  const [planLeaving,  setPlanLeaving]  = useState(false);
  const [planElapsed,  setPlanElapsed]  = useState(0);
  const [withCaptions, setWithCaptions] = useState(_savedMeta?.withCaptions ?? false);
  const [socialVideo,  setSocialVideo]  = useState<SocialVideoContext | null>(null);
  const [quickMode,    setQuickMode]    = useState(false);
  const [duration,     setDuration]     = useState<'snappy'|'standard'|'extended'|'comprehensive'>(_savedMeta?.duration as any ?? 'standard');
  const [autoMode,     setAutoMode]     = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [planView, setPlanView] = useState<'v1'|'v2'>(() =>
    (localStorage.getItem('vision_plan_view') as 'v1'|'v2') ?? 'v1'
  );

  useEffect(() => { localStorage.setItem('vision_plan_view', planView); }, [planView]);

  const planTimerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const fileRef      = useRef<HTMLInputElement>(null);

  const isBusy   = isLoading || isPolling;
  const isReady  = prompt.trim().length > 0;
  const showPlanning = isBusy || quickMode;
  const showReady    = !!plan && !isBusy && !quickMode;
  const showIdle     = !plan && !isBusy && !quickMode;

  // Planning elapsed timer
  useEffect(() => {
    if (isPolling) {
      setPlanElapsed(0);
      planTimerRef.current = setInterval(() => setPlanElapsed(e => e + 1), 1000);
    } else {
      if (planTimerRef.current) clearInterval(planTimerRef.current);
    }
    return () => { if (planTimerRef.current) clearInterval(planTimerRef.current); };
  }, [isPolling]);

  // Drag & Drop
  const onDragOver  = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = (e: DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); };
  const onDrop      = (e: DragEvent) => {
    e.preventDefault(); setDragging(false);
    Array.from(e.dataTransfer.files).forEach(f => setFiles(p => [...p, { id: `${f.name}-${Date.now()}`, name: f.name }]));
  };
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(f => setFiles(p => [...p, { id: `${f.name}-${Date.now()}`, name: f.name }]));
    e.target.value = '';
  };

  const handleSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isReady || isBusy) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
    saveVisionMeta({ prompt, withCaptions, duration });
    await generatePlan(prompt, {
      withCaptions,
      durationLevel: duration,
      socialVideo: socialVideo ?? undefined,
    });
  };

  const handleQuickSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isReady || isBusy) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
    saveVisionMeta({ prompt, withCaptions, duration });
    setQuickMode(true);
    await generatePlan(prompt, {
      withCaptions,
      durationLevel: duration,
      socialVideo: socialVideo ?? undefined,
    });
  };

  useEffect(() => {
    if (plan && quickMode) {
      executePlan(plan.planUuid).then(() => { reset(); navigate('/studio'); });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, quickMode]);

  const handleExecutePlan = async (uuid: string, version?: number) => {
    const ok = await executePlan(uuid, version);
    if (ok) { reset(); navigate('/studio'); }
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
      setConfirmAction('back');
    } else {
      navigate('/studio');
    }
  };

  const handleConfirm = () => {
    if (confirmAction === 'back') {
      navigate('/studio');
    } else if (confirmAction === 'delete') {
      handleNewConversation();
    }
    setConfirmAction(null);
  };

  const renderPromptBox = (minimalist = false) => (
    <PromptBox
      prompt={prompt}
      setPrompt={setPrompt}
      focused={focused}
      setFocused={setFocused}
      dragging={dragging}
      files={files}
      setFiles={setFiles}
      handleSend={handleSend}
      handleQuickSend={handleQuickSend}
      isReady={isReady}
      isBusy={isBusy}
      isLoading={isLoading}
      isPolling={isPolling}
      ripple={ripple}
      fileRef={fileRef}
      showReady={showReady}
      withCaptions={withCaptions}
      setWithCaptions={setWithCaptions}
      socialVideo={socialVideo}
      setSocialVideo={setSocialVideo}
      duration={duration}
      setDuration={setDuration}
      autoMode={autoMode}
      setAutoMode={setAutoMode}
      minimalist={minimalist}
    />
  );

  return (
    <VisionContainer onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <LogoMark href="/">EZpresence</LogoMark>
      <BackBtn onClick={handleBackClick}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <BackBtnLabel>Back to <BackBtnAccent>Studio</BackBtnAccent></BackBtnLabel>
      </BackBtn>
      {showReady && (
        <VersionToggle>
          <VersionBtn $active={planView === 'v1'} onClick={() => setPlanView('v1')}>V1</VersionBtn>
          <VersionBtn $active={planView === 'v2'} onClick={() => setPlanView('v2')}>V2</VersionBtn>
        </VersionToggle>
      )}

      {/* ── IDLE ── */}
      {showIdle && (
        <ContentWrapper>
          <VisionBackground />
          <VisionHeader />
          {renderPromptBox()}
          {apiError && <Banner $ok={false}>⚠️ {apiError}</Banner>}
        </ContentWrapper>
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
      {showReady && plan && planView === 'v1' && (
        <ReadyView
          plan={plan}
          updatePlan={updatePlan}
          executePlan={handleExecutePlan}
          isUpdating={isUpdating}
          isExecuting={isExecuting}
          apiError={apiError}
          promptBoxSlot={renderPromptBox(true)}
          onRequestDelete={() => setConfirmAction('delete')}
        />
      )}
      {showReady && plan && planView === 'v2' && (
        <ReadyViewV2
          plan={plan}
          updatePlan={updatePlan}
          executePlan={handleExecutePlan}
          isUpdating={isUpdating}
          isExecuting={isExecuting}
          apiError={apiError}
          promptBoxSlot={renderPromptBox(true)}
          onRequestDelete={() => setConfirmAction('delete')}
        />
      )}

      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={onFile} />

      {confirmAction === 'back' && (
        <ConfirmDialog
          title="Leave Vision Creator?"
          message="Going back to Studio will permanently delete this plan. This cannot be undone."
          confirmLabel="Delete & Leave"
          danger
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
    </VisionContainer>
  );
};

export default VisionPage;
