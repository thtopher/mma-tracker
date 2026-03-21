import { useState, useRef, useEffect, useCallback } from 'react';
import waterTreatmentImg from '../../assets/water-treatment.png';
import './WaterTreatmentView.css';

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  top: string;
  left: string;
  qualityWidth: string;
  qualityColor: string;
  leftHeading: string;
  leftText: string;
  rightHeading: string;
  rightItems: string[];
}

const stages: Stage[] = [
  {
    id: 1,
    title: 'Water Intake',
    subtitle: 'Pulling in the raw data',
    top: '55%',
    left: '6%',
    qualityWidth: '12%',
    qualityColor: '#4BA3C3',
    leftHeading: 'What Happens with Water',
    leftText:
      'Raw water is pumped from a natural source — a river, lake, or underground aquifer. It arrives full of sediment, microorganisms, dissolved minerals, and organic matter. Nothing about it is consistent or safe yet.',
    rightHeading: 'What We Do with Data',
    rightItems: [
      'Source discovery — identify carrier filings, hospital chargemasters, CMS datasets, and other raw feeds',
      'File acquisition — pull data via SFTP, API, or direct download on scheduled cadences',
      'Format normalization — convert CSV, fixed-width, PDF, and proprietary formats into a common schema',
      'Initial cataloging — tag each file with source, vintage, geography, and line of business',
    ],
  },
  {
    id: 2,
    title: 'Coagulation',
    subtitle: 'Reconciling identities and surfacing problems',
    top: '42%',
    left: '20%',
    qualityWidth: '30%',
    qualityColor: '#7EC8C8',
    leftHeading: 'What Happens with Water',
    leftText:
      'Chemical coagulants (like aluminum sulfate) are rapidly mixed into the raw water. These chemicals carry a positive charge that neutralizes the negative charge on dirt and dissolved particles, causing them to clump together into larger masses called "floc."',
    rightHeading: 'What We Do with Data',
    rightItems: [
      'Provider identity reconciliation — match NPIs, TINs, and facility names across sources to a single canonical entity',
      'Service code extraction — parse CPT, HCPCS, MS-DRG, and revenue codes from each record',
      'Taxonomy-based flagging — classify every code by service category, setting, and specialty',
      'Place-of-service validation — confirm that facility type, billing class, and geography are internally consistent',
    ],
  },
  {
    id: 3,
    title: 'Sedimentation',
    subtitle: 'Removing the obvious junk',
    top: '35%',
    left: '34%',
    qualityWidth: '52%',
    qualityColor: '#00968F',
    leftHeading: 'What Happens with Water',
    leftText:
      'Water sits in a sedimentation basin where gravity pulls the heavy floc to the bottom. The longer the water rests, the more particles settle out. Operators skim sludge from the bottom and send it for disposal.',
    rightHeading: 'What We Do with Data',
    rightItems: [
      'Standardization — align units, date formats, and code versions across every source',
      'Placeholder removal — strip $0 rows, "N/A" entries, and dummy codes that carry no analytic value',
      'Per diem conversion — translate bundled per-diem charges into comparable unit-rate equivalents',
      'Deduplication — identify and collapse duplicate records from overlapping sources or reporting periods',
    ],
  },
  {
    id: 4,
    title: 'Filtration',
    subtitle: 'Merging sources and weighting by real-world usage',
    top: '30%',
    left: '49%',
    qualityWidth: '72%',
    qualityColor: '#009DE0',
    leftHeading: 'What Happens with Water',
    leftText:
      'Water passes through layers of sand, gravel, and activated carbon. Each layer traps progressively smaller particles — from visible grit down to dissolved chemicals and taste compounds. The result is visually clear water.',
    rightHeading: 'What We Do with Data',
    rightItems: [
      'Carrier + hospital merge — blend insurer-reported rates with facility-posted charges for the same service and geography',
      'Utilization weighting — weight each rate by real claims volume so high-frequency services dominate the composite',
      'Rate selection — choose the most representative rate when multiple credible values exist for a single code-market pair',
    ],
  },
  {
    id: 5,
    title: 'Disinfection',
    subtitle: 'Quality scoring and confidence testing',
    top: '38%',
    left: '64%',
    qualityWidth: '90%',
    qualityColor: '#0077B6',
    leftHeading: 'What Happens with Water',
    leftText:
      'Even after filtration, invisible pathogens remain. Chlorine, chloramine, UV light, or ozone are applied to kill bacteria, viruses, and parasites. A residual disinfectant is maintained so the water stays safe through the pipes.',
    rightHeading: 'What We Do with Data',
    rightItems: [
      'Claims cross-check — validate rates against independent claims benchmarks to catch systematic bias',
      'Confidence scoring — assign a reliability grade to every data point based on source count, recency, and agreement',
      'Outlier detection — flag statistical outliers for human review before they enter the production dataset',
    ],
  },
  {
    id: 6,
    title: 'Storage',
    subtitle: 'The finished national dataset',
    top: '46%',
    left: '78%',
    qualityWidth: '97%',
    qualityColor: '#003366',
    leftHeading: 'What Happens with Water',
    leftText:
      'Clean, treated water is held in covered reservoirs and elevated tanks, ready for demand. Continuous monitoring ensures chlorine levels, pH, and turbidity stay within regulatory limits.',
    rightHeading: 'What We Do with Data',
    rightItems: [
      'Gap filling — impute missing markets using regional regression models so every code has national coverage',
      'National dataset — publish a single, query-ready table covering every CPT/HCPCS code, every MSA, and every payer type',
      'Quarterly refresh — re-run the full pipeline each quarter to incorporate new filings, updated chargemasters, and fresh claims data',
    ],
  },
  {
    id: 7,
    title: 'Distribution',
    subtitle: 'Intelligence delivered to brokers and clients',
    top: '55%',
    left: '93%',
    qualityWidth: '100%',
    qualityColor: '#001A41',
    leftHeading: 'What Happens with Water',
    leftText:
      'Clean water flows through a distribution network of mains, service lines, and meters to homes, businesses, and fire hydrants. Each tap delivers the same safe product, on demand.',
    rightHeading: 'What We Do with Data',
    rightItems: [
      'Community-Based Organizations — neighborhood-level cost benchmarks that power value-based care programs and grant applications',
      'Providers — procedure-level rate intelligence for contract negotiation, charge-setting, and competitive positioning',
      'Payers — network-wide cost comparisons for plan design, provider tiering, and reimbursement strategy',
      'Data & Analytics Vendors — licensable reference datasets that feed downstream platforms, dashboards, and predictive models',
      'Investors — diligence-grade market analytics for healthcare M&A, PE roll-ups, and portfolio monitoring',
    ],
  },
];

