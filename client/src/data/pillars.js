import { FaShieldAlt, FaBolt, FaLeaf } from "react-icons/fa";

/**
 * CHADI's strategic framework: three pillars (Protect / Empower / Thrive),
 * each with flagship projects, the programme components under them, and the
 * UN Sustainable Development Goals the pillar advances. Pure structure only
 * - every piece of display text is looked up from i18n via these keys (see
 * `ourApproach.pillars`, `ourApproach.projects`, `ourApproach.components`
 * and `ourApproach.sdgs` in the locale files), the same pattern CoreValues
 * uses for its VALUE_KEYS.
 */
export const PILLARS = [
  {
    key: "protect",
    icon: FaShieldAlt,
    sdgs: [2, 3, 4, 6, 10, 16],
    projects: [
      {
        key: "sovcest",
        components: [
          "startTalentAdvancement",
          "childProtectionSafeguarding",
          "childRightsAdvocacy",
          "counsellingPsychosocialSupport",
          "educationSupport",
          "skillsAcquisition",
          "familyStrengthening",
          "emergencyChildSupport",
        ],
      },
      {
        key: "miycan",
        components: [
          "miycn",
          "healthHour",
          "schoolHealthProgramme",
          "adolescentHealth",
          "mentalHealthPromotion",
          "nutritionEducation",
        ],
      },
      {
        key: "childReliefRecovery",
        components: [
          "humanitarianResponse",
          "wash",
          "safeSchools",
          "childProtectionEmergencies",
          "disasterRecovery",
          "communityResilience",
        ],
      },
    ],
  },
  {
    key: "empower",
    icon: FaBolt,
    sdgs: [4, 5, 8, 9, 10],
    projects: [
      {
        key: "futureReady",
        components: [
          "digitalLiteracy",
          "stemEducation",
          "financialLiteracy",
          "careerDevelopment",
          "entrepreneurship",
          "employabilitySkills",
        ],
      },
      {
        key: "choices",
        components: [
          "drugAbusePrevention",
          "lifeSkills",
          "leadershipDevelopment",
          "mentorship",
          "civicEducation",
          "positiveBehaviourChange",
        ],
      },
      {
        key: "youthLeadership",
        components: ["youthLeadership", "volunteerism", "advocacy", "communityService", "peerEducation", "socialInnovation"],
      },
    ],
  },
  {
    key: "thrive",
    icon: FaLeaf,
    sdgs: [3, 5, 11, 13, 16, 17],
    projects: [
      {
        key: "padPeriodCareBank",
        components: ["menstrualHealth", "periodPovertyPrevention", "schoolRetentionForGirls"],
      },
      {
        key: "stillHere",
        components: ["mentalHealthAwareness", "sickleCellSupport", "counselling", "survivorSupport", "advocacy"],
      },
      {
        key: "greenFutures",
        components: [
          "climateAction",
          "peacebuilding",
          "environmentalEducation",
          "treePlanting",
          "communityResilience",
          "youthClimateLeadership",
        ],
      },
    ],
  },
];
