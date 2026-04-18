const HUNTSVILLE_ELECTED_URL = "https://www.huntsvilleal.gov/government/voting-elections/elected-officials/";
const HUNTSVILLE_COUNCIL_URL = "https://www.huntsvilleal.gov/government/city-council/city-council-us/";
const MADISON_COUNTY_ELECTED_URL = "https://www.madisoncountyal.gov/government/county-elected-officials";
const MADISON_PROBATE_URL = "https://www.madisoncountyal.gov/departments/probate-judge";
const MADISON_TAX_ASSESSOR_URL = "https://www.madisoncountyal.gov/services/taxa/";
const MADISON_TAX_COLLECTOR_URL = "https://www.madisoncountyal.gov/departments/tax-collector";
const MADISON_SHERIFF_URL = "https://www.madisoncountyal.gov/government/county-elected-officials";
const GOVERNOR_URL = "https://governor.alabama.gov/";
const GOVERNOR_CONTACT_URL = "https://governor.alabama.gov/contact/";
const AG_URL = "https://www.alabamaag.gov/About/";
const BRITT_URL = "https://www.britt.senate.gov/about/";
const BRITT_CONTACT_URL = "https://www.britt.senate.gov/contact/";
const TUBERVILLE_URL = "https://www.tuberville.senate.gov/";
const TUBERVILLE_CONTACT_URL = "https://www.tuberville.senate.gov/contact/";
const STRONG_URL = "https://strong.house.gov/about";
const STRONG_CONTACT_URL = "https://strong.house.gov/contact";
const FCPA_URL = "https://fcpa.alabama.gov/";
const FEC_URL = "https://www.fec.gov/data/";

const defaultDecoderActions = ({ name, phone, email, address, website, financeUrl }) => ({
  intro: "Use this profile as a working shell. Fill in the timeline, donor records, vote record, and contact history as new reporting comes in.",
  contacts: [
    {
      name,
      role: "Office contact",
      phone: phone || "",
      email: email || "",
      address: address || "",
      officialLink: website || "",
    },
  ],
  meetings: [],
  paths: financeUrl
    ? [
        {
          destination: "Campaign finance search",
          type: "Research",
          why: "Pull the official contribution history before publishing donor claims.",
          link: financeUrl,
        },
      ]
    : [],
  actions: [
    financeUrl
      ? {
          label: "Search finance records",
          kind: "gold",
          href: financeUrl,
        }
      : null,
    website
      ? {
          label: "Official website",
          kind: "blue",
          href: website,
        }
      : null,
  ].filter(Boolean),
});

