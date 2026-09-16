import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import ChatPanel from './ChatPanel.jsx';
import CompareAllView from './CompareAllView.jsx';
import StageIntro from './StageIntro.jsx';
import WorkshopTitleSlide from './WorkshopTitleSlide.jsx';
import WorkshopFaqSlide from './WorkshopFaqSlide.jsx';
import WorkshopMatrixSlide from './WorkshopMatrixSlide.jsx';
import WorkshopThankYouSlide from './WorkshopThankYouSlide.jsx';
import WorkshopStepControls from './WorkshopStepControls.jsx';
import StatusBar from './StatusBar.jsx';
import ErrorBanner from './ErrorBanner.jsx';
import { WORKSHOP_STEPS, getNextStepLabel } from '../constants/stages.js';

export default function WorkshopFlow({
  indexEmpty,
  backendOnline,
  health,
  totalVectors,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const step = WORKSHOP_STEPS[stepIndex];
  const isTitle = step?.type === 'title';
  const isFaq = step?.type === 'faq';
  const isStage = step?.type === 'stage';
  const isCompare = step?.type === 'compare';
  const isMatrix = step?.type === 'matrix';
  const isThanks = step?.type === 'thanks';
  const isLastStep = stepIndex >= WORKSHOP_STEPS.length - 1;
  const showPipelineOverview = isStage || isCompare;
  const nextLabel = getNextStepLabel(stepIndex);

  useEffect(() => {
    setShowDetails(false);
  }, [stepIndex]);

  const goNext = () => {
    if (stepIndex < WORKSHOP_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  };

  return (
    <div className="workshop-shell">
      <header className="workshop-top workshop-top-compact">
        <div className="workshop-top-main">
          <span className="workshop-brand-title">RAG Learning Lab</span>
          <span className="workshop-stage-line">
            <strong className="workshop-stage-name">{step.title}</strong>
            {step.description ? (
              <span className="workshop-stage-desc">{step.description}</span>
            ) : null}
          </span>
        </div>

        <div className="workshop-top-actions">
          {showPipelineOverview && (
            <button
              type="button"
              className={`details-toggle ${showDetails ? 'active' : ''}`}
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
            >
              <Info size={14} />
              {showDetails ? 'Hide overview' : 'Show overview'}
            </button>
          )}
          <span className="workshop-progress">
            {stepIndex + 1} / {WORKSHOP_STEPS.length}
          </span>
        </div>
      </header>

      {!backendOnline && (
        <ErrorBanner message="Backend unreachable — start the API with: npm run dev:backend" />
      )}

      <div className="workshop-content">
        <div className="workshop-body workshop-body-expanded">
          {isTitle && <WorkshopTitleSlide workshopName={step.workshopName} />}
          {isFaq && <WorkshopFaqSlide key={step.id} questions={step.questions} />}
          {isStage && (
            <ChatPanel
              key={step.id}
              stage={step.id}
              indexEmpty={indexEmpty}
              workshopLayout
            />
          )}
          {isCompare && (
            <CompareAllView indexEmpty={indexEmpty} isWorkshopFinale />
          )}
          {isMatrix && <WorkshopMatrixSlide rows={step.rows} />}
          {isThanks && <WorkshopThankYouSlide />}
        </div>

        {showDetails && showPipelineOverview && (
          <div className="overview-overlay" role="region" aria-label="Pipeline overview">
            <StageIntro step={step} onClose={() => setShowDetails(false)} />
          </div>
        )}
      </div>

      <WorkshopStepControls
        onNext={isLastStep ? undefined : goNext}
        nextLabel={isLastStep ? null : nextLabel}
        onBack={goBack}
        showBack={stepIndex > 0}
      />

      <StatusBar
        backendOnline={backendOnline}
        health={health}
        totalVectors={totalVectors}
      />
    </div>
  );
}
