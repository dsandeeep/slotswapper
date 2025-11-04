import React, { useState, useEffect } from 'react';
import API from '../../services/api';

function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);

  useEffect(() => {
    fetchSlots();
    fetchMySlots();
  }, []);

  const fetchSlots = async () => {
    const { data } = await API.get('/slots/swappable');
    setSlots(data);
  };

  const fetchMySlots = async () => {
    const { data } = await API.get('/events');
    setMySlots(data.filter(e => e.status === 'SWAPPABLE'));
  };

  const requestSwap = async (theirSlotId, mySlotId) => {
    try {
      await API.post('/swaps/request', { mySlotId, theirSlotId });
      alert('Swap request sent!');
      fetchSlots();
      fetchMySlots();
    } catch (err) {
      alert('Failed to send swap request');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Marketplace - Available Swappable Slots</h2>
      <a href="/dashboard">Back to Dashboard</a>
      
      <div style={{ marginTop: '20px' }}>
        {slots.length === 0 ? (
          <p>No swappable slots available at the moment.</p>
        ) : (
          slots.map(slot => (
            <div key={slot._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
              <h3>{slot.title}</h3>
              <p><strong>Owner:</strong> {slot.userId.name} ({slot.userId.email})</p>
              <p><strong>Time:</strong> {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}</p>
              
              <select 
                onChange={(e) => e.target.value && requestSwap(slot._id, e.target.value)}
                style={{ padding: '8px' }}
              >
                <option value="">Select your slot to swap</option>
                {mySlots.map(ms => (
                  <option key={ms._id} value={ms._id}>
                    {ms.title} ({new Date(ms.startTime).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Marketplace;
