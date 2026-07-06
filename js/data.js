/* =========================================================
   NEXUS-OT — Data Layer
   Synthetic document corpus, knowledge graph topology,
   compliance rule definitions.

   Fictional plant: "Bhilwara Steel & Alloys Ltd" — Unit-3
   Coke Oven Battery. Built to demonstrate cross-document
   reasoning, not real records.
========================================================= */

const DOCS = [
  {
    id:'doc-maint', title:'Maintenance Log — CB-204 Gas Blower', type:'Maintenance Log', tag:'CB-204',
    chunks:[
      "Entry 14-Jan-2025: CB-204 coke oven gas blower showing elevated vibration (6.2 mm/s RMS, threshold 7.5). Bearing housing temperature nominal. No immediate action; flagged for next scheduled inspection.",
      "Entry 02-Feb-2025: Gasket on CB-204 discharge flange shows early-stage wear during visual check. Replacement not yet due per OEM interval. Logged for tracking.",
      "Entry 20-Feb-2025: Planned 4-hour maintenance window opened on CB-204 for bearing lubrication, 09:00–13:00. Blower taken to reduced-load mode, not fully isolated."
    ]
  },
  {
    id:'doc-pid', title:'P&ID Annotation Note — Zone GL-12', type:'Engineering Drawing Note', tag:'GL-12',
    chunks:[
      "Gas line GL-12 (coke oven gas, 0.3–0.5 barg) runs 11 metres from CB-204 blower housing to isolation valve V-45, within the designated hazardous gas zone of Unit-3 Coke Oven Battery.",
      "Isolation valve V-45 is manually operated; no remote shutoff is installed on this line segment as of the last drawing revision (Rev C, 2023)."
    ]
  },
  {
    id:'doc-sop', title:'SOP-118 — Hot Work & Confined Space Entry Near Gas Lines', type:'Safety SOP', tag:'SOP-118',
    chunks:[
      "SOP-118 requires continuous or 30-minute-interval gas testing for any hot work or confined space entry within 15 metres of an active coke oven gas line.",
      "Permit approval under SOP-118 requires sign-off from the shift safety officer and confirmation that no incompatible simultaneous operations are scheduled in the same zone.",
      "SOP-118, as currently implemented, does not require the permit system to automatically check the equipment maintenance schedule (e.g. active blower maintenance windows) before issuing a hot work or entry permit in the same zone."
    ]
  },
  {
    id:'doc-oisd', title:'OISD-STD-118 — Fire Prevention in Coke Oven Batteries', type:'Regulatory Guideline', tag:'OISD-STD-118',
    chunks:[
      "OISD-STD-118 mandates continuous gas monitoring in any coke oven battery zone during maintenance, hot work, or confined space activity, regardless of the distance between the maintenance activity and adjacent gas-carrying equipment.",
      "The standard requires that permit-to-work systems account for concurrent maintenance activity on equipment within the same hazard zone, not only for the specific equipment being worked on."
    ]
  },
  {
    id:'doc-incident', title:'Near-Miss Incident Report — 20 Feb 2025', type:'Incident Report', tag:'INC-0225',
    chunks:[
      "At 10:40 on 20-Feb-2025, a hot work permit was active for pipe insulation repair 9 metres from GL-12. A gas detector alarm triggered at 10:44 (reading 22% LEL) during the same window CB-204 was under a planned maintenance reduced-load state.",
      "Investigation found the hot work permit had been approved without cross-referencing the CB-204 maintenance window logged in the maintenance system. Gas testing at time of alarm had last been performed 34 minutes earlier, exceeding the 30-minute interval required by SOP-118.",
      "No injuries occurred. Root cause: permit approval process and equipment maintenance schedule are maintained in separate systems with no automated cross-check, consistent with the gap noted in SOP-118."
    ]
  },
  {
    id:'doc-oem', title:'OEM Manual Excerpt — CB-204 Blower Model BX-450', type:'OEM Manual', tag:'CB-204',
    chunks:[
      "Model BX-450 discharge flange gasket rated service life: 18 months under normal load, or immediate replacement if visual wear exceeds Grade 2 on the OEM wear scale.",
      "Vibration threshold for scheduled shutdown: 7.5 mm/s RMS sustained over 15 minutes. Below threshold, continued operation with monitoring is permitted."
    ]
  },
  {
    id:'doc-inspection', title:'Inspection Report — Q1 2026, Unit-3 Rotating Equipment', type:'Inspection Report', tag:'CB-204',
    chunks:[
      "CB-204 discharge flange gasket assessed at Grade 2.5 wear (OEM scale) as of 08-Mar-2026 — above the OEM's immediate-replacement threshold of Grade 2. Vibration reading 6.8 mm/s RMS, within threshold but trending upward since Jan 2025.",
      "Recommendation: schedule gasket replacement within 60 days. Note: any associated maintenance window should be cross-checked against active hot work permits in the GL-12 zone per the gap identified in incident INC-0225."
    ]
  }
];


