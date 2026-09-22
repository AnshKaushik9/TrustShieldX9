export type ThreatLevel = 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';

export interface ScanResult {
  id: string;
  target: string;
  type: 'URL' | 'FILE' | 'MEDIA' | 'STREAM';
  timestamp: string;
  threatLevel: ThreatLevel;
  trustScore: number;
  details: Record<string, unknown>;
}

export interface SystemStatus {
  mediaModel: 'GREEN' | 'YELLOW' | 'RED';
  urlScanner: 'GREEN' | 'YELLOW' | 'RED';
  chromeExtension: 'GREEN' | 'YELLOW' | 'RED';
  safeScan: 'GREEN' | 'YELLOW' | 'RED';
  database: 'GREEN' | 'YELLOW' | 'RED';
  backend: 'GREEN' | 'YELLOW' | 'RED';
}
