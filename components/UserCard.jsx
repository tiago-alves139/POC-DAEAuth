import React from 'react';

function UserCard({ user }) {
  return (
    <div className="rounded p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
      <div className="flex justify-between items-center">
        <h2 className="text-xl">{user.name} - {user.displayName}</h2>
      </div>
    </div>
  );
}

export default UserCard;