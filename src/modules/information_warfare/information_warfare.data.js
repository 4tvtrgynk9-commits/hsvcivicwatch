const data = {
  id: "information_warfare",
  title: "Information Warfare",
  intro: "Public opinion is a resource. The institutions and officials documented in this app know that. This module investigates how narratives are manufactured, how disinformation campaigns protect donor interests, and who owns the media landscape in North Alabama.",
  tabs: [
    {
      id: "narrative_control",
      label: "Narrative Control",
      stats: [
        ["Official Framing", "Systematic", "Public agencies and officials routinely frame harmful decisions as public benefits", "#dc2626"],
        ["Press Release Capture", "Documented", "Local coverage frequently reprints official press releases with minimal scrutiny", "#ea580c"],
        ["Accountability Coverage", "Declining", "Investigative journalism in North Alabama has declined as newsroom budgets shrink", "#dc2626"],
        ["PR Spending", "Growing", "Government and corporate PR budgets outpace local newsroom budgets", "#7c3aed"]
      ],
      issues: [],
      trail: []
    },
    {
      id: "disinformation",
      label: "Disinformation Campaigns",
      stats: [
        ["Medicaid Misinformation", "Active", "False claims about who receives public benefits are used to justify blocking Medicaid expansion", "#dc2626"],
        ["Immigration Scapegoating", "Documented", "Anti-immigrant rhetoric is deployed to redirect anger away from donor-aligned policy failures", "#ea580c"],
        ["Crime Narrative Distortion", "Common", "Selective crime statistics are used to justify over-policing in specific neighborhoods", "#dc2626"],
        ["Source Laundering", "Active", "Think tank reports funded by industry donors are cited as independent research", "#7c3aed"]
      ],
      issues: [],
      trail: []
    },
    {
      id: "media_capture",
      label: "Media Capture",
      stats: [
        ["Local TV Ownership", "Consolidated", "North Alabama TV stations are owned by national media conglomerates", "#dc2626"],
        ["Newspaper Ownership", "Changed", "AL.com and local print outlets have undergone significant ownership and staff changes", "#ea580c"],
        ["Advertiser Influence", "Structural", "Major local advertisers include the same institutions this app investigates", "#dc2626"],
        ["Independent Media", "Limited", "North Alabama has limited independent investigative journalism infrastructure", "#7c3aed"]
      ],
      issues: [],
      trail: []
    }
  ]
};
export default data;
