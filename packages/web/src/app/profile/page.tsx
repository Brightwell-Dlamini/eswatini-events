'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TicketIcon,
  UserCircleIcon,
  CogIcon,
  BellIcon,
  CreditCardIcon,
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Password changed',
      message: 'Your password was successfully updated',
      time: '2 hours ago',
      read: true,
    },
    {
      id: '2',
      title: 'New login',
      message: 'Login from new device detected',
      time: '1 day ago',
      read: true,
    },
    {
      id: '3',
      title: 'Payment received',
      message: 'Your payment for MTN Bushfire was confirmed',
      time: '3 days ago',
      read: false,
    },
  ]);

  const [paymentMethods] = useState([
    {
      id: '1',
      type: 'Visa',
      number: '•••• •••• •••• 4242',
      expiry: '05/26',
      primary: true,
    },
    {
      id: '2',
      type: 'Mastercard',
      number: '•••• •••• •••• 5555',
      expiry: '08/25',
      primary: false,
    },
  ]);

  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+268 1234 5678',
    location: 'Mbabane, Eswatini',
    bio: 'Event enthusiast and music lover',
    tickets: [
      {
        id: 'TKT-123',
        event: 'MTN Bushfire Festival',
        date: '2025-05-30',
        location: 'Malkerns Valley',
        time: '18:00',
        price: 'E500',
        status: 'Confirmed',
      },
      {
        id: 'TKT-124',
        event: 'Eswatini vs Nigeria',
        date: '2025-07-19',
        location: 'Somhlolo Stadium',
        time: '15:00',
        price: 'E250',
        status: 'Confirmed',
      },
    ],
  };

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    bio: user.bio,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main>
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="relative h-32 w-32 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center">
                <UserCircleIcon className="h-28 w-28 text-white/90" />
                <button className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-indigo-600 rounded-full p-2 shadow-lg">
                  <CogIcon className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="text-white">
                <h1 className="text-4xl font-bold">{user.name}</h1>
                <p className="text-white/90 mt-1">{user.bio}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="h-5 w-5" />
                    {user.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <GlobeAltIcon className="h-5 w-5" />
                    Member since 2023
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6">
                <nav className="space-y-1">
                  {[
                    { id: 'profile', icon: UserCircleIcon, label: 'Profile' },
                    { id: 'tickets', icon: TicketIcon, label: 'My Tickets' },
                    {
                      id: 'notifications',
                      icon: BellIcon,
                      label: 'Notifications',
                      count: notifications.filter((n) => !n.read).length,
                    },
                    {
                      id: 'payment',
                      icon: CreditCardIcon,
                      label: 'Payment Methods',
                    },
                    { id: 'security', icon: LockClosedIcon, label: 'Security' },
                    { id: 'settings', icon: CogIcon, label: 'Settings' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {item.count ? (
                        <span className="ml-auto bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full lg:w-3/4">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Personal Information
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Email
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Phone
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bio
                          </label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                      <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Account Preferences
                      </h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Email Notifications
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive email updates and notifications
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            SMS Notifications
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive text message updates
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Dark Mode
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Switch between light and dark theme
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tickets Tab */}
              {activeTab === 'tickets' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        My Tickets
                      </h3>
                    </div>
                    <div className="p-6">
                      {user.tickets.length > 0 ? (
                        <div className="space-y-4">
                          {user.tickets.map((ticket) => (
                            <div
                              key={ticket.id}
                              className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {ticket.event}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center">
                                      <CalendarIcon className="h-4 w-4 mr-1" />
                                      {new Date(ticket.date).toLocaleDateString(
                                        'en-SZ',
                                        {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                        }
                                      )}
                                    </span>
                                    <span className="flex items-center">
                                      <MapPinIcon className="h-4 w-4 mr-1" />
                                      {ticket.location}
                                    </span>
                                    <span className="flex items-center">
                                      <ClockIcon className="h-4 w-4 mr-1" />
                                      {ticket.time}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    {ticket.status}
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {ticket.price}
                                  </span>
                                  <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center">
                                    View details
                                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <TicketIcon className="h-12 w-12 mx-auto text-gray-400" />
                          <h4 className="mt-4 font-medium text-gray-900 dark:text-white">
                            No tickets yet
                          </h4>
                          <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Your purchased tickets will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Mark all as read
                      </button>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                              !notification.read
                                ? 'bg-indigo-50/50 dark:bg-indigo-900/10'
                                : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-4">
                              <div className="mt-1 flex-shrink-0">
                                <BellIcon
                                  className={`h-5 w-5 ${
                                    !notification.read
                                      ? 'text-indigo-600 dark:text-indigo-400'
                                      : 'text-gray-400 dark:text-gray-500'
                                  }`}
                                />
                              </div>
                              <div>
                                <h4
                                  className={`text-sm font-medium ${
                                    !notification.read
                                      ? 'text-gray-900 dark:text-white'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="ml-auto h-2 w-2 rounded-full bg-indigo-600"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <BellIcon className="h-12 w-12 mx-auto text-gray-400" />
                          <h4 className="mt-4 font-medium text-gray-900 dark:text-white">
                            No notifications
                          </h4>
                          <p className="mt-2 text-gray-600 dark:text-gray-400">
                            You&apos;re all caught up
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Payment Methods
                      </h3>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Add new
                      </button>
                    </div>
                    <div className="p-6">
                      {paymentMethods.length > 0 ? (
                        <div className="space-y-4">
                          {paymentMethods.map((method) => (
                            <div
                              key={method.id}
                              className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between"
                            >
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-md flex items-center justify-center">
                                  {method.type === 'Visa' ? (
                                    <span className="font-bold text-indigo-800 dark:text-indigo-300">
                                      Visa
                                    </span>
                                  ) : (
                                    <span className="font-bold text-indigo-800 dark:text-indigo-300">
                                      MC
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {method.number}
                                  </h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Expires {method.expiry}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {method.primary && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                    Primary
                                  </span>
                                )}
                                <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                                  Edit
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <CreditCardIcon className="h-12 w-12 mx-auto text-gray-400" />
                          <h4 className="mt-4 font-medium text-gray-900 dark:text-white">
                            No payment methods
                          </h4>
                          <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Add a payment method to make purchases easier
                          </p>
                          <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                            Add Payment Method
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Security
                      </h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Password
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Last changed 3 months ago
                          </p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          Change Password
                        </button>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                          Enable 2FA
                        </button>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Active Sessions
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            2 devices currently signed in
                          </p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          View Sessions
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Account Settings
                      </h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Language
                        </h4>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
                          <option>English</option>
                          <option>French</option>
                          <option>Spanish</option>
                        </select>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Timezone
                        </h4>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
                          <option>(GMT+02:00) Africa/Mbabane</option>
                          <option>(GMT+01:00) Europe/London</option>
                          <option>(GMT-05:00) America/New_York</option>
                        </select>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Currency
                        </h4>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
                          <option>Lilangeni (SZL)</option>
                          <option>US Dollar (USD)</option>
                          <option>Euro (EUR)</option>
                        </select>
                      </div>

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                          Delete Account
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          This action cannot be undone. All your data will be
                          permanently removed.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
