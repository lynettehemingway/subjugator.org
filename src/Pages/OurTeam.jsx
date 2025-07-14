import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/OurTeam.css";

/* ---------- auto-import headshots from /assets/people ---------- */
const peopleModules = import.meta.glob(
  "../assets/people/*.{png,jpg,jpeg,webp,gif}",
  { eager: true }
);
const memberImages = Object.fromEntries(
  Object.entries(peopleModules).map(([path, mod]) => [
    path.split("/").pop(),
    mod.default,
  ])
);

const toSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "_");

const resolveImage = (slug) => {
  for (const ext of ["png", "jpg", "jpeg", "webp", "gif"]) {
    const key = `${slug}.${ext}`;
    if (memberImages[key]) return memberImages[key];
  }
  return undefined; // fallback – no head‑shot found
};

/* ---------- card component ---------- */
const TeamMemberCard = ({ member }) => {
  const hasImage = Boolean(member.img);

  return (
    <article
      className={`team-card ${hasImage ? "has-photo" : "no-photo"}`}
      tabIndex={0}
    >
      {hasImage && (
        <div className="team-card__image-wrapper">
          <img
            src={member.img}
            alt={`${member.name} head‑shot`}
            className="team-card__image"
            loading="lazy"
          />
        </div>
      )}

      <h3 className="team-card__name">{member.name}</h3>
      <p className="team-card__role">{member.role}</p>
    </article>
  );
};

/* ---------- page component ---------- */
function OurTeam() {
  const rawMembers = [
    { name: "Adam McAleer", role: "Mechanical Lead" },
    { name: "Joseph Goodman", role: "Electrical Lead" },
    { name: "Cameron Brown", role: "Software Lead" },
    { name: "Adrian Fernandez", role: "Electrical Lead" },
    { name: "Lester Bonilla", role: "Electrical Lead" },
    { name: "Adam Hamdan", role: "Mechanical Lead" },
    { name: "Ryan Hoburg", role: "Mechanical Lead" },
    { name: "Alex Johnson", role: "Software Lead" },
    { name: "Carlos Chavez", role: "Software Lead" },
    { name: "Eric(Jack) Rainville", role: "Electrical Lead" },
    { name: "Ethan Mitchell", role: "Electrical Member" },
    { name: "Keith Khadar", role: "Software Lead" },
    { name: "Daniel Parra", role: "Software Lead" },
    { name: "Lorant Domokos", role: "Mechanical Lead" },

    
  ];

  /* attach images */
  const teamMembers = rawMembers.map((m) => ({
    ...m,
    img: resolveImage(toSlug(m.name)),
  }));

  const location = useLocation();
  
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      // Delay to ensure the target element is rendered
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);
  

  /* devtools verification – run once */
  useEffect(() => {
    console.table(teamMembers.map((m) => ({ name: m.name, imgFound: !!m.img })));
  }, []); 
  return (
    <main className="our-team-page">
      <section className="hero container-fluid text-center" id="top-team">
        <h1 className="hero-title">
          <span className="highlight">2025&nbsp;Team&nbsp;</span>
          Members
        </h1>
      </section>

      {/* ----- grid section ----- */}
      <section className="team-section">
        <div className="team-section__inner container-xl">
          <p className="grid-subtitle" role="presentation">
            Meet the engineers shaping SubjuGator
          </p>

          <div className="team-grid" role="list">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
      <div className="cta-wrapper">
        <h2 className="cta-heading">Passionate about underwater robotics?</h2>
        <div className="cta-buttons">
          <Link to="/contact" className="btn btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </section>

    </main>
  );
}

export default OurTeam;