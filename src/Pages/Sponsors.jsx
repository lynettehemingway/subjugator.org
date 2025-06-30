// src/Pages/Sponsors.jsx
import React from "react";
import "../styles/Sponsors.css";

// local logo & pdf imports
import sylphaseLogo from "../assets/sponsors/Sylphase.png";
import sponsorPacket from "../assets/sponsorship_packet.pdf";

/* ---------- Tier component ---------- */
const SponsorSection = ({ title, sponsors }) => (
  <section className="sponsor-section">
    <h2 className="sponsor-section__title">{title}</h2>

    <div className="sponsor-grid">
      {sponsors.map((s, i) => {
        const isPerson = !s.url; // people / alumni have no URL
        return (
          <div key={i} className={`sponsor-card${isPerson ? " person" : ""}`}>
            {s.imgSrc && (
              isPerson ? (
                <img src={s.imgSrc} alt={s.imgAlt} className="sponsor-card__logo" />
              ) : (
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  <img src={s.imgSrc} alt={s.imgAlt} className="sponsor-card__logo" />
                </a>
              )
            )}
            {isPerson && <h3 className="sponsor-card__name person-name">{s.name}</h3>}
          </div>
        );
      })}
    </div>
  </section>
);

/* ---------- Main page ---------- */
const Sponsors = () => {
  const diamondSponsors = [
    {
      name: "Sylphase",
      url: "https://sylphase.com",
      imgSrc: sylphaseLogo,
      imgAlt: "Sylphase Logo",
    },
    {
      name: "L3Harris Technologies",
      url: "https://l3harris.com",
      imgSrc:
        "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/L3Harris_Technologies_logo.svg/1280px-L3Harris_Technologies_logo.svg.png",
      imgAlt: "L3Harris Logo",
    },
    {
      name: "Erik de la Inglesia",
      imgSrc: "https://mil.ufl.edu/sponsors/Erik.png",
      imgAlt: "Erik de la Iglesia",
    },
  ];

  const platinumSponsors = [
    {
      name: "JD Squared",
      url: "https://jd2.com",
      imgSrc: "http://mil.ufl.edu/sponsors/JD-squared-transparent.png",
      imgAlt: "JD Squared Logo",
    },
    {
      name: "Texas Instruments",
      url: "https://ti.com",
      imgSrc: "https://1000logos.net/wp-content/uploads/2020/04/Logo-Texas-Instruments.jpg",
      imgAlt: "Texas Instruments Logo",
    },
  ];

  const goldSponsors = [
    { name: "Kevin Allen (MIL alumnus)", imgSrc: "http://mil.ufl.edu/sponsors/kevin.jpeg", imgAlt: "Kevin Allen" },
    { name: "Anonymous (MIL alumnus)" },
  ];

  const silverSponsors = [
    { name: "Matthew Langford (MIL alumnus)" },
    { name: "IEEE", url: "https://www.ieee.org", imgSrc: "https://upload.wikimedia.org/wikipedia/commons/2/21/IEEE_logo.svg", imgAlt: "IEEE Logo" },
    { name: "Anonymous (MIL alumnus)" },
    { name: "Electrical and Computer Engineering, UF", url: "https://ece.ufl.edu", imgSrc: "https://www.ece.ufl.edu/wp-content/uploads/2024/10/ElectricalComputerEngineering-VECTOR-RGB.svg", imgAlt: "ECE Logo" },
    { name: "Mechanical and Aerospace Engineering, UF", url: "https://mae.ufl.edu", imgSrc: "https://mil.ufl.edu/sponsors/MAE_logo.png", imgAlt: "MAE Logo" },
  ];

  const bronzeSponsors = [
    { name: "Dr. Andrew Gray (MIL alumnus)" },
    { name: "DigiKey", url: "https://www.digikey.com", imgSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/DigiKey_logo.svg/1280px-DigiKey_logo.svg.png", imgAlt: "DigiKey Logo" },
  ];

  return (
    <main className="sponsors-page">
      {/* ----- hero ----- */}
      <section className="hero container-fluid text-center">
        <h1 className="hero-title">2025 Sponsors</h1>
        <p className="hero-subtitle">
          We have been very fortunate to have generous partners in industry and at the University of Florida to support the SubjuGator project. Listed below are active sponsors for the SubjuGator project at the University of Florida. For more information about becoming a sponsor, please see our sponsorship packet below.
        </p>
      </section>

      {/* ----- sponsor tiers ----- */}
      <div className="sponsor-tiers container-xl">
        <SponsorSection title="Diamond Sponsors" sponsors={diamondSponsors} />
        <SponsorSection title="Platinum Sponsors" sponsors={platinumSponsors} />
        <SponsorSection title="Gold Sponsors" sponsors={goldSponsors} />
        <SponsorSection title="Silver Sponsors" sponsors={silverSponsors} />
        <SponsorSection title="Bronze Sponsors" sponsors={bronzeSponsors} />
      </div>

      {/* ----- footer with call‑to‑action button ----- */}
      <footer className="sponsor-footer text-center">
        <h2 className="sponsor-call">Become a Sponsor</h2>
        <span className="sponsor-underline" />
        <a
          href={sponsorPacket}
          target="_blank"
          rel="noopener noreferrer"
          className="sponsor-btn"
        >
          Download Sponsorship Packet (PDF)
        </a>
      </footer>
    </main>
  );
};

export default Sponsors;
