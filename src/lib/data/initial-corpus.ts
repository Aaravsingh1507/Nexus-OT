import { IndustrialDocument, GraphNode, GraphEdge, ComplianceRule, IncidentReport } from '@/types';

export const INITIAL_DOCUMENTS: IndustrialDocument[] = [
  {
    id: 'doc-maint',
    title: 'Maintenance Log — CB-204 Gas Blower (Q1 2025)',
    type: 'maintenance_log',
    tag: 'CB-204',
    facility: 'Unit-3 Coke Oven Battery',
    dateAdded: '2025-02-21',
    version: '1.2',
    summary: 'Preventive and corrective maintenance log on Coke Oven Gas Blower CB-204 covering vibration measurements, flange wear, and lubrication downtime windows.',
    chunks: [
      "Entry 14-Jan-2025: CB-204 coke oven gas booster blower showing elevated vibration (6.2 mm/s RMS on drive-end bearing, threshold 7.5 mm/s per OEM). Bearing housing temperature nominal at 64°C. No immediate trip required; flagged for next scheduled bi-monthly inspection window.",
      "Entry 02-Feb-2025: Gasket on CB-204 discharge flange shows early-stage wear and discoloration during visual walkdown inspection. Replacement not yet due per OEM 18-month calendar interval. Logged in CMMS tag #CB204-GASKET for tracking.",
      "Entry 20-Feb-2025: Planned 4-hour maintenance window opened on CB-204 for bearing lubrication and shaft alignment check, 09:00–13:00 IST. Blower taken to reduced-load mode (35% capacity), not fully isolated with blind spades. Shift Supervisor: R. K. Sharma."
    ]
  },
  {
    id: 'doc-pid',
    title: 'P&ID Annotation & Isolation Schedule — Zone GL-12 (Rev C)',
    type: 'pid_drawing',
    tag: 'GL-12',
    facility: 'Unit-3 Coke Oven Battery',
    dateAdded: '2023-11-15',
    version: 'Rev C',
    summary: 'Engineering drawing notes and piping specifications for coke oven gas transmission line GL-12, manual isolation valve V-45, and hazardous zone perimeter.',
    chunks: [
      "Gas line GL-12 (coke oven gas, operating pressure 0.35–0.50 barg, design temp 120°C, 350mm NB carbon steel ASTM A106 Gr B) runs 11 metres from CB-204 blower discharge housing to manual isolation valve V-45, within the designated Class 1 Div 1 hazardous gas zone of Unit-3 Coke Oven Battery.",
      "Isolation valve V-45 is a manually operated flanged plug valve; no remote emergency shutoff valve (MOV or ESD) is installed on this line segment as of drawing Rev C (dated Nov 2023). Any hot work within 15m radius requires nitrogen purging or positive blinding up to V-45."
    ]
  },
  {
    id: 'doc-sop',
    title: 'SOP-118 — Hot Work & Confined Space Entry Near Gas Lines',
    type: 'safety_sop',
    tag: 'SOP-118',
    facility: 'Bhilwara Steel & Alloys All Units',
    dateAdded: '2024-04-10',
    version: '3.1',
    summary: 'Standard Operating Procedure governing work permit issuance, atmospheric gas testing intervals, and simultaneous operations (SIMOPS) near active combustible gas conduits.',
    chunks: [
      "SOP-118 Section 4.2 requires mandatory pre-work atmospheric testing and continuous or 30-minute-interval portable multi-gas detector testing (O2, LEL, H2S, CO) for any hot work or spark-producing activity within a 15-metre radius of an active coke oven gas conduit.",
      "SOP-118 Section 4.5: Permit approval requires joint physical inspection and sign-off by Shift Safety Officer and Area Maintenance In-charge, verifying that no incompatible simultaneous operations (SIMOPS) are scheduled in the same hazard envelope.",
      "CRITICAL OPERATIONAL GAP NOTED: SOP-118, as currently executed in SAP PM / paper permit desk, does not require the work permit system to automatically query or cross-check the equipment maintenance schedule (e.g. active blower reduced-load maintenance windows) before issuing a hot work permit in the overlapping zone."
    ]
  },
  {
    id: 'doc-oisd-118',
    title: 'OISD-STD-118 — Fire Prevention & Safety in Coke Oven Batteries',
    type: 'regulatory_standard',
    tag: 'OISD-STD-118',
    facility: 'Statutory / Petroleum & Chemical Safety',
    dateAdded: '2023-01-01',
    version: '2023 Ed',
    summary: 'Indian Oil Industry Safety Directorate mandatory standard for fire safety, gas monitoring, and work permit verification in hydrocarbon and by-product processing units.',
    chunks: [
      "OISD-STD-118 Clause 6.4: Mandates continuous calibrated gas monitoring in any coke oven battery zone during maintenance, hot work, or confined space activity, regardless of physical distance to adjacent gas-carrying equipment when pressurized lines are within 15 metres.",
      "OISD-STD-118 Clause 8.2: The safety permit-to-work system must integrate an automated or verified checklist accounting for concurrent operational and maintenance activities on all equipment within the same blast/hazard zone, ensuring no non-isolated equipment is maintained simultaneously with adjacent spark-generating work."
    ]
  },
  {
    id: 'doc-oisd-105',
    title: 'OISD-STD-105 — Work Permit System & Hazardous Area Isolation',
    type: 'regulatory_standard',
    tag: 'OISD-STD-105',
    facility: 'Statutory / Work Permit Directorate',
    dateAdded: '2022-08-15',
    version: '2022 Ed',
    summary: 'Mandatory standard governing cold work, hot work, electrical isolation lock-out/tag-out (LOTO), and statutory gas testing protocols.',
    chunks: [
      "OISD-STD-105 Clause 4.1.2: A Hot Work Permit is strictly invalid if atmospheric gas testing has not been executed within 30 minutes prior to initiation of work, or if re-testing intervals exceed 30 minutes in zones where fugitive emission sources exist.",
      "OISD-STD-105 Clause 5.3: Prior to issuing permits for work in flammable atmospheres, positive mechanical isolation (spectacle blinds or physical disconnection with blind flanges) is mandatory. Operating under partial throttling or reduced load is prohibited during adjacent hot work."
    ]
  },
  {
    id: 'doc-factories-act',
    title: 'The Factories Act 1948 (Amended) — Section 31 & 36 Compliance',
    type: 'regulatory_standard',
    tag: 'ACT-1948',
    facility: 'Statutory / Directorate of Industrial Safety & Health',
    dateAdded: '2021-06-01',
    version: 'Central Act 63',
    summary: 'Statutory requirements governing pressure plant integrity testing, dangerous gas precautions in confined spaces, and occupier liability for hazardous processes.',
    chunks: [
      "Section 31 (Pressure Plant): All pressure vessels and gas transmission systems operating above atmospheric pressure must undergo hydrostatic/non-destructive thickness testing at intervals not exceeding 12 months by a certified Competent Person, and logs must be maintained in Form 8.",
      "Section 36 & 36A (Precautions against dangerous fumes & explosive gases): No person shall enter or remain in any chamber, tank, vat, pit, or confined space where dangerous gas or vapor is present, unless all practicable measures including isolation valves and continuous gas venting have been certified safe."
    ]
  },
  {
    id: 'doc-incident',
    title: 'Near-Miss Incident Investigation Report — INC-0225 (20-Feb-2025)',
    type: 'incident_report',
    tag: 'INC-0225',
    facility: 'Unit-3 Coke Oven Battery',
    dateAdded: '2025-02-25',
    version: 'Final RCA',
    summary: 'Comprehensive Root Cause Analysis (RCA) on the gas detector alarm triggered near line GL-12 during concurrent hot work permit and CB-204 maintenance.',
    chunks: [
      "Incident Summary: At 10:40 AM on 20-Feb-2025, a hot work permit (HW-2025-0418) was active for steam tracing pipe insulation repair 9 metres from gas conduit GL-12. At 10:44 AM, fixed gas detector GD-12A triggered an audio-visual alarm at 22% LEL (Lower Explosive Limit) coke oven gas concentration, initiating emergency hot work cessation.",
      "Investigation Timeline & Root Cause: At the time of the alarm, blower CB-204 was operating in a non-isolated reduced-load maintenance state for bearing lubrication. Gas testing prior to alarm had last been performed at 10:10 AM (34 minutes elapsed), exceeding the 30-minute interval prescribed by SOP-118 and OISD-105. Root Cause: Permit approval and maintenance scheduling reside in disconnected silos with zero automated cross-check.",
      "Immediate Corrective Actions: (1) Immediate revision of SOP-118 to mandate digital interlock between SAP PM maintenance windows and work permit approvals; (2) Replacement of degraded flange gasket on CB-204 before resuming full-capacity throughput."
    ]
  },
  {
    id: 'doc-oem',
    title: 'OEM Technical Manual — Model BX-450 Coke Oven Gas Blower',
    type: 'oem_manual',
    tag: 'CB-204',
    facility: 'Howden-Spirax Industrial Blower Division',
    dateAdded: '2020-03-12',
    version: 'Manual Rev 4',
    summary: 'Manufacturer operational specifications, vibration thresholds, gasket replacement lifecycle, and overhaul criteria for Model BX-450 gas blowers.',
    chunks: [
      "Flange Gasket Specifications: Model BX-450 discharge flange utilizes corrugated metal-jacketed graphite-filled gaskets (DN350 PN16). Rated service life is 18 months under normal operating temperature (<140°C), or mandatory immediate replacement if visual surface degradation exceeds Grade 2.0 on the OEM 5-point wear matrix.",
      "Vibration Monitoring Limits: Normal operation: <4.5 mm/s RMS. Alarm / Attention threshold: 4.5–7.0 mm/s RMS. Immediate scheduled trip / shutdown threshold: >7.5 mm/s RMS sustained for >15 minutes. Continued operation above 6.5 mm/s RMS accelerates mechanical seal fatigue and increases fugitive gas seepage."
    ]
  },
  {
    id: 'doc-inspection',
    title: 'Statutory Inspection Report — Q1 2026 Rotating Equipment Audit',
    type: 'inspection_report',
    tag: 'CB-204',
    facility: 'Unit-3 Coke Oven Battery',
    dateAdded: '2026-03-10',
    version: 'Signed Audit',
    summary: 'Third-party statutory inspection by Competent Person reviewing mechanical integrity, vibration trends, and compliance of rotating equipment in by-product area.',
    chunks: [
      "CB-204 Audit Finding (08-Mar-2026): Visual inspection of the CB-204 discharge flange gasket assessed surface micro-cracking and graphite displacement at Grade 2.5 wear—exceeding the OEM's immediate replacement threshold of Grade 2.0. Vibration measured at 6.8 mm/s RMS, trending upward from 6.2 mm/s in Jan 2025.",
      "Audit Statutory Notice: Gasket replacement must be formally executed within 60 calendar days (before 07-May-2026). Mandatory condition: Any scheduled maintenance shutdown must be cross-checked against active hot work permits in Zone GL-12 to avoid recurrence of Near-Miss Incident INC-0225."
    ]
  },
  {
    id: 'doc-moc',
    title: 'MOC-2025-014 — Proposed Remote Isolation Actuator for Valve V-45',
    type: 'management_of_change',
    tag: 'V-45',
    facility: 'Unit-3 Coke Oven Battery',
    dateAdded: '2025-04-18',
    version: 'Engineering Review',
    summary: 'Management of Change proposal to replace manual plug valve V-45 on gas line GL-12 with a SIL-2 rated pneumatic fail-safe emergency shutdown valve (ESDV).',
    chunks: [
      "Engineering Justification: Following Near-Miss INC-0225 and OISD-STD-118 audit observations, manual plug valve V-45 takes 8–12 minutes for an operator in full breathing apparatus to physically reach and close during an offshore or plant leak scenario.",
      "Proposed Modification: Retrofit V-45 with an ATEX-certified pneumatic quarter-turn spring-return actuator connected to the Unit-3 distributed control system (DCS) with triple-redundant solenoid valves. Status: Awaiting budget allocation for Q3 2026 turnaround."
    ]
  }
];

