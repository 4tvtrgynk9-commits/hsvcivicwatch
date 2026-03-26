const data = {
  id: "equity",
  title: "The Two Huntsvilles",
  intro: "Use this page to see how roads, schools, policing, and spending patterns create unequal outcomes inside the same city.",
  tabs: [
    {
      id: "overview",
      label: "Overview",
      stats: [
        ["Jemison High AP Rate", "44%", "vs Columbia High 17% AP participation — same district", "#dc2626"],
        ["Road PCI North", "41 avg", "Poor — needs full reconstruction, not patching", "#dc2626"],
        ["School Funding Gap", "$847/pupil", "Less in lower-income HCS schools", "#ea580c"],
        ["Battle Developer Donors", "$380k", "From those who benefit from status quo", "#dc2626"]
      ],
      issues: [
        {
          id: "schools",
          label: "School Equity",
          title: "Jemison and Columbia show the deeper pattern",
          summary: "Jemison and Columbia are both treated as under-resourced schools despite being in different parts of the city. The pattern is not just geography; it follows demographics and income.",
          details: "J.O. Johnson High School closed in 2016 and was demolished in 2021. Its replacement, Mae C. Jemison High School, now serves the same northwest Huntsville community. In 2023–2024, Jemison had a 44% AP participation rate and 13 AP programs, but only 6–9% of students tested as proficient in math. Columbia High, another heavily minority and economically disadvantaged school, shows a similar under-resourced pattern. Huntsville City Schools has not adopted a weighted funding formula to ensure lower-income schools receive sufficient resources.",
          decoder: {
            whatsHappening: "Huntsville schools serving lower-income communities are not being resourced in a way that closes the gap, even when those schools still show signs of student ambition and advanced-course participation.",
            connections: "School funding choices, district priorities, and the lack of a weighted funding formula all connect to this outcome. When elected leaders and school leadership do not change the formula, the same schools keep carrying the same burdens.",
            benefits: "The status quo benefits officials and decision-makers who avoid the political cost of redistributing resources more fairly.",
            impact: "Students in lower-income communities lose opportunity, teachers face harder conditions, and families are left carrying the cost of educational inequality.",
            actions: {
              intro: "If you care about educational opportunity, school funding fairness, and what students in your city are actually getting, take action below.",
              contacts: [
                { name: "Huntsville City Schools", role: "District leadership", officialLink: "https://www.huntsvillecityschools.org" }
              ],
              meetings: [
                { title: "School Board Meetings", frequency: "Check district calendar", why: "Funding priorities and board oversight decisions happen here." }
              ],
              paths: [
                { destination: "Public comment to school board", type: "Comment / oversight", why: "Push for weighted funding and school-level transparency.", link: "https://www.huntsvillecityschools.org" }
              ],
              actions: [
                { label: "Email School Leadership", kind: "primary", template: { email: "", subject: "Request for school funding transparency", body: "I am writing to request clearer public reporting on school-by-school funding, staffing, and resource allocation in Huntsville City Schools. I am especially concerned about whether lower-income schools are receiving the resources needed to serve students fairly." } }
              ]
            }
          }
        },
        {
          id: "roads",
          label: "Roads",
          title: "North Huntsville roads remain in poor condition",
          summary: "North Huntsville roads average a pavement condition score near the bottom of 'poor,' while south Huntsville roads average in the 'good' range.",
          details: "Pavement Condition Index (PCI) ranges from 0–25 Failed, 26–40 Serious, 41–55 Poor, 56–70 Fair, and 71–85 Good. North Huntsville averages PCI 41, while south Huntsville averages PCI 72. Same city. Same property tax rate. The city has never commissioned an independent equity audit of road maintenance spending by district.",
          decoder: {
            whatsHappening: "Residents in different parts of the same city are getting very different road conditions, even though they pay into the same city system.",
            connections: "Capital budgeting, district-level prioritization, and the lack of an independent equity audit all connect to why this gap stays in place.",
            benefits: "Areas already receiving better maintenance and newer investment keep benefiting, while officials avoid a hard public accounting of spending patterns.",
            impact: "Drivers, families, workers, and neighborhoods in north Huntsville absorb the cost through vehicle wear, safety risks, and lower quality infrastructure.",
            actions: {
              intro: "If you care about what your taxes are funding and why some neighborhoods keep getting worse roads, take action below.",
              contacts: [
                { name: "Huntsville City Council", role: "City budget and oversight", officialLink: "https://www.huntsvilleal.gov/government/city-council/" }
              ],
              meetings: [
                { title: "City Council Meetings", frequency: "Regularly scheduled", why: "Road spending priorities and accountability questions can be raised here." }
              ],
              paths: [
                { destination: "City Council public comment", type: "Complaint / oversight", why: "Ask for district-by-district road spending and pavement condition reporting.", link: "https://www.huntsvilleal.gov/government/city-council/" }
              ],
              actions: [
                { label: "Email City Council", kind: "primary", template: { email: "", subject: "Request for road equity audit", body: "I am requesting a public district-by-district review of road maintenance and capital road spending in Huntsville. Residents in different parts of the city are clearly experiencing different conditions, and the public deserves an equity audit." } }
              ]
            }
          }
        }
      ],
      trail: [
        { label: "Equity source data", text: "Existing equity data in prior site files" }
      ]
    }
  ]
};
export default data;