function createProfile({
  id,
  scopes,
  kind = "official",
  featured = false,
  name,
  office,
  geography,
  party = "",
  inOfficeSince = "",
  termEnds = "Under research",
  nextElection = "Under research",
  jurisdiction = "",
  residency = "Under research",
  salary = "Under research",
  wealthBuild = "Public salary / public office",
  website = "",
  financeUrl = FCPA_URL,
  phone = "",
  email = "",
  address = "",
  officeHours = "Under research",
  summary = "",
  timeline = [],
  onRecord = [],
  donors = null,
  votes = [],
  headshotUrl = "",
  quickFacts = [],
  decoder = null,
}) {
  const roleLabel = kind === "judge" ? "Judge" : kind === "candidate" ? "Candidate tracker" : "Elected official";
  const statusLine =
    kind === "candidate"
      ? inOfficeSince || "Race shell ready for candidate research"
      : inOfficeSince
      ? `In office since ${inOfficeSince}`
      : "Current term in progress";

  return {
    id,
    scopes,
    kind,
    featured,
    name,
    office,
    geography,
    party,
    roleLabel,
    headshotUrl,
    statusLine,
    termEnds,
    metrics: [
      { label: "Net worth now", value: "Under research" },
      { label: "Before office", value: "Under research" },
      { label: "How they built it", value: wealthBuild || "Under research" },
      { label: kind === "candidate" ? "Declared finance" : "Public salary", value: salary || "Under research" },
    ],
    quickFacts: [
      { label: "Residency", value: residency || "Under research" },
      { label: "Jurisdiction", value: jurisdiction || geography || "Under research" },
      { label: "Next election", value: nextElection || "Under research" },
      { label: "Term ends", value: termEnds || "Under research" },
      ...quickFacts,
    ],
    profile: {
      summary:
        summary ||
        "This profile is a reporting shell for the office, donor network, public record, and timeline that shape power over Huntsville and Madison County.",
      timeline:
        timeline.length > 0
          ? timeline
          : [
              {
                date: "Research pending",
                title: "Build this timeline",
                detail: "Add filing dates, election wins, key appointments, major controversies, and major policy milestones here.",
              },
            ],
    },
    onRecord:
      onRecord.length > 0
        ? onRecord
        : [
            {
              title: "On-record profile shell",
              body: "Add direct quotes, public statements, debate clips, press releases, and sworn testimony here.",
              sourceLabel: "Primary source research pending",
            },
          ],
    donors:
      donors ||
      {
        summary:
          kind === "candidate"
            ? "Track committee filings, major donors, PAC support, self-funding, and outside spending here."
            : "Track campaign finance, PAC support, bundlers, and recurring donor networks here.",
        recordsLabel: financeUrl === FEC_URL ? "Federal record" : "Public record",
        donors: [
          { name: "Under research", amount: "Under research", note: "Pull official filings before publishing donor conclusions." },
        ],
        links: financeUrl
          ? [{ label: financeUrl === FEC_URL ? "Search FEC records" : "Search AL campaign finance", href: financeUrl }]
          : [],
      },
    votes,
    contact: {
      phone,
      email,
      address,
      officeHours,
      website,
      financeUrl,
    },
    decoder:
      decoder || {
        whatsHappening:
          kind === "candidate"
            ? `${name} is in the tracker because this race can shift who controls money, appointments, or enforcement power over Huntsville and Madison County.`
            : `${name} holds an office that directly affects budgets, enforcement, records, appointments, or election access tied to Huntsville and Madison County.`,
        connections:
          "Use this profile to connect public statements, campaign money, endorsements, appointments, and policy outcomes in one place.",
        whoBenefits:
          "Fill in named beneficiaries after reviewing campaign finance, contract records, endorsements, and major office actions.",
        impact:
          "Residents feel these offices through taxes, courts, schools, zoning, policing, and access to public records or public services.",
        actions: defaultDecoderActions({ name, phone, email, address, website, financeUrl }),
      },
  };
}

const cityCouncilMembers = [
  ["michelle-watkins", "Michelle Watkins", "District 1 Council Member", "2024", "2028", "August 2028 municipal"],
  ["david-little", "David Little", "District 2 Council Member", "Under research", "2026", "August 2026 municipal"],
  ["jennie-robinson", "Jennie Robinson", "District 3 Council President", "Under research", "2026", "August 2026 municipal"],
  ["bill-kling", "Bill Kling, Jr.", "District 4 Council Member", "Under research", "2026", "August 2026 municipal"],
  ["john-meredith", "John Meredith", "District 5 Council Member", "2024", "2028", "August 2028 municipal"],
].map(([id, name, office, inOfficeSince, termEnds, nextElection]) =>
  createProfile({
    id,
    scopes: ["overview", "local"],
    featured: true,
    name,
    office,
    geography: "Huntsville City Council",
    party: "Nonpartisan",
    inOfficeSince,
    termEnds,
    nextElection,
    jurisdiction: "Huntsville district seat",
    residency: "Huntsville district",
    salary: "Under research",
    wealthBuild: "Public office / outside employment under research",
    website: HUNTSVILLE_COUNCIL_URL,
    financeUrl: FCPA_URL,
    phone: "256-427-5011",
    email: "HsvCityCouncil@HuntsvilleAL.gov",
    address: "City Council Office, 6th Floor, 305 Fountain Circle, Huntsville, AL 35801",
    officeHours: "Monday-Friday, 8 a.m.-5 p.m.",
    summary:
      "City Council members vote on zoning, contracts, incentives, police and infrastructure budgets, and appointments that shape daily life across Huntsville.",
    timeline: [
      {
        date: "Current term",
        title: "Serving on Huntsville City Council",
        detail: "Track committee assignments, development votes, incentive packages, and budget priorities here.",
      },
    ],
    onRecord: [
      {
        title: "Council record",
        body: "Pull town hall remarks, council meeting statements, newsletters, and social media posts into one chronology.",
        sourceLabel: "Huntsville City Council records",
      },
    ],
    votes: [
      {
        title: "Council vote tracker",
        date: "Rolling",
        position: "Under research",
        summary: "Track votes on development, policing, budget amendments, board appointments, and records access here.",
        sourceLabel: "Council agendas and minutes",
      },
    ],
  })
);

