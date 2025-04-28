'use client';

import { useEffect, useState } from 'react';
import { useContact } from '@/Hooks/contact'; 
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/Dialog'; 

interface SelectedContact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function ContactsPage() {
  const { contacts, fetchContacts, deleteContactById } = useContact();
  const [selectedContact, setSelectedContact] = useState<SelectedContact | null>(null);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Reduced from 8 to 5 for better readability

  useEffect(() => {
    fetchContacts();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

  // Navigation functions
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Smart pagination range to avoid showing too many buttons
  const getPaginationRange = () => {
    const totalNumbers = 3; // Show 3 page numbers at a time
    let start = Math.max(1, currentPage - Math.floor(totalNumbers / 2));
    let end = Math.min(totalPages, start + totalNumbers - 1);
    
    if (end - start + 1 < totalNumbers) {
      start = Math.max(1, end - totalNumbers + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleViewContact = (contact: SelectedContact) => {
    setSelectedContact(contact);
    setOpen(true);
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContactById(id);
        fetchContacts();
        toast.success('Contact deleted successfully');
      } catch (error) {
        console.error('Error deleting contact', error);
        toast.error('Failed to delete contact');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Decorative SVG background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-50 dark:opacity-20">
        <svg className="absolute -left-20 -top-20 w-96 h-96 text-blue-100 dark:text-blue-900" fill="currentColor" viewBox="0 0 200 200">
          <path d="M40,-57.4C53.7,-49.6..." transform="translate(100 100)" />
        </svg>
        <svg className="absolute -right-20 -bottom-20 w-96 h-96 text-indigo-100 dark:text-indigo-900" fill="currentColor" viewBox="0 0 200 200">
          <path d="M44.4,-65.4C56.9,-56.6..." transform="translate(100 100)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header section with stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Contact Messages</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage all incoming messages</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-4 py-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Total: <span className="text-blue-600 dark:text-blue-400 font-semibold">{contacts.length}</span>
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-4 py-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Page: <span className="text-blue-600 dark:text-blue-400 font-semibold">{currentPage}/{totalPages}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        {contacts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">No messages yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Your contact messages will appear here when they arrive.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {currentItems.map((contact) => (
                <div key={contact._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-6 flex flex-col sm:flex-row justify-between border border-gray-100 dark:border-gray-700">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h2 className="font-semibold text-gray-800 dark:text-white truncate">{contact.name}</h2>
                          <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate">
                            {contact.email}
                          </a>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">{contact.message}</p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(contact.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 mt-3 sm:mt-0 sm:ml-4">
                    <button
                      onClick={() => handleViewContact(contacts.find(c => c._id === contact._id) as SelectedContact)}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact._id)}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced pagination controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, contacts.length)} of {contacts.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {getPaginationRange().map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-10 h-10 rounded-md flex items-center justify-center ${
                          currentPage === number
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Contact details modal with improved scrolling */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <DialogTitle>Contact Details</DialogTitle>
                  <DialogDescription>Full message and contact information</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {selectedContact && (
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{selectedContact.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                    <a href={`mailto:${selectedContact.email}`} className="mt-1 text-blue-600 dark:text-blue-400 hover:underline block break-all">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</h3>
                    <div className="mt-1 p-3   rounded-lg  ">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Received on {new Date(selectedContact.createdAt).toLocaleString()}</span>
                </div>
              </div>
            )}

            <DialogFooter>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
 
      </div>
   
      <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="450"
            height="556"
            viewBox="0 0 450 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="277"
              cy="63"
              r="225"
              fill="url(#paint0_linear_25:217)"
            />
            <circle
              cx="17.9997"
              cy="182"
              r="18"
              fill="url(#paint1_radial_25:217)"
            />
            <circle
              cx="76.9997"
              cy="288"
              r="34"
              fill="url(#paint2_radial_25:217)"
            />
            <circle
              cx="325.486"
              cy="302.87"
              r="180"
              transform="rotate(-37.6852 325.486 302.87)"
              fill="url(#paint3_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="184.521"
              cy="315.521"
              r="132.862"
              transform="rotate(114.874 184.521 315.521)"
              stroke="url(#paint4_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="356"
              cy="290"
              r="179.5"
              transform="rotate(-30 356 290)"
              stroke="url(#paint5_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="191.659"
              cy="302.659"
              r="133.362"
              transform="rotate(133.319 191.659 302.659)"
              fill="url(#paint6_linear_25:217)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_25:217"
                x1="-54.5003"
                y1="-178"
                x2="222"
                y2="288"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint1_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
              >
                <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
              </radialGradient>
              <radialGradient
                id="paint2_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
              >
                <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
              </radialGradient>
              <linearGradient
                id="paint3_linear_25:217"
                x1="226.775"
                y1="-66.1548"
                x2="292.157"
                y2="351.421"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:217"
                x1="184.521"
                y1="182.159"
                x2="184.521"
                y2="448.882"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_25:217"
                x1="356"
                y1="110"
                x2="356"
                y2="470"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_25:217"
                x1="118.524"
                y1="29.2497"
                x2="166.965"
                y2="338.63"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="364"
            height="201"
            viewBox="0 0 364 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
              stroke="url(#paint0_linear_25:218)"
            />
            <path
              d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
              stroke="url(#paint1_linear_25:218)"
            />
            <path
              d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
              stroke="url(#paint2_linear_25:218)"
            />
            <path
              d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
              stroke="url(#paint3_linear_25:218)"
            />
            <circle
              opacity="0.8"
              cx="214.505"
              cy="60.5054"
              r="49.7205"
              transform="rotate(-13.421 214.505 60.5054)"
              stroke="url(#paint4_linear_25:218)"
            />
            <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
            <defs>
              <linearGradient
                id="paint0_linear_25:218"
                x1="184.389"
                y1="69.2405"
                x2="184.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_25:218"
                x1="156.389"
                y1="69.2405"
                x2="156.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_25:218"
                x1="125.389"
                y1="69.2405"
                x2="125.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_25:218"
                x1="93.8507"
                y1="67.2674"
                x2="89.9278"
                y2="210.214"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:218"
                x1="214.505"
                y1="10.2849"
                x2="212.684"
                y2="99.5816"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint5_radial_25:218"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(220 63) rotate(90) scale(43)"
              >
                <stop offset="0.145833" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.08" />
              </radialGradient>
            </defs>
          </svg>
        </div>  
    </div>
    
  );
}