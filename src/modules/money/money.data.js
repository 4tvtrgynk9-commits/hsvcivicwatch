const data = {
  id: "money",
  title: "Follow the Money",
  intro: "Every policy decision in this app has a financial beneficiary. This module maps the donor relationships, executive compensation packages, government contracts, and political connections that explain why Huntsville's institutions make the decisions they make.",
  tabs: [
    {
      id: "connections_map",
      label: "Connections Map",
      isConnectionsMap: true,
      issues: [],
      trail: []
    },
    {
      id: "donor_profiles",
      label: "Donor Profiles",
      stats: [
        ["Top PAC Donor Sector", "Insurance & Healthcare", "Insurance and healthcare industry PACs are among the top donors to Alabama legislators", "#dc2626"],
        ["BizPAC Total Giving", "$380k+", "BizPAC contributions to Huntsville-area candidates documented in recent cycles", "#ea580c"],
        ["Donor-to-Vote Correlation", "Documented", "Legislators who receive industry donations vote against oversight and regulation at measurable rates", "#dc2626"],
        ["Dark Money", "Active", "Alabama has limited disclosure requirements for politically active nonprofits", "#7c3aed"]
      ],
      issues: [],
      trail: []
    },
    {
      id: "exec_compensation",
      label: "Executive Compensation",
      stats: [
        ["HHHS CEO Pay", "$4.2M/yr", "David Spillers total compensation — nonprofit system paying zero property or income tax", "#dc2626"],
        ["Huntsville Utilities CEO", "Not disclosed", "HU executive compensation is not publicly reported as a city-owned utility", "#ea580c"],
        ["TVA CEO Pay", "$8.1M/yr", "TVA CEO compensation — federal agency with no elected oversight board", "#dc2626"],
        ["Median Worker Wage", "$20.18/hr", "MIT living wage for a single adult in Madison County — below most major employer starting wages", "#7c3aed"]
      ],
      issues: [],
      trail: [
        { label: "HHHS IRS Form 990", text: "Source for David Spillers compensation figures" },
        { label: "TVA Annual Report", text: "Source for TVA CEO compensation" }
      ]
    },
    {
      id: "contracts_vendors",
      label: "Contracts & Vendors",
      stats: [
        ["Sole-Source Contracts", "Active", "HHHS and city agencies use sole-source contracts that bypass competitive bidding", "#dc2626"],
        ["Flock Safety Contract", "Recurring", "HPD pays recurring taxpayer fees to Flock Safety for license plate reader infrastructure", "#ea580c"],
        ["Securus Technologies", "Monopoly", "Madison County Jail phone contract with Securus extracts commissions on family calls", "#dc2626"],
        ["IDB Abatements", "Untracked", "No consolidated public accounting of Industrial Development Board tax abatements", "#7c3aed"]
      ],
      issues: [],
      trail: []
    }
  ]
};
export default data;
