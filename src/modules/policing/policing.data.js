const data = {
  id: 'policing',
  title: 'Law Enforcement & Accountability',
  intro:
    `Huntsville allocates over 50% of its $343M budget to "Public Safety," yet transparency remains locked behind state laws and closed-door settlements. From taxing baby formula to fund police cruisers to spending six figures defending a murder conviction, the city's financial priorities are engineered to protect the badge, not the resident.`,
  tabs: [
    {
      id: 'budget',
      label: 'The $343M Loop',
      stats: [
        ['Public Safety', '54%', 'Share of the $343.7M total city budget', '#e53e3e'],
        ['HPD Personnel', '$80.6M', 'Direct salary and benefit costs for 2026', '#3182ce'],
        ['Crisis Care Cut', '$36,000', 'Amount diverted from WellStone mental health', '#dd6b20']
      ],
      issues: [
        {
          id: 'necessity_tax',
          label: 'The Baby Tax',
          title: 'Taxing the Cradle: The 4.5% Necessity Surcharge',
          summary:
            'While the State of Alabama exempted diapers and formula from its 4% tax in 2025, the City of Huntsville continues to collect its 4.5% local tax on these items to fuel the General Fund.',
          details:
            'Under Act 2025-304, Alabama finally recognized that essential items like baby formula, diapers, and menstrual hygiene products should not be taxed. However, the City of Huntsville has refused to pass a matching local ordinance. This means every time a parent buys formula, diapers, or other hygiene necessities, they are still paying a 4.5% local tax that flows into the General Fund. That same General Fund is the primary source for the $80.6M **HPD (Huntsville Police Department)** budget. In Huntsville, the biological realities of raising a child or managing a period are still treated like a revenue stream for police spending.',
          decoder: {
            whatsHappening:
              'The city is maintaining a local necessity tax on infants and healthcare essentials instead of cutting into the police-heavy General Fund.',
            connections:
              'The contradiction is simple. City leaders say the budget meets community needs, yet they keep taxing diapers, formula, and menstrual products while expanding police staffing. They are treating affordability like an optional concern and policing like a guaranteed priority.',
            benefits:
              'The biggest beneficiary is the General Fund structure that protects the **HPD** budget and the political leadership that avoids making harder funding choices elsewhere.',
            impact:
              'A family spending $150 each month on diapers and formula pays about $6.75 in city tax alone. That may look small on paper, but over time it becomes a direct transfer from household survival spending into the same city budget that prioritizes police growth.',
            actions: {
              intro: 'Demand that Huntsville match the state exemption and stop taxing basic necessities.',
              contacts: [
                {
                  name: 'Huntsville City Council',
                  role: 'Legislative Body',
                  officialLink: 'https://www.huntsvilleal.gov/government/city-council/'
                }
              ],
              meetings: [],
              paths: [
                {
                  destination: 'Act 2025-304 (State Exemption)',
                  type: 'Policy',
                  why: 'This is the state framework the city has chosen not to mirror locally.'
                }
              ],
              actions: [
                {
                  label: 'Email Council: End the Baby Tax',
                  kind: 'email',
                  template: {
                    subject: 'Exempt Diapers and Formula from City Tax',
                    body:
                      'The state has exempted baby and hygiene essentials from sales tax. Why is Huntsville still taxing these necessities through its local tax structure? The city should immediately match the state exemption.'
                  }
                }
              ]
            }
          }
        },
        {
          id: 'darby_defense_fund',
          label: 'The Slush Fund',
          title: 'The $125k "Protocol" Murder Defense',
          summary:
            'The City of Huntsville used $125,486 in taxpayer funds to hire private attorneys to defend William Darby after he was indicted for murder.',
          details:
            'After an officer was caught on camera killing a resident in a mental health crisis, the city did not distance itself from the act. It funded the defense. The city spent $125,486 from the General Fund to hire private lawyers for William Darby after his indictment. That means residents paid into the same fund that was then used to shield an officer accused of murder. In any other profession, conduct that exposes an employer to criminal litigation and six-figure defense costs would trigger immediate separation. In Huntsville, the city fought to protect the officer and the institution around him.',
          decoder: {
            whatsHappening:
              'Taxpayer money is being used as a legal shield for police officers, even in cases involving extreme violence and criminal prosecution.',
            connections:
              'City leadership defended Darby by framing the killing as consistent with police training. That creates a deeper contradiction: if the officer acted in line with training, then the city is admitting the training itself is part of the problem. Residents are forced to fund the training, the defense of the officer, and the political protection of the department all at once.',
            benefits:
              'The immediate beneficiaries are **HPD** leadership, which avoids admitting institutional failure, and the private legal firms brought in to defend officers with public money.',
            impact:
              'This destroys public trust. The victim and his family paid taxes into the same system that later financed the defense of the man who killed him. That turns public revenue into institutional self-protection.',
            actions: {
              intro: 'Demand a full audit of all public dollars spent on police legal defense.',
              contacts: [
                {
                  name: 'Mayor Tommy Battle',
                  role: 'Executive',
                  officialLink: 'https://www.huntsvilleal.gov/government/mayors-office/'
                }
              ],
              meetings: [],
              paths: [],
              actions: [
                {
                  label: 'Demand Defense Fund Audit',
                  kind: 'email',
                  template: {
                    subject: 'Public Funding for Police Defense',
                    body:
                      'I am calling for a full public accounting of all General Fund dollars spent on legal defense for Huntsville police officers, including outside counsel and related case costs.'
                  }
                }
              ]
            }
          }
        }
      ],
      brainstorm: [
        {
          id: 'bs_settlement_hush',
          label: 'Hush Money',
          title: 'The $600k Settlement',
          summary:
            'How executive sessions and closed-door settlements are used to quietly resolve police violence cases with public money.'
        }
      ],
      trail: [
        {
          label: 'Huntsville FY2026 Budget',
          text: 'Track the $343.7M total budget and the share directed to Public Safety.'
        },
        {
          label: 'Alabama Act 2025-304',
          text: 'Track the state-level exemption Huntsville has not matched locally.'
        }
      ]
    },
    {
      id: 'oversight',
      label: 'Shadow Revenue',
      stats: [
        ['Asset Forfeiture', '$1.2M', 'Reported seizures by local agencies in 2024 to 2025', '#e53e3e'],
        ['Jail Commissions', '60%', 'Kickback rate tied to Securus jail phone contracts', '#3182ce'],
        ['Phone Call Cost', '$15.00', 'Potential cost of a single 15-minute jail call', '#dd6b20']
      ],
      issues: [
        {
          id: 'securus_kickback',
          label: 'The Jail Tax',
          title: `Sheriff Turner's Securus Profit Machine`,
          summary:
            `Madison County Sheriff Kevin Turner maintains a monopoly contract with Securus Technologies, extracting money from families through jail phone commissions.`,
          details:
            `The Madison County Jail functions as a revenue center. Families, often already struggling financially, must pay inflated rates to speak with incarcerated loved ones. Under commission-based jail phone contracts, a large portion of that revenue flows back to the county through so-called site commissions. That means every phone call is not just communication. It is a money stream built on isolation, poverty, and captivity. These funds can then be routed into discretionary spending channels with far less public scrutiny than the normal budget process.`,
          decoder: {
            whatsHappening:
              `The Sheriff's office benefits from a commission structure that turns family contact into a source of institutional revenue.`,
            connections:
              'Officials present themselves as public servants, but the contract model depends on extracting money from families with the fewest options. The people with the least power are forced to subsidize a system that claims to protect the public while profiting from confinement.',
            benefits:
              `The main beneficiaries are the Sheriff's office and **Securus Technologies**, which profit from a captive market with little meaningful competition or public control.`,
            impact:
              `This is a poverty extraction system. Money that could go to rent, groceries, childcare, or school supplies instead gets pulled into jail telecom fees and commission structures.`,
            actions: {
              intro: 'Demand an end to commission-based jail phone contracts in Madison County.',
              contacts: [
                {
                  name: 'Madison County Commission',
                  role: 'County Oversight',
                  officialLink: 'https://www.madisoncountyal.gov/government/about-your-commission'
                }
              ],
              meetings: [
                {
                  title: 'Commission Meeting',
                  frequency: 'Bi-weekly',
                  why: 'Demand an end to jail phone kickbacks and commission-based family contact.'
                }
              ],
              paths: [
                {
                  destination: 'The Martha Wright-Reed Act',
                  type: 'Federal Law',
                  why: 'Federal reform efforts target predatory jail communication pricing.'
                }
              ],
              actions: [
                {
                  label: 'Email Commission: End Kickbacks',
                  kind: 'email',
                  template: {
                    subject: 'End Jail Phone Commissions',
                    body:
                      'I am calling for the immediate end of site commissions and profit-based jail phone contracts in Madison County. Families should not be taxed for staying in contact with incarcerated loved ones.'
                  }
                }
              ]
            }
          }
        },
        {
          id: 'asset_forfeiture_atm',
          label: 'Forfeiture',
          title: 'Asset Forfeiture: The HPD Cash Machine',
          summary:
            'HPD can seize cash, cars, and other property without a criminal conviction, then benefit from the proceeds through discretionary enforcement funding.',
          details:
            'Civil asset forfeiture allows law enforcement to take property by claiming it is connected to crime, even when the owner is never convicted. In practice, that flips the burden onto residents to fight for their own money or vehicles back through an expensive legal process. This is policing for profit. The danger is not just the seizure itself. It is what happens after. When agencies are allowed to keep or benefit from forfeiture proceeds, they gain a direct financial incentive to treat residents as revenue opportunities rather than people with constitutional rights.',
          decoder: {
            whatsHappening:
              'Law enforcement can seize property first and force residents to prove innocence later, creating a financial incentive for aggressive policing.',
            connections:
              'Officials claim forfeiture targets criminal profits, but the structure turns departments into profit-seeking institutions themselves. When an agency can benefit from what it seizes, public safety and revenue generation become blurred.',
            benefits:
              'The beneficiaries are police and sheriff discretionary accounts that gain access to extra money outside the normal public budget process.',
            impact:
              'Residents can lose cash, vehicles, or other property without ever being convicted of a crime. That creates fear, financial instability, and a justice system where the government can profit from accusation alone.',
            actions: {
              intro: 'Support state-level reform that requires stronger due process protections before property can be taken.',
              contacts: [
                {
                  name: 'Alabama Attorney General Steve Marshall',
                  role: 'State Law Enforcement',
                  officialLink: 'https://www.alabamaag.gov/contact/'
                }
              ],
              meetings: [],
              paths: [
                {
                  destination: 'Institute for Justice',
                  type: 'Research',
                  why: 'Tracks and challenges civil asset forfeiture abuse nationwide.'
                }
              ],
              actions: [
                {
                  label: 'Contact AG: Forfeiture Reform',
                  kind: 'email',
                  template: {
                    subject: 'End Civil Asset Forfeiture Abuse',
                    body:
                      'Law enforcement should not be able to seize property without a criminal conviction and meaningful due process. Alabama should end policing-for-profit practices.'
                  }
                }
              ]
            }
          }
        }
      ],
      brainstorm: [
        {
          id: 'bs_bodycam_iron',
          label: 'Iron Curtain',
          title: `HB289: The Bodycam Law`,
          summary:
            `How Alabama's custodial law enforcement recording protections can be used to hide police misconduct footage from the public.`
        }
      ],
      trail: [
        {
          label: 'FCC Jail Phone Rulings',
          text: 'Track federal action on predatory jail communication pricing and commission limits.'
        },
        {
          label: 'Alabama Civil Asset Forfeiture Reports',
          text: 'Track reported seizures and where forfeiture money is flowing.'
        }
      ]
    }
  ]
};

export default data;