import React from 'react'

export default function Widgets() {
  return (
    <div>        <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-gray-600 text-sm">Total Jobs</h3>
        <p className="text-2xl font-bold">24</p>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-gray-600 text-sm">Total Applications</h3>
        <p className="text-2xl font-bold">156</p>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-gray-600 text-sm">Hired Candidates</h3>
        <p className="text-2xl font-bold">12</p>
      </div>
    </main> </div>
  )
}
