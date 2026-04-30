export const roadmapData = [
    {
        id: 1,
        title: "Election Announcement",
        description: "The Election Commission announces the dates. Model Code of Conduct (MCC) comes into effect immediately.",
        icon: "📢"
    },
    {
        id: 2,
        title: "Voter Registration",
        description: "Preparation of electoral rolls. Citizens 18+ can register using Form 6.",
        icon: "📝"
    },
    {
        id: 3,
        title: "Voter List Verification",
        description: "Voters check their names in the electoral roll and download voter slips.",
        icon: "✅"
    },
    {
        id: 4,
        title: "Candidate Nomination",
        description: "Candidates file nomination papers and declare their assets/criminal records.",
        icon: "✍️"
    },
    {
        id: 5,
        title: "Scrutiny & Withdrawal",
        description: "Returning Officer checks nominations. Candidates can withdraw their names.",
        icon: "🔍"
    },
    {
        id: 6,
        title: "Election Campaign",
        description: "Parties rally and campaign. Stops 48 hours before polling starts.",
        icon: "🗣️"
    },
    {
        id: 7,
        title: "Model Code of Conduct",
        description: "Strict rules apply to ensure fair play, prevent bribery, and misuse of power.",
        icon: "⚖️"
    },
    {
        id: 8,
        title: "Voting Day Process",
        description: "Voters visit polling booths, show ID, get inked, and wait for their turn.",
        icon: "🗳️"
    },
    {
        id: 9,
        title: "EVM & VVPAT Process",
        description: "Voters press button on EVM and verify their vote on VVPAT slip.",
        icon: "📠"
    },
    {
        id: 10,
        title: "Vote Counting",
        description: "EVMs are opened under tight security and votes are counted.",
        icon: "🧮"
    },
    {
        id: 11,
        title: "Result Declaration",
        description: "ECI announces winners for each constituency.",
        icon: "🎉"
    },
    {
        id: 12,
        title: "Government Formation",
        description: "The party or coalition with a majority forms the new government.",
        icon: "🏛️"
    }
];

export const checklistData = [
    { id: "eligibility", label: "Check eligibility (18+ and Indian Citizen)" },
    { id: "nvsp", label: "Register on NVSP website (Form 6)" },
    { id: "verify", label: "Verify name in final voter list" },
    { id: "slip", label: "Download digital voter slip" },
    { id: "booth", label: "Find exact polling booth location" },
    { id: "idproof", label: "Keep a valid ID proof ready (Voter ID, Aadhaar, PAN)" },
    { id: "candidate", label: "Research the candidates in your constituency" },
    { id: "nota", label: "Understand the NOTA (None of the Above) option" },
    { id: "vote", label: "Go out, vote, and verify the VVPAT slip" }
];

export const glossaryData = [
    { term: "ECI", definition: "Election Commission of India. The constitutional body responsible for conducting fair elections." },
    { term: "Constituency", definition: "A geographical area that elects one representative to the legislative body." },
    { term: "Voter ID (EPIC)", definition: "Elector's Photo Identity Card. The official ID issued by ECI to eligible voters." },
    { term: "NVSP", definition: "National Voter's Service Portal. The official online platform for voter registration." },
    { term: "EVM", definition: "Electronic Voting Machine. Used to record votes securely and rapidly." },
    { term: "VVPAT", definition: "Voter Verifiable Paper Audit Trail. A slip printed for 7 seconds to let voters verify their EVM vote." },
    { term: "NOTA", definition: "None of the Above. An option allowing voters to reject all candidates in their constituency." },
    { term: "MCC", definition: "Model Code of Conduct. Guidelines for political parties to ensure fair campaigning." },
    { term: "BLO", definition: "Booth Level Officer. A local representative of the ECI who helps with voter registration." },
    { term: "Lok Sabha", definition: "The lower house of India's bicameral Parliament, elected directly by the people." },
    { term: "Rajya Sabha", definition: "The upper house of Parliament, elected indirectly by state legislatures." },
    { term: "By-election", definition: "A special election held to fill a political office that has become vacant between general elections." }
];

export const formsData = [
    {
        id: "form6",
        title: "Form 6",
        purpose: "Application for inclusion of name in the electoral roll.",
        who: "First-time voters or voters shifting to a new constituency.",
        proof: "Age proof (Birth Certificate/Aadhaar) & Address proof (Electricity Bill/Aadhaar)."
    },
    {
        id: "form7",
        title: "Form 7",
        purpose: "Application for objecting inclusion or seeking deletion of name.",
        who: "To delete the name of a deceased person or someone who shifted permanently.",
        proof: "Death certificate or proof of shifting."
    },
    {
        id: "form8",
        title: "Form 8",
        purpose: "Application for correction of details or shifting residence within constituency.",
        who: "Registered voters who need to fix typos, change address, or get a replacement EPIC.",
        proof: "Documentary proof of correct details (e.g., corrected Aadhaar)."
    },
    {
        id: "form6a",
        title: "Form 6A",
        purpose: "Application for inclusion of name in electoral roll by an overseas Indian elector.",
        who: "Non-Resident Indians (NRIs) who have not acquired citizenship of any other country.",
        proof: "Valid Indian Passport with valid visa."
    }
];