export const INITIAL_GRAPH_NODES: GraphNode[] = [
  {
    id: 'facility-unit3',
    label: 'Unit-3 Coke Oven Battery',
    sub: 'FACILITY ZONE',
    type: 'zone',
    desc: 'The primary coal carbonization and by-product hazard zone housing gas blowers, conduits, isolation headers, and ammonia recovery units.',
    sources: ['doc-pid', 'doc-oisd-118'],
    x: 450,
    y: 50
  },
  {
    id: 'cb-204',
    label: 'CB-204 Gas Blower',
    sub: 'EQUIPMENT / ASSET',
    type: 'equipment',
    desc: 'Heavy-duty coke oven gas booster blower (Model BX-450). Active in Feb 2025 near-miss under reduced load; flagged in Q1 2026 inspection for Grade 2.5 gasket wear.',
    sources: ['doc-maint', 'doc-oem', 'doc-inspection'],
    x: 230,
    y: 190
  },
  {
    id: 'gl-12',
    label: 'Gas Line GL-12',
    sub: 'PRESSURIZED CONDUIT',
    type: 'equipment',
    desc: '350mm NB pressurized coke oven gas transmission line (0.35–0.50 barg) connecting CB-204 blower discharge to isolation valve V-45.',
    sources: ['doc-pid', 'doc-incident'],
    x: 450,
    y: 190
  },
  {
    id: 'v-45',
    label: 'Valve V-45',
    sub: 'MANUAL ISOLATION',
    type: 'equipment',
    desc: 'Manual plug isolation valve on GL-12. Lacks remote emergency actuator (MOC-2025-014 proposed for upgrade).',
    sources: ['doc-pid', 'doc-moc'],
    x: 680,
    y: 190
  },
  {
    id: 'inc-0225',
    label: 'Near-Miss INC-0225',
    sub: 'INCIDENT (20-FEB-2025)',
    type: 'incident',
    desc: '22% LEL gas alarm during simultaneous hot work (9m away) and CB-204 maintenance. Root cause: siloed permit and maintenance scheduling.',
    sources: ['doc-incident'],
    x: 360,
    y: 330
  },
  {
    id: 'maint-window-0225',
    label: 'Maint Window (20-Feb)',
    sub: 'TEMPORAL SCHEDULE',
    type: 'schedule',
    desc: '4-hour planned maintenance window on CB-204 for bearing lube while operating in un-isolated reduced load mode.',
    sources: ['doc-maint', 'doc-incident'],
    x: 180,
    y: 330
  },
  {
    id: 'insp-2026',
    label: 'Q1 2026 Audit Finding',
    sub: 'STATUTORY AUDIT',
    type: 'incident',
    desc: 'Grade 2.5 gasket wear on CB-204 discharge flange; 6.8 mm/s vibration. Mandatory replacement mandated within 60 days.',
    sources: ['doc-inspection'],
    x: 120,
    y: 220
  },
  {
    id: 'sop-118',
    label: 'SOP-118 (Work Permit)',
    sub: 'PROCEDURE',
    type: 'procedure',
    desc: 'Standard Operating Procedure for hot work near gas lines. Flawed: lacks automated interlock with active equipment maintenance windows.',
    sources: ['doc-sop'],
    x: 450,
    y: 440
  },
  {
    id: 'oisd-118',
    label: 'OISD-STD-118',
    sub: 'REGULATORY MANDATE',
    type: 'regulation',
    desc: 'Mandates continuous gas monitoring and integrated concurrent maintenance verification across all equipment in the hazard zone.',
    sources: ['doc-oisd-118'],
    x: 700,
    y: 440
  },
  {
    id: 'oisd-105',
    label: 'OISD-STD-105',
    sub: 'PERMIT TO WORK',
    type: 'regulation',
    desc: 'Strict 30-minute gas testing frequency rule and positive isolation requirement prior to hot work permit validity.',
    sources: ['doc-oisd-105'],
    x: 580,
    y: 330
  },
  {
    id: 'factories-act',
    label: 'Factories Act Sec 31/36',
    sub: 'STATUTORY LAW',
    type: 'regulation',
    desc: 'Indian statutory provisions for periodic pressure plant hydrostatic/NDT certification and dangerous fumes containment.',
    sources: ['doc-factories-act'],
    x: 820,
    y: 270
  },
  {
    id: 'moc-v45',
    label: 'MOC-2025-014',
    sub: 'MANAGEMENT OF CHANGE',
    type: 'procedure',
    desc: 'Proposal to upgrade V-45 manual valve to DCS-operated emergency shutdown valve (ESDV).',
    sources: ['doc-moc'],
    x: 780,
    y: 130
  }
];

