import React from 'react';
import st from './Testimonial_Card.module.css';

const TestimonialCard = ({ name, testimonial, image }) => {
  return (
    <div className={st.testimonialCard}>
      <img src={image} alt={name} className={st.testimonialImage} />
      <p className={st.testimonialText}>"{testimonial}"</p>
      <h3 className={st.testimonialName}>- {name}</h3>
    </div>
  );
};

export default TestimonialCard;
