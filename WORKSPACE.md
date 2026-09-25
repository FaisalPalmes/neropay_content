# Workspace: where every file lives

Written 25 Sep 2026 for Faisal's home PC (internal drive `D:`, updated from `H:` the same day), the Samsung SSD, the MacBook and Google Drive. A local Claude Code session
reads this first (with `LOCAL-HANDOVER.md`) and builds the folders from §5. One rule sits above the rest: **the register (`library.js`) is the
record, and folders are only storage.** Moving a file to an `Approved` folder does not approve it.

## 1. Who holds what

| Place | Drive | Role | Holds |
|---|---|---|---|
| PC internal drive | `D:` (`D:\01 Client Work\nPanda`) | The engine room | This repo (code), Claude Code sessions, DaVinci's project library, tools, temp |
| Samsung SSD | `E:` | Active work | Media for pieces in progress: generations, plates, screens, DaVinci media and cache, renders |
| Google Drive | `G:` (Drive for desktop) | Library and record | Brand, references, approved masters, everything delivered, operations, archive |

The loop: generate → work on `E:` → Faisal approves → master to Drive → `backup: true` in `library.js`.

- **Code never goes on the SSD.** Git and `node_modules` break on exFAT, and they differ between Windows and Mac. Each
  machine keeps its own clone; GitHub keeps them in step. Pull before you start, push when you finish.
- **Claude Code history stays on the machine that ran it.** Continuity comes from this repo, not from session history.
  To work from the MacBook, leave the PC on and run `claude remote-control` in the repo folder so the PC session appears
  in the Claude Code app.
- **Big media never goes in git.** It lives on `E:` while it is worked on and on Drive once it is approved.

## 2. The SSD (`E:`)

- **Format: NTFS, kept** (Faisal, 25 Sep 2026). The SSD stays at home, plugged into the PC. The MacBook doesn't
  write to it (NTFS is read-only on a Mac); Faisal drives the PC session from the MacBook with `claude remote-control`
  instead. If that changes, the switch to exFAT is: copy everything off, erase it as ExFAT with a GUID Partition Map,
  copy it back.
- **Always eject before unplugging.** A pull mid-write can corrupt what is being written.
- **The letter stays `E:`.** Pin it in Windows Disk Management (right-click the volume → Change Drive Letter) so paths
  never move.
- The new work lives in `E:\nPanda\`, so what is already on the SSD is untouched.

## 3. Google Drive

`My Drive / 01 - PROJECTS / 01 - CLIENTS / 02 - nPanda / nPanda` (created 25 Sep 2026). `nPanda - OLD` beside it is
the previous work and is left alone. On the PC it appears under `G:\My Drive\...` through Drive for desktop; confirm
the letter on the machine. Use it to archive and deliver. Don't edit video straight off it: streamed files are slow.

| Folder | Drive ID |
|---|---|
| nPanda | `12jwcrVMDgqHRjHe1-nitYAvAoGQSMU3p` |
| 00_Inbox | `1WJR5MJyYSzySnLOu5E8HYaiE3MprEfZi` |
| 01_Brand | `1vpHCdi3ExIetXwfApS_atGWsp6_v0yho` (Logos, Fonts, Sting-Outro, Guidelines) |
| 02_Video | `1kONMx4JLXtFmbBRPTPtTg_KaM7p5mGEQ` (Masters `1oC_AsmQrYzsNIy2YzUVaHy5KTY3_E9VQ`, Delivered `13YNrxKSJ50nK11TvfO276LqwYhnh0pMQ`) |
| 03_Motion | `1wtEKN6y5iQBHaSzr63frauGOpSDR7b1p` (Masters `14VWzurmEQRTNIC9VsUvFHCvx-rSOTu65`, Delivered `16Nj1SfROfZI-9F6va8gee2vxYlB05Z7M`) |
| 04_Images | `1VUd2Z38fE1rwX0Jtdzge-pthiYzgtE6Y` (Approved, Delivered, Templates) |
| 05_Paid-Ads | `1BdUef36B-5PwSgrtUOmCQi3DAxU_5hlK` (01_Inspiration, 02_Briefs, 03_Statics and 04_Video-Ads each with Working · Review · Approved, 05_Live, 06_Retired) |
| 07_Audio | `1xTadefZxc_US3DhsmsxN3WXQSDHH5zQp` (Voiceovers, Music, SFX) |
| 08_Reference | `1FY90_t2thfelhunE1zSvT5BcF580ZYPn` (Moodboards, Character-Sheets, Screen-Recordings) |
| 09_Operations | `1Yxe3mkRIIJ8hyrpj2gyuONMhXK1O_JG3` (Registers, Calendars, Compliance, Handovers, Tool-Accounts) |
| 99_Archive | `1QQx7ZDOTqt0V2h8y_uh4NuHTBVvZDJIR` |

The numbers are the same in every place: `02_Video` is video on the SSD and on Drive. `06` is left free for organic
social if it ever needs its own home. No passwords go in `Tool-Accounts`: it records what each tool is for and costs.

## 4. The trees

```
D:\01 Client Work\nPanda\          NeroPay only; other clients live beside it in 01 Client Work
├─ CLAUDE.md                 short: "read repos\neropay_content\WORKSPACE.md", plus the drive letters
├─ repos\
│  └─ neropay_content\       the git clone; start sessions here
├─ davinci\
│  ├─ project-library\       Resolve's project database; export .drp to Drive to back it up
│  └─ gallery\               grade stills
├─ tools\                    ffmpeg, a Python venv, anything the pipeline installs
└─ scratch\                  temp only; safe to empty

