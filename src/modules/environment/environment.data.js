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
      issues: [],
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