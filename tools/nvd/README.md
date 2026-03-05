# NVD API Client

**Status:** ✅ Migrated to tools/nvd/client.ts
**Version:** 1.0.0
**Last Updated:** 2026-01-29

---

## Location

```
tools/nvd/client.ts
```

## Migration Complete

Migrated from `tools/pentest/nvd-api/nvd-client.ts` (now removed)

### API Documentation

**Endpoint:** https://services.nvd.nist.gov/rest/json/cves/2.0

**Authentication:**
- Optional: `NVD_API_KEY` in `.env`
- Without key: 5 requests/30 seconds
- With key: 50 requests/30 seconds (10x improvement)

**Rate Limits:**
- No key: 5 req/30s, 10,000 req/day
- With key: 50 req/30s, 100,000 req/day

**Get API Key:** https://nvd.nist.gov/developers/request-an-api-key (free)

---

## Example Usage (After Migration)

```typescript
import { NVDClient } from '@/tools/api';

const client = new NVDClient();

const results = await client.search({
  keyword: 'GraphQL',
  publishedStartDate: '2024-01-01',
  publishedEndDate: '2025-12-31',
  cvssV3Severity: 'HIGH,CRITICAL'
});

console.log(`Found ${results.totalResults} CVEs`);
```

---

## References

- **Existing Client:** `tools/pentest/nvd-api/nvd-client.ts`
