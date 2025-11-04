import React, { useState, useEffect } from 'react';
import API from '../../services/api';

function SwapRequests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const incomingRes = await API.get('/swaps/incoming');
    const outgoingRes = await API.get('/swaps/outgoing');
    setIncoming(incomingRes.data);
    setOutgoing(outgoingRes.data);
  };

  const handleRespond = async (requestId, action) => {
    try {
      await API.post('/swaps/respond', { requestId, action });
      alert(`Swap ${action === 'ACCEPT' ? 'accepted' : 'rejected'}!`);
      fetchRequests();
    } catch (err) {
      alert('Failed to respond to swap request');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Swap Requests</h2>
      <a href="/dashboard">Back to Dashboard</a>
      
      <h3 style={{ marginTop: '20px' }}>Incoming Requests</h3>
      {incoming.length === 0 ? (
        <p>No incoming requests</p>
      ) : (
        incoming.map(req => (
          <div key={req._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
            <p><strong>From:</strong> {req.myUserId.name}</p>
            <p><strong>They offer:</strong> {req.mySlotId.title}</p>
            <p><strong>For your:</strong> {req.theirSlotId.title}</p>
            <button 
              onClick={() => handleRespond(req._id, 'ACCEPT')}
              style={{ marginRight: '10px', padding: '8px 16px', background: 'green', color: 'white' }}
            >
              Accept
            </button>
            <button 
              onClick={() => handleRespond(req._id, 'REJECT')}
              style={{ padding: '8px 16px', background: 'red', color: 'white' }}
            >
              Reject
            </button>
          </div>
        ))
      )}

      <h3 style={{ marginTop: '30px' }}>Outgoing Requests</h3>
      {outgoing.length === 0 ? (
        <p>No outgoing requests</p>
      ) : (
        outgoing.map(req => (
          <div key={req._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
            <p><strong>To:</strong> {req.theirUserId.name}</p>
            <p><strong>You offered:</strong> {req.mySlotId.title}</p>
            <p><strong>For their:</strong> {req.theirSlotId.title}</p>
            <p><strong>Status:</strong> {req.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default SwapRequests;