const schoolBoardMembers = [
  ["chaundra-jones", "Chaundra Jones", "District 1 Board of Education", "2024", "2028", "August 2028 municipal"],
  ["holly-mccarty", "Holly McCarty", "District 2 Board of Education", "Under research", "2026", "August 2026 municipal"],
  ["andrea-alvarez", "Andrea Alvarez", "District 3 Board of Education", "Under research", "2026", "August 2026 municipal"],
  ["ryan-renaud", "Ryan Renaud", "District 4 Board of Education", "Under research", "2026", "August 2026 municipal"],
  ["carlos-matthews", "Carlos Matthews", "District 5 Board of Education", "2024", "2028", "August 2028 municipal"],
].map(([id, name, office, inOfficeSince, termEnds, nextElection]) =>
  createProfile({
    id,
    scopes: ["overview", "local"],
    name,
    office,
    geography: "Huntsville City Board of Education",
    party: "Nonpartisan",
    inOfficeSince,
    termEnds,
    nextElection,
    jurisdiction: "Huntsville City Schools district",
    residency: "Huntsville district",
    salary: "Under research",
    wealthBuild: "Board service / outside employment under research",
    website: HUNTSVILLE_ELECTED_URL,
    financeUrl: FCPA_URL,
    summary:
      "School board races often attract less scrutiny than city races, but these officials shape discipline, facilities, superintendent oversight, and a large public budget.",
    timeline: [
      {
        date: "Current term",
        title: "Board service",
        detail: "Track superintendent votes, school closures, discipline policies, and budget actions here.",
      },
    ],
    onRecord: [
      {
        title: "Board statements",
        body: "Add meeting remarks, candidate questionnaires, and statements on curriculum, discipline, and equity issues here.",
        sourceLabel: "School board agenda and meeting records",
      },
    ],
    votes: [
      {
        title: "Board vote tracker",
        date: "Rolling",
        position: "Under research",
        summary: "Track superintendent contracts, rezoning, facilities spending, and policy revisions here.",
        sourceLabel: "Board agenda packets and minutes",
      },
    ],
  })
);

const countyCommissioners = [
  ["mac-mccutcheon", "Mac McCutcheon", "Commission Chairman (At-Large)", true],
  ["tom-brandon", "Tom Brandon", "Commissioner District 1", false],
  ["steve-haraway", "Steve Haraway", "Commissioner District 2", false],
  ["craig-hill", "Craig Hill", "Commissioner District 3", false],
  ["phil-vandiver", "Phil Vandiver", "Commissioner District 4", false],
  ["phil-riddick", "Phil Riddick", "Commissioner District 5", false],
  ["violet-edwards", "Violet Edwards", "Commissioner District 6", false],
].map(([id, name, office, featured]) =>
  createProfile({
    id,
    scopes: ["overview", "county"],
    featured,
    name,
    office,
    geography: "Madison County Commission",
    inOfficeSince: "Under research",
    termEnds: "Under research",
    nextElection: "Under research",
    jurisdiction: office.includes("At-Large") ? "Madison County" : office.replace("Commissioner ", ""),
    residency: "Madison County",
    salary: "Under research",
    wealthBuild: "County office / outside employment under research",
    website: MADISON_COUNTY_ELECTED_URL,
    financeUrl: FCPA_URL,
    phone: "256-532-3300",
    address: "Madison County Courthouse, 100 North Side Square, Huntsville, AL 35801",
    officeHours: "Monday-Friday, 8:30 a.m.-5 p.m.",
    summary:
      "The County Commission controls county budget priorities, infrastructure, jail spending support, and local administrative functions that affect Huntsville and surrounding communities.",
    timeline: [
      {
        date: "Current term",
        title: "County budget and infrastructure oversight",
        detail: "Track commission votes on road work, county facilities, jail support, and public services here.",
      },
    ],
    onRecord: [
      {
        title: "Commission record",
        body: "Collect meeting statements, budget speeches, and public comments tied to county spending and county administration.",
        sourceLabel: "Madison County Commission records",
      },
    ],
    votes: [
      {
        title: "Commission vote tracker",
        date: "Rolling",
        position: "Under research",
        summary: "Track county appropriations, land use, jail funding support, and major contracts here.",
        sourceLabel: "Madison County Commission agendas and minutes",
      },
    ],
  })
);

