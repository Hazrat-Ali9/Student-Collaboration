'use client';
import CreateGroup from '@/app/components/CreateGroup';
import GroupChatPopup from '@/app/components/GroupChatPopup';
import GroupList from '@/app/components/GroupList';
import { useEffect, useState } from 'react';


export default function GroupChatManager() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
   const [userData, setUserData] = useState('');

  const handleGroupCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };
   useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    }, []);

  return (
    <div style={{paddingLeft:'50px'}}>
      
      <CreateGroup onGroupCreated={handleGroupCreated} />
      <GroupList key={refreshKey} onGroupSelect={(group) => setSelectedGroup(group)} />

      {selectedGroup && (
        <GroupChatPopup
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          userData={userData}
        />
      )}
    </div>
  );
}
