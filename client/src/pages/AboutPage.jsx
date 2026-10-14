import PageFrame from "../components/PageFrame";

const team = [
  ["Mira Fernandes", "Executive chef · Goa / Mumbai", "MF"],
  ["Rohan Khanna", "Wok & fire · Delhi / Singapore", "RK"],
  ["Leela Shah", "Pastry & pours · Pune / Paris", "LS"],
];

const pillars = [
  ["A city pantry", "We work with small growers, spice merchants and makers who care about where the good stuff comes from."],
  ["A little drama", "Open fire, tableside pours and plates meant to be passed. Dinner should have a beginning, middle and encore."],
  ["A generous room", "Come dressed up, come after work, come with news. There’s a good chair waiting either way."],
];

export default function AboutPage() {
  return (
    <PageFrame
      eyebrow="Our story"
      title="Built around the long way home."
      intro="Urban Spice began with one question: what happens when a restaurant stops asking food to choose just one address?"
    >
      <div className="about-hero">
        <div className="about-hero-img">
          <img
            src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1400"
            alt="A table ready for dinner"
          />
        </div>
        <div className="about-hero-quote">
          <p className="font-display">“The best meals don’t stay in their lane.”</p>
          <p>
            Our kitchen borrows with respect, argues with convention and leaves room for the unexpected. Every plate
            is a little familiar, then suddenly not.
          </p>
        </div>
      </div>

      <div className="about-grid">
        {pillars.map(([title, text], index) => (
          <div key={title}>
            <span className="about-grid-num font-display">0{index + 1}</span>
            <h2 className="font-display">{title}</h2>
            <p>{text}</p>
          </div>
        ))}
      </div>

      <div className="about-team">
        <p className="eyebrow">The people behind the pass</p>
        <div className="team-grid">
          {team.map(([name, role, initials]) => (
            <div key={name} className="team-member">
              <div className="team-avatar font-display">{initials}</div>
              <div>
                <h3 className="font-display">{name}</h3>
                <p>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageFrame>
  );
}
