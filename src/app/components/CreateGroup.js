'use client'
import '../styles/creategroup.css';
import React, { useState } from 'react';
import { createGroup } from '../api/groupApi';
// import { createGroup } from '@/api/group';


export default function CreateGroup({ onGroupCreated }) {
  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (!name) return;
    const group = await createGroup(name);
    setName('');
    onGroupCreated(group);
  };

  return (
    <div className="create-group-card">
  <h2>Create New Group</h2>
  <p>Enter a group name to create new group.</p>
  <div className="input-row">
  <input value={name} onChange={e => setName(e.target.value)} placeholder="Group name" />
    <button onClick={handleCreate}>
      Create <span className="icon">➕</span>
    </button>
  </div>
</div>

  );
}
