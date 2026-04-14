const data = {
  id: "voting_rights",
  title: "The Ballot & Your Access",
  intro: "Voting is the most direct form of civic power. This module documents voter registration barriers, polling access gaps, and how to find your elected representatives at every level of government.",
  tabs: [
    {
      id: "overview",
      label: "Overview",
      stats: [
        ["Madison County Registered Voters", "~240,000", "Estimated active registered voters in Madison County", "#3182ce"],
        ["AL Voter ID Requirement", "Strict", "Alabama requires photo ID to vote — one of the strictest laws in the nation", "#dc2626"],
        ["Polling Location Changes", "Ongoing", "Madison County has closed and consolidated polling locations in recent election cycles", "#ea580c"],
        ["Felony Disenfranchisement", "Active", "Alabama permanently strips voting rights from certain felony convictions", "#7c3aed"]
      ],
      issues: [],
      trail: []
    },
    {
      id: "voter_registration",
      label: "Voter Registration",
      stats: [
        ["Online Registration", "Available", "Alabama offers online voter registration at alabamavotes.gov", "#1e8449"],
        ["Registration Deadline", "15 days", "Must register 15 days before an election in Alabama", "#ea580c"],
        ["Purge Rate", "High", "Alabama has one of the highest voter roll purge rates in the Southeast", "#dc2626"],
        ["Same-Day Registration", "Not available", "Alabama does not allow same-day voter registration", "#7c3aed"]
      ],
      issues: [],
      trail: [
        { label: "Alabama Secretary of State — Voter Registration", text: "Official source for registration requirements and deadlines" }
      ]
    },
    {
      id: "polling_access",
      label: "Polling & Access",
      stats: [
        ["Madison County Polling Sites", "Active", "Number of active polling locations varies by election cycle", "#3182ce"],
        ["Early Voting", "Not available", "Alabama does not offer early in-person voting", "#dc2626"],
        ["Absentee Voting", "Limited", "Alabama requires an excuse to vote absentee", "#ea580c"],
        ["ADA Compliance", "Required", "All polling locations are required to be ADA accessible", "#1e8449"]
      ],
      issues: [],
      trail: [
        { label: "Madison County Election Commission", text: "Source for local polling location data" }
      ]
    },
    {
      id: "your_reps",
      label: "Your Representatives",
      stats: [
        ["City Council Districts", "5", "Huntsville City Council has 5 district seats plus an at-large president", "#3182ce"],
        ["State House Districts", "Multiple", "Madison County is represented by multiple Alabama House districts", "#3182ce"],
        ["Congressional District", "AL-05", "Huntsville is in Alabama's 5th Congressional District", "#3182ce"],
        ["School Board Seats", "Elected", "Huntsville City Schools and Madison County Schools boards are elected positions", "#1e8449"]
      ],
      issues: [],
      trail: [
        { label: "Alabama Legislature — Find Your Representatives", text: "Official source for state legislative district lookup" }
      ]
    }
  ]
};
export default data;