export const INITIAL_GRAPH_EDGES: GraphEdge[] = [
  { id: 'e1', from: 'facility-unit3', to: 'cb-204', relationship: 'encloses', label: 'contains' },
  { id: 'e2', from: 'facility-unit3', to: 'gl-12', relationship: 'encloses', label: 'contains' },
  { id: 'e3', from: 'facility-unit3', to: 'v-45', relationship: 'encloses', label: 'contains' },
  { id: 'e4', from: 'cb-204', to: 'gl-12', relationship: 'supplies_gas_to', label: 'discharges into' },
  { id: 'e5', from: 'gl-12', to: 'v-45', relationship: 'terminates_at', label: 'isolated by' },
  { id: 'e6', from: 'cb-204', to: 'insp-2026', relationship: 'flagged_in', label: 'wear Grade 2.5' },
  { id: 'e7', from: 'cb-204', to: 'maint-window-0225', relationship: 'underwent', label: 'reduced load' },
  { id: 'e8', from: 'maint-window-0225', to: 'inc-0225', relationship: 'coincided_with', label: 'SIMOPS overlap' },
  { id: 'e9', from: 'gl-12', to: 'inc-0225', relationship: 'gas_leak_near', label: 'alarm 22% LEL' },
  { id: 'e10', from: 'inc-0225', to: 'sop-118', relationship: 'exposes_gap_in', label: 'no cross-check' },
  { id: 'e11', from: 'sop-118', to: 'oisd-118', relationship: 'compliance_gap', label: 'NON-COMPLIANT GAP', gap: true, evidence: 'OISD-STD-118 mandates permit cross-check for concurrent maintenance; SOP-118 lacks system integration.' },
  { id: 'e12', from: 'sop-118', to: 'oisd-105', relationship: 'governed_by', label: 'gas test rule' },
  { id: 'e13', from: 'cb-204', to: 'factories-act', relationship: 'statutory_inspection', label: 'Sec 31 vessel check' },
  { id: 'e14', from: 'v-45', to: 'moc-v45', relationship: 'under_modification', label: 'actuator retrofit' },
  { id: 'e15', from: 'moc-v45', to: 'oisd-118', relationship: 'improves_compliance', label: 'ESD requirement' }
];