const countywideOfficials = [
  createProfile({
    id: "kevin-turner",
    scopes: ["overview", "county"],
    kind: "official",
    featured: true,
    name: "Kevin Turner",
    office: "Madison County Sheriff",
    geography: "Madison County",
    inOfficeSince: "2019",
    termEnds: "Under research",
    nextElection: "Under research",
    jurisdiction: "Countywide law enforcement and jail oversight",
    residency: "Madison County",
    salary: "~$95,000/yr",
    wealthBuild: "Career law enforcement / public salary",
    website: MADISON_SHERIFF_URL,
    financeUrl: FCPA_URL,
    phone: "256-532-3412",
    address: "Madison County Sheriff's Office, 100 North Side Square, Huntsville, AL 35801",
    officeHours: "Under research",
    summary:
      "The sheriff controls countywide enforcement priorities and major jail operations that shape detention conditions, contracts, and pretrial realities in Madison County.",
    timeline: [
      {
        date: "2019",
        title: "Took office as sheriff",
        detail: "Track jail contract decisions, public safety messaging, and enforcement priorities from this point forward.",
      },
    ],
    onRecord: [
      {
        title: "Sheriff statements",
        body: "Use press conferences, county commission appearances, and policy memos to track how public messaging compares with jail and enforcement outcomes.",
        sourceLabel: "Sheriff's Office public record",
      },
    ],
    votes: [],
  }),
  createProfile({
    id: "frank-barger",
    scopes: ["overview", "county", "judicial"],
    kind: "judge",
    featured: true,
    name: "Frank Barger",
    office: "Madison County Probate Judge",
    geography: "Madison County",
    inOfficeSince: "2019",
    termEnds: "Under research",
    nextElection: "Under research",
    jurisdiction: "Probate court, elections administration, land and estate records",
    residency: "Madison County",
    salary: "Under research",
    wealthBuild: "Court administration / public salary",
    website: MADISON_PROBATE_URL,
    financeUrl: FCPA_URL,
    phone: "256-532-3330",
    email: "probate@madisoncountyal.gov",
    address: "Madison County Service Center, 1918 North Memorial Parkway, Huntsville, AL 35801",
    officeHours: "Monday-Friday, 8:30 a.m.-4:30 p.m.",
    summary:
      "The Probate Judge manages elections administration, probate matters, and key records functions that directly affect voting access and public accountability.",
    timeline: [
      {
        date: "2019",
        title: "Began service as Probate Judge",
        detail: "Track election administration decisions, probate modernization claims, and records management changes from 2019 onward.",
      },
    ],
    onRecord: [
      {
        title: "Election administration record",
        body: "Track statements about ballot access, poll management, absentee procedures, and records modernization here.",
        sourceLabel: "Madison County Probate Court",
      },
    ],
    votes: [],
  }),
  createProfile({
    id: "cliff-mann",
    scopes: ["overview", "county"],
    featured: true,
    name: "Cliff Mann",
    office: "Madison County Tax Assessor",
    geography: "Madison County",
    inOfficeSince: "2015",
    termEnds: "Under research",
    nextElection: "Under research",
    jurisdiction: "County property valuation and assessment",
    residency: "Madison County",
    salary: "Under research",
    wealthBuild: "County office / public salary",
    website: MADISON_TAX_ASSESSOR_URL,
    financeUrl: FCPA_URL,
    summary:
      "The Tax Assessor affects how property values are set for taxation, which shapes tax burden and appeals across Madison County.",
    timeline: [
      {
        date: "2015",
        title: "Began serving as Tax Assessor",
        detail: "Track valuation changes, Board of Equalization disputes, and assessment policy shifts here.",
      },
    ],
    votes: [],
  }),
  createProfile({
    id: "valerie-miles",
    scopes: ["overview", "county"],
    featured: true,
    name: "Valerie Miles",
    office: "Madison County Tax Collector",
    geography: "Madison County",
    inOfficeSince: "Under research",
    termEnds: "Under research",
    nextElection: "Under research",
    jurisdiction: "County property tax collection",
    residency: "Madison County",
    salary: "Under research",
    wealthBuild: "County office / public salary",
    website: MADISON_TAX_COLLECTOR_URL,
    financeUrl: FCPA_URL,
    phone: "256-532-3370",
    summary:
      "The Tax Collector manages the public-facing side of tax collection, deadlines, and payment systems that affect every property owner in the county.",
    timeline: [
      {
        date: "Current term",
        title: "County tax collection oversight",
        detail: "Track delinquency policy, payment options, and tax collection administration here.",
      },
    ],
    votes: [],
  }),
  createProfile({
    id: "rob-broussard",
    scopes: ["overview", "county", "judicial"],
    featured: false,
    name: "Rob Broussard",
    office: "District Attorney",
    geography: "Madison County",
    inOfficeSince: "Under research",
    termEnds: "Under research",
    nextElection: "Under research",
    jurisdiction: "Countywide prosecution",
    residency: "Madison County",
    salary: "Under research",
    wealthBuild: "Public prosecution / public salary",
    website: MADISON_COUNTY_ELECTED_URL,
    financeUrl: FCPA_URL,
    summary:
      "The District Attorney shapes charging decisions, plea leverage, diversion access, and courtroom pressure across Madison County.",
    votes: [],
  }),
  createProfile({
    id: "debra-kizer",
    scopes: ["overview", "county", "judicial"],
    featured: false,
    name: "Debra Kizer",
    office: "Circuit Clerk",
    geography: "Madison County",
    inOfficeSince: "Under research",
    termEnds: "Under research",
    nextElection: "Under research",
    jurisdiction: "Circuit court administration and records",
    residency: "Madison County",
    salary: "Under research",
    wealthBuild: "Court administration / public salary",
    website: MADISON_COUNTY_ELECTED_URL,
    financeUrl: FCPA_URL,
    summary:
      "The Circuit Clerk office affects access to filings, court records, and procedural transparency in the county court system.",
    votes: [],
  }),
  createProfile({
    id: "tyler-berryhill",
    scopes: ["overview", "county"],
    featured: false,
    name: "Tyler H. Berryhill",
    office: "Coroner",
    geography: "Madison County",
    inOfficeSince: "Under research",
    termEnds: "Under research",
    nextElection: "Under research",
    jurisdiction: "Death investigation and reporting",
    residency: "Madison County",
    salary: "Under research",
    wealthBuild: "Public office / outside practice under research",
    website: MADISON_COUNTY_ELECTED_URL,
    financeUrl: FCPA_URL,
    summary:
      "The coroner's office affects death investigations, public transparency, and records connected to jail deaths and other public accountability cases.",
    votes: [],
  }),
  createProfile({
    id: "mark-craig",
    scopes: ["overview", "county"],
    featured: false,
    name: "Mark Craig",
    office: "License Director",
    geography: "Madison County",
    inOfficeSince: "Under research",
    termEnds: "Under research",
    nextElection: "Under research",
    jurisdiction: "County licensing administration",
    residency: "Madison County",
    salary: "Under research",
    wealthBuild: "Public office / public salary",
    website: MADISON_COUNTY_ELECTED_URL,
    financeUrl: FCPA_URL,
    summary:
      "The License Director handles motor vehicle and license administration that residents encounter regularly but rarely track as an elected office.",
    votes: [],
  }),
];

