import React, { useState, useEffect, useRef } from 'react';
import { VisionPlan, fetchVisionPlanVersion } from '@hooks/useVisionPlan';
import { useContentUrl } from '@hooks/contents/useContentUrl';
import { BackBtn, BackBtnLabel, BackBtnAccent } from '@pages/Studio/VisionPage/styles';
import AudioPickerPanel from '@components/Studio/VisionCreator/AudioPickerPanel/AudioPickerPanel';
import {
  ConsoleWrapper, TopBar, TopBarLogo, TopBarDivider,
  TopBarTitle, TopBarMeta, TypeBadge, CategoryChip, SplitPane,
  Sidebar, SidebarSection, SidebarLabel, NavItem, NavIcon, NavLabel,
  SidebarDivider, SceneCountLabel, SceneTile, SceneTileNum, SceneTileInfo,
  SceneTilePrompt, DurationChip,
  ContentPanel, ContentInner, SectionHeading, HeadingIcon, HeadingText, HeadingSubtext,
  FieldCard, FieldLabel, ReadOnlyText, ReadOnlyPlaceholder,
  VoiceSection, GenderDisplay, GenderBadge, GenderIcon,
  SceneTabs, SceneTab, SceneFieldGroup,
  TimelineWrapper, TimelineTrack, TimelineSegment, TimelineDot,
  TimelineSegmentLabel, TimelineSegmentDur, TimelineEndDot, TimelineTotalLabel,
  BottomBarOuter, BottomNavArrow, BottomBar, BottomActionRow,
  PromptSlotWrap, StatusText, GenerateBtn, BtnSpinner, RegeneratingOverlay, VersionLoadOverlay,
  VideoPanelWrap, VideoPanelLabel, VideoWrap, MinimalistVideo, VideoSpinnerWrap, VideoEmptyMsg,
} from './styles';

