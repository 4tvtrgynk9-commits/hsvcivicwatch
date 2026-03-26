const data = {
  id: "landuse",
  title: "Land: Annexation, Zoning, & Development",
  intro: "This module tracks who gets annexed, who gets incentives, how development decisions are made, and who benefits from growth patterns in Madison County.",
  tabs: [
    {
      id: "overview",
      label: "Overview",
      visual: { type: "placeholder", title: "Development map placeholder", description: "A development / annexation / incentive visual can live here in the rebuilt site." },
      issues: [
        {
          id: "annexation",
          label: "Annexation",
          title: "Growth decisions shape public cost and private gain",
          summary: "Annexation and development decisions are not neutral. They shift infrastructure costs, investment priorities, and who gets access to public incentives.",
          details: "This module should connect annexation, zoning, incentive use, and development pressure into one local land-use story. The goal is to show how decisions about where growth happens and where public resources go shape daily life and long-term inequality.",
          decoder: {
            whatsHappening: "Development choices determine which areas grow, which areas get prioritized, and who receives the benefit of public-facing investment.",
            connections: "Elected leaders, appointed boards, developers, tax incentive bodies, and planning processes all connect to land-use outcomes.",
            benefits: "Developers, favored corridors, and connected interests can benefit from public incentives, rezoning, and annexation patterns.",
            impact: "Taxpayers, neighborhoods facing neglect, and residents displaced or priced out can pay the cost.",
            actions: {
              intro: "If you care about who is shaping the city and how development decisions affect your neighborhood, take action below.",
              contacts: [
                { name: "City Council / planning-related offices", role: "Land-use and development oversight", officialLink: "https://www.huntsvilleal.gov/government/city-council/" }
              ],
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