const stateProfiles = [
  createProfile({
    id: "kay-ivey",
    scopes: ["overview", "state"],
    featured: true,
    name: "Kay Ivey",
    office: "Governor of Alabama",
    geography: "Statewide",
    party: "Republican",
    inOfficeSince: "2017",
    termEnds: "January 2027",
    nextElection: "November 3, 2026",
    jurisdiction: "State budget, appointments, corrections, roads, education policy",
    residency: "Alabama",
    salary: "Under research",
    wealthBuild: "State office / prior statewide offices",
    website: GOVERNOR_URL,
    financeUrl: FCPA_URL,
    phone: "334-242-7100",
    address: "State Capitol, 600 Dexter Avenue, Montgomery, AL 36130",
    officeHours: "Under research",
    summary:
      "The governor shapes statewide budgets, agency leadership, corrections policy, and appointments that directly affect Huntsville and Madison County.",
    timeline: [
      {
        date: "2017",
        title: "Sworn in as governor",
        detail: "Track budgets, appointments, corrections policy, and statewide economic-development decisions from 2017 onward.",
      },
      {
        date: "2022",
        title: "Reelected statewide",
        detail: "Track the second-term agenda and how it affects Huntsville-area institutions and funding.",
      },
    ],
    onRecord: [
      {
        title: "State of the State / public remarks",
        body: "Compare statewide messaging on education, prisons, roads, and economic development with Huntsville-area outcomes.",
        sourceLabel: "Governor's Office public record",
      },
    ],
    votes: [],
  }),
  createProfile({
    id: "steve-marshall",
    scopes: ["overview", "state", "judicial"],
    featured: true,
    name: "Steve Marshall",
    office: "Attorney General of Alabama",
    geography: "Statewide",
    party: "Republican",
    inOfficeSince: "2017",
    termEnds: "Under research",
    nextElection: "Under research",
    jurisdiction: "State legal enforcement, litigation, criminal justice policy",
    residency: "Alabama",
    salary: "Under research",
    wealthBuild: "Public prosecution / statewide office",
    website: AG_URL,
    financeUrl: FCPA_URL,
    address: "501 Washington Avenue, Montgomery, AL 36104",
    summary:
      "The attorney general influences statewide criminal justice posture, legal challenges, and enforcement priorities that ripple into North Alabama.",
    timeline: [
      {
        date: "2017",
        title: "Became attorney general",
        detail: "Track statewide litigation, criminal justice rhetoric, and interventions that affect Huntsville and Madison County.",
      },
    ],
    votes: [],
  }),
];

