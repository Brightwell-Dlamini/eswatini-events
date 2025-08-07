import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketId: string;
  checkedIn: boolean;
}

interface AttendeeListProps {
  eventId?: string;
}

export const AttendeeList: React.FC<AttendeeListProps> = ({ eventId }) => {
  const [search, setSearch] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    const fetchAttendees = async () => {
      const data = await api.getAttendees(eventId);
      setAttendees(data);
    };
    fetchAttendees();
  }, [eventId]);

  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(search.toLowerCase()) ||
      attendee.email.toLowerCase().includes(search.toLowerCase()) ||
      attendee.ticketId.includes(search)
  );

  const handleBulkEmail = () => {
    console.log('Sending bulk email to attendees');
    // Simulate API call
  };

  const handleCheckIn = async (id: string) => {
    try {
      await api.checkInAttendee(id);
      setAttendees(
        attendees.map((attendee) =>
          attendee.id === id ? { ...attendee, checkedIn: true } : attendee
        )
      );
    } catch (error) {
      console.error('Error checking in attendee:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Attendees</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name/email/ticket ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-white bg-opacity-10 text-white flex-grow"
        />
        <button onClick={handleBulkEmail} className="btn-primary">
          Email All
        </button>
      </div>
      <ul className="space-y-2">
        {filteredAttendees.map((attendee) => (
          <li key={attendee.id} className="flex justify-between items-center">
            <div>
              <p>
                {attendee.name} ({attendee.email})
              </p>
              <p>Ticket ID: {attendee.ticketId}</p>
            </div>
            <div>
              <span
                className={
                  attendee.checkedIn ? 'text-green-400' : 'text-red-400'
                }
              >
                {attendee.checkedIn ? 'Checked In' : 'Not Checked In'}
              </span>
              {!attendee.checkedIn && (
                <button
                  onClick={() => handleCheckIn(attendee.id)}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full ml-4"
                >
                  Check In
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
