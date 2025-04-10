"use client"
import { useState } from 'react';
import { isLoggedIn } from '@/Hooks/useAuth'; // Adjust import path as needed

const ProfilePage = () => {
  const currentUser = isLoggedIn() || {
    name: '',
    email: '',
    role: '',
    phone: '',
    bio: '',
    country: '',
    cityState: '',
    postalCode: '',
    taxId: ''
  };

  const [editSection, setEditSection] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: currentUser.name.split(' ')[0] || '',
    lastName: currentUser.name.split(' ')[1] || '',
    email: currentUser.email,
    phone: currentUser.phone,
    bio: currentUser.bio,
    country: currentUser.country,
    cityState: currentUser.cityState,
    postalCode: currentUser.postalCode,
    taxId: currentUser.taxId
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (section: string) => {
    // Here you would typically call an API to save the data
    console.log(`Saving ${section} data:`, profileData);
    setEditSection(null);
  };

  const renderEditableField = (label: string, name: string, value: string, section: string) => {
    return editSection === section ? (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    ) : (
      <div className="mb-4">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900">{value || '-'}</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className=" rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex items-center">
            <div className=" 
            
            rounded-full p-1 mr-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-blue-800 text-2xl font-bold">
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h1>
              
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Personal Information Section */}
          <div className="mb-8 border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <button
                onClick={() => setEditSection(editSection === 'personal' ? null : 'personal')}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                {editSection === 'personal' ? 'Cancel' : 'Edit'}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderEditableField('First Name', 'firstName', profileData.firstName, 'personal')}
              {renderEditableField('Last Name', 'lastName', profileData.lastName, 'personal')}
              {renderEditableField('Email address', 'email', profileData.email, 'personal')}
              {renderEditableField('Phone', 'phone', profileData.phone, 'personal')}
              {renderEditableField('Bio', 'bio', profileData.bio, 'personal')}
            </div>

            {editSection === 'personal' && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleSave('personal')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Address Section */}
          <div className="mb-8 border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Address</h2>
              <button
                onClick={() => setEditSection(editSection === 'address' ? null : 'address')}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                {editSection === 'address' ? 'Cancel' : 'Edit'}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderEditableField('Country', 'country', profileData.country, 'address')}
              {renderEditableField('City/State', 'cityState', profileData.cityState, 'address')}
              {renderEditableField('Postal Code', 'postalCode', profileData.postalCode, 'address')}
              {renderEditableField('TAX ID', 'taxId', profileData.taxId, 'address')}
            </div>

            {editSection === 'address' && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleSave('address')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Websites & Social Media</h2>
              <button className="text-blue-600 hover:text-blue-800 flex items-center">
                Add New
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3  rounded-md">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <p className="font-medium">LinkedIn</p>
                  <p className="text-sm text-gray-500">linkedin.com</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center p-3  rounded-md">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <p className="font-medium">GitHub</p>
                  <p className="text-sm text-gray-500">github.com</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;