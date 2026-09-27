# ADIE — OWASP ASVS 5.0.0 Public Evidence

Public evidence companion for the ADIE ASVS validation work completed on 27 September 2026.

## Current recorded results

- 181 ASVS requirements mapped
- 40 Level 1 requirements
- 141 Level 2 requirements
- 1,473 automated tests passed
- 0 test failures
- 2 warnings
- 4 requirement-specific evidence records sealed: V1.1.1, V1.1.2, V1.3.3, V1.3.6

## Evidence boundary

The 1,473 / 0 figure is the result of the current isolated-lab automated regression suite. It is not, by itself, a claim that every one of the 181 ASVS requirements passed.

The public evidence package separates automated regression results from requirement-specific evidence and preserves the original MVR record unchanged.

No production API source was modified during this closure work, and security controls were not relaxed to obtain passing results.

## Integrity

The final evidence snapshot was sealed with SHA-256:

f4da56b067f4a74cda7da83670701849fd7b54a188985271d83c4d340ba62ad1

This is a sanitized public evidence layer. Internal source code, private audit packages, local filesystem paths and internal adjudication artifacts are not published here.

## Files

- [Public ASVS evidence summary](asvs_public_summary.json)
- [Regression result](asvs_regression_result.txt)
- [Requirement-specific closure](asvs_requirement_specific_closure.json)
- [Evidence integrity record](asvs_integrity_sha256.txt)
- [Scope and claim boundary](asvs_scope_and_boundaries.md)
