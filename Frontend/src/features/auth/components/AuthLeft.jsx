import React from "react";
import styles from "../style/auth.module.scss";

const AuthLeft = ({ title, subtitle, features }) => {
  return (
    <div className={styles.leftPanel}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      <div className={styles.grid} />

      <div className={styles.leftContent}>
        <div className={styles.leftLogo}>
          <div className={styles.logoMark}>G</div>
          <span>Gyaan AI</span>
        </div>

        <div className={styles.leftHero}>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <ul className={styles.featureList}>
          {features.map((f, i) => (
            <li key={i} className={styles.featureItem}>
              <span className={styles.featureCheck}>✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <strong>50K+</strong>
            <span>Students</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <strong>200+</strong>
            <span>Topics</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <strong>4.9★</strong>
            <span>Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLeft;
