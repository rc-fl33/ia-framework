/**
 * NIST CSF 2.0 Crosswalk Helper
 *
 * Maps control characteristics to NIST CSF 2.0 functions for SECURITY FRAMEWORKS ONLY.
 *
 * This is an OPTIONAL crosswalk helper — it is not a universal classifier.
 * Only apply to frameworks where NIST CSF alignment adds value:
 *   - iso-27001, nist-csf, nist-800-53, cis-controls, fedramp
 *
 * Do NOT apply to:
 *   - regulatory frameworks (hipaa, pci-dss, gdpr, dsa, ffiec, soc2)
 *   - quality management frameworks (iso-9001, iso-13485)
 *   - ai governance frameworks (iso-42001, iso-42005, iso-42006, iso-24028, aiuc-1)
 *   - audit methodology frameworks (iso-19011)
 *
 * The pipeline gates this by checking manifest.yaml enrichment_status.framework_category === 'security'.
 */

export const NIST_PHASES = ['GOVERN', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER'] as const;
export type NistPhase = typeof NIST_PHASES[number];

/** Keyword sets per phase — checked against lowercased control ID + title + category */
export const NistPhaseMap: Record<NistPhase, string[]> = {
  GOVERN: [
    'policy', 'policies', 'governance', 'risk management', 'leadership', 'context',
    'scope', 'oversight', 'accountability', 'roles', 'responsibilities', 'authority',
    'strategy', 'charter', 'steering', 'compliance', 'regulatory', 'objective',
    'planning', 'plan', 'program', 'framework', 'management system', 'continual improvement',
    'review', 'audit', 'performance', 'nonconformity', 'corrective action',
  ],
  IDENTIFY: [
    'asset', 'inventory', 'risk assessment', 'supply chain', 'supplier', 'vendor',
    'third party', 'business environment', 'classification', 'categorization',
    'identify', 'discovery', 'mapping', 'register', 'catalog', 'portfolio',
    'dependency', 'criticality', 'prioritization', 'vulnerability assessment',
  ],
  PROTECT: [
    'access control', 'authentication', 'authorization', 'training', 'awareness',
    'data security', 'encryption', 'cryptography', 'configuration', 'change management',
    'hardening', 'patch', 'update', 'firewall', 'network', 'segmentation',
    'backup', 'protection', 'safeguard', 'control', 'physical', 'personnel',
    'secure development', 'code', 'application', 'identity', 'privileged',
  ],
  DETECT: [
    'monitoring', 'detection', 'log', 'logging', 'anomaly', 'alert', 'siem',
    'audit trail', 'event', 'continuous monitoring', 'sensor', 'intrusion',
    'threat intelligence', 'indicator', 'baseline', 'scanning',
  ],
  RESPOND: [
    'incident response', 'incident management', 'communications', 'analysis',
    'mitigation', 'containment', 'eradication', 'notification', 'reporting',
    'escalation', 'forensics', 'investigation', 'response plan',
  ],
  RECOVER: [
    'recovery', 'recovery planning', 'restoration', 'resilience', 'continuity',
    'disaster recovery', 'business continuity', 'bcp', 'rpo', 'rto',
    'lessons learned', 'post-incident', 'improvement', 'reconstitution',
  ],
};

/**
 * Look up the NIST CSF 2.0 phase for a given control.
 * Uses keyword matching on control ID prefix, title, and category.
 * Returns PROTECT as the default when no match is found.
 *
 * Only call this for security framework controls (framework_category === 'security').
 */
export function lookupPhase(controlId: string, title: string, category: string): NistPhase {
  const haystack = `${controlId} ${title} ${category}`.toLowerCase();

  let bestPhase: NistPhase = 'PROTECT';
  let bestScore = 0;

  for (const phase of NIST_PHASES) {
    const keywords = NistPhaseMap[phase];
    let score = 0;
    for (const kw of keywords) {
      if (haystack.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestPhase = phase;
    }
  }

  return bestPhase;
}