const federalProfiles = [
  createProfile({
    id: "katie-britt",
    scopes: ["overview", "federal"],
    featured: true,
    name: "Katie Britt",
    office: "U.S. Senator",
    geography: "Alabama",
    party: "Republican",
    inOfficeSince: "2023",
    termEnds: "2029",
    nextElection: "November 2028",
    jurisdiction: "Federal appropriations, judiciary, banking, national policy",
    residency: "Alabama",
    salary: "$174,000/yr",
    wealthBuild: "Law / business association leadership / federal office",
    website: BRITT_URL,
    financeUrl: FEC_URL,
    phone: "256-429-3450",
    address: "660 Gallatin Street SW, Suite 1400, Huntsville, AL 35801",
    officeHours: "Under research",
    summary:
      "A U.S. Senator has leverage over federal spending, confirmations, and policy that affect Redstone, research funding, housing, and infrastructure tied to Huntsville.",
    timeline: [
      {
        date: "2023",
        title: "Sworn into the U.S. Senate",
        detail: "Track federal appropriations requests, committee work, and public messaging tied to North Alabama priorities.",
      },
    ],
    onRecord: [
      {
        title: "Committee and district messaging",
        body: "Track appropriations claims, local project credit, and public statements that tie federal policy to Huntsville-area impacts.",
        sourceLabel: "Senate office public record",
      },
    ],
    votes: [
      {
        title: "U.S. Senate vote record",
        date: "Rolling",
        position: "Under research",
        summary: "Track major votes on budgets, confirmations, social spending, military funding, and civil rights here.",
        sourceLabel: "U.S. Senate roll call record",
      },
    ],
    contact: {
      phone: "256-429-3450",
      email: "",
      address: "660 Gallatin Street SW, Suite 1400, Huntsville, AL 35801",
      officeHours: "Under research",
      website: BRITT_CONTACT_URL,
      financeUrl: FEC_URL,
    },
  }),
  createProfile({
    id: "tommy-tuberville",
    scopes: ["overview", "federal"],
    featured: true,
    name: "Tommy Tuberville",
    office: "U.S. Senator",
    geography: "Alabama",
    party: "Republican",
    inOfficeSince: "2021",
    termEnds: "2027",
    nextElection: "Not on ballot for Senate in 2026 if still holding seat",
    jurisdiction: "Federal appropriations, military, agriculture, national policy",
    residency: "Alabama",
    salary: "$174,000/yr",
    wealthBuild: "Coaching / media / federal office",
    website: TUBERVILLE_URL,
    financeUrl: FEC_URL,
    phone: "256-692-7500",
    address: "2101 Clinton Avenue West, Suite 300, Huntsville, AL 35805",
    officeHours: "Under research",
    summary:
      "A U.S. Senator influences military spending, federal appointments, and national policy choices that directly matter to Huntsville's defense-driven economy.",
    timeline: [
      {
        date: "2021",
        title: "Sworn into the U.S. Senate",
        detail: "Track statements on military policy, holds, federal spending, and how they affect Huntsville institutions.",
      },
    ],
    onRecord: [
      {
        title: "Federal messaging",
        body: "Track public comments, local appearances, and committee activity that directly affect Huntsville's defense and research economy.",
        sourceLabel: "Senate office public record",
      },
    ],
    votes: [
      {
        title: "U.S. Senate vote record",
        date: "Rolling",
        position: "Under research",
        summary: "Track major votes and holds on defense, appropriations, nominations, and social policy here.",
        sourceLabel: "U.S. Senate roll call record",
      },
    ],
    contact: {
      phone: "256-692-7500",
      email: "",
      address: "2101 Clinton Avenue West, Suite 300, Huntsville, AL 35805",
      officeHours: "Under research",
      website: TUBERVILLE_CONTACT_URL,
      financeUrl: FEC_URL,
    },
  }),
  createProfile({
    id: "dale-strong",
    scopes: ["overview", "federal"],
    featured: true,
    name: "Dale Strong",
    office: "U.S. Representative, AL-05",
    geography: "North Alabama / Huntsville",
    party: "Republican",
    inOfficeSince: "2023",
    termEnds: "January 2027",
    nextElection: "November 3, 2026",
    jurisdiction: "House appropriations and federal district advocacy",
    residency: "Madison County",
    salary: "$174,000/yr",
    wealthBuild: "Local government / public service / federal office",
    website: STRONG_URL,
    financeUrl: FEC_URL,
    phone: "256-551-0190",
    address: "2101 Clinton Avenue W, Suite 302, Huntsville, AL 35805",
    officeHours: "Under research",
    summary:
      "The AL-05 House seat is the most direct federal elected office for Huntsville, shaping appropriations requests and local federal advocacy.",
    timeline: [
      {
        date: "2023",
        title: "Sworn into the U.S. House",
        detail: "Track district earmarks, appropriations priorities, and claims about federal wins for North Alabama.",
      },
    ],
    onRecord: [
      {
        title: "District messaging",
        body: "Track claims about local wins, military priorities, and district development against the public funding record.",
        sourceLabel: "House office public record",
      },
    ],
    votes: [
      {
        title: "U.S. House vote record",
        date: "Rolling",
        position: "Under research",
        summary: "Track votes on appropriations, defense, labor, housing, and civil-rights related bills here.",
        sourceLabel: "U.S. House roll call record",
      },
    ],
    contact: {
      phone: "256-551-0190",
      email: "",
      address: "2101 Clinton Avenue W, Suite 302, Huntsville, AL 35805",
      officeHours: "Under research",
      website: STRONG_CONTACT_URL,
      financeUrl: FEC_URL,
    },
  }),
];

