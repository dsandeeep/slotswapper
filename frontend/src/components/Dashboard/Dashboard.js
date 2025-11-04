import React, { useState, useEffect } from 'react';
import API from '../../services/api';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await API.get('/events');
    setEvents(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await API.post('/events', { title, startTime, endTime });
    fetchEvents();
    setTitle('');
    setStartTime('');
    setEndTime('');
  };

  const markSwappable = async (id) => {
    await API.patch(`/events/${id}`, { status: 'SWAPPABLE' });
    fetchEvents();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Calendar</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <input 
          type="datetime-local" 
          value={startTime} 
          onChange={(e) => setStartTime(e.target.value)} 
          required 
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <input 
          type="datetime-local" 
          value={endTime} 
          onChange={(e) => setEndTime(e.target.value)} 
          required 
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add Event</button>
      </form>

      <ul>
        {events.map(event => (
          <li key={event._id} style={{ marginBottom: '10px' }}>
            <strong>{event.title}</strong> - Status: {event.status}
            {event.status === 'BUSY' && (
              <button 
                onClick={() => markSwappable(event._id)}
                style={{ marginLeft: '10px', padding: '4px 8px' }}
              >
                Mark Swappable
              </button>
            )}
          </li>
        ))}
      </ul>
      
      <div style={{ marginTop: '20px' }}>
        <a href="/marketplace">Go to Marketplace</a> | <a href="/requests">View Swap Requests</a>
      </div>
    </div>
  );
}

export default Dashboard;
