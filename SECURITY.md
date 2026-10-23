<!-- BEGIN MICROSOFT SECURITY.MD V0.0.7 BLOCK -->

## Security

Microsoft takes the security of our software products and services seriously, which includes all source code repositories managed through our GitHub organizations, which include [Microsoft](https://github.com/Microsoft), [Azure](https://github.com/Azure), [DotNet](https://github.com/dotnet), [AspNet](https://github.com/aspnet), [Xamarin](https://github.com/xamarin), and [our GitHub organizations](https://opensource.microsoft.com/).

If you believe you have found a security vulnerability in any Microsoft-owned repository that meets [Microsoft's definition of a security vulnerability](https://aka.ms/opensource/security/definition), please report it to us as described below.

## Reporting Security Issues

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them to the Microsoft Security Response Center (MSRC) at [https://msrc.microsoft.com/create-report](https://aka.ms/opensource/security/create-report).

If you prefer to submit without logging in, send email to [secure@microsoft.com](mailto:secure@microsoft.com).  If possible, encrypt your message with our PGP key; please download it from the [Microsoft Security Response Center PGP Key page](https://aka.ms/opensource/security/pgpkey).

You should receive a response within 24 hours. If for some reason you do not, please follow up via email to ensure we received your original message. Additional information can be found at [microsoft.com/msrc](https://aka.ms/opensource/security/msrc). 

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

  * Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
  * Full paths of source file(s) related to the manifestation of the issue
  * The location of the affected source code (tag/branch/commit or direct URL)
  * Any special configuration required to reproduce the issue
  * Step-by-step instructions to reproduce the issue
  * Proof-of-concept or exploit code (if possible)
  * Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

If you are reporting for a bug bounty, more complete reports can contribute to a higher bounty award. Please visit our [Microsoft Bug Bounty Program](https://aka.ms/opensource/security/bounty) page for more details about our active programs.

## Preferred Languages

We prefer all communications to be in English.

## Policy

Microsoft follows the principle of [Coordinated Vulnerability Disclosure](https://aka.ms/opensource/security/cvd).

<!-- END MICROSOFT SECURITY.MD BLOCK -->

## Node.js tooling security baseline

Use the complete [October 21, 2026 Node.js security releases](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases),
not just a Brotli-specific workaround:

| Node.js line | Minimum patched version | Repository use |
| --- | --- | --- |
| 22.x | 22.23.4 | Local development default in `.nvmrc`; CI |
| 24.x | 24.22.1 | CI |
| 26.x | 26.12.1 | Security reference only; not selected or tested by this repository's CI |

Newer patched releases within the selected major are allowed. CI uses
major-bounded ranges with `check-latest: true` so cached older runtimes cannot
satisfy the selection and newer fixes are retained. Local developers must
explicitly activate the runtime; see [contributor setup](./CONTRIBUTING.md#clone-and-setup).

The full release addresses CVE-2026-105482, CVE-2026-105483,
CVE-2026-106069, CVE-2026-111497, CVE-2026-105481, CVE-2026-106072,
CVE-2026-106074, CVE-2026-106071, and CVE-2026-106073 on the affected
lines identified in the advisory, plus its Node.js 26 ZIP validation fix.
It also updates bundled c-ares, CA certificates, and Undici on all three
lines, OpenSSL on 22/24, and SQLite on 22. Not every issue affects every line.

### Tooling and mobile runtime boundary

This baseline applies to Node.js processes used for dependency installation,
Grunt/Rollup builds, Puppeteer test launching, Expo/Metro development servers,
release/packaging scripts, archive creation, and compression/size reporting.
Include Brotli **encoding-only** jobs in patched-runtime coverage as a
precaution; this does not assert that encoding is vulnerable to the decoder
issue. The checked-in archive helper uses `archiver` with zlib, and the root
lockfile includes `gzip-size`; neither is a reason to exempt the tooling
runtime from the full update.

The published plugin runs in React Native's mobile environment. Hermes and
JavaScriptCore are not Node.js. This baseline does not change SDK code,
framework peers, mobile engines, or the published package's runtime contract.
The legacy sample's Expo/Metro compatibility requires separate validation;
changing Node.js alone does not certify that toolchain.

### Separate dependencies and deployment checks

The root lockfile contains `undici-types` (TypeScript declarations), not a
standalone Undici runtime. No standalone Brotli, c-ares, OpenSSL, or SQLite
package is recorded there. Updating Node.js repairs its bundled libraries,
not independently installed copies. The sample has no committed lockfile,
so its resolved dependencies must be checked separately. Recheck separately
installed copies against applicable advisories when resolving or updating
tooling; do not add dependency overrides for Node.js-bundled fixes.

Repository selections do not establish that every runtime has been deployed:

- GitHub Actions' embedded Node.js interpreters (checkout/setup-node, CodeQL,
  and issue automation) are supplied by the action/runner, not by the
  `setup-node` selection for shell commands.
- Hosted/self-hosted runner images, task-embedded runtimes, shared external
  release/nightly pipelines, and developer/IDE installations need their own
  runtime verification and rollout.
- Consumer build environments and any separately deployed Node.js services
  must be patched independently; upgrading this plugin does not patch them.

Record the actual executable and `process.versions` in each Node.js job,
including packaging/encoding jobs, and verify the supported fixed line before
installing dependencies or processing artifacts. CI reports this information
after runtime setup. Do not treat this repository change as evidence of an
external deployment.
