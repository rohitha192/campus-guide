import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './Events.css';

// This constant is defined outside the component, which is correct.
const REMINDER_SCHEDULE = [60, 10, 0];

const Events = () => {
  const [userType, setUserType] = useState(localStorage.getItem('userEventType') || null);
  const [selectedCouncil, setSelectedCouncil] = useState(localStorage.getItem('userEventCouncil') || null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const scheduledReminders = useRef(new Set());

  // --- 1. Notification and Reminder Functions ---

  const setAlarm = useCallback((event, minutesBefore) => {
    const reminderId = `${event._id}-${minutesBefore}`;
    if (scheduledReminders.current.has(reminderId) || !('Notification' in window)) return;

    const eventTime = new Date(event.startTime).getTime();
    const reminderTime = eventTime - (minutesBefore * 60 * 1000);
    const now = new Date().getTime();

    if (reminderTime > now) {
      const timeUntilReminder = reminderTime - now;
      
      setTimeout(() => {
        let body;
        if (minutesBefore === 0) {
          body = `'${event.name}' is starting now at ${event.locationName}.`;
        } else {
          body = `'${event.name}' starts in ${minutesBefore} minutes at ${event.locationName}.`;
        }

        new Notification('Event Reminder!', { body: body });
      }, timeUntilReminder);

      scheduledReminders.current.add(reminderId);
    }
  }, []);

  const scheduleRemindersForEvent = useCallback((event) => {
    REMINDER_SCHEDULE.forEach(minutes => {
      setAlarm(event, minutes);
    });
  }, [setAlarm]);

  // --- 2. Data Fetching Function ---

  const fetchEvents = useCallback(async () => {
    if (!userType) return;
    setLoading(true);
    setEvents([]);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Authentication Error: No token found.");
        setLoading(false);
        return;
      }
      
      const config = { headers: { 'x-auth-token': token } };
      let apiUrl = 'http://localhost:5000/api/dashboard/events';

      if (userType === 'member' && selectedCouncil) {
        apiUrl += `?council=${selectedCouncil}`;
      }

      const res = await axios.get(apiUrl, config);
      setEvents(res.data);

      if (userType === 'member' && Notification.permission === 'granted') {
        res.data.forEach(event => {
          scheduleRemindersForEvent(event);
        });
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  }, [userType, selectedCouncil, scheduleRemindersForEvent]);

  // --- 3. useEffect to Run Data Fetching ---

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  
  // --- 4. Handler Functions (This is what you were missing) ---

  const handleUserTypeSelect = (type) => {
    localStorage.setItem('userEventType', type);
    setUserType(type);
    if (type === 'student') {
      localStorage.removeItem('userEventCouncil');
      setSelectedCouncil(null);
    }
  };
  
  const handleCouncilSelect = (council) => {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    localStorage.setItem('userEventCouncil', council);
    setSelectedCouncil(council);
  };

  // --- 5. Render Logic ---

  // RENDER 1: Show role selection
  if (!userType) {
    return (
      <div className="choice-container">
        <h1>Welcome to the Events Page!</h1>
        <p>To personalize your view, please select your role:</p>
        <div className="choice-buttons">
          <button onClick={() => handleUserTypeSelect('student')}>General Student</button>
          <button onClick={() => handleUserTypeSelect('member')}>Student Body Member</button>
        </div>
      </div>
    );
  }
  
  // RENDER 2: Show council selection for members
  if (userType === 'member' && !selectedCouncil) {
    return (
      <div className="choice-container">
        <h2>Select Your Student Body</h2>
        <p>Alarms will be set automatically for your council's events.</p>
        <div className="council-selection">
          <select onChange={(e) => handleCouncilSelect(e.target.value)} defaultValue="">
            <option value="" disabled>-- Please choose a body --</option>
            <option value="SAC">SAC (Student Activity Council)</option>
            <option value="VSC">VSC (Vignan Steel Corporation)</option>
            <option value="E-cell">E-cell (Entrepreneurship Cell)</option>
            <option value="NCC">NCC (National Cadet Corps)</option>
            <option value="UEAC">UEAC (University English & Arts Club)</option>
            <option value="NSS">NSS (National Service Scheme)</option>
            <option value="ARC">ARC (Automation & Robotics Club)</option>
          </select>
        </div>
        <button className="back-button" onClick={() => handleUserTypeSelect(null)}>Go Back</button>
      </div>
    );
  }

  // RENDER 3: Show the events list
  return (
    <div className="events-container">
      <h1>
        {userType === 'member' ? `${selectedCouncil} Council Events` : 'All Campus Events'}
      </h1>
      {loading ? <p className="loading-message">Loading events...</p> : (
        <div className="event-list">
          {events.length > 0 ? events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.name}</h3>
              <p className="event-description">{event.description}</p>
              <div className="event-details">
                <p><strong>Location:</strong> {event.locationName}</p>
                <p><strong>Time:</strong> {new Date(event.startTime).toLocaleString()}</p>
              </div>
            </div>
          )) : <p className="no-events-message">No events found for this category.</p>}
        </div>
      )}
      <button className="back-button" onClick={() => {
          localStorage.removeItem('userEventType');
          localStorage.removeItem('userEventCouncil');
          setUserType(null);
          setSelectedCouncil(null);
      }}>Change Role</button>
    </div>
  );
};

export default Events;