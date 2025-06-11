"use client";

import { useState } from 'react';

export default function TestSimple() {
  const [message, setMessage] = useState('Simple test page loaded!');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Test</h1>
      <p>{message}</p>
      <button onClick={() => setMessage('Button clicked!')}>
        Test Button
      </button>
    </div>
  );
}
