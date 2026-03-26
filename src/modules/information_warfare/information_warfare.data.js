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
      issues: [
        {
          id: "misdirection",
          label: "Narrative Control",
          title: "False stories can protect donor interests",
          summary: "When officials push false or misleading claims, public anger can be redirected away from the policies and donors actually benefiting.",
          details: "Federal law has long barred undocumented immigrants from Medicaid, SNAP, ACA marketplace plans, Medicare, and CHIP. When politicians say otherwise, that misinformation can be used to justify refusing programs like Medicaid expansion that would help Alabama residents. The public ends up blaming the wrong target while donor-backed policy choices stay protected.",
          decoder: {
            whatsHappening: "False narratives are being used to move public attention away from the policy choices and donor interests that are actually driving harm.",
            connections: "Politicians, donor networks, media ecosystems, and weakened investigative capacity all connect to how misinformation spreads and why it is useful.",
            benefits: "Officials and industries that benefit from public confusion gain political cover when people are kept focused on the wrong story.",
            impact: "Residents lose access to truth, policy accountability, and benefits or protections they might otherwise demand more forcefully.",
            actions: {
              intro: "If you care about how false narratives protect bad policy and donor power, take action below.",
              contacts: [
                { name: "State and federal elected officials", role: "Narrative and policy accountability targets" }
              ],
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