import { useState, useRef } from 'react';
import './index.css';

// We'll keep initial bidders to represent the files we will process against the API
const INITIAL_BIDDERS = [
  { id: 'b1', name: 'Alpha Buildworks Ltd', eval: {} },
  { id: 'b2', name: 'Omega Construct', eval: {} },
  { id: 'b3', name: 'Prime EPC', eval: {} }
];

function App() {
  const [appState, setAppState] = useState('DASHBOARD'); // DASHBOARD, UPLOADING, PROCESSING, EVAL_VIEW
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

    setAppState('UPLOADING');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Extract Criteria
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

      setAppState('PROCESSING');
      
      // 2. Process Bidders (Simulating uploading bidder docs one by one)
      const updatedBidders = [...INITIAL_BIDDERS];
      for (let i = 0; i < updatedBidders.length; i++) {
        const bidder = updatedBidders[i];
        
        // We will send a mock file just to trigger the backend logic (using the bidder name to drive mock or real AI logic)
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

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand" style={{cursor: 'pointer'}} onClick={() => setAppState('DASHBOARD')}>
          <div style={{width: 32, height: 32, background: 'var(--accent-blue)', borderRadius: 6}}></div>
          <span>Procure<span className="accent-gradient-text">AI</span> </span>
        </div>
        <div>
          <button className="btn btn-outline" style={{marginRight: 10}} onClick={() => setAppState('SYSTEM_LOGS')}>System Logs</button>
          <button className="btn btn-primary" onClick={() => setAppState('PROFILE')}>Profile</button>
        </div>
      </nav>

      <main className="main-content">
        
        {appState === 'DASHBOARD' && (
          <div className="fade-in">
            <h1 style={{fontSize: '2.5rem', marginBottom: 10}}>Welcome to <span className="gradient-text">Tender Evaluation</span></h1>
            <p style={{color: 'var(--text-secondary)', marginBottom: 40}}>Upload a tender document to auto-extract criteria and evaluate bidder submissions securely.</p>
            
            <div className="dashboard-grid">
              <div className="glass-panel">
                <h3 style={{marginBottom: 20}}>Start New Evaluation</h3>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept=".pdf,.docx" 
                  onChange={handleTenderUpload} 
                />
                <div className="upload-zone" onClick={onUploadClick}>
                  <div className="upload-icon">📄</div>
                  <h3>Upload Tender PDF</h3>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>Supported: PDF, DOCX (Max 50MB)</p>
                </div>
              </div>

              <div className="glass-panel">
                <h3 style={{marginBottom: 20}}>Recent Tasks</h3>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                  <div style={{padding: '12px 0', borderBottom: '1px solid var(--glass-border)'}}>CRPF/Proc/2026/04 - <span className="badge badge-green">Completed</span></div>
                  <div style={{padding: '12px 0', borderBottom: '1px solid var(--glass-border)'}}>IT_Hardware_Supply - <span className="badge badge-yellow">Needs Review (2)</span></div>
                  <div style={{padding: '12px 0'}}>Civil_Works_HQ - <span className="badge badge-green">Completed</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(appState === 'UPLOADING' || appState === 'PROCESSING') && (
          <div className="fade-in" style={{textAlign: 'center', marginTop: 100}}>
            <h2 className="accent-gradient-text" style={{fontSize: '2rem', marginBottom: 20}}>
              {appState === 'UPLOADING' ? 'Ingesting Documents via FastAPI...' : 'Multimodal Parser is Running...'}
            </h2>
            <div style={{maxWidth: 400, margin: '0 auto'}}>
              <div className="scanning-bar"></div>
              {appState === 'PROCESSING' && (
                <div style={{marginTop: 30, color: 'var(--text-secondary)', fontSize: '0.9rem'}} className="fade-in">
                  <p>✓ Layout parsed successfully</p>
                  <p>✓ Extracting financial thresholds via LLM</p>
                  <p>⟳ Analyzing 3 bidder submissions against criteria...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {appState === 'EVAL_VIEW' && (
          <div className="fade-in">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30}}>
              <div>
                <h2>Evaluation Matrix: <span style={{color: 'var(--text-secondary)', fontWeight: 400}}>Tender CRPF-2026-X</span></h2>
                <p style={{color: 'var(--text-secondary)', marginTop: 4}}>Extracted {criteriaList.length} criteria. Analysed {bidders.length} Bidders.</p>
              </div>
              <div>
                <button className="btn btn-outline" style={{marginRight: 10}} onClick={() => setAppState('DASHBOARD')}>← Back</button>
                <button className="btn btn-primary" onClick={handleExportCSV}>Export CSV Audit Log</button>
              </div>
            </div>

            <div className="glass-panel" style={{padding: 0}}>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{width: '20%'}}>Bidders</th>
                      {criteriaList.map(c => (
                        <th key={c.id}>
                          <div style={{marginBottom: 8}}>{c.desc}</div>
                          <span className={`badge ${c.mandatory ? 'badge-mandatory' : 'badge-optional'}`}>
                            {c.mandatory ? 'Mandatory' : 'Optional'}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bidders.map(b => (
                      <tr key={b.id}>
                        <td style={{fontWeight: 600}}>{b.name}</td>
                        {criteriaList.map(c => {
                          const ev = b.eval[c.id];
                          if(!ev) return <td key={c.id}>-</td>;
                          return (
                            <td key={c.id}>
                              <div 
                                className={`cell-status-btn cell-${ev.status}`}
                                onClick={() => openHitlModal(b.name, c, ev)}
                              >
                                {ev.status === 'green' ? '✓ Eligible' : ev.status === 'red' ? '✗ Ineligible' : '⚠ Review Required'}
                                <div style={{fontSize: '0.7rem', fontWeight: 400, marginTop: 4, opacity: 0.8}}>{ev.val}</div>
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

        {appState === 'SYSTEM_LOGS' && (
          <div className="fade-in">
            <h2>System <span className="gradient-text">Audit Logs</span></h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: 30}}>Immutable tracking for all procurement actions and AI inferences.</p>
            <div className="glass-panel" style={{padding: 0}}>
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
                    <td>Manual Override: Omega Construct - Eligible</td>
                    <td>P. Officer (ID: 8091)</td>
                    <td><span className="badge badge-yellow">Audited</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {appState === 'PROFILE' && (
          <div className="fade-in">
            <h2>Officer <span className="gradient-text">Profile</span></h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: 30}}>Manage your authentication and viewing permissions.</p>
            <div className="glass-panel" style={{maxWidth: 600}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30}}>
                <div style={{width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold'}}>
                  PO
                </div>
                <div>
                  <h3 style={{fontSize: '1.5rem', margin: 0}}>Procurement Officer</h3>
                  <p style={{color: 'var(--text-secondary)', margin: '4px 0 0 0'}}>ID: 8091 • Level 4 Access</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {hitlData && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
            <div className="modal-header">
              <h3 style={{margin: 0}}>Human Review Required</h3>
              <button 
                onClick={closeHitlModal}
                style={{background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer'}}
              >×</button>
            </div>
            <div className="modal-body">
              <div>
                <div className="detail-row">
                  <div className="detail-label">Bidder</div>
                  <div className="detail-value">{hitlData.bidderName}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Criterion</div>
                  <div style={{background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 6, fontSize: '0.9rem', marginTop: 8}}>
                    {hitlData.crit.desc}
                  </div>
                </div>
                <div className="detail-row" style={{marginTop: 24}}>
                  <div className="detail-label" style={{color: 'var(--accent-amber)'}}>AI Extracted Ambiguity</div>
                  <div style={{background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: 12, borderRadius: 6, fontSize: '0.9rem', marginTop: 8}}>
                    <strong>Value Found:</strong> {hitlData.evalData.val}<br/><br/>
                    {hitlData.evalData.ambiguity}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="detail-label">Source Document: {hitlData.evalData.doc}</div>
                <div className="document-preview" style={{marginTop: 8}}>
                  <div className="fake-doc">
                    <h4 style={{marginBottom: 10, borderBottom: '1px solid #ccc'}}>Audited Financials 2025</h4>
                    <div className="doc-line"></div>
                    <div className="doc-line"></div>
                    <div className="doc-line medium"></div>
                    <br/>
                    <div className="doc-line"></div>
                    <div style={{marginTop: 10, fontWeight: 'bold', fontSize: '0.8rem'}}>Total Earnings: ~480 Mn</div>
                    <div className="bounding-box"></div>
                  </div>
                </div>
                <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 8, textAlign: 'center'}}>
                  Yellow bounding box indicates AI region of interest.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => resolveHitl('red')}>Mark Ineligible (Reject)</button>
              <button className="btn btn-primary" onClick={() => resolveHitl('green')}>Confirm Eligible (Override)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
