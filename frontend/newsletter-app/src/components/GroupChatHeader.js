import React from 'react';
import Avatar from '@mui/material/Avatar';

const GroupChatHeader = ({ groupName }) => {
  const groupImage = `/images/groups/group.jpeg`; // Construct the image path

  return (
    <div className="flex items-center p-4 bg-gray-100 border-b border-gray-300">
      <Avatar alt={groupName} src={groupImage} className="mr-4" />
      <h1 className="text-2xl font-bold">{groupName}</h1>
    </div>
  );
};

export default GroupChatHeader;
