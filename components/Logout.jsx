"use client"

import { signOut } from "next-auth/react";

export default function Logout() {
  return <button className="rounded bg-red-300 font-bold text-white py-1 px-1 w-fit hover:bg-blue-700 transition-colors duration-200 mx-auto"
    onClick={() => signOut()}>
    Sign Out
  </button>
}