import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function WorkshopStepControls({ onNext, nextLabel, onBack, showBack }) {
  return (
    <div className="workshop-step-controls" aria-label="Workshop navigation">
      {showBack && (
        <button
          type="button"
          className="workshop-icon-btn"
          onClick={onBack}
          data-tooltip="Previous stage"
          aria-label="Previous stage"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      {onNext && nextLabel && (
        <button
          type="button"
          className="workshop-icon-btn workshop-icon-btn-primary"
          onClick={onNext}
          data-tooltip={nextLabel}
          aria-label={nextLabel}
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
}