export const beginnerSteps = [
    {
        title: "Who can vote?",
        content: "Any Indian citizen who is 18 years or older on the qualifying date (usually Jan 1st of the year) can vote."
    },
    {
        title: "How to register?",
        content: "You can apply online through the NVSP portal or Voter Helpline App by filling out Form 6. You need a photo, age proof, and address proof."
    },
    {
        title: "How to verify?",
        content: "Always check the final electoral roll online before voting day to confirm your name is listed. Without it, you cannot vote."
    },
    {
        title: "Voting Day",
        content: "Go to your assigned booth with an ID. The officer checks your ID, marks your finger with indelible ink, and allows you to use the EVM."
    },
    {
        title: "Results",
        content: "After voting completes nationwide, EVMs are secured. On counting day, votes are tallied and the candidate with the highest votes in a constituency wins."
    }
];

export const electionFacts = [
    "The 2019 Lok Sabha elections were the world's largest democratic exercise, with over 912 million eligible voters.",
    "The highest polling station in the world is located in Tashigang, Himachal Pradesh, at an altitude of 15,256 feet.",
    "A single voter in the Gir forest of Gujarat has a dedicated polling booth set up just for him, deep inside the sanctuary.",
    "India introduced the 'None of the Above' (NOTA) option in 2013, allowing voters to officially register their rejection of all candidates.",
    "Indelible ink, applied to a voter's left index finger, is manufactured exclusively by Mysore Paints and Varnish Limited.",
    "The first general election of independent India took four months to complete, spanning from late 1951 to early 1952.",
    "VVPAT (Voter Verifiable Paper Audit Trail) machines were introduced to provide a physical paper slip confirming the electronic vote."
];

export const historyTimelineData = [
    {
        year: "1950",
        title: "Election Commission Established",
        description: "The Election Commission of India (ECI) was established on January 25, 1950, a day now celebrated as National Voters' Day.",
        icon: "🏛️"
    },
    {
        year: "1951-52",
        title: "First General Elections",
        description: "India held its first massive democratic elections with universal adult franchise. Sukumar Sen was the first Chief Election Commissioner.",
        icon: "🗳️"
    },
    {
        year: "1982",
        title: "First EVM Usage",
        description: "Electronic Voting Machines (EVMs) were used for the first time on a trial basis in the Parur Assembly constituency of Kerala.",
        icon: "📠"
    },
    {
        year: "1989",
        title: "Voting Age Lowered",
        description: "The 61st Amendment Act lowered the voting age in India from 21 to 18 years, enfranchising millions of youth.",
        icon: "🎓"
    },
    {
        year: "1993",
        title: "EPIC Introduced",
        description: "Elector's Photo Identity Cards (EPIC), commonly known as Voter IDs, were introduced to prevent electoral fraud.",
        icon: "🪪"
    },
    {
        year: "2013",
        title: "NOTA Implemented",
        description: "The Supreme Court directed the ECI to provide the 'None of the Above' (NOTA) option on EVMs.",
        icon: "🚫"
    },
    {
        year: "2014",
        title: "VVPAT Introduction",
        description: "Voter Verifiable Paper Audit Trail (VVPAT) was introduced with EVMs to add an extra layer of transparency.",
        icon: "🖨️"
    },
    {
        year: "2019",
        title: "Largest Election in History",
        description: "The 17th Lok Sabha elections recorded the highest ever voter turnout at 67.4% out of 912 million eligible voters.",
        icon: "📈"
    }
];

export const pastElectionsData = {
    "2024": {
        title: "18th Lok Sabha General Election",
        dates: [
            { label: "Announcement", date: "March 16, 2024" },
            { label: "Phase 1 Polling", date: "April 19, 2024" },
            { label: "Phase 7 Polling", date: "June 1, 2024" },
            { label: "Counting Day", date: "June 4, 2024" }
        ],
        stats: [
            { label: "Eligible Voters", value: "~968 Million" },
            { label: "Total Phases", value: "7" },
            { label: "Voter Turnout", value: "65.79%" }
        ],
        highlights: "The world's largest election with nearly a billion eligible voters. The Election Commission set up over 1 million polling stations."
    },
    "2019": {
        title: "17th Lok Sabha General Election",
        dates: [
            { label: "Announcement", date: "March 10, 2019" },
            { label: "Phase 1 Polling", date: "April 11, 2019" },
            { label: "Phase 7 Polling", date: "May 19, 2019" },
            { label: "Counting Day", date: "May 23, 2019" }
        ],
        stats: [
            { label: "Eligible Voters", value: "912 Million" },
            { label: "Total Phases", value: "7" },
            { label: "Voter Turnout", value: "67.4%" }
        ],
        highlights: "Recorded the highest voter turnout in the history of Indian general elections. VVPATs were used in all EVMs."
    },
    "2014": {
        title: "16th Lok Sabha General Election",
        dates: [
            { label: "Announcement", date: "March 5, 2014" },
            { label: "Phase 1 Polling", date: "April 7, 2014" },
            { label: "Phase 9 Polling", date: "May 12, 2014" },
            { label: "Counting Day", date: "May 16, 2014" }
        ],
        stats: [
            { label: "Eligible Voters", value: "814.5 Million" },
            { label: "Total Phases", value: "9" },
            { label: "Voter Turnout", value: "66.4%" }
        ],
        highlights: "Introduction of the NOTA (None Of The Above) option on EVMs for a general election, giving voters the right to reject candidates."
    }
};