/* =========================================================
   KNOWLEDGE GRAPH — nodes & edges
========================================================= */

const NODES = [
  {id:'facility', label:'Unit-3 Coke Oven Battery', sub:'FACILITY ZONE', type:'facility', x:450, y:60,
   desc:'The hazard zone containing the coke oven gas blower, gas line and isolation valve referenced across every document in this corpus.',
   sources:['doc-pid']},
  {id:'cb204', label:'CB-204', sub:'GAS BLOWER', type:'equipment', x:230, y:190,
   desc:'Coke oven gas blower, model BX-450. Under a maintenance window at the time of the Feb 2025 near-miss; flagged again in the Q1 2026 inspection for gasket wear above OEM threshold.',
   sources:['doc-maint','doc-oem','doc-inspection']},
  {id:'gl12', label:'GL-12', sub:'GAS LINE', type:'equipment', x:450, y:190,
   desc:'Coke oven gas line running 11m from CB-204 to isolation valve V-45. Sits inside the 15m hazard radius defined by SOP-118.',
   sources:['doc-pid']},
  {id:'v45', label:'V-45', sub:'ISOLATION VALVE', type:'equipment', x:660, y:190,
   desc:'Manually operated isolation valve on GL-12. No remote shutoff installed as of the latest drawing revision.',
   sources:['doc-pid']},
  {id:'inspection', label:'Q1 2026 Inspection', sub:'FLAGGED FINDING', type:'incident', x:150, y:320,
   desc:'Found CB-204 gasket wear at Grade 2.5 — above the OEM immediate-replacement threshold of Grade 2. Recommends replacement within 60 days and cross-checking any maintenance window against active permits.',
   sources:['doc-inspection']},
  {id:'maintwin', label:'Maintenance Window', sub:'20-FEB-2025, 09:00–13:00', type:'equipment', x:320, y:330,
   desc:'Planned CB-204 bearing lubrication window. Blower was in reduced-load mode, not fully isolated, during this period — the same window in which the near-miss occurred.',
   sources:['doc-maint']},
  {id:'incident', label:'Near-Miss INC-0225', sub:'20-FEB-2025', type:'incident', x:490, y:330,
   desc:'Gas alarm triggered at 22% LEL during a hot work permit active 9m from GL-12, overlapping CB-204\'s maintenance window. Root cause: no automated cross-check between permit approval and equipment maintenance schedules.',
   sources:['doc-incident']},
  {id:'sop118', label:'SOP-118', sub:'HOT WORK / ENTRY PROCEDURE', type:'procedure', x:450, y:450,
   desc:'Governs hot work and confined space entry near gas lines. Requires gas testing every 30 minutes within 15m of a gas line, but does not require checking equipment maintenance schedules before permit approval.',
   sources:['doc-sop']},
  {id:'oisd118', label:'OISD-STD-118', sub:'REGULATORY STANDARD', type:'regulation', x:690, y:450,
   desc:'Requires continuous gas monitoring during any maintenance, hot work, or entry activity in a coke oven battery zone, and requires permit systems to account for concurrent maintenance on equipment in the same hazard zone.',
   sources:['doc-oisd']}
];

const EDGES = [
  {from:'facility', to:'cb204'}, {from:'facility', to:'gl12'}, {from:'facility', to:'v45'},
  {from:'cb204', to:'gl12'}, {from:'gl12', to:'v45'},
  {from:'cb204', to:'inspection'}, {from:'cb204', to:'maintwin'},
  {from:'maintwin', to:'incident'}, {from:'gl12', to:'incident'},
  {from:'incident', to:'sop118'}, {from:'sop118', to:'oisd118', gap:true, label:'GAP'}
];

const NODE_COLORS = {
  facility:'#5C8A6B', equipment:'#4A93BE', procedure:'#8B7EC8', regulation:'#6E7880', incident:'#D98E3F'
};

const COMPLIANCE_ROWS = [
  {proc:'SOP-118 — Hot Work / Entry Permit', req:'OISD-STD-118: permit system must account for concurrent maintenance activity in the same hazard zone', status:'gap',
   evidence:'INC-0225 near-miss; permit approved without checking CB-204 maintenance window'},
  {proc:'SOP-118 — Gas Testing Interval', req:'OISD-STD-118: continuous or interval gas monitoring during activity near gas lines', status:'ok',
   evidence:'30-minute interval defined and generally followed; single interval breach recorded in INC-0225 (34 min)'},
  {proc:'CB-204 Maintenance Scheduling', req:'OEM manual: gasket replacement at Grade 2 wear or 18-month service life', status:'gap',
   evidence:'Q1 2026 inspection found Grade 2.5 wear, exceeding replacement threshold; replacement scheduled but not yet executed'}
];
