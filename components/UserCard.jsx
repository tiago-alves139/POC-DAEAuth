import React from 'react';

function UserCard({ user }) {
  return (
    <div className="rounded p-4 border border-slate-300 my-3 justify-between gap-5 items-start">
      <div>
        <div className="text-xl">{user.name} - {user.displayName}</div>
        <div className="text-sm text-slate-500">{user.email}</div>
      </div>
    </div>
  );
}

export default UserCard;