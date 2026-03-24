import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

function DisinfoPage(){
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-navy">DISINFORMATION · INVESTIGATION</span>
        <h2>Disinformation <em>& The Facts</em></h2>
        <p>Federal law bars undocumented immigrants from Medicaid, SNAP, and the ACA — since 1996. Politicians who claim otherwise received hundreds of thousands from insurance PACs that benefit from Medicaid refusal. Here are the statutes, the donors, and the real harm.</p>
      </div>
      <FactBlocks facts={[
        {k:"green",label:"THE ACTUAL FEDERAL LAW — 8 U.S.C. §1611 (SINCE 1996)",lc:"#16a34a",tc:"#14532d",text:"Federal law (8 U.S.C. §1611, in place since 1996) explicitly bars undocumented immigrants from: Medicaid, SNAP food assistance, ACA marketplace plans, Medicare, and CHIP. This is a 30-year federal statute that is unambiguous and has been continuously enforced. It is not a loophole, not a gray area, and not subject to interpretation. Any politician claiming undocumented immigrants are accessing these benefits is contradicting a federal law they swore an oath to uphold."},
        {k:"red",label:"THE BRITT DISINFORMATION CAMPAIGN",lc:"#dc2626",tc:"#7f1d1d",text:"Sen. Katie Britt made public statements claiming immigrants are accessing Medicaid — directly contradicting 8 U.S.C. §1611. Britt received $310,000 from health insurance PACs. Health insurance companies benefit when Medicaid is not expanded because their market shrinks when Medicaid expands. The false immigration claim is used to justify Medicaid refusal that leaves 295,000 Alabama citizens — not immigrants — uninsured. Connecting the claim to the donor is not speculation — it is documented."},
        {k:"gold",label:"THE DOCUMENTED LOOP — FALSE CLAIM → REAL HARM → REAL DONOR BENEFIT",lc:"#b8860b",tc:"#78350f",text:"Step 1: Politician claims immigrants burden Medicaid. Step 2: The claim is false — 8 U.S.C. §1611 prevents this. Step 3: The false claim justifies Medicaid refusal. Step 4: 295,000 Alabama citizens lose coverage. Step 5: Health insurance industry retains their market. Step 6: Health insurance industry donates to the politicians. Step 7: Repeat. The people harmed by this loop are US citizens — working Alabamians who earn too little for marketplace plans and too much for traditional Medicaid."},
        {k:"blue",label:"REALPAGE AND ALGORITHMIC RENT MANIPULATION",lc:"#2563eb",tc:"#1e3a5f",text:"RealPage software is used by landlords across the US to set rents using shared market data. The DOJ sued RealPage for antitrust violations — coordinating prices without a formal cartel agreement, which courts have found can still be illegal. When multiple landlords use the same algorithm trained on the same data, they effectively collude on rent increases. Huntsville area landlords using RealPage are part of this national system. The DOJ antitrust case is active."},
        {k:"green",label:"LOCAL INVESTIGATIVE JOURNALISM — DECLINING",lc:"#16a34a",tc:"#14532d",text:"The institutions most capable of exposing the above — local investigative journalism — have been gutted by staff cuts across all Alabama outlets. WHNT, WAFF, WAAY, and AL.com have all reduced reporting staff in recent years. This is not accidental: a weakened local press reduces accountability for local officials. The answer is not to accept it — it is to share documented information through community networks and demand local media restore accountability reporting."},
      ]}/>
      <AiButton prompt="Investigate Alabama political disinformation connected to real policy harm. FACTS: 8 U.S.C. 1611 (since 1996) explicitly bars undocumented immigrants from Medicaid, SNAP, ACA, Medicare, CHIP. Sen. Britt made public statements contradicting this law. Britt received $310,000 from health insurance PACs. Medicaid refusal leaves 295,000 Alabama citizens uninsured. RealPage DOJ antitrust suit — algorithmic rent coordination. Local investigative journalism declining — staff cuts across all AL outlets. Connect these facts clearly for a Madison County resident. Show who benefits from false claims and what the real harm is. Under 200 words, no jargon."/>
    </div>
  );
}

// --- UNHOUSED RESIDENTS PAGE ---

export { DisinfoPage };
