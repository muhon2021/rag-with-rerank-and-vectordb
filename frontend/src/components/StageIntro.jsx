import { Fragment } from 'react';
import { ArrowDown, X } from 'lucide-react';

export default function StageIntro({ step, onClose }) {
  if (!step) return null;

  return (
    <section className="stage-intro stage-intro-compact">
      <div className="stage-intro-toolbar">
        {step.talkPoint && (
          <p className="intro-talk-point">{step.talkPoint}</p>
        )}
        {onClose && (
          <button type="button" className="overview-close" onClick={onClose} aria-label="Hide overview">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="stage-intro-grid">
        <div className="intro-card">
          <h3>Technologies</h3>
          <ul>
            {step.technologies?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="intro-card intro-flow">
          <h3>How it works</h3>
          <div className="flow-pipeline" aria-label="How it works">
            {step.dataFlow?.map((item, i) => (
              <Fragment key={`${item.step}-${i}`}>
                <div className="flow-step-chip">{item.step}</div>
                {i < step.dataFlow.length - 1 && (
                  <ArrowDown className="flow-arrow" size={18} aria-hidden />
                )}
              </Fragment>
            ))}
          </div>
        </div>
        <div className="intro-card intro-pros">
          <h3>Pros</h3>
          <ul>
            {step.pros?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="intro-card intro-cons">
          <h3>Cons</h3>
          <ul>
            {step.cons?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
