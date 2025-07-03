'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

import '../../styles/contact.css';
import sendMessageApi from '@/app/api/sendMessageApi';

const Page = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // You could include the name in the message body
    const fullMessage = `
    From: ${formData.name}
    Email: ${formData.email}

    Message: ${formData.message}
  `;

    await sendMessageApi(
      {
        to: 'mahpara.slog@gmail.com', 
        subject: `New Contact Message from ${formData.name}`,
        message: fullMessage,
        replyTo: formData.email,  // Send user's email to backend
      },
      Swal,
      () => setFormData({ name: '', email: '', message: '' })
    );
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We would love to hear from you — reach out anytime!</p>
      </div>

      <div className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Message</label>
          <textarea
            name="message"
            rows="6"
            placeholder="Type your message..."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Page;