export const INITIAL_COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'comp-1',
    regulation: 'OISD-STD-118',
    clauseNumber: 'Clause 8.2',
    category: 'Work Permit & SIMOPS',
    requirement: 'Work permit system must verify and cross-reference concurrent maintenance activities on all equipment within the same hazard envelope before hot work approval.',
    applicableTo: ['SOP-118', 'Unit-3 Coke Oven Battery', 'CB-204'],
    severity: 'critical',
    currentStatus: 'gap',
    evidenceSummary: 'Incident INC-0225 revealed permit HW-2025-0418 was issued without checking CB-204 maintenance window. Software systems remain disconnected.',
    evidenceDocIds: ['doc-incident', 'doc-sop', 'doc-oisd-118'],
    lastAssessedDate: '2025-02-25',
    suggestedAction: 'Deploy digital permit integration linking SAP PM maintenance work orders directly into the hot work approval gate.'
  },
  {
    id: 'comp-2',
    regulation: 'OEM Blower Specification (Model BX-450)',
    clauseNumber: 'Section 4.1',
    category: 'Asset Integrity',
    requirement: 'Discharge flange gasket must be replaced at 18 months or immediately if surface wear exceeds Grade 2.0 on OEM degradation scale.',
    applicableTo: ['CB-204'],
    severity: 'high',
    currentStatus: 'gap',
    evidenceSummary: 'Q1 2026 statutory inspection recorded Grade 2.5 gasket wear with 6.8 mm/s vibration. Replacement notice pending with 60-day deadline.',
    evidenceDocIds: ['doc-inspection', 'doc-oem'],
    lastAssessedDate: '2026-03-10',
    suggestedAction: 'Schedule positive-blind shutdown of CB-204 to replace discharge flange gasket before 07-May-2026 deadline.'
  },
  {
    id: 'comp-3',
    regulation: 'OISD-STD-105',
    clauseNumber: 'Clause 4.1.2',
    category: 'Atmospheric Gas Testing',
    requirement: 'Gas testing must be executed within 30 minutes prior to hot work start and repeated at intervals not exceeding 30 minutes in flammable gas zones.',
    applicableTo: ['SOP-118', 'Zone GL-12'],
    severity: 'critical',
    currentStatus: 'under_review',
    evidenceSummary: 'SOP-118 text specifies 30-minute interval, but operational practice in INC-0225 showed 34-minute lapse. Automated gas detector logging recommended.',
    evidenceDocIds: ['doc-sop', 'doc-incident', 'doc-oisd-105'],
    lastAssessedDate: '2025-03-01',
    suggestedAction: 'Install automated wireless telemetry telemetry on portable gas monitors to alarm if 30-minute test interval is breached.'
  },
  {
    id: 'comp-4',
    regulation: 'The Factories Act 1948',
    clauseNumber: 'Section 31',
    category: 'Statutory Pressure Plant',
    requirement: 'Annual examination and non-destructive hydrostatic/ultrasonic testing of pressure vessels and gas headers by certified Competent Person.',
    applicableTo: ['GL-12', 'CB-204'],
    severity: 'high',
    currentStatus: 'compliant',
    evidenceSummary: 'Form 8 statutory certificate valid through October 2026. Ultrasonic wall thickness on line GL-12 measured 9.2mm (minimum nominal 7.1mm).',
    evidenceDocIds: ['doc-factories-act', 'doc-inspection'],
    lastAssessedDate: '2025-10-15',
    suggestedAction: 'Maintain scheduled annual inspection calendar for Q3 2026.'
  },
  {
    id: 'comp-5',
    regulation: 'OISD-STD-116 & 118',
    clauseNumber: 'Clause 5.1',
    category: 'Emergency Isolation',
    requirement: 'Remotely operated emergency shutoff valves (ESDV) with fail-safe closure required on volatile gas headers exceeding 250mm diameter.',
    applicableTo: ['V-45', 'GL-12'],
    severity: 'medium',
    currentStatus: 'gap',
    evidenceSummary: 'V-45 is currently a manual plug valve. MOC-2025-014 has been approved by engineering for pneumatic actuator retrofit but awaits turnaround execution.',
    evidenceDocIds: ['doc-pid', 'doc-moc', 'doc-oisd-118'],
    lastAssessedDate: '2025-04-20',
    suggestedAction: 'Expedite procurement of SIL-2 rated pneumatic actuator under MOC-2025-014.'
  }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-0225',
    title: 'Near-Miss Gas Alarm at GL-12 during Hot Work & CB-204 Maintenance',
    severity: 'high',
    status: 'investigating',
    locationZone: 'Zone GL-12 / Unit-3 Coke Oven Battery',
    equipmentIds: ['cb-204', 'gl-12', 'v-45'],
    occurredAt: '2025-02-20T10:44:00+05:30',
    description: 'Fixed combustible gas detector GD-12A triggered 22% LEL alarm while hot work permit HW-2025-0418 was active 9m away on steam lines and CB-204 was undergoing bearing lube under reduced load.',
    rootCause: 'Permit approval process in SAP PM did not check or interlock with active equipment maintenance windows in the same hazard zone. Atmospheric gas testing had lapsed by 34 minutes.',
    correctiveActions: [
      'Revise SOP-118 to mandate digital interlock between work permits and maintenance schedules.',
      'Calibrate and lower fixed gas detector alarm threshold to 15% LEL for early warning.',
      'Replace CB-204 discharge flange gasket to eliminate fugitive emission source.'
    ],
    linkedRegulationIds: ['comp-1', 'comp-3']
  }
];
