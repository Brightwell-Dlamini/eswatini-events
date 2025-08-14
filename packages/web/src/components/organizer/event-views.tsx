// components/event-views.tsx
interface EventViewProps {
  event: Event;
  selected?: boolean;
  onSelect?: (id: string) => void;
  variant?: 'card' | 'list' | 'table';
}

export function EventCard({
  event,
  selected = false,
  onSelect,
}: EventViewProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all ${
        selected ? 'ring-2 ring-primary' : 'hover:border-primary/50'
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onSelect?.(event.id)}
        className="absolute z-10 top-3 left-3 h-5 w-5 rounded border checked:bg-primary"
      />

      <div className="aspect-video overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold line-clamp-2 leading-snug">
            {event.title}
          </h3>
          <EventStatusBadge status={event.status} />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FiCalendar size={14} />
          <span>
            {new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <EventProgress value={event.ticketsSold} max={event.capacity} />

        <div className="flex justify-between text-sm">
          <span>${event.revenue.toLocaleString()}</span>
          <span>{event.attendees} attendees</span>
        </div>
      </div>
    </motion.div>
  );
}

export function EventListCard({ event, selected, onSelect }: EventViewProps) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className={`flex items-stretch rounded-lg border bg-card overflow-hidden ${
        selected ? 'ring-1 ring-primary' : ''
      }`}
    >
      <div className="w-1/3 relative">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect?.(event.id)}
          className="absolute top-3 left-3 h-5 w-5 rounded border checked:bg-primary z-10"
        />
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover min-h-32"
        />
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">{event.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <FiCalendar size={14} />
              <span>
                {new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
          <EventStatusBadge status={event.status} />
        </div>

        <div className="mt-auto pt-4">
          <div className="flex justify-between items-center">
            <EventProgress
              value={event.ticketsSold}
              max={event.capacity}
              compact
            />
            <Button variant="ghost" size="sm" className="ml-auto">
              <FiMoreVertical size={16} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function EventTableRow({ event, selected, onSelect }: EventViewProps) {
  return (
    <tr className={`hover:bg-muted/50 ${selected ? 'bg-primary/5' : ''}`}>
      <td className="p-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect?.(event.id)}
          className="h-4 w-4 rounded border checked:bg-primary"
        />
      </td>
      <td className="p-3 font-medium">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
          <span>{event.title}</span>
        </div>
      </td>
      <td className="p-3 text-sm text-muted-foreground">
        {new Date(event.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </td>
      <td className="p-3">
        <EventStatusBadge status={event.status} />
      </td>
      <td className="p-3">
        <EventProgress
          value={event.ticketsSold}
          max={event.capacity}
          showNumbers
        />
      </td>
      <td className="p-3 font-medium">${event.revenue.toLocaleString()}</td>
      <td className="p-3 text-right">
        <DropdownMenu>
          <DropdownTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <FiMoreVertical size={16} />
            </Button>
          </DropdownTrigger>
          <DropdownContent align="end">
            <DropdownItem>
              <FiEdit2 className="mr-2" size={14} />
              Edit
            </DropdownItem>
            <DropdownItem>
              <FiBarChart2 className="mr-2" size={14} />
              Analytics
            </DropdownItem>
            <DropdownItem>
              <FiShare2 className="mr-2" size={14} />
              Share
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

function EventStatusBadge({ status }: { status: string }) {
  const statusMap = {
    draft: {
      label: 'Draft',
      class:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    published: {
      label: 'Live',
      class:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    completed: {
      label: 'Completed',
      class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    },
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${statusMap[status].class}`}
    >
      {statusMap[status].label}
    </span>
  );
}

function EventProgress({ value, max, compact = false, showNumbers = false }) {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className={`${compact ? 'w-24' : 'w-full'}`}>
      {showNumbers && (
        <div className="flex justify-between text-xs mb-1">
          <span>{value} sold</span>
          <span>{max} total</span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!compact && !showNumbers && (
        <div className="flex justify-between text-xs mt-1">
          <span className="text-muted-foreground">
            {value}/{max} tickets
          </span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}
