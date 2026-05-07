import { useState, useRef } from 'react';
import './index.css';

// SVG Icons
const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
  Tenders: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Audit: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Upload: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Warning: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ArrowRight: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
};

const INITIAL_BIDDERS = [
  { id: 'b1', name: 'Alpha Buildworks Ltd', eval: {} },
  { id: 'b2', name: 'Omega Construct', eval: {} },
  { id: 'b3', name: 'Prime EPC', eval: {} }
];

function App() {
  const [appState, setAppState] = useState('LANDING'); 
  const [criteriaList, setCriteriaList] = useState([]);
  const [bidders, setBidders] = useState(INITIAL_BIDDERS);
  const [hitlData, setHitlData] = useState(null);

  const fileInputRef = useRef(null);

  const onUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleTenderUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAppState('PROCESSING');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/upload-tender', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      let currentCriteria = [];
      if (data.criteria) {
        currentCriteria = data.criteria;
        setCriteriaList(currentCriteria);
      }
      
      const updatedBidders = [...INITIAL_BIDDERS];
      for (let i = 0; i < updatedBidders.length; i++) {
        const bidder = updatedBidders[i];
        
        const bidderFormData = new FormData();
        const dummyBlob = new Blob(["dummy bidder content"], { type: "application/pdf" });
        bidderFormData.append('file', dummyBlob, `Bidder_${bidder.name.split(' ')[0]}.pdf`);
        bidderFormData.append('bidder_name', bidder.name);
        bidderFormData.append('criteria', JSON.stringify(currentCriteria));

        const evalRes = await fetch('http://localhost:8000/api/evaluate-bidder', {
          method: 'POST',
          body: bidderFormData
        });
        const evalData = await evalRes.json();
        
        if (evalData.eval) {
          bidder.eval = evalData.eval;
        }
      }
      
      setBidders(updatedBidders);
      setAppState('EVAL_VIEW');

    } catch (err) {
      console.error(err);
      alert("Error processing tender. Ensure backend is running at :8000");
      setAppState('DASHBOARD');
    }
  };

  const openHitlModal = (bidderName, crit, evalData) => {
    if(evalData.status !== 'yellow') return;
    setHitlData({ bidderName, crit, evalData });
  };

  const closeHitlModal = () => setHitlData(null);

  const resolveHitl = (newStatus) => {
    setBidders(prev => prev.map(b => {
      if(b.name === hitlData.bidderName) {
        return {
          ...b,
          eval: {
            ...b.eval,
            [hitlData.crit.id]: {
              ...b.eval[hitlData.crit.id],
              status: newStatus
            }
          }
        };
      }
      return b;
    }));
    closeHitlModal();
  };

  const handleExportCSV = () => {
    let csvStr = "Tender,Bidder Name,Criterion,Verdict,Value Found,Source Document\n";
    bidders.forEach(b => {
      criteriaList.forEach(c => {
        const ev = b.eval[c.id];
        if(!ev) return;
        let verdict = ev.status === 'green' ? 'Eligible' : (ev.status === 'red' ? 'Ineligible' : 'Needs Review');
        let safeVal = ev.val.replace(/,/g, ''); 
        let safeName = b.name.replace(/,/g, '');
        let safeCrit = c.desc.replace(/,/g, '');
        csvStr += `CRPF-2026-X,${safeName},${safeCrit},${verdict},${safeVal},${ev.doc}\n`;
      });
    });
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", url);
    downloadAnchorNode.setAttribute("download", "procureai_audit_log.csv");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (appState === 'LANDING') {
    return (
      <div className="app-container">
        <div className="ambient-bg">
          <div className="ambient-orb orb-1"></div>
          <div className="ambient-orb orb-2"></div>
          <div className="ambient-orb orb-3"></div>
        </div>
        
        <div className="hero-section" style={{width: '100%'}}>
          <div className="hero-content">
            <h1 className="hero-title animate-slide-up delay-100">
              Intelligence for <br/>
              <span className="accent-gradient-text">Procurement Excellence</span>
            </h1>
            <p className="hero-subtitle animate-slide-up delay-200">
              ProcureAI automates the complex process of evaluating tender bids by leveraging multimodal AI to parse heterogeneous documents, extract critical financial data, and determine bidder eligibility with complete auditability.
            </p>
            
            <div className="animate-slide-up delay-300" style={{display: 'flex', gap: 16, justifyContent: 'center'}}>
              <button className="btn btn-primary" onClick={() => setAppState('DASHBOARD')} style={{padding: '16px 32px', fontSize: '1.1rem'}}>
                Launch Dashboard <Icons.ArrowRight />
              </button>
            </div>

            <div className="feature-cards">
              <div className="feature-card animate-slide-up delay-400">
                <div style={{color: 'var(--accent-tertiary)', marginBottom: 16}}><Icons.Tenders /></div>
                <h3 style={{fontSize: '1.2rem', marginBottom: 8}}>Automated Extraction</h3>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>Instantly build dynamic evaluation matrices directly from raw PDF tender documents.</p>
              </div>
              <div className="feature-card animate-slide-up delay-500">
                <div style={{color: 'var(--warning)', marginBottom: 16}}><Icons.Warning /></div>
                <h3 style={{fontSize: '1.2rem', marginBottom: 8}}>Human-in-the-Loop</h3>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>AI acts as an assistant, automatically flagging ambiguous financial data for human review.</p>
              </div>
              <div className="feature-card animate-slide-up delay-500">
                <div style={{color: 'var(--success)', marginBottom: 16}}><Icons.Audit /></div>
                <h3 style={{fontSize: '1.2rem', marginBottom: 8}}>Immutable Auditing</h3>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>Every AI inference and human override is securely logged and exportable for transparency.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="ambient-bg">
        <div className="ambient-orb orb-1" style={{opacity: 0.15}}></div>
        <div className="ambient-orb orb-2" style={{opacity: 0.1}}></div>
      </div>

      <aside className="sidebar">
        <div className="sidebar-brand" onClick={() => setAppState('LANDING')}>
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span>ProcureAI</span>
        </div>

        <nav className="nav-menu">
          <div className={`nav-item ${appState === 'DASHBOARD' || appState === 'UPLOADING' || appState === 'PROCESSING' ? 'active' : ''}`} onClick={() => setAppState('DASHBOARD')}>
            <Icons.Dashboard /> Dashboard
          </div>
          <div className={`nav-item ${appState === 'EVAL_VIEW' ? 'active' : ''}`}>
            <Icons.Tenders /> Active Evaluations
          </div>
          <div className={`nav-item ${appState === 'SYSTEM_LOGS' ? 'active' : ''}`} onClick={() => setAppState('SYSTEM_LOGS')}>
            <Icons.Audit /> Audit Logs
          </div>
          <div className={`nav-item ${appState === 'SETTINGS' ? 'active' : ''}`} onClick={() => setAppState('SETTINGS')}>
            <Icons.Settings /> Settings
          </div>
        </nav>

        <div className="user-profile-sm">
          <div className="avatar">PO</div>
          <div>
            <div style={{fontWeight: 600, fontSize: '0.9rem', color: '#fff'}}>P. Officer</div>
            <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>L4 Access Level</div>
          </div>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="top-header">
          <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
            <span className="badge badge-success">System Online</span>
            <div style={{width: '1px', height: 24, background: 'var(--glass-border)'}}></div>
            <span style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>v2.0 Beta</span>
          </div>
        </header>

        <main className="main-content">
          {appState === 'DASHBOARD' && (
            <div className="animate-fade-in">
              <div style={{marginBottom: 40}}>
                <h1 style={{fontSize: '2.25rem', marginBottom: 8}}>Tender Operations</h1>
                <p style={{color: 'var(--text-secondary)'}}>Upload a new tender document to initiate the AI evaluation pipeline.</p>
              </div>
              
              <div className="dashboard-grid">
                <div className="col-span-8">
                  <div className="glass-panel" style={{height: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
                      <h3 style={{fontSize: '1.25rem'}}>Initialize New Evaluation</h3>
                    </div>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      accept=".pdf,.docx" 
                      onChange={handleTenderUpload} 
                    />
                    
                    <div className="upload-zone" onClick={onUploadClick}>
                      <div className="upload-icon-wrapper">
                        <Icons.Upload />
                      </div>
                      <div>
                        <h3 style={{fontSize: '1.2rem', marginBottom: 4}}>Upload Tender RFP Document</h3>
                        <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Drag and drop or click to browse. Supports PDF & DOCX (Max 50MB).</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-4" style={{display: 'flex', flexDirection: 'column', gap: 24}}>
                  <div className="stat-card">
                    <div className="stat-icon blue"><Icons.Tenders /></div>
                    <div>
                      <div style={{fontSize: '2rem', fontWeight: 700, lineHeight: 1}}>14</div>
                      <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4}}>Active Tenders</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon purple"><Icons.Warning /></div>
                    <div>
                      <div style={{fontSize: '2rem', fontWeight: 700, lineHeight: 1}}>02</div>
                      <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4}}>Pending Reviews</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-12 glass-panel" style={{marginTop: 16}}>
                  <h3 style={{fontSize: '1.25rem', marginBottom: 24}}>Recent Processing History</h3>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Tender ID</th>
                          <th>Department</th>
                          <th>Status</th>
                          <th>Bidders</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{fontWeight: 500}}>CRPF/Proc/2026/04</td>
                          <td>IT Infrastructure</td>
                          <td><span className="badge badge-success">Completed</span></td>
                          <td>12</td>
                          <td style={{color: 'var(--text-secondary)'}}>Today, 10:24 AM</td>
                        </tr>
                        <tr>
                          <td style={{fontWeight: 500}}>CRPF/Med/2026/01</td>
                          <td>Medical Supplies</td>
                          <td><span className="badge badge-warning">Needs Review</span></td>
                          <td>8</td>
                          <td style={{color: 'var(--text-secondary)'}}>Yesterday, 04:15 PM</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {appState === 'PROCESSING' && (
            <div className="animate-fade-in processing-container">
              <div className="radar-loader"></div>
              <h2 className="accent-gradient-text" style={{fontSize: '2rem', marginBottom: 16}}>
                Multimodal AI Processing...
              </h2>
              <div style={{color: 'var(--text-secondary)', textAlign: 'center'}}>
                <p style={{marginBottom: 8}}>✓ Ingesting and tokenizing tender document</p>
                <p style={{marginBottom: 8}}>✓ Extracting key eligibility criteria</p>
                <p className="animate-pulse" style={{color: 'var(--accent-tertiary)'}}>⟳ Analyzing bidder submissions against thresholds...</p>
              </div>
            </div>
          )}

          {appState === 'SYSTEM_LOGS' && (
            <div className="animate-fade-in">
              <div style={{marginBottom: 40}}>
                <h1 style={{fontSize: '2.25rem', marginBottom: 8}}>System Audit Logs</h1>
                <p style={{color: 'var(--text-secondary)'}}>Immutable tracking for all procurement actions and AI inferences.</p>
              </div>
              <div className="glass-panel" style={{padding: 0}}>
                <div className="table-wrapper" style={{border: 'none', borderRadius: '20px'}}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Action</th>
                        <th>User / System</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{color: 'var(--text-secondary)'}}>Today, 10:42 AM</td>
                        <td style={{fontWeight: 500}}>Manual Override: Omega Construct - Eligible</td>
                        <td>P. Officer (ID: 8091)</td>
                        <td><span className="badge badge-warning">Audited</span></td>
                      </tr>
                      <tr>
                        <td style={{color: 'var(--text-secondary)'}}>Today, 09:15 AM</td>
                        <td style={{fontWeight: 500}}>Tender CRPF-2026-X Analysis Completed</td>
                        <td>ProcureAI Core Engine</td>
                        <td><span className="badge badge-success">System</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {appState === 'SETTINGS' && (
            <div className="animate-fade-in">
              <div style={{marginBottom: 40}}>
                <h1 style={{fontSize: '2.25rem', marginBottom: 8}}>Platform Settings</h1>
                <p style={{color: 'var(--text-secondary)'}}>Configure your evaluation thresholds and system preferences.</p>
              </div>
              <div className="dashboard-grid">
                <div className="col-span-8">
                  <div className="glass-panel">
                    <h3 style={{fontSize: '1.25rem', marginBottom: 24}}>AI Evaluation Thresholds</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, borderBottom: '1px solid var(--glass-border)'}}>
                        <div>
                          <h4 style={{fontWeight: 500, fontSize: '1rem'}}>Confidence Threshold</h4>
                          <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>Minimum AI confidence required to auto-approve without HITL.</p>
                        </div>
                        <span className="badge badge-success">85%</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, borderBottom: '1px solid var(--glass-border)'}}>
                        <div>
                          <h4 style={{fontWeight: 500, fontSize: '1rem'}}>Mandatory Criteria Override</h4>
                          <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>Allow Officers to override missing mandatory documents.</p>
                        </div>
                        <span className="badge badge-danger">Disabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {appState === 'EVAL_VIEW' && (
            <div className="animate-fade-in">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32}}>
                <div>
                  <h1 style={{fontSize: '2.25rem', marginBottom: 8}}>Evaluation Matrix</h1>
                  <p style={{color: 'var(--text-secondary)'}}>
                    <span style={{color: '#fff', fontWeight: 600}}>Tender: CRPF-2026-X</span> • Extracted {criteriaList.length} criteria • Analysed {bidders.length} Bidders.
                  </p>
                </div>
                <div style={{display: 'flex', gap: 16}}>
                  <button className="btn btn-outline" onClick={() => setAppState('DASHBOARD')}>
                    Exit View
                  </button>
                  <button className="btn btn-primary" onClick={handleExportCSV}>
                    <Icons.Download /> Export Audit CSV
                  </button>
                </div>
              </div>

              <div className="glass-panel" style={{padding: '24px 0 0 0'}}>
                <div className="table-wrapper" style={{border: 'none', borderRadius: '0 0 20px 20px'}}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{width: '25%', paddingLeft: 32}}>Bidder Entity</th>
                        {criteriaList.map(c => (
                          <th key={c.id}>
                            <div style={{marginBottom: 8, color: '#fff'}}>{c.desc}</div>
                            <span className={`badge ${c.mandatory ? 'badge-success' : 'badge-warning'}`} style={{fontSize: '0.65rem'}}>
                              {c.mandatory ? 'Mandatory' : 'Optional'}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bidders.map(b => (
                        <tr key={b.id}>
                          <td style={{fontWeight: 600, paddingLeft: 32}}>{b.name}</td>
                          {criteriaList.map(c => {
                            const ev = b.eval[c.id];
                            if(!ev) return <td key={c.id} style={{color: 'var(--text-muted)'}}>Pending...</td>;
                            return (
                              <td key={c.id}>
                                <div 
                                  className={`cell-status-btn cell-${ev.status}`}
                                  onClick={() => openHitlModal(b.name, c, ev)}
                                >
                                  <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                                    {ev.status === 'green' && <><Icons.Check /> Eligible</>}
                                    {ev.status === 'red' && <><Icons.X /> Ineligible</>}
                                    {ev.status === 'yellow' && <><Icons.Warning /> Review Req.</>}
                                  </div>
                                  <div style={{fontSize: '0.75rem', fontWeight: 400, opacity: 0.9, marginTop: 2}}>{ev.val}</div>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {hitlData && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up">
            <div className="modal-header">
              <h3 style={{margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{color: 'var(--warning)'}}><Icons.Warning /></div>
                Human-in-the-Loop Review
              </h3>
              <button 
                onClick={closeHitlModal}
                style={{background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'}}
              >
                <Icons.X />
              </button>
            </div>
            
            <div className="modal-body">
              <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
                <div className="glass-panel" style={{padding: 24, borderRadius: 16}}>
                  <div style={{color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8}}>Bidder Entity</div>
                  <div style={{fontSize: '1.25rem', fontWeight: 600}}>{hitlData.bidderName}</div>
                </div>
                
                <div className="glass-panel" style={{padding: 24, borderRadius: 16}}>
                  <div style={{color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8}}>Evaluation Criterion</div>
                  <div style={{fontSize: '1.1rem'}}>{hitlData.crit.desc}</div>
                </div>

                <div className="glass-panel" style={{padding: 24, borderRadius: 16, border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)'}}>
                  <div style={{color: 'var(--warning)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontWeight: 600}}>AI Extracted Ambiguity</div>
                  <div style={{marginBottom: 12}}><strong style={{color: '#fff'}}>Found Value:</strong> {hitlData.evalData.val}</div>
                  <div style={{color: 'var(--text-secondary)', lineHeight: 1.6}}>{hitlData.evalData.ambiguity}</div>
                </div>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12}}>Source Evidence: {hitlData.evalData.doc}</div>
                <div style={{
                  flex: 1, 
                  background: '#f8fafc', 
                  borderRadius: 16, 
                  position: 'relative', 
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--glass-border)'
                }}>
                  <div style={{
                    width: '85%', height: '85%', 
                    background: '#fff', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                    padding: 32,
                    color: '#334155',
                    fontFamily: 'serif',
                    position: 'relative'
                  }}>
                    <h4 style={{borderBottom: '2px solid #e2e8f0', paddingBottom: 16, marginBottom: 24, fontSize: '1.2rem', color: '#0f172a'}}>Audited Financial Statements - FY 2025</h4>
                    
                    <div style={{height: 12, background: '#e2e8f0', borderRadius: 4, marginBottom: 16, width: '100%'}}></div>
                    <div style={{height: 12, background: '#e2e8f0', borderRadius: 4, marginBottom: 16, width: '90%'}}></div>
                    <div style={{height: 12, background: '#e2e8f0', borderRadius: 4, marginBottom: 32, width: '60%'}}></div>
                    
                    <div style={{height: 12, background: '#e2e8f0', borderRadius: 4, marginBottom: 16, width: '100%'}}></div>
                    <div style={{height: 12, background: '#e2e8f0', borderRadius: 4, marginBottom: 16, width: '80%'}}></div>
                    
                    <div style={{position: 'absolute', top: 180, left: 24, width: 200, height: 40, border: '3px solid var(--warning)', background: 'rgba(245, 158, 11, 0.1)', zIndex: 10, borderRadius: 4}}></div>
                    <div style={{marginTop: 40, fontWeight: 700, fontSize: '1.1rem', color: '#0f172a'}}>Consolidated Earnings: ~480 Mn (Estimated)</div>
                    
                  </div>
                </div>
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 16, textAlign: 'center'}}>
                  <Icons.Warning /> The highlighted region shows where the AI extracted the value.
                </p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn" style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)'}} onClick={() => resolveHitl('red')}>
                <Icons.X /> Mark Ineligible
              </button>
              <button className="btn" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)'}} onClick={() => resolveHitl('green')}>
                <Icons.Check /> Override & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
