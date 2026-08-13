"use client";

import React, { useEffect, useState } from "react";
import styles from "./Footer.module.css";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  if (pathname === "/stats" || pathname === "/banner") return null;

  return (
    <footer className={styles["site-footer"]}>
      <div className={styles["hero-row"]}>
        <div className="flex flex-col items-start gap-4">
          <h2 className={styles["hero-headline"]}>
            <span className={styles.line}>Let's</span>
            <span className={styles.line}>create</span>
            <span className={`${styles.line} ${styles.future}`}>future</span>
            <span className={styles.line}>together</span>
          </h2>
          {/* Mobile contact block (visible only on mobile viewports) */}
          <div className={styles["contact-block-mobile"]}>
            <p className={styles["contact-us-label"]}>Contact us</p>
            <a className={styles["contact-email"]} href="mailto:hackxmuj@gmail.com">hackxmuj@gmail.com</a>
          </div>
        </div>

        <div className={styles["team-grid"]}>
          <div className={styles["team-card"]}>
            <p className={styles["team-name"]}>Tanmoy Mandal</p>
            <p className={styles["team-phone"]}>+91 8340157213</p>
            <a className={styles["team-email"]} href="mailto:tanmaymandal1250@gmail.com">tanmaymandal1250@gmail.com</a>
          </div>
          <div className={styles["team-card"]}>
            <p className={styles["team-name"]}>Dolly Srivastava</p>
            <p className={styles["team-phone"]}>+91 7985008591</p>
            <a className={styles["team-email"]} href="mailto:dolly8842vsecap@gmail.com">dolly8842vsecap@gmail.com</a>
          </div>
          <div className={styles["team-card"]}>
            <p className={styles["team-name"]}>Arindam Sharma</p>
            <p className={styles["team-phone"]}>+91 9877234162</p>
            <a className={styles["team-email"]} href="mailto:arindamsharma05@gmail.com">arindamsharma05@gmail.com</a>
          </div>
          <div className={styles["team-card"]}>
            <p className={styles["team-name"]}>Anshuman Singh</p>
            <p className={styles["team-phone"]}>+91 9978644964</p>
            <a className={styles["team-email"]} href="mailto:anshuman.singh11166@gmail.com">anshuman.singh11166@gmail.com</a>
          </div>
        </div>
      </div>

      <div className={styles["footer-bottom"]}>
        {/* Desktop contact block (hidden on mobile viewports) */}
        <div className={styles["contact-block-desktop"]}>
          <p className={styles["contact-us-label"]}>Contact us</p>
          <a className={styles["contact-email"]} href="mailto:hackxmuj@gmail.com">hackxmuj@gmail.com</a>
        </div>

        <div className={styles["footer-meta"]}>
          <div className={styles["social-links"]}>
            <a href="https://www.linkedin.com/company/hackxmuj" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://www.instagram.com/muj.hackx/" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
          <p className={styles.copyright}>© <span className={styles.year}>{year || "2026"}</span> All rights reserved. MUJHACKX.</p>
        </div>
      </div>
    </footer>
  );
}
