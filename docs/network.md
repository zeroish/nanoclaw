# Network Configuration - Olympus

## Overview

Olympus is the home server running NanoClaw. It operates behind a home network firewall with remote access provided via Tailscale mesh VPN.

## Host Network

| Address | Purpose | Accessible from |
|---|---|---|
| `192.168.4.48` | LAN IP (Olympus on home network, DHCP static) | Home LAN only |
| `100.100.192.35` | Tailscale IP (encrypted mesh VPN) | Anywhere with Tailscale |
| `olympus.tail2e25.ts.net` | Tailscale DNS name | Anywhere with Tailscale |

## Local Services

Services within the Olympus LAN can reach the server via:
- `192.168.4.48` (direct LAN IP)
- Hostname resolution via AdGuard

Services use service-specific subdomains under `*.ivy.cintron.xyz` (LAN HTTPS via Caddy):
- `olympus.ivy.cintron.xyz` - Caddy reverse proxy / host management
- See `zeroish/init` for service subdomain registry

## Remote Access

### SSH from outside network

```bash
# Via Tailscale IP
ssh gilmatic@100.100.192.35

# Via Tailscale DNS name
ssh gilmatic@olympus.tail2e25.ts.net
```

### Prerequisites

- Tailscale client installed and running on your machine
- Authenticated to the shared Tailscale network
- SSH key-based authentication configured

### Service access from outside network

Remote access to web services (Caddy-managed) requires:
1. Tailscale connectivity to 100.100.192.35
2. Service subdomains may not resolve externally; use IP address or local DNS

## DNS Resolution

### LAN DNS (internal)
- AdGuard at `192.168.4.52` handles DNS for `*.ivy.cintron.xyz` and other local domains
- Route53 handles public DNS

### Tailscale DNS
- Tailscale provides automatic DNS for tailnet machines
- Hostname: `olympus.tail2e25.ts.net`

## Service Discovery

NanoClaw services expose via:
- LAN: `http://192.168.4.48:<port>` or `https://<service>.ivy.cintron.xyz`
- Remote (Tailscale): `http://100.100.192.35:<port>`

## Security Model

- **Tailscale**: End-to-end encrypted mesh VPN, no direct internet exposure
- **LAN HTTPS**: Caddy manages TLS for service subdomains (Route53 DNS-01 validation)
- **SSH**: Key-based auth only, no password login
- **Firewall**: Home network NAT blocks unsolicited inbound connections

## Related

- Network topology decisions: `zeroish/init` (LAN HTTPS milestone #1, issues #39-42)
- Service configuration: See individual service docs in nanoclaw/
- Security model: See `gilmatic/ivy/spec/security-model.md`