const candidateTrackers = [
  createProfile({
    id: "governor-race-2026",
    scopes: ["overview", "candidates", "state"],
    kind: "candidate",
    featured: true,
    name: "Governor's Race 2026",
    office: "Statewide candidate tracker",
    geography: "Alabama",
    inOfficeSince: "Primary and general election tracker",
    termEnds: "Election on November 3, 2026",
    nextElection: "November 3, 2026",
    jurisdiction: "State budget and appointments",
    residency: "Statewide race",
    salary: "Governor salary under research",
    wealthBuild: "Candidate wealth and donor network under research",
    website: GOVERNOR_URL,
    financeUrl: FCPA_URL,
    summary:
      "This profile is for building out the 2026 governor field, donor networks, endorsements, and public positions before the race locks in.",
    timeline: [
      {
        date: "2026 cycle",
        title: "Field formation",
        detail: "Add candidates as they file, then log donor surges, endorsements, debate moments, and runoff risks.",
      },
    ],
    votes: [],
  }),
  createProfile({
    id: "senate-race-2026",
    scopes: ["overview", "candidates", "federal"],
    kind: "candidate",
    featured: true,
    name: "U.S. Senate Race 2026",
    office: "Federal candidate tracker",
    geography: "Alabama / Huntsville impact",
    inOfficeSince: "Open-seat race shell",
    termEnds: "Election on November 3, 2026",
    nextElection: "November 3, 2026",
    jurisdiction: "Federal representation and appropriations",
    residency: "Statewide race",
    salary: "Senate salary under research",
    wealthBuild: "Campaign finance under research",
    website: FEC_URL,
    financeUrl: FEC_URL,
    summary:
      "This tracker is for the 2026 Senate race that will influence federal priorities affecting Huntsville, Redstone, and the wider metro economy.",
    timeline: [
      {
        date: "2026 cycle",
        title: "Build the field",
        detail: "Track candidate entries, donor coalitions, PAC support, and major issue pivots here.",
      },
    ],
    votes: [],
  }),
  createProfile({
    id: "huntsville-council-races-2026",
    scopes: ["overview", "candidates", "local"],
    kind: "candidate",
    featured: true,
    name: "Huntsville Council Races 2026",
    office: "Districts 2, 3, and 4 tracker",
    geography: "Huntsville",
    inOfficeSince: "Municipal race shell",
    termEnds: "Election cycle in 2026",
    nextElection: "August 2026 municipal",
    jurisdiction: "City budgeting, zoning, contracts, appointments",
    residency: "Huntsville district races",
    salary: "Council salary under research",
    wealthBuild: "Campaign finance under research",
    website: HUNTSVILLE_COUNCIL_URL,
    financeUrl: FCPA_URL,
    summary:
      "This tracker is for building individual candidate profiles in the 2026 Huntsville council races before the field is finalized.",
    timeline: [
      {
        date: "2026 cycle",
        title: "Candidate entry and filing",
        detail: "Add each candidate, then track endorsements, finance activity, and district-specific issues here.",
      },
    ],
    votes: [],
  }),
  createProfile({
    id: "school-board-races-2026",
    scopes: ["overview", "candidates", "local"],
    kind: "candidate",
    featured: false,
    name: "School Board Races 2026",
    office: "Districts 2, 3, and 4 tracker",
    geography: "Huntsville City Schools",
    inOfficeSince: "School board race shell",
    termEnds: "Election cycle in 2026",
    nextElection: "August 2026 municipal",
    jurisdiction: "District school governance and budget oversight",
    residency: "Huntsville district races",
    salary: "Board compensation under research",
    wealthBuild: "Campaign finance under research",
    website: HUNTSVILLE_ELECTED_URL,
    financeUrl: FCPA_URL,
    summary:
      "This tracker is for candidate research in lower-visibility school board races that still control major public policy and spending.",
    timeline: [
      {
        date: "2026 cycle",
        title: "Board candidate tracking",
        detail: "Add filings, endorsements, donor patterns, and public education positions here.",
      },
    ],
    votes: [],
  }),
];

