import { WORKSHOP_NAME } from '../constants/workshopSlides.js';

export default function WorkshopTitleSlide({ workshopName = WORKSHOP_NAME }) {
  return (
    <div className="workshop-slide workshop-title-slide">
      <h1 className="workshop-title-main">{workshopName}</h1>
    </div>
  );
}
