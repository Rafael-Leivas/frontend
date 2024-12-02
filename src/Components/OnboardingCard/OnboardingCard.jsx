import React from 'react';
import './OnboardingCard.css';

const OnboardingCard = ({ number, title, subtitle, liberado, onViewMore }) => {
  return (
    <div className={`welcome-card ${!liberado ? 'blocked' : ''}`}>
      <div className="circle">{number}</div>
      <div className="content">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="cta-container">
        {liberado ? (
          <button className="cta-button" onClick={onViewMore}>
            Veja tudo! <span>&#9660;</span>
          </button>
        ) : (
          <button className="cta-button disabled">Bloqueado</button>
        )}
      </div>
      {!liberado && <div className="overlay">Bloqueado</div>}
    </div>
  );
};

export default OnboardingCard;
