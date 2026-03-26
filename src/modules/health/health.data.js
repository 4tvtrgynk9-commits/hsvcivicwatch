const data = {
  id: "health",
  title: "Healthcare & Hospital System",
  intro: "This module tracks healthcare monopoly power, staffing pressure, tax treatment, patient burden, and the political connections that shape healthcare in Madison County.",
  tabs: [
    {
      id: "overview",
      label: "Overview",
      stats: [
        ["HHHS CEO Pay", "$3.1M", "Self-appointed nonprofit board approved it", "#dc2626"],
        ["Tax Exemption", "~$63M/yr", "Income and property tax foregone", "#ea580c"],
        ["Coverage Gap", "295,000", "Alabamians uninsured in the Medicaid gap", "#dc2626"],
        ["North/South Gap", "$1,020/yr", "Illustrative cost burden difference by ZIP patterns", "#dc2626"]
      ],
      issues: [
        {
          id: "nonprofit",
          label: "Nonprofit Status",
          title: "A nonprofit system with tax breaks, executive pay, and patient lawsuits",
          summary: "Huntsville Hospital Health System receives major tax advantages while paying top executives millions and still taking aggressive action against patients over medical debt.",
          details: "HHHS pays zero federal income tax, zero state income tax, and reduced property tax while claiming nonprofit status worth an estimated $63M per year in exemptions. At the same time, its CEO earns about $3.1M a year, starting CNA wages remain low, and the system has reportedly pursued patients over unpaid bills through wage garnishment and liens.",
          decoder: {
            whatsHappening: "A hospital system benefiting from nonprofit tax treatment is still operating in ways that look heavily revenue-driven and burdensome to ordinary patients.",
            connections: "The self-appointed board, tax exemption structure, hospital monopoly power, and weak public oversight all help explain why this system can operate with limited accountability.",
            benefits: "Hospital leadership, insulated governance structures, and the dominant regional system benefit from tax advantages and reduced competitive pressure.",
            impact: "Patients, workers, taxpayers, and communities lose when a dominant health system receives public-facing benefits without equivalent public accountability.",
            actions: {
              intro: "If you care about nonprofit accountability, medical debt, and what tax exemptions should require in return, take action below.",
              contacts: [
                { name: "Huntsville Hospital Health System", role: "Hospital leadership", officialLink: "https://www.huntsvillehospital.org" }
              ],
              meetings: [
                { title: "Hospital public oversight question", frequency: "As available through public processes", why: "Push for greater disclosure around tax exemption and patient burden." }
              ],
              paths: [
                { destination: "FTC / AG complaint route", type: "Complaint", why: "Raise concerns about unfair or opaque practices where appropriate." }
              ],
              actions: [
                { label: "Email Hospital Leadership", kind: "primary", template: { email: "", subject: "Request for nonprofit accountability and transparency", body: "I am requesting clearer public reporting on Huntsville Hospital's nonprofit obligations, executive compensation, patient debt collection practices, and community benefit commitments." } }
              ]
            }
          }
        }
      ],
      trail: [{ label: "Health data", text: "Existing health module source data" }]
    }
  ]
};
export default data;