const overviewLeadProfiles = [
  createProfile({
    id: "tommy-battle",
    scopes: ["overview", "local"],
    featured: true,
    name: "Tommy Battle",
    office: "Mayor of Huntsville",
    geography: "City of Huntsville",
    party: "Nonpartisan",
    inOfficeSince: "2008",
    termEnds: "2028",
    nextElection: "August 2028 municipal",
    jurisdiction: "Citywide executive budget and appointments",
    residency: "Huntsville",
    salary: "Under research",
    wealthBuild: "Business / public office",
    website: HUNTSVILLE_ELECTED_URL,
    financeUrl: FCPA_URL,
    phone: "256-427-5000",
    email: "contact@huntsvilleal.gov",
    address: "Mayor's Office, 7th Floor, 305 Fountain Circle, Huntsville, AL 35801",
    officeHours: "Monday-Friday, 8 a.m.-5 p.m.",
    summary:
      "The mayor drives Huntsville's executive agenda through appointments, contract execution, budget proposals, and citywide administrative control.",
    timeline: [
      {
        date: "2008",
        title: "Elected mayor",
        detail: "Build the long-view timeline here: elections, major development eras, public controversies, and contract waves.",
      },
      {
        date: "2024",
        title: "Won another municipal term",
        detail: "Use this point to track the current term's priorities, budget asks, and headline development decisions.",
      },
    ],
    onRecord: [
      {
        title: "Mayor's Office messaging",
        body: "Track public statements about growth, public safety, incentives, housing, and transparency against the public record.",
        sourceLabel: "Mayor's Office public record",
      },
    ],
    votes: [
      {
        title: "Executive action tracker",
        date: "Rolling",
        position: "Executive authority",
        summary: "The mayor does not cast council votes, but this tab should track budgets proposed, appointments made, and contracts advanced.",
        sourceLabel: "Mayor's Office / council packets",
      },
    ],
  }),
];

export const OFFICIAL_SCOPE_TABS = [
  { id: "overview", label: "Overview" },
  { id: "local", label: "Local" },
  { id: "county", label: "County" },
  { id: "state", label: "State" },
  { id: "federal", label: "Federal" },
  { id: "judicial", label: "Judicial" },
  { id: "candidates", label: "Candidates" },
];

export const OFFICIAL_PROFILES = [
  ...overviewLeadProfiles,
  ...cityCouncilMembers,
  ...schoolBoardMembers,
  ...countyCommissioners,
  ...countywideOfficials,
  ...stateProfiles,
  ...federalProfiles,
  ...candidateTrackers,
];
