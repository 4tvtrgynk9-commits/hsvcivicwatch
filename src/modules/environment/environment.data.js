const data = {
  id: "environment",
  title: "Environment",
  intro: "This module focuses on contamination, cleanup failures, agency oversight, and who bears the cost of environmental neglect in Madison County.",
  tabs: [
    {
      id: "overview",
      label: "Overview",
      stats: [
        ["Triana Superfund", "Active", "EPA list — Redstone/Olin DDT legacy", "#dc2626"],
        ["Redstone PFAS", "Documented", "Groundwater contamination — extent undisclosed", "#dc2626"],
        ["ADEM Enforcement", "Weak", "Compared with stronger state agencies", "#ea580c"],
        ["Energy PACs", "$340k", "Donor influence tied to appointments and policy", "#dc2626"]
      ],
      issues: [
        {
          id: "pfas",
          label: "PFAS",
          title: "Forever chemicals remain a public health risk",
          summary: "PFAS contamination from military and industrial activity continues to affect North Alabama, while communities like Triana still carry the legacy burden.",
          details: "PFAS from Redstone Arsenal contaminate soil and groundwater and are linked to cancer, thyroid disease, and immune damage. Triana remains tied to a long-running contamination story connected to Redstone Arsenal and industrial pollution. Oversight and cleanup transparency remain limited.",
          decoder: {
            whatsHappening: "Residents are dealing with pollution risks that have lasted for years while the public still lacks full clarity about the extent of contamination and the pace of cleanup.",
            connections: "Military installations, industrial actors, environmental regulators, political appointees, and weak enforcement all connect to why contamination can persist without strong public accountability.",
            benefits: "Institutions that avoid stronger cleanup obligations, tighter enforcement, or deeper transparency benefit when the burden stays diffuse and the public lacks clear leverage.",
            impact: "Nearby communities, the environment, taxpayers, and residents worried about water and health absorb the cost.",
            actions: {
              intro: "If you care about contamination, cleanup transparency, and who is responsible for environmental harm, take action below.",
              contacts: [
                { name: "ADEM", role: "State environmental regulator", officialLink: "https://adem.alabama.gov" }
              ],
              meetings: [],
              paths: [
                { destination: "Environmental complaint / records route", type: "Complaint / records request", why: "Request contamination, monitoring, and cleanup information.", link: "https://adem.alabama.gov" }
              ],
              actions: [
                { label: "Request Environmental Records", kind: "primary", template: { email: "", subject: "Request for contamination and cleanup records", body: "I am requesting public records related to contamination monitoring, cleanup activity, enforcement actions, and public health notices connected to PFAS and other environmental hazards in Madison County." } }
              ]
            }
          }
        }
      ],
      trail: [{ label: "Environment data", text: "Existing environment source data" }]
    }
  ]
};
export default data;