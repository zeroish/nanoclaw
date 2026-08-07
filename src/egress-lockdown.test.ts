import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

import { EGRESS_NETWORK, egressNetworkArgs } from './egress-lockdown.js';
import { FULL_EGRESS_NETWORK } from './config.js';

describe('egressNetworkArgs', () => {
  it('places the container on the locked-down egress network only', () => {
    expect(egressNetworkArgs()).toEqual(['--network', EGRESS_NETWORK]);
  });
});

describe('fullEgressNetworkArgs (structural)', () => {
  // Exercising the real function calls execFileSync against the live Docker
  // daemon (network create), so this is guarded structurally rather than run
  // end-to-end here. See container-runner.test.ts for the call-site invariant.
  it('creates the full-egress network without --internal (needs a real internet route)', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src', 'egress-lockdown.ts'), 'utf-8');
    const fn = src.match(/function ensureFullEgressNetwork\(\)[\s\S]*?\n\}/);
    expect(fn).not.toBeNull();
    expect(fn![0]).not.toContain('--internal');
  });

  it('attaches both the full-egress network and the locked-down egress network', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src', 'egress-lockdown.ts'), 'utf-8');
    const fn = src.match(/export function fullEgressNetworkArgs\(\)[\s\S]*?\n\}/);
    expect(fn).not.toBeNull();
    expect(fn![0]).toContain("'--network', FULL_EGRESS_NETWORK");
    expect(fn![0]).toContain("'--network', EGRESS_NETWORK");
  });

  it('names the full-egress network distinctly from the locked-down egress network', () => {
    expect(FULL_EGRESS_NETWORK).not.toBe(EGRESS_NETWORK);
    expect(FULL_EGRESS_NETWORK).toBe('nanoclaw-full-egress');
  });
});
