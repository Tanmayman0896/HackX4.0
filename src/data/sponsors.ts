export interface Sponsor {
  id: number;
  name: string;
  logo: string;
}

// Export Alias
export type Partner = Sponsor;

export const LANDING_SPONSORS: Sponsor[] = [
  // 1. Abhibus
  {
    id: 1,
    name: "Abhibus",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787685959301_2jfpvc.avif",
  },
  // 2. Accenture
  {
    id: 2,
    name: "Accenture",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787685971272_r1nu8i.avif",
  },
    // 4. HackCulture
  {
    id: 4,
    name: "HackCulture",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686068706_rwhh4.avif",
  },
  // 3. Adani One
  {
    id: 3,
    name: "Adani One",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787685978735_gty9tl.avif",
  },

  // 5. Logitech
  {
    id: 5,
    name: "Logitech",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686102711_26yik7.avif",
  },
  // 8. Hitachi
  {
    id: 8,
    name: "Hitachi",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686093259_kmp5kzo.avif",
  },
  // 7. OnePlus
  {
    id: 7,
    name: "OnePlus",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686127284_h8vdc.avif",
  },

    // 6. Sarvam
  {
    id: 6,
    name: "Sarvam",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686165357_5cs66f.avif",
  },
];

export const GRID_SPONSORS: Sponsor[] = [
  // Featured 8 Landing Partners
  ...LANDING_SPONSORS,

  // 9. Balaji Wafers
  {
    id: 9,
    name: "Balaji Wafers",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787685986328_l1s5dx.avif",
  },
  /*/ 10. Project Vanguard BPHC
  {
    id: 10,
    name: "Project Vanguard BPHC",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787685993967_qxcfhm.avif",
  },*/
  // 11. Eventopia
  {
    id: 11,
    name: "Eventopia",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686059975_m7qt9.avif",
  },
  /* 12. Cipher LNMIIT
  {
    id: 12,
    name: "Cipher LNMIIT",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686011685_o7okwp.avif",
  },*/
  // 13. Coding Blocks
  {
    id: 13,
    name: "Coding Blocks",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686018930_7te0v2.avif",
  },
  // 14. Coding Ninjas
  {
    id: 14,
    name: "Coding Ninjas",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686025855_jsz3gk.avif",
  },
  // 15. Devfolio
  {
    id: 15,
    name: "Devfolio",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686034427_fsirnb.avif",
  },
  // 16. EazyDiner
  {
    id: 16,
    name: "EazyDiner",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686044605_p3uy2s.avif",
  },
  // 17. Ecofy
  {
    id: 17,
    name: "Ecofy",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686052944_yj5kg.avif",
  },
  // 18. Eventopia
  {
    id: 18,
    name: "Eventopia",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686059975_m7qt9.avif",
  },
  // 19. HackerRank
  {
    id: 19,
    name: "HackerRank",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686075605_4qtpu8.avif",
  },
  // 20. HackShastra
  {
    id: 20,
    name: "HackShastra",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686084906_yzug7d.avif",
  },
  // 21. Luma AI
  {
    id: 21,
    name: "Luma AI",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686112053_z92ll7.avif",
  },
  // 22. MongoDB
  {
    id: 22,
    name: "MongoDB",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686119689_qmat7g.avif",
  },
  // 23. Pizza Baker's
  {
    id: 23,
    name: "Pizza Baker's",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686136049_aws1mc.avif",
  },
  // 24. Programming Pathshala
  {
    id: 24,
    name: "Programming Pathshala",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686146479_3zyfxa.svg",
  },
  // 25. Ritva
  {
    id: 25,
    name: "Ritva",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686157320_5dfosz.avif",
  },
  // 26. Verdant
  {
    id: 26,
    name: "Verdant",
    logo: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1787686172342_lru2fn.avif",
  },
];

// Combined dataset exports (all 26 partners)
export const SPONSORS: Sponsor[] = [...GRID_SPONSORS];
export const PARTNERS: Sponsor[] = SPONSORS;
export const OUR_PARTNERS: Sponsor[] = SPONSORS;
