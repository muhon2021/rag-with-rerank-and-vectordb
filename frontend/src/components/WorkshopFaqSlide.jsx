import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function WorkshopFaqSlide({ questions = [] }) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="workshop-slide workshop-faq-slide">
      <ul className="faq-list">
        {questions.map((item) => {
          const isOpen = openId === item.id;
          return (
            <li key={item.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
              >
                <span>{item.label}</span>
                <ChevronDown className="faq-chevron" size={20} aria-hidden />
              </button>
              {isOpen && (
                <div className="faq-answer">
                  <ul>
                    {item.answer.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
