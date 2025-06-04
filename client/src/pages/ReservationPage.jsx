import { useState } from 'react';

export default function ReservationPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here (API call, validation, etc.)
    console.log('Reservation submitted:', form);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Make a Reservation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="email" placeholder="Your Email" type="email" value={form.email} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="date" type="date" value={form.date} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="time" type="time" value={form.time} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="guests" type="number" min="1" value={form.guests} onChange={handleChange} required className="w-full p-2 border rounded" />
        <button type="submit" className="bg-brown-700 text-white p-2 rounded">Reserve</button>
      </form>
    </div>
  );
}
