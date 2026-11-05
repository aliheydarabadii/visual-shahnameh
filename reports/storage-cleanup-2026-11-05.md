# Storage cleanup, 2026-11-05

Generated raster sources and four uncompressed check scores were removed after the shipped AVIF files and the replacement audio were verified. Existing `public/art` files were not rewritten. Net generated-file reclaim is **646,751,612 bytes**.

Removed file inventory: `work/storage-cleanup-2026-11-05/removed-files.json` (82 files, 659,758,659 bytes). The four replacement M4A files are larger than the truncated ones they replaced by 13,007,047 bytes, which is already subtracted in the net figure.

## Directories

Byte counts are sums of file sizes (`st_size`), taken before any deletion. `public/art` is unchanged. `art/incoming` was removed after it was empty.

| Path | Before (bytes) | Before (files) | After (bytes) | After (files) |
| --- | ---: | ---: | ---: | ---: |
| `art/incoming` | 287,674,871 | 78 | 0 | 0 |
| `public/art` | 217,945,163 | 460 | 217,945,163 | 460 |
| `work/checks` | 754,467,562 | 164 | 395,390,821 | 160 |
| `art` | 290,172,953 | 204 | 2,498,082 | 126 |
| whole tree | 1,413,210,485 | 8,475 | 766,859,064 | 8,415 |

`work/checks` fell by 359,076,741 bytes: 372,083,788 of WAV minus 13,007,047 of M4A growth. `art` fell by exactly the 287,674,871 bytes of incoming PNGs. Allocated-block sizes are in `work/storage-cleanup-2026-11-05/before-bytes.json` and `after-bytes.json`.

The whole-tree after measurement includes this report, the audit records, and 109,524 bytes of files outside this cleanup that changed while it ran. Those other files were left as they were. The final whole-tree total is `repo_all` in `after-bytes.json`.

## Shipped paintings

All 460 AVIF files were hashed and decoded before anything was deleted. Every file loads and is 1536×1024. Combined SHA-256 manifest:

`910eade086e4ecfc02d797ecb8fb9fb631a5d95a2abad7d81ba2052b5d34b54e`

The same manifest matched after cleanup (`public-art-compare.json`, `identical: true`). Nothing under `public/art` was deleted or recompressed. The shipped files stay the existing q70 4:4:4 encodes.

All 40 section modules still resolve. 459 `art(...)` paintings and the shared light layer `public/art/01-01/layer-abr.avif` are present, and each still has the hash recorded before cleanup (`section-image-refs-after.json`).

## Incoming PNGs

78 PNGs, 287,674,871 bytes. All were sources for finished sections 07.13–07.17. Each PNG decoded at 1536×1024. No non-raster files were in `art/incoming`.

57 files (206,826,055 bytes) have a shipped derivative. The derivative path is `public/art/<section>/<same-stem>.avif`. For each one, the AVIF loads at 1536×1024, the dimensions match the PNG, the section module references that stem, and `art/manifest-<section>.json` lists the PNG. Match is stem, decode, and dimensions. The AVIF encode is lossy, so the pixels were not compared, and the AVIF was not written again.

21 files (80,848,816 bytes) are rejected, unused, or late duplicates. No AVIF uses that stem, the manifest does not list them, and the section module does not reference them. Every image that section does reference already loaded.

| Folder | Files | Bytes | Role |
| --- | ---: | ---: | --- |
| `07-13-kia-late` | 1 | 3,590,514 | source of the shipped painting |
| `07-14-kia-late` | 18 | 65,942,659 | 16 shipped sources; `08-sajdeh.png` and `17-pil.png` superseded |
| `07-14-unused` | 5 | 20,086,181 | earlier rejects (`08-sajdeh`, `08-sajdeh-2`, `17-pil`, `21-shir`, `22-kineh`) |
| `07-15-unused` | 2 | 8,214,185 | earlier rejects (`06-narvan`, `07-arus`); shipped names are the `-2` stems |
| `07-16-sources` | 21 | 75,460,492 | 16 shipped sources; five unsuffixed stems superseded by `-2` |
| `07-17-sources` | 31 | 114,380,840 | 24 shipped sources; seven earlier stems left unused |

Empty directories removed: those six folders and `art/incoming`.

Kept: `art/prompts/` (40 files), `art/manifest-*.json` (40), `art/characters/` (45), and `art/STYLE.md`.

## Check audio

`check_section.mjs` encodes with `ffmpeg` AAC at 128k and measures loudness in the same process. `ebur128` fills stderr, `spawnSync` stops the process at its default buffer, and the M4A is left short. All four leftover encodes had stopped at 853.751020 seconds. The WAVs were still complete. Loudness was already measured and stored; it was not measured again.

Each WAV was encoded with `ffmpeg -hide_banner -nostats -loglevel error -c:a aac -b:a 128k`. Stderr was empty. The new file was decoded, its duration matched the WAV, and only then did it replace the short M4A and the WAV get deleted.

| Section | WAV | Short M4A | Full M4A | Full M4A bytes | LUFS |
| --- | ---: | ---: | ---: | ---: | ---: |
| 05.02 | 863.980000 s | 853.751020 s | 863.980000 s | 13,836,993 | −22.6 |
| 06.06 | 1460.870023 s | 853.751020 s | 1460.870023 s | 23,611,796 | −21.5 |
| 07.14 | 932.470023 s | 853.751020 s | 932.470023 s | 15,010,753 | −21.1 |
| 07.17 | 961.315011 s | 853.751020 s | 961.315011 s | 15,461,122 | −21.7 |

Codec is AAC, 22050 Hz, stereo. LUFS values are the direct readings in `work/orchestration-2026-11-04/supplemental-loudness.json` (logs `loudness-05-02.log`, `loudness-06-06.log`, `loudness-07-14.log`, `loudness-07-17.log`). WAV bytes removed: 76,203,080; 128,848,780; 82,243,900; 84,788,028.

The other 36 sections already had only `score.m4a`. Those files were not re-encoded. No `score.wav` remains.

`work/checks` still has, for every section, `result.json`, `sheet-desktop.jpg`, `sheet-phone.jpg`, and `score.m4a` (160 files). No other check raster frames were present, so none were removed.

## Retained

- All 460 files in `public/art`.
- Prompts, manifests, character sheets, and `art/STYLE.md`.
- Check results, contact sheets, the 40 M4A scores, and orchestration logs.
- `source/`, `text/`, scripts, section modules, UI, docs, `.git`, `node_modules`, and `.venv`.
- No user-attachment files were in the deleted set.

## Audit records

`work/storage-cleanup-2026-11-05/`

- `before-bytes.json`, `after-bytes.json`
- `public-art-before.json`, `public-art-compare.json`
- `incoming-audit.json`, `removed-files.json`
- `audio-before.json`, `audio-after.json`
- `section-image-refs-before.json`, `section-image-refs-after.json`

Whole tree after this report and the audit records: 766,859,064 bytes in 8,415 files. Concurrent edits outside this cleanup account for 109,524 of those bytes.
