const data = {
  id: "information_warfare",
  title: "Information Warfare",
  intro: "This module tracks how false claims, manipulated narratives, and public confusion help officials and institutions avoid accountability while harming ordinary residents.",
  tabs: [
    {
      id: "overview",
      label: "Overview",
      stats: [
        ["False Benefit Claims", "Contradict law", "Federal statutes already bar undocumented access to many benefits", "#dc2626"],
        ["Insurance PACs", "$310k", "Donor ties linked to false public narratives", "#dc2626"],
        ["RealPage DOJ Suit", "Active", "Algorithmic pricing and rent coordination claims", "#dc2626"],
        ["Investigative Capacity", "Declining", "Alabama journalism cuts weaken accountability", "#ea580c"]
      ],
      issues: [],
              meetings: [],
              paths: [
                { destination: "Media tip / public accountability route", type: "Media / oversight", why: "Push verified facts and request stronger scrutiny." }
              ],
              actions: [
                { label: "Contact Media with a Tip", kind: "primary", template: { email: "", subject: "Request for coverage on misinformation and policy harm", body: "I am asking your newsroom to investigate misleading public claims that are being used to redirect attention away from the real policy and donor interests affecting Madison County residents." } }
              ]
            }
          }
        }
      ],
      trail: [{ label: "Information warfare data", text: "Existing disinformation source data" }]
    }
  ]
};
export default data;