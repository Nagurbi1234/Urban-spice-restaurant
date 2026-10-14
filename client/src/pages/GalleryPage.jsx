import PageFrame from "../components/PageFrame";

const images = [
  "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

export default function GalleryPage() {
  return (
    <PageFrame
      eyebrow="At the table"
      title="A room that knows how to glow."
      intro="Sun-washed lunches, low-lit dinners and the small beautiful details between them."
    >
      <div className="gallery-columns">
        {images.map((image, index) => (
          <figure
            key={image}
            className={`gallery-item ${index === 1 ? "portrait" : index === 3 ? "tall" : "square"}`}
          >
            <img src={image} alt={`Urban Spice atmosphere ${index + 1}`} data-testid={`img-gallery-${index + 1}`} />
          </figure>
        ))}
      </div>
    </PageFrame>
  );
}
