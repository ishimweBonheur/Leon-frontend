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
  const [itemsPerPage] = useState(8); // Items per page

  useEffect(() => {
    fetchContacts();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* SVG Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-50 dark:opacity-20">
        <svg className="absolute -left-20 -top-20 w-96 h-96 text-blue-100 dark:text-blue-900" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M40,-57.4C53.7,-49.6,68.1,-41.6,74.1,-29.4C80.1,-17.1,77.7,-0.6,72.7,13.9C67.7,28.4,60.1,40.9,48.8,52.1C37.5,63.3,22.5,73.2,5.9,76.1C-10.7,79.1,-28.9,75.2,-43.4,65.6C-57.9,56,-68.7,40.8,-73.5,23.7C-78.3,6.6,-77.1,-12.3,-68.8,-27.9C-60.5,-43.5,-45.1,-55.8,-30.3,-63.1C-15.5,-70.4,-1.3,-72.7,11.3,-68.1C23.9,-63.5,26.3,-52,40,-57.4Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute -right-20 -bottom-20 w-96 h-96 text-indigo-100 dark:text-indigo-900" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M44.4,-65.4C56.9,-56.6,66.1,-43.5,71.5,-28.8C76.9,-14.1,78.5,2.3,74.2,16.2C69.9,30.1,59.7,41.6,47.2,52.7C34.7,63.8,19.9,74.5,2.3,75.8C-15.3,77.1,-30.6,69,-45.3,58.6C-60,48.2,-74.1,35.5,-79.1,19.6C-84.1,3.7,-80,-15.4,-70.3,-31.5C-60.6,-47.6,-45.2,-60.7,-29.8,-68.5C-14.4,-76.3,1.1,-78.8,16.5,-75.1C31.8,-71.4,31.9,-74.2,44.4,-65.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header with stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Contact Messages</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage all incoming messages</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-4 py-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Total Messages: <span className="text-blue-600 dark:text-blue-400 font-semibold">{contacts.length}</span>
              </p>
            </div>
          </div>
        </div>

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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center ${currentPage === number 
                      ? 'bg-blue-600 text-white' 
                      : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Contact Details Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent >
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <DialogTitle >Contact Details</DialogTitle>
                  <DialogDescription >Full message and contact information</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {selectedContact && (
              <div className="space-y-4 py-4">
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
                    <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedContact.message}</p>
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
    </div>
  );
}