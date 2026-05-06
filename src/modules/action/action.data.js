const data = {
  id: "action",
  title: "Take Action",
  intro: "This is not a 911 hotline. Nobody here is coming to save you. But if you've read this far and you're ready to file a complaint, request a record, tip off a reporter, or find out who your actual representative is — this is the page. It won't fix everything. It might fix something.",
  tabs: [
    {
      id: "overview",
      label: "Overview",
      visual: { type: "placeholder", title: "Action hub", description: "This page is a resource hub rather than a standard issue-analysis page." },
      issues: [
        {
          id: "hub",
          label: "Action Hub",
          title: "Find the right path and act",
          summary: "This page gathers action tools, public process pathways, and practical next steps so residents can do more than just read about the problems.",
          details: "The Take Action page should eventually centralize complaint paths, records requests, media contacts, voter registration tools, election guidance, and templates. It functions as a resource page, not just a single issue page.",
          decoder: {
            whatsHappening: "Residents often know something is wrong but do not know who to contact, how to request records, or how to file complaints effectively.",
            connections: "Oversight systems, agencies, boards, elected leaders, media, and public records laws all determine how people can push for accountability.",
            benefits: "Power stays concentrated when people are frustrated, uninformed, or unsure where to start.",
            impact: "Residents lose leverage when the tools of accountability are hard to find or hard to use.",
            actions: {
              intro: "If you want practical civic tools in one place, start here.",
              contacts: [],
              meetings: [],
              paths: [
                { destination: "Voter registration", type: "Voting tool", why: "Get registered or verify your status.", link: "https://www.sos.alabama.gov/alabama-votes/voter/register-to-vote" }
              ],
              actions: [
                { label: "Register to Vote", kind: "gold", href: "https://www.sos.alabama.gov/alabama-votes/voter/register-to-vote" }
              ]
            }
          }
        }
      ],
      trail: []
    },
    {
      id: "public_records",
      label: "Public Records",
      stats: [],
      issues: [],
      trail: []
    },
    {
      id: "complaint_paths",
      label: "Complaint Paths",
      stats: [],
      issues: [],
      trail: []
    },
    {
      id: "media_contacts",
      label: "Media Contacts",
      stats: [],
      issues: [],
      trail: []
    }
  ]
};
export default data;
