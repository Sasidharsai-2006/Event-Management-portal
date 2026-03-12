import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Filter, Search, Star, Trophy, Award } from 'lucide-react';
import EventRegistrationModal from '../components/modals/EventRegistrationModal';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    status: ''
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents([
        {
          id: '68c59b7f88b83ae1611ffef8',
          title: 'AI Tools Workshop 2024',
          description: 'Learn about the latest AI tools including ChatGPT, Claude, Midjourney, and more. Hands-on workshop with practical examples and real-world applications.',
          date: '2024-03-15',
          time: '10:00 AM',
          venue: 'Main Auditorium',
          type: 'Workshop',
          category: 'Technical',
          participants: 150,
          maxParticipants: 200,
          status: 'upcoming',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
          registrationFee: 0,
          prizes: [
            { position: 1, title: 'Best Project', value: '$100' },
            { position: 2, title: 'Runner Up', value: '$50' },
            { position: 3, title: 'Third Place', value: '$25' }
          ],
          tags: ['AI', 'ChatGPT', 'Machine Learning', 'Workshop']
        },
        {
          id: '68c59b7f88b83ae1611ffefd',
          title: 'Prompt Engineering Masterclass',
          description: 'Master the art of prompt engineering for AI models. Learn advanced techniques, best practices, and optimization strategies for better AI interactions.',
          date: '2024-03-22',
          time: '9:00 AM',
          venue: 'Computer Lab 101',
          type: 'Workshop',
          category: 'Technical',
          participants: 45,
          maxParticipants: 50,
          status: 'upcoming',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
          registrationFee: 0,
          prizes: [
            { position: 1, title: 'Prompt Master', value: 'Premium Access' },
            { position: 2, title: 'Creative Prompter', value: 'Tools Bundle' },
            { position: 3, title: 'Rising Star', value: 'Resources' }
          ],
          tags: ['Prompt Engineering', 'AI', 'ChatGPT', 'Advanced']
        },
        {
          id: '68c59b7f88b83ae1611fff02',
          title: 'Hackathon: Build with AI',
          description: '48-hour hackathon focused on building innovative solutions using AI. Teams of 2-4 members will create projects using various AI tools and APIs.',
          date: '2024-04-05',
          time: '6:00 PM',
          venue: 'Innovation Lab',
          type: 'Competition',
          category: 'Technical',
          participants: 80,
          maxParticipants: 100,
          status: 'upcoming',
          image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop&crop=center',
          registrationFee: 0,
          prizes: [
            { position: 1, title: 'Grand Prize', value: '$1000' },
            { position: 2, title: 'Second Place', value: '$500' },
            { position: 3, title: 'Third Place', value: '$250' }
          ],
          tags: ['Hackathon', 'AI', 'Competition', 'Innovation']
        },
        {
          id: '68c59b7f88b83ae1611fff07',
          title: 'Data Science Bootcamp',
          description: 'Intensive 3-day bootcamp covering data analysis, visualization, and machine learning. Perfect for beginners and intermediate learners.',
          date: '2024-04-12',
          time: '9:00 AM',
          venue: 'Data Science Lab',
          type: 'Workshop',
          category: 'Technical',
          participants: 65,
          maxParticipants: 80,
          status: 'upcoming',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
          registrationFee: 0,
          prizes: [
            { position: 1, title: 'Data Science Champion', value: 'Job Assistance' },
            { position: 2, title: 'Analytics Expert', value: 'Course Access' },
            { position: 3, title: 'Data Enthusiast', value: 'Resources' }
          ],
          tags: ['Data Science', 'Python', 'Machine Learning', 'Analytics']
        },
        {
          id: '68c59b7f88b83ae1611fff0c',
          title: 'Cybersecurity CTF Competition',
          description: 'Capture The Flag competition testing your cybersecurity skills. Challenges include cryptography, web security, reverse engineering, and forensics.',
          date: '2024-04-20',
          time: '10:00 AM',
          venue: 'Security Lab 301',
          type: 'Competition',
          category: 'Technical',
          participants: 35,
          maxParticipants: 60,
          status: 'upcoming',
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop&crop=center',
          registrationFee: 0,
          prizes: [
            { position: 1, title: 'Security Master', value: '$500' },
            { position: 2, title: 'Cyber Warrior', value: '$300' },
            { position: 3, title: 'Digital Guardian', value: '$200' }
          ],
          tags: ['Cybersecurity', 'CTF', 'Ethical Hacking', 'Security']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesCategory = !filters.category || event.category === filters.category;
    const matchesType = !filters.type || event.type === filters.type;
    const matchesStatus = !filters.status || event.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setIsRegistrationModalOpen(true);
  };

  const handleRegistration = async (eventId, formData) => {
    try {
      console.log('Registering for event:', eventId, formData);
      
      // Make API call to register for the event
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }
      
      // Update the event participants count
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, participants: event.participants + 1 }
            : event
        )
      );
      
      console.log('Registration successful:', result);
      
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-gray-600">Discover and participate in exciting campus events</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Entertainment">Entertainment</option>
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">All Types</option>
              <option value="Workshop">Workshop</option>
              <option value="Competition">Competition</option>
              <option value="Conference">Conference</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-white/90 backdrop-blur-sm text-primary-800 text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    {event.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center bg-white/90 backdrop-blur-sm text-gray-600 text-xs px-3 py-1 rounded-full shadow-lg">
                    <Clock className="w-3 h-3 mr-1" />
                    {event.time}
                  </div>
                </div>
                {event.registrationFee === 0 && (
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-block bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      FREE
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                    {event.venue}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-primary-500" />
                    {event.participants}/{event.maxParticipants} participants
                  </div>
                </div>

                {/* Prizes */}
                {event.prizes && event.prizes.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                      <span className="font-medium">Prizes</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {event.prizes.slice(0, 3).map((prize, index) => (
                        <span key={index} className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          {prize.position} - {prize.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                  ></div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRegisterClick(event)}
                    className="btn-primary flex-1 text-center group-hover:bg-primary-700 transition-colors"
                  >
                    Register Now
                  </button>
                  <Link
                    to={`/events/${event.id}`}
                    className="btn-outline px-4 group-hover:bg-primary-50 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Registration Modal */}
        <EventRegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          event={selectedEvent}
          onRegister={handleRegistration}
        />
      </div>
    </div>
  );
};

export default Events;