import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { api } from '@utils/apiClient';
import {
  Overlay,
  Dialog,
  Header,
  Title,
  Description,
  Label,
  Textarea,
  ButtonGroup,
  CancelButton,
  SubmitButton,
  SuccessBanner,
  CharCount,
} from './styles';

interface ReportDialogProps {
  isOpen: boolean;
  contentId: string;
  contentName?: string;
  onClose: () => void;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  isOpen,
  contentId,
  contentName,
  onClose,
}) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!feedback.trim() || loading) return;

    setLoading(true);
    try {
      await api.post(`/contents/${contentId}/report`, {
        message: feedback.trim(),
      });

      setSubmitted(true);
      setFeedback('');
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch {
      // Fallback: open mailto if API is unavailable
      const subject = encodeURIComponent(`[STUDIO CONTENT REPORT]: ${contentId}`);
      const bodyLines = [
        '---REPORT START---',
        `CONTENT_ID: ${contentId}`,
        `CONTENT_NAME: ${contentName || 'Unknown'}`,
        `REPORT_TIMESTAMP: ${new Date().toISOString()}`,
        '---FEEDBACK START---',
        feedback.trim(),
        '---FEEDBACK END---',
        '---REPORT END---',
      ].join('%0A');
      window.open(`mailto:contact@ezpresence.com?subject=${subject}&body=${bodyLines}`);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = () => {
    if (!loading) onClose();
  };

  return ReactDOM.createPortal(
    <Overlay 
      onClick={handleOverlayClick}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Header>
          <span style={{ fontSize: 22 }}>⚠️</span>
          <Title>Report Video Quality</Title>
        </Header>
        <Description>
          Your feedback is streamed directly to our AI agents department, so you can be sure we will improve
          based on what you tell us.
        </Description>

        {submitted ? (
          <SuccessBanner>✅ Feedback sent! Thank you.</SuccessBanner>
        ) : (
          <>
            <Label htmlFor="report-feedback">What's wrong with this video?</Label>
            <Textarea
              id="report-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. The transitions look choppy, the color grading is off, incorrect aspect ratio..."
              disabled={loading}
              maxLength={2000}
            />
            <CharCount>{feedback.length} / 2000</CharCount>
            <ButtonGroup>
              <CancelButton onClick={onClose} disabled={loading}>
                Cancel
              </CancelButton>
              <SubmitButton
                onClick={handleSubmit}
                $loading={loading}
                disabled={loading || !feedback.trim()}
              >
                {loading ? 'Sending…' : 'Send Report'}
              </SubmitButton>
            </ButtonGroup>
          </>
        )}
      </Dialog>
    </Overlay>,
    document.body
  );
};

export default ReportDialog;
