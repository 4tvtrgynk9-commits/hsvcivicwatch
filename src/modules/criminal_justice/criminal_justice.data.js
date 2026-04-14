const data = {
  id: "criminal_justice",
  title: "Criminal Justice: Sentencing & Prisons",
  intro: "Alabama has one of the highest incarceration rates in the nation. Madison County pretrial detention rates, sentencing disparities, and prison conditions reflect a system built around punishment — not public safety or rehabilitation.",
  tabs: [
    {
      id: "bail_pretrial",
      label: "Bail & Pretrial",
      stats: [
        ["Pretrial Detention Rate", "High", "Madison County holds a significant share of its jail population pretrial — before any conviction", "#dc2626"],
        ["Cash Bail System", "Active", "Alabama uses a cash bail system that ties pretrial freedom to financial resources", "#ea580c"],
        ["Pretrial Length", "Months", "Many defendants wait months in Madison County Jail before trial or resolution", "#dc2626"],
        ["Public Defender Access", "Strained", "Alabama public defenders carry caseloads that limit meaningful representation", "#7c3aed"]
      ],
      issues: [],
      trail: [
        { label: "Madison County Jail population data", text: "Source for pretrial detention rates" },
        { label: "Alabama cash bail statutes", text: "Source for bail system structure" }
      ]
    },
    {
      id: "sentencing",
      label: "Sentencing",
      stats: [
        ["Racial Disparity", "Documented", "Black residents in Madison County face disproportionate prosecution and sentencing outcomes", "#dc2626"],
        ["Drug Offense Sentences", "Above average", "Alabama drug sentencing guidelines produce longer sentences than many peer states", "#ea580c"],
        ["Mandatory Minimums", "In effect", "Alabama mandatory minimum statutes limit judicial discretion in sentencing", "#dc2626"],
        ["Felony Disenfranchisement", "Active", "Alabama permanently strips voting rights from certain felony convictions", "#7c3aed"]
      ],
      issues: [],
      trail: [
        { label: "Alabama Sentencing Commission data", text: "Source for sentencing disparity figures" },
        { label: "ACLU Alabama criminal justice reports", text: "Context for racial disparity documentation" }
      ]
    },
    {
      id: "incarceration",
      label: "Incarceration",
      stats: [
        ["Alabama Prison Overcrowding", "~170%", "Alabama prisons operate at roughly 170% of designed capacity", "#dc2626"],
        ["DOJ Consent Decree", "Active", "Federal oversight of Alabama prison conditions due to documented constitutional violations", "#ea580c"],
        ["Prison Violence Rate", "Among highest", "Alabama records some of the highest rates of prison violence in the nation", "#dc2626"],
        ["Recidivism Rate", "High", "Alabama recidivism rates reflect limited reentry support and rehabilitation programming", "#7c3aed"]
      ],
      issues: [],
      trail: [
        { label: "DOJ v. Alabama prison conditions litigation", text: "Source for federal oversight and consent decree" },
        { label: "Alabama Department of Corrections annual report", text: "Source for capacity and violence figures" }
      ]
    }
  ]
};
export default data;
