const data = {
  id: "landuse",
  title: "Land: Annexation, Zoning, & Development",
  intro: "This module tracks who gets annexed, who gets incentives, how development decisions are made, and who benefits from growth patterns in Madison County.",
  tabs: [
    {
      id: "overview",
      label: "Overview",
      visual: { type: "placeholder", title: "Development map placeholder", description: "A development / annexation / incentive visual can live here in the rebuilt site." },
      issues: [],
              meetings: [
                { title: "Planning / council meetings", why: "Zoning, annexation, and development decisions surface here." }
              ],
              paths: [
                { destination: "Public comment and records route", type: "Comment / records request", why: "Ask for supporting records behind development decisions." }
              ],
              actions: [
                { label: "Request Development Records", kind: "primary", template: { email: "", subject: "Request for annexation and development records", body: "I am requesting public records related to annexation, zoning, development incentives, and the public review process for projects affecting Madison County residents." } }
              ]
            }
          }
        }
      ],
      trail: [{ label: "Land-use data", text: "Existing annexation/development source data" }]
    }
  ]
};
export default data;