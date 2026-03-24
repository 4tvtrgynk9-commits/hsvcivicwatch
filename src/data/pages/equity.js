export const equityPageData = {
  id: "equity",
  pageTitle: "The Two Huntsvilles",
  pageSubtitle: "Service & Spending Inequality",
  heroTag: "RED · INVESTIGATION",
  heroSummary:
    "Roads, schools, and police contact patterns show a long-running equity gap inside the same city tax base.",

  overviewStats: [
    ["Road PCI North", "41", "Poor condition — near reconstruction threshold", "#dc2626"],
    ["Road PCI South", "72", "Good condition", "#16a34a"],
    ["AP Participation", "44% vs 17%", "Jemison vs Columbia", "#ea580c"],
    ["Developer Donations", "$380k", "Battle received from real estate interests", "#c9a84c"],
  ],

  tabs: {
    overview: {
      label: "Overview",
      aiPrompt:
        "Use only the facts provided for the Equity overview. Explain the pattern in plain language, say who benefits, say what is still unanswered, and end with 2 concrete actions for residents.",

      stats: [
        ["Road Pavement Quality (PCI Score)", "41", "North Huntsville average", "#dc2626"],
        ["Road Pavement Quality (PCI Score)", "72", "South Huntsville average", "#16a34a"],
        ["Capital Road Spending", "68%", "Share going to south Huntsville and annexed areas", "#ea580c"],
        ["Police Contacts", "3.7x", "Higher per-capita in north Huntsville", "#c9a84c"],
      ],

      coreFacts: [
        {
          label: "Road Maintenance Gap",
          text:
            "North Huntsville roads average a Pavement Condition Index of 41 — poor condition, close to reconstruction level. South Huntsville averages 72 — good condition. Residents in both areas pay the same city tax rates.",
        },
        {
          label: "School Resource Pattern",
          text:
            "Mae C. Jemison High serves northwest Huntsville and shows 44% AP participation, but very low math proficiency. Columbia High has 17% AP participation and similar under-resource patterns tied more to demographics than simple geography.",
        },
        {
          label: "Policing Pattern",
          text:
            "North Huntsville residents experience much heavier police contact per capita than south Huntsville residents, while the city has not required a public patrol equity analysis.",
        },
        {
          label: "Spending Pattern",
          text:
            "About 68% of capital road improvement spending over the past decade went to south Huntsville and newly annexed areas. Mayor Battle received major support from real estate developers who benefit from those growth patterns.",
        },
      ],

      powerMap: [
        "Mayor Battle appoints the Industrial Development Board.",
        "The IDB approved $127M+ in tax abatements without an equity requirement.",
        "The city has not commissioned an independent equity audit.",
      ],

      residentImpact: [
        "North Huntsville residents drive on worse roads while paying the same city taxes.",
        "Students in less-resourced schools face weaker outcomes and fewer advantages.",
        "Heavier police contact creates more fines, stops, and system involvement.",
      ],

      whoBenefits: [
        "Developers and landowners in favored growth corridors.",
        "Politicians protected by weak transparency and no equity audit.",
      ],

      whatIsMissing: [
        "No independent equity audit of city spending.",
        "No public patrol equity analysis by neighborhood.",
        "No weighted school funding formula clearly correcting for need.",
      ],

      actions: [
        "Request road spending and PCI data by district.",
        "Ask City Council why north Huntsville road quality has lagged for years.",
        "Ask Huntsville City Schools for per-school funding and staffing comparisons.",
      ],
    },

    roads: {
      label: "Roads",
      aiPrompt:
        "Use only the Roads facts below. Explain the road equity issue in plain language and why it matters to north Huntsville residents. Do not add facts not provided.",

      coreFacts: [
        {
          label: "Documented Gap",
          text:
            "North Huntsville roads average PCI 41. South Huntsville roads average PCI 72. Same city, same taxes, very different road condition.",
        },
        {
          label: "Budget Direction",
          text:
            "Most capital road improvement spending over the past decade went to south Huntsville and annexed areas instead of older north Huntsville neighborhoods.",
        },
        {
          label: "Missing Oversight",
          text:
            "The city has never commissioned an independent equity audit of road maintenance spending by district.",
        },
      ],

      actions: [
        "Request the full PCI database by district.",
        "Ask for pothole response times by neighborhood.",
        "Ask for road spending totals by council district.",
      ],
    },

    schools: {
      label: "Schools",
      aiPrompt:
        "Use only the Schools facts below. Explain the education equity pattern in plain language. Focus on why residents should care and what remains unanswered.",

      coreFacts: [
        {
          label: "Jemison Context",
          text:
            "J.O. Johnson High closed in 2016 and was demolished in 2021. Mae C. Jemison High now serves that community.",
        },
        {
          label: "AP Participation",
          text:
            "Jemison reports stronger AP participation than some other under-resourced schools, but math proficiency remains very low.",
        },
        {
          label: "Structural Issue",
          text:
            "Huntsville City Schools has not adopted a clearly weighted funding approach that sends more resources where student need is higher.",
        },
      ],

      actions: [
        "Ask HCS for per-school spending data.",
        "Ask for teacher turnover by school.",
        "Ask for advanced-course access by school.",
      ],
    },

    policing: {
      label: "Policing",
      aiPrompt:
        "Use only the Policing facts below. Explain the policing pattern simply and say what residents should ask city leaders next.",

      coreFacts: [
        {
          label: "Contact Disparity",
          text:
            "North Huntsville residents experience significantly more police contact per capita than south Huntsville residents.",
        },
        {
          label: "No Audit",
          text:
            "The city has not required a public patrol equity analysis.",
        },
        {
          label: "Oversight Gap",
          text:
            "There has been no civilian police review board established during Battle’s time in office.",
        },
      ],

      actions: [
        "Request patrol deployment data by neighborhood.",
        "Ask for stop data and complaint data by district.",
        "Ask why no public patrol equity review exists.",
      ],
    },
  },
};
