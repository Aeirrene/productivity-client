import React, { useState, useEffect } from "react";

const App = () => {
  const [form, setForm] = useState({ name: "", time: "" });
  const [activities, setActivities] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch activities when the component mounts
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/activities");
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    fetchActivities();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        setActivities([...activities, data]); // Add the new activity to the list
        setResponseMessage("Activity added successfully!");
      } else {
        setResponseMessage("Failed to add activity. Please try again.");
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again.");
      console.error(error);
    }

    setForm({ name: "", time: "" }); // Reset the form fields
  };

  return (
    <div>
      <h1>Productivity Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Activity Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Time Taken"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          required
        />
        <button type="submit">Add Activity</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
      <h2>Activities</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity._id}>
            {activity.name} - {activity.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;