function detectSocialPlatform(url: string): 'youtube' | 'instagram' | 'tiktok' | 'facebook' {
  if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube';
  if (/instagram\.com/i.test(url)) return 'instagram';
  if (/tiktok\.com/i.test(url)) return 'tiktok';
  return 'facebook';
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SCENE_COLORS = ['#9b5de5', '#14b8a6', '#f59e0b', '#ec4899', '#3b82f6', '#ef4444'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scenesToArray(scenes: any): any[] {
  if (!scenes) return [];
  return Array.isArray(scenes) ? scenes : Object.values(scenes);
}

function getSceneLabel(scene: any, idx: number): string {
  if (scene.sceneTitle) return scene.sceneTitle;
  const prompt: string = scene.sceneGenerationPrompt || scene.prompt || '';
  const trimmed = prompt.slice(0, 52);
  return trimmed ? (trimmed.length < prompt.length ? trimmed + '…' : trimmed) : `Scene ${idx + 1}`;
}

// ─── Section metadata ─────────────────────────────────────────────────────────
type SectionId = 'visual' | 'music' | 'voice' | 'scenes';

const SECTION_META: Record<SectionId, { icon: string; label: string; color: string; subtext: string }> = {
  visual: { icon: '🎬', label: 'Visual Style', color: '#9b5de5', subtext: 'How the video looks and feels' },
  music:  { icon: '🎵', label: 'Music',        color: '#14b8a6', subtext: 'Music composition and mood' },
  voice:  { icon: '🎤', label: 'Voice',        color: '#ec4899', subtext: 'Narration style and gender' },
  scenes: { icon: '🗨',  label: 'Scenes',       color: '#f59e0b', subtext: 'Individual scene details' },
};

// ─── Timeline Component ───────────────────────────────────────────────────────
interface TimelineProps {
  scenes: any[];
  planType?: string;
  activeIdx: number;
  onSelect: (i: number) => void;
  inline?: boolean;
  minimalist?: boolean;
}

const SceneTimeline: React.FC<TimelineProps> = ({ scenes, planType, activeIdx, onSelect, inline, minimalist }) => {
  const isSpeechless = planType === 'SPEECHLESS';
  const durations = scenes.map(s => isSpeechless ? (s.sceneDuration || 6) : 1);
  const total = durations.reduce((a, b) => a + b, 0) || 1;
  const totalSecs = isSpeechless ? total : null;

  return (
    <TimelineWrapper $inline={inline}>
      <TimelineTrack $minimalist={minimalist}>
        {scenes.map((_, i) => {
          const color = SCENE_COLORS[i % SCENE_COLORS.length];
          const isActive = activeIdx === i;
          return (
            <TimelineSegment
              key={i}
              style={{ flex: durations[i] / total }}
              $color={color}
              $active={isActive}
              onClick={() => onSelect(i)}
              title={`Scene ${i + 1}${isSpeechless ? ` · ${durations[i]}s` : ''}`}
            >
              {!minimalist && <TimelineDot $color={color} $active={isActive} />}
              {!minimalist && (
                <TimelineSegmentLabel $active={isActive}>
                  {i + 1}
                  {isSpeechless && <TimelineSegmentDur>{durations[i]}s</TimelineSegmentDur>}
                </TimelineSegmentLabel>
              )}
            </TimelineSegment>
          );
        })}
        {!minimalist && (
          <TimelineEndDot
            $color={SCENE_COLORS[(scenes.length - 1) % SCENE_COLORS.length] || '#9b5de5'}
          />
        )}
      </TimelineTrack>
      {!minimalist && totalSecs !== null && (
        <TimelineTotalLabel>{totalSecs}s total</TimelineTotalLabel>
      )}
    </TimelineWrapper>
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface ReadyViewV2Props {
  plan: VisionPlan;
  updatePlan: (uuid: string, props: Record<string, any>) => Promise<boolean>;
  executePlan: (uuid: string, version?: number) => Promise<boolean>;
  isUpdating: boolean;
  isExecuting: boolean;
  isRegenerating?: boolean;
  apiError?: string | null;
  promptBoxSlot?: React.ReactNode;
  onRequestDelete: () => void;
  readonly?: boolean;
  onBack?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
const ReadyViewV2: React.FC<ReadyViewV2Props> = ({
  plan: originalPlan, executePlan, isExecuting, isRegenerating = false, promptBoxSlot, readonly = false,
  onBack,
}) => {
  const lastVersion = originalPlan.lastVersionNumber ?? originalPlan.version ?? 1;
  const [currentVersion, setCurrentVersion] = useState<number>(lastVersion);
  const [viewedPlan, setViewedPlan] = useState<VisionPlan>(originalPlan);
  const [versionLoading, setVersionLoading] = useState(false);
  const plan = viewedPlan;
  const effectiveReadonly = readonly;
  const isSpeechless = plan.planType === 'SPEECHLESS';

  const [activeSection, setActiveSection] = useState<SectionId>('visual');
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [status, setStatus] = useState('');
  const statusRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasMusicBeenViewed, setHasMusicBeenViewed] = useState(false);

  useEffect(() => {
    if (activeSection === 'music') setHasMusicBeenViewed(true);
  }, [activeSection]);

  const { url: videoUrl, loading: videoLoading, fetchUrl } = useContentUrl();

  useEffect(() => {
    if (plan.mediaContentUuid) {
      fetchUrl(plan.mediaContentUuid);
    }
  }, [plan.mediaContentUuid]);

  useEffect(() => {
    setActiveSceneIdx(0);
    setViewedPlan(originalPlan);
    setCurrentVersion(originalPlan.lastVersionNumber ?? originalPlan.version ?? 1);
    if (isSpeechless && activeSection === 'voice') {
      setActiveSection('visual');
    }
  }, [originalPlan.planUuid]);

  const loadVersion = async (n: number) => {
    if (n < 1 || n > lastVersion || versionLoading) return;
    setVersionLoading(true);
    try {
      const result = await fetchVisionPlanVersion(originalPlan.planUuid, n);
      if (result) {
        setViewedPlan(result);
        setCurrentVersion(n);
        setActiveSceneIdx(0);
      }
    } catch {
      /* ignore */
    } finally {
      setVersionLoading(false);
    }
  };

  const showStatus = (msg: string) => {
    setStatus(msg);
    if (statusRef.current) clearTimeout(statusRef.current);
    statusRef.current = setTimeout(() => setStatus(''), 3500);
  };

  const handleGenerate = async () => {
    if (isExecuting || effectiveReadonly) return;
    showStatus('Executing plan…');
    await executePlan(originalPlan.planUuid, plan.version);
  };

  const handleSceneTileClick = (idx: number) => {
    setActiveSection('scenes');
    setActiveSceneIdx(idx);
  };

  const scenes = scenesToArray(plan.scenes);
  const safeSceneIdx = Math.min(activeSceneIdx, Math.max(0, scenes.length - 1));
  const activeScene = scenes[safeSceneIdx];

  const navSections: SectionId[] = isSpeechless
    ? ['visual', 'music']
    : ['visual', 'music', 'voice'];

  const contentKey = activeSection === 'scenes' ? `scenes-${safeSceneIdx}` : 'main';
  const activeMeta = SECTION_META[activeSection];

  return <>
    <ConsoleWrapper>
      {isRegenerating && (
        <RegeneratingOverlay>
          <BtnSpinner />
          <span>Regenerating plan…</span>
        </RegeneratingOverlay>
      )}
      {/* ── Top Bar ── */}
      <TopBar>
        <TopBarLogo href="/">EZpresence</TopBarLogo>
        <TopBarDivider />
        <TopBarTitle>{plan.clipTitle || 'Untitled Vision'}</TopBarTitle>
        {onBack && (
          <BackBtn onClick={onBack} style={{ position: 'relative', top: 'auto', right: 'auto', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <BackBtnLabel>Back to <BackBtnAccent>Studio</BackBtnAccent></BackBtnLabel>
          </BackBtn>
        )}
      </TopBar>

      {/* ── Split Pane ── */}
      <SplitPane>
        {/* ── Sidebar ── */}
        <Sidebar>
          <SidebarSection>
            <SidebarLabel>Director</SidebarLabel>
            <div style={{ display: 'flex', gap: 6, padding: '4px 12px 8px', flexWrap: 'wrap' }}>
              <TypeBadge $speechless={isSpeechless}>
                {isSpeechless ? 'Speechless' : 'Narrated'}
              </TypeBadge>
              {plan.category && <CategoryChip>{plan.category}</CategoryChip>}
            </div>
            {navSections.map(id => {
              const meta = SECTION_META[id];
              return (
                <NavItem key={id} $active={activeSection === id} $color={meta.color}
                  onClick={() => setActiveSection(id)}>
                  <NavIcon $active={activeSection === id} $color={meta.color}>{meta.icon}</NavIcon>
                  <NavLabel>{meta.label}</NavLabel>
                </NavItem>
              );
            })}
          </SidebarSection>

          <SidebarDivider />

          <SidebarSection>
            <SceneCountLabel>
              <span>Scenes</span>
            </SceneCountLabel>
            {scenes.length > 0 && (
              <div style={{ padding: '4px 12px 8px', pointerEvents: 'none' }}>
                <SceneTimeline
                  scenes={scenes}
                  planType={plan.planType}
                  activeIdx={-1}
                  onSelect={() => {}}
                  inline
                  minimalist
                />
              </div>
            )}
            {scenes.map((scene, i) => {
              const isActive = activeSection === 'scenes' && safeSceneIdx === i;
              const color = SCENE_COLORS[i % SCENE_COLORS.length];
              return (
                <SceneTile key={i} $active={isActive} $color={color}
                  onClick={() => handleSceneTileClick(i)}>
                  <SceneTileNum $active={isActive} $color={color}>{i + 1}</SceneTileNum>
                  <SceneTileInfo>
                    <SceneTilePrompt $active={isActive}>
                      {getSceneLabel(scene, i)}
                    </SceneTilePrompt>
                    {scene.sceneDuration && (
                      <DurationChip $color={color}>{scene.sceneDuration}s</DurationChip>
                    )}
                  </SceneTileInfo>
                </SceneTile>
              );
            })}
          </SidebarSection>
        </Sidebar>

        {/* ── Content Panel ── */}
        <ContentPanel style={{ position: 'relative' }}>
          <ContentInner key={contentKey} style={versionLoading ? { opacity: 0.5, pointerEvents: 'none' } : undefined}>

            {/* ── Visual Style ── */}
            {activeSection === 'visual' && (
              <>
                <SectionHeading>
                  <HeadingIcon $color={activeMeta.color}>{activeMeta.icon}</HeadingIcon>
                  <div>
                    <HeadingText $color={activeMeta.color}>{activeMeta.label}</HeadingText>
                    <HeadingSubtext>{activeMeta.subtext}</HeadingSubtext>
                  </div>
                </SectionHeading>
                <FieldCard $color={activeMeta.color}>
                  <FieldLabel>Style Description</FieldLabel>
                  <ReadOnlyText>
                    {plan.clipVisualStyle || <ReadOnlyPlaceholder>No visual style defined</ReadOnlyPlaceholder>}
                  </ReadOnlyText>
                </FieldCard>
              </>
            )}

            {/* ── Music ── */}
            {activeSection === 'music' && (
              <>
                <SectionHeading>
                  <HeadingIcon $color={activeMeta.color}>{activeMeta.icon}</HeadingIcon>
                  <div>
                    <HeadingText $color={activeMeta.color}>{activeMeta.label}</HeadingText>
                    <HeadingSubtext>{activeMeta.subtext}</HeadingSubtext>
                  </div>
                </SectionHeading>
                <FieldCard $color={activeMeta.color}>
                  <FieldLabel>Music Direction</FieldLabel>
                  <ReadOnlyText>
                    {plan.clipMusicInstructions || <ReadOnlyPlaceholder>No music instructions defined</ReadOnlyPlaceholder>}
                  </ReadOnlyText>
                </FieldCard>
              </>
            )}
            {hasMusicBeenViewed && plan.socialMediaLink?.url && (plan.socialMediaLink.duration ?? 0) > 0 && (
              <div style={{ display: activeSection === 'music' ? undefined : 'none' }}>
                <AudioPickerPanel
                  value={{
                    platform: detectSocialPlatform(plan.socialMediaLink.url),
                    url: plan.socialMediaLink.url,
                    offsetSeconds: plan.socialMediaLink.offset ?? 0,
                    durationSeconds: plan.socialMediaLink.duration!,
                  }}
                  onChange={() => {}}
                  onClose={() => {}}
                  minDurationSec={plan.socialMediaLink.duration!}
                  maxDurationSec={plan.socialMediaLink.duration!}
                  avgDurationSec={plan.socialMediaLink.duration!}
                  readonly
                  visible={activeSection === 'music'}
                />
              </div>
            )}

            {/* ── Voice (NARRATED only) ── */}
            {activeSection === 'voice' && !isSpeechless && (
              <>
                <SectionHeading>
                  <HeadingIcon $color={activeMeta.color}>{activeMeta.icon}</HeadingIcon>
                  <div>
                    <HeadingText $color={activeMeta.color}>{activeMeta.label}</HeadingText>
                    <HeadingSubtext>{activeMeta.subtext}</HeadingSubtext>
                  </div>
                </SectionHeading>
                <VoiceSection>
                  <FieldCard $color={activeMeta.color}>
                    <FieldLabel>Direction</FieldLabel>
                    <ReadOnlyText>
                      {plan.clipVoiceInstructions || <ReadOnlyPlaceholder>No voice instructions defined</ReadOnlyPlaceholder>}
                    </ReadOnlyText>
                  </FieldCard>
                  <FieldCard $color={activeMeta.color}>
                    <FieldLabel>Gender</FieldLabel>
                    <GenderDisplay>
                      <GenderBadge $active={plan.clipVoiceGender === 'MALE'} $gender="MALE">
                        <GenderIcon>♂</GenderIcon>
                        Male
                      </GenderBadge>
                      <GenderBadge $active={plan.clipVoiceGender === 'FEMALE'} $gender="FEMALE">
                        <GenderIcon>♀</GenderIcon>
                        Female
                      </GenderBadge>
                    </GenderDisplay>
                  </FieldCard>
                </VoiceSection>
              </>
            )}

            {/* ── Scenes ── */}
            {activeSection === 'scenes' && scenes.length > 0 && (
              <>
                <SectionHeading>
                  <HeadingIcon $color={SCENE_COLORS[safeSceneIdx % SCENE_COLORS.length]}>
                    {activeMeta.icon}
                  </HeadingIcon>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <HeadingText $color={SCENE_COLORS[safeSceneIdx % SCENE_COLORS.length]}>
                        Scene {safeSceneIdx + 1}
                      </HeadingText>
                      {activeScene?.sceneDuration && (
                        <DurationChip $color={SCENE_COLORS[safeSceneIdx % SCENE_COLORS.length]}>
                          {activeScene.sceneDuration}s
                        </DurationChip>
                      )}
                    </div>
                    <HeadingSubtext>{getSceneLabel(activeScene, safeSceneIdx)}</HeadingSubtext>
                  </div>
                </SectionHeading>

                <SceneTabs>
                  {scenes.map((_, i) => {
                    const color = SCENE_COLORS[i % SCENE_COLORS.length];
                    return (
                      <SceneTab key={i} $active={safeSceneIdx === i} $color={color}
                        onClick={() => setActiveSceneIdx(i)}>
                        {i + 1}
                      </SceneTab>
                    );
                  })}
                </SceneTabs>

                {activeScene && (() => {
                  const activeColor = SCENE_COLORS[safeSceneIdx % SCENE_COLORS.length];
                  const isObjOffset = typeof activeScene.sceneOffsetFrame === 'object'
                    && activeScene.sceneOffsetFrame !== null;
                  const visualInstructions = isObjOffset
                    ? activeScene.sceneOffsetFrame?.staticVisualInstructions || ''
                    : typeof activeScene.sceneOffsetFrame === 'string'
                      ? activeScene.sceneOffsetFrame : '';

                  return (
                    <SceneFieldGroup>
                      {activeScene.sceneTitle && (
                        <FieldCard $color={activeColor}>
                          <FieldLabel>Title</FieldLabel>
                          <ReadOnlyText>{activeScene.sceneTitle}</ReadOnlyText>
                        </FieldCard>
                      )}
                      {activeScene.sceneScriptSegment && (
                        <FieldCard $color={activeColor}>
                          <FieldLabel>Script</FieldLabel>
                          <ReadOnlyText $italic>
                            "{activeScene.sceneScriptSegment}"
                          </ReadOnlyText>
                        </FieldCard>
                      )}

                      {(visualInstructions || isObjOffset) && (
                        <FieldCard $color={activeColor}>
                          <FieldLabel>Visual Setup</FieldLabel>
                          <ReadOnlyText>
                            {visualInstructions || <ReadOnlyPlaceholder>No visual setup defined</ReadOnlyPlaceholder>}
                          </ReadOnlyText>
                        </FieldCard>
                      )}

                      <FieldCard $color={activeColor}>
                        <FieldLabel>Generation Prompt</FieldLabel>
                        <ReadOnlyText>
                          {activeScene.sceneGenerationPrompt
                            || <ReadOnlyPlaceholder>No generation prompt defined</ReadOnlyPlaceholder>}
                        </ReadOnlyText>
                      </FieldCard>
                    </SceneFieldGroup>
                  );
                })()}
              </>
            )}

          </ContentInner>
          {versionLoading && <VersionLoadOverlay><BtnSpinner /></VersionLoadOverlay>}
        </ContentPanel>

        {plan.mediaContentUuid && (
          <VideoPanelWrap>
            <VideoWrap>
              {videoLoading && (
                <VideoSpinnerWrap><BtnSpinner /></VideoSpinnerWrap>
              )}
              {!videoLoading && videoUrl && (
                <MinimalistVideo src={videoUrl} controls playsInline loop />
              )}
              {!videoLoading && !videoUrl && (
                <VideoEmptyMsg>Could not load video</VideoEmptyMsg>
              )}
            </VideoWrap>
          </VideoPanelWrap>
        )}
      </SplitPane>

      {/* ── Bottom Bar — hidden for fully read-only (done) plans ── */}
      {!readonly && (
        <BottomBarOuter>
          <BottomNavArrow
            $hidden={lastVersion <= 1 || currentVersion <= 1 || versionLoading}
            onClick={() => loadVersion(currentVersion - 1)}
            title="Previous version"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </BottomNavArrow>

          <BottomBar>
            <BottomActionRow>
              {promptBoxSlot && <PromptSlotWrap>{promptBoxSlot}</PromptSlotWrap>}
              {status && <StatusText>{status}</StatusText>}
              <GenerateBtn $loading={isExecuting} onClick={handleGenerate} disabled={isExecuting}>
                {isExecuting ? <BtnSpinner /> : '▶'}
                {isExecuting ? 'Generating…' : 'Generate Video'}
              </GenerateBtn>
            </BottomActionRow>
          </BottomBar>

          <BottomNavArrow
            $hidden={lastVersion <= 1 || currentVersion >= lastVersion || versionLoading}
            onClick={() => loadVersion(currentVersion + 1)}
            title="Next version"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </BottomNavArrow>
        </BottomBarOuter>
      )}

    </ConsoleWrapper>
    </>
};

export default ReadyViewV2;