E:\nPanda\
├─ 00_Inbox\                 downloads land here; sorted into a piece the same day
├─ 02_Video\                 presenter and Higgsfield live action
├─ 03_Motion\                motion graphics, HyperFrames
├─ 04_Images\                statics, cards, carousels
├─ 05_Paid-Ads\              ad creative in progress
├─ 07_Audio\                 voiceovers, music, sfx in progress
├─ _DaVinci-Cache\           render and optimised-media cache (on the SSD for speed)
└─ _Template\                copy this to start a piece
   ├─ 01_Brief\              brief, prompts, references
   ├─ 02_Source\             raw generations, untouched
   ├─ 03_Plates\             clips prepped for compositing
   ├─ 04_Screens\            app screens, cards, overlays
   ├─ 05_Project\            DaVinci / Fusion comps, tracks
   ├─ 06_Renders\            drafts: v01, v02…
   └─ 07_Exports\            16x9 · 9x16 · 1x1 · 4x5
```

A piece is one folder named by its register ID: `E:\nPanda\02_Video\MA02_mobile-apps-live\`. Files are named
`ID_vNN_crop_YYYY-MM-DD.ext`, e.g. `MA02_v03_16x9_2026-09-25.mp4`.

## 5. Build it (PowerShell, on the PC)

```powershell
$h = 'D:\01 Client Work\nPanda'
'repos','davinci\project-library','davinci\gallery','tools','scratch' | % { New-Item -ItemType Directory -Force "$h\$_" | Out-Null }
$e = 'E:\nPanda'
'00_Inbox','02_Video','03_Motion','04_Images','05_Paid-Ads','07_Audio','_DaVinci-Cache' | % { New-Item -ItemType Directory -Force "$e\$_" | Out-Null }
'01_Brief','02_Source','03_Plates','04_Screens','05_Project','06_Renders','07_Exports\16x9','07_Exports\9x16','07_Exports\1x1','07_Exports\4x5' |
  % { New-Item -ItemType Directory -Force "$e\_Template\$_" | Out-Null }
git clone https://github.com/FaisalPalmes/neropay_content.git "$h\repos\neropay_content"
Set-Content "$h\CLAUDE.md" "Workspace root. Read repos\neropay_content\WORKSPACE.md first. Internal D:, SSD E: (E:\nPanda), Google Drive G:."
```

Start a session with access to all three:

```powershell
cd "D:\01 Client Work\nPanda\repos\neropay_content"
claude --add-dir E:\nPanda --add-dir "G:\My Drive\01 - PROJECTS\01 - CLIENTS\02 - nPanda\nPanda"
```

The MacBook mirrors it: the repo at `~/NeroPay/repos/neropay_content`, the SSD at `/Volumes/<label>/nPanda`, and Drive
under `~/Library/CloudStorage/`.
