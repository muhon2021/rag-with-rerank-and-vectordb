import { WORKSHOP_NAME } from '../constants/workshopSlides.js';

export default function WorkshopTitleSlide({ workshopName = WORKSHOP_NAME }) {
  // Replace the word "Welcome" with "Hello" when rendering the workshop title
  const displayName =
    typeof workshopName === 'string'
      ? workshopName.replace(/\bWelcome\b/gi, 'Hello')
      : workshopName;

  return (
    <div className="workshop-slide workshop-title-slide">
      <h1 className="workshop-title-main">{displayName}</h1>
    </div>
  );
}