export function WaterTreatmentView() {
  const [activeStageIndex, setActiveStageIndex] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  const handleHotspotClick = useCallback((index: number) => {
    setActiveStageIndex((prev) => (prev === index ? null : index));
  }, []);

  // Scroll detail panel into view when a stage is selected
  useEffect(() => {
    if (activeStageIndex !== null && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeStageIndex]);

  // Click outside to dismiss
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        diagramRef.current &&
        !diagramRef.current.contains(target) &&
        detailRef.current &&
        !detailRef.current.contains(target)
      ) {
        setActiveStageIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeStage = activeStageIndex !== null ? stages[activeStageIndex] : null;

  return (
    <div>
      {/* Header */}
      <div className="wt-header">
        <h1>How We Turn Raw Data Into Trusted Intelligence</h1>
        <p>
          Third Horizon Solutions processes millions of healthcare data points the same way a
          treatment plant purifies water — through a rigorous, multi-stage pipeline that removes
          noise, reconciles sources, and delivers a single, reliable product.
        </p>
      </div>

      {/* Diagram */}
      <div className="wt-diagram-wrapper" ref={diagramRef}>
        <div className="wt-diagram">
          <img src={waterTreatmentImg} alt="Water treatment process diagram" />
          {stages.map((stage, i) => (
            <button
              key={stage.id}
              className={`wt-hotspot${activeStageIndex === i ? ' active' : ''}`}
              style={{ top: stage.top, left: stage.left }}
              onClick={() => handleHotspotClick(i)}
              aria-label={`Stage ${stage.id}: ${stage.title}`}
            >
              {stage.id}
            </button>
          ))}
        </div>
        <div className="wt-click-hint">Click a numbered stage to explore</div>
      </div>

      {/* Detail Panel */}
      {activeStage && (
        <div className="wt-detail" ref={detailRef} key={activeStage.id}>
          <div className="wt-detail-card">
            <div className="wt-detail-header">
              <div className="wt-detail-number">{activeStage.id}</div>
              <div className="wt-detail-titles">
                <h2>{activeStage.title}</h2>
                <p>{activeStage.subtitle}</p>
              </div>
            </div>

            <div className="wt-detail-body">
              <div className="wt-detail-col">
                <h3>{activeStage.leftHeading}</h3>
                <p>{activeStage.leftText}</p>
              </div>
              <div className="wt-detail-col">
                <h3>{activeStage.rightHeading}</h3>
                <ul>
                  {activeStage.rightItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="wt-quality">
              <div className="wt-quality-label">Data Quality Progress</div>
              <div className="wt-quality-track">
                <div
                  className="wt-quality-fill"
                  style={{
                    width: activeStage.qualityWidth,
                    background: activeStage.qualityColor,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="wt-footer">
        &copy; {new Date().getFullYear()} Third Horizon Solutions. All rights reserved.
      </div>
    </div>
  );
}
