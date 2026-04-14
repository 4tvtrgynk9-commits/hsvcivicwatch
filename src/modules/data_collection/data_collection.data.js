const data = {
  id: 'data_collection',
  title: 'Data Collection & Surveillance',
  intro:
    'Huntsville markets itself as "The Smart Place" to attract tech investment, but underneath the branding is an unregulated digital dragnet. From retail profiling enabled by state loopholes to police license plate readers with zero civilian audit, the city is building a surveillance machine where the only ones protected are the corporations and politicians who benefit from it.',
  tabs: [
    {
      id: 'retail',
      label: 'Retail Surveillance',
      stats: [
        ['Retail PAC Support', '$11,500&#43;', '2026 cycle donations to key local reps', '#e53e3e'],
        ['Privacy Gap', 'Active', 'HB351 "Loyalty" carveout in effect', '#3182ce'],
        ['Dynamic Pricing', 'Risk', 'Digital labels create infrastructure for gouging', '#805ad5']
      ],
      issues: [
        {
          id: 'retail_pac_loophole',
          label: 'The Lobbyist Special',
          title: 'HB351: The Retail PAC "Privacy" Purchase',
          summary:
            'Alabama's 2026 data privacy bill was written with massive loopholes that protect the exact "loyalty" tracking tools used by Walmart and Kroger to profile residents.',
          details:
            'In April 2026, HB351 reached "Ready to Enroll" status, marketed as a win for consumer privacy. In reality, the bill contains a specific carveout for "loyalty, rewards, and club-card" programs. This loophole allows retailers to continue harvesting and selling shopper data as long as it is tied to a "discount" program. This ensures that the deep financial and health profiling documented by Consumer Reports remains 100% legal in Alabama, unlike in California where residents have a "One-Stop" right to delete their profiles.',
          decoder: {
            whatsHappening:
              'State law has been surgically edited to protect the data-mining business model of major grocery and retail chains.',
            connections:
              'The contradiction is in the donor list. Rep. Andy Whitt (District 6) has received over $11,000 from the Alabama Retail PAC this cycle, while Sen. Arthur Orr (District 3) is officially endorsed by the same lobby. They claim to protect "individual liberty" from government overreach, yet they are passing laws that give corporations the "liberty" to harvest your life. They have effectively legalized corporate stalking in exchange for campaign funding.',
            benefits:
              'The "Select Few" include the Alabama Retail Association and the politicians who use Retail PAC money to fund their 2026 re-elections.',
            impact:
              'Alabamians take on the burden. We are forced into a "Privacy Tax"---giving up our health and financial data just to access fair grocery prices---because our representatives were paid to ensure we have no "Right to Delete."',
            actions: {
              intro:
                'Demand that the Huntsville delegation explain why Retail PAC money is more important than your privacy.',
              contacts: [
                {
                  name: 'Rep. Andy Whitt',
                  role: 'State Representative',
                  officialLink: 'https://alison.legislature.state.al.us/house-leaders-members?rep=157'
                },
                {
                  name: 'Sen. Arthur Orr',
                  role: 'State Senator',
                  officialLink: 'https://alison.legislature.state.al.us/senate-leaders-members?sen=59'
                }
              ],
              meetings: [],
              paths: [
                {
                  destination: 'California Delete Act Model',
                  type: 'Policy',
                  why:
                    'Compare Alabama's "Loyalty Loophole" to states that actually protect residents.'
                }
              ],
              actions: [
                {
                  label: 'Demand Right to Delete',
                  kind: 'email',
                  template: {
                    subject: 'Repeal HB351 Loopholes',
                    body:
                      'I am a Huntsville resident. Stop protecting data brokers and retail lobbyists. We deserve a real Right to Delete our data, including loyalty program profiles.'
                  }
                }
              ]
            }
          }
        },
        {
          id: 'walmart_digital_risk',
          label: 'Dynamic Pricing',
          title: 'The Walmart "Digital Shadow" & Algorithmic Gouging',
          summary:
            'Walmart's rollout of digital shelf labels in Huntsville provides the technical infrastructure to hike prices instantly based on your personal data profile.',
          details:
            'Walmart has completed its transition to digital shelf labels nationwide, including across the Huntsville metro. While the company claims these are for "efficiency," the labels enable "Surveillance Pricing"---the ability to adjust the price on the shelf based on centralized algorithms. Because Walmart tracks every card purchase and links it to your identity, they can theoretically test the limit of what you specifically are willing to pay. In Alabama, there are zero laws preventing a retailer from using your "Digital Shadow" to set an individualized price the moment you enter the aisle.',
          decoder: {
            whatsHappening:
              'Retailers are replacing fixed pricing with algorithmic control, using consumer data to maximize profit on every transaction.',
            connections:
              'The contradiction: Mayor Battle markets Huntsville as a "Smart City" leader, but he stays silent on how "smart" tech is used to pick the pockets of residents. He and the local delegation prioritize a "pro-business" climate that is actually just a "pro-gouging" climate for their retail donors.',
            benefits:
              'Walmart shareholders and the algorithmic software vendors who benefit from an unregulated data market in Alabama.',
            impact:
              'Privacy Erosion. For Huntsville families already burdened by high grocery taxes, dynamic pricing is a hidden tax that targets your specific needs and bank balance.',
            actions: {
              intro: 'Report suspected algorithmic pricing to state regulators.',
              contacts: [
                {
                  name: 'AL AG Consumer Protection',
                  role: 'Regulatory Body',
                  officialLink: 'https://www.alabamaag.gov/consumer-complaint/'
                }
              ],
              meetings: [],
              paths: [
                {
                  destination: 'FTC Surveillance Pricing Inquiry',
                  type: 'Investigation',
                  why: 'The federal government is currently investigating these practices.'
                }
              ],
              actions: [
                {
                  label: 'File Price Complaint',
                  kind: 'web',
                  template: {
                    subject: 'Report Dynamic Pricing',
                    body:
                      'I am reporting suspected individualized pricing based on surveillance data at local Huntsville retail locations.'
                  }
                }
              ]
            }
          }
        }
      ],
      brainstorm: [
        {
          id: 'bs_card_link',
          label: 'Card Linking',
          title: 'The Card-Link Trap',
          summary:
            'How retailers track you even without a loyalty card by linking your debit/credit card to your "digital shadow."'
        }
      ],
      trail: [
        {
          label: 'AL Secretary of State',
          text: '2026 Campaign Finance Records for Retailers of Alabama PAC.'
        },
        {
          label: 'HB351 Enrolled Text',
          text: 'Section-by-section analysis of loyalty program carveouts.'
        }
      ]
    },
    {
      id: 'policing',
      label: 'Police Surveillance',
      stats: [
        ['Flock Cameras', '90&#43;', 'Estimated active units city--wide by late 2025', '#e53e3e'],
        ['Search Logs', 'Internal Only', 'Zero independent civilian audit of access', '#dd6b20'],
        ['AI Error Warning', '108 Days', 'Time Angela Lipps spent in jail due to AI error', '#805ad5']
      ],
      issues: [
        {
          id: 'hpd_flock_vacuum',
          label: 'Digital Dragnet',
          title: 'The HPD "Oversight Vacuum" (Flock ALPR)',
          summary:
            'Huntsville leadership has expanded the Flock surveillance network to nearly 100 units while refusing to allow any independent civilian audit of who is being searched.',
          details:
            'HPD logs the movement of every vehicle that passes a Flock camera. While HPD claims searches require a "case number," these logs are audited only by HPD itself. In 2024, Angela Lipps was jailed for 108 days due to a similar unregulated "glitch" in facial recognition tech. Without a civilian-led board with subpoena power, there is zero verification that a "rogue cop" isn't using the system to stalk an ex-partner or monitor a political rival.',
          decoder: {
            whatsHappening:
              'Law enforcement has built a 24/7 digital tail for every resident with zero public-facing accountability.',
            connections:
              'The contradiction: Mayor Battle calls Huntsville the "Smart Place," but he operates an "Accountability Black Hole." They claim the cameras are for "safety," but by blocking a civilian oversight board with audit power, they are actually protecting the ability of a rogue officer to abuse the system. They use "safety" rhetoric to secure endorsements from police unions while residents take 100% of the surveillance risk.',
            benefits:
              'Flock Safety, which collects recurring taxpayer revenue, and the political establishment that uses "high-tech policing" to maintain a "safe for business" image while avoiding actual transparency.',
            impact:
              'The Stalking Risk. Every time you drive to a church, a doctor, or a protest, the government logs it. Without oversight, that data is a weapon for personal or political vendettas.',
            actions: {
              intro: 'Demand a Surveillance Transparency Ordinance for Huntsville.',
              contacts: [
                {
                  name: 'Huntsville City Council',
                  role: 'Legislative Body',
                  officialLink: 'https://www.huntsvilleal.gov/government/city-council/'
                }
              ],
              meetings: [
                {
                  title: 'HPCAC Public Listening Session',
                  frequency: 'Quarterly',
                  why:
                    'Ask why the 2024 expansion did not include a mandatory, public, third-party audit of search logs.'
                }
              ],
              paths: [
                {
                  destination: 'Oakland Privacy Commission',
                  type: 'Policy Model',
                  why: 'The standard for how cities should oversee police surveillance tech.'
                }
              ],
              actions: [
                {
                  label: 'Demand Search Audit',
                  kind: 'email',
                  template: {
                    subject: 'Surveillance Search Transparency',
                    body:
                      'I am calling for an independent civilian audit of all HPD Flock camera and facial recognition search logs.'
                  }
                }
              ]
            }
          }
        }
      ],
      brainstorm: [
        {
          id: 'bs_data_buying',
          label: 'Data Buying',
          title: 'The Backdoor Warrant',
          summary:
            'Investigating whether local agencies are buying phone location data to bypass the Fourth Amendment.'
        }
      ],
      trail: [
        {
          label: 'Angela Lipps Lawsuit (2025)',
          text: 'Documentation of false imprisonment via unregulated AI match.'
        },
        {
          label: 'Huntsville City Budget 2026',
          text: 'Line-item funding for Flock Safety and "Public Safety Tech" expansion.'
        }
      ]
    }
  ]
};

export default data;