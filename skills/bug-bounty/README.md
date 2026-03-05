# Bug Bounty Skill

Bug bounty testing skill. Use `/bug-bounty` to begin.

Auto-loads program scope from public arkadiyt/bounty-targets-data repository (HackerOne, Bugcrowd, Intigriti, YesWeHack, Federacy) and generates SCOPE.md before delegating to the security agent for 7-phase PTES testing.

## Data Source

All bug bounty program data is fetched from the public repository:
- **Repository:** https://github.com/arkadiyt/bounty-targets-data
- **Update Frequency:** Hourly
- **Supported Platforms:** HackerOne, Bugcrowd, Intigriti, YesWeHack, Federacy
- **Parser:** `tools/bug-bounty/bounty-scope-parser-public.ts` (fetches data directly from GitHub)

No local scraping or VPS infrastructure required.
