const DEFAULT_WORKSHOP_NAME = 'Welcome';

export default function WorkshopTitleSlide({ workshopName = DEFAULT_WORKSHOP_NAME }) {
  // Update display to show "Hi There" instead of "Welcome" on the root title slide
  const displayTitle =
    typeof workshopName === 'string'
      ? workshopName.replace('Welcome', 'Hi There')
      : workshopName;

  return (
    <div className="workshop-slide workshop-title-slide">
      <h1 className="workshop-title-main">{displayTitle}</h1>
    </div>
  );
}
