import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Star, Search, Filter, MapPin, Clock, Award } from 'lucide-react';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: ''
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClubs([
        {
          id: '68c59b7f88b83ae1611ffeec',
          name: 'MLSC (Machine Learning Student Community)',
          description: 'A community of students passionate about machine learning, AI, and data science. We organize workshops, hackathons, and research projects.',
          category: 'Technical',
          type: 'Student Led',
          members: 95,
          maxMembers: 100,
          events: 8,
          rating: 4.8,
          logo: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=100&h=100&fit=crop&crop=center',
          color: 'bg-blue-500',
          meetingSchedule: {
            day: 'Friday',
            time: '18:00',
            venue: 'Computer Lab 101',
            frequency: 'weekly'
          },
          tags: ['machine learning', 'AI', 'data science', 'python', 'tensorflow'],
          contactInfo: {
            email: 'mlsc@campusconnect.edu',
            phone: '+1 (555) 123-4567'
          }
        },
        {
          id: '68c59b7f88b83ae1611ffeef',
          name: 'GFG (GeeksforGeeks) Student Chapter',
          description: 'Official GeeksforGeeks student chapter focused on competitive programming, data structures, and algorithms. We conduct coding contests and interview preparation sessions.',
          category: 'Technical',
          type: 'Official',
          members: 120,
          maxMembers: 150,
          events: 12,
          rating: 4.9,
          logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop&crop=center',
          color: 'bg-green-500',
          meetingSchedule: {
            day: 'Saturday',
            time: '10:00',
            venue: 'Programming Lab 201',
            frequency: 'weekly'
          },
          tags: ['competitive programming', 'algorithms', 'data structures', 'interview prep', 'coding'],
          contactInfo: {
            email: 'gfg@campusconnect.edu',
            phone: '+1 (555) 123-4568'
          }
        },
        {
          id: '68c59b7f88b83ae1611ffef2',
          name: 'GDG (Google Developer Group)',
          description: 'Google Developer Group focused on Google technologies, cloud computing, and developer tools. We organize tech talks, workshops, and Google Cloud events.',
          category: 'Technical',
          type: 'Official',
          members: 65,
          maxMembers: 80,
          events: 6,
          rating: 4.7,
          logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&crop=center',
          color: 'bg-red-500',
          meetingSchedule: {
            day: 'Wednesday',
            time: '19:00',
            venue: 'Google Cloud Lab',
            frequency: 'bi-weekly'
          },
          tags: ['google cloud', 'android development', 'web development', 'firebase', 'flutter'],
          contactInfo: {
            email: 'gdg@campusconnect.edu',
            phone: '+1 (555) 123-4569'
          }
        },
        {
          id: '68c59b7f88b83ae1611ffef5',
          name: 'BlackBox - Cybersecurity Club',
          description: 'Cybersecurity and ethical hacking club focused on information security, penetration testing, and digital forensics. We conduct CTF competitions and security workshops.',
          category: 'Technical',
          type: 'Student Led',
          members: 45,
          maxMembers: 60,
          events: 10,
          rating: 4.9,
          logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop&crop=center',
          color: 'bg-purple-500',
          meetingSchedule: {
            day: 'Thursday',
            time: '17:00',
            venue: 'Security Lab 301',
            frequency: 'weekly'
          },
          tags: ['cybersecurity', 'ethical hacking', 'penetration testing', 'CTF', 'digital forensics'],
          contactInfo: {
            email: 'blackbox@campusconnect.edu',
            phone: '+1 (555) 123-4570'
          }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         club.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                         club.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesCategory = !filters.category || club.category === filters.category;
    const matchesType = !filters.type || club.type === filters.type;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clubs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clubs</h1>
          <p className="text-gray-600">Join amazing clubs and be part of something bigger</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clubs..."
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
              <option value="Arts">Arts</option>
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">All Types</option>
              <option value="Student Led">Student Led</option>
              <option value="Official">Official</option>
              <option value="Faculty Led">Faculty Led</option>
            </select>
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredClubs.map((club) => (
            <div key={club.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className={`w-16 h-16 ${club.color} rounded-lg flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <img 
                      src={club.logo} 
                      alt={club.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                      {club.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {club.category}
                      </span>
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {club.type}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      <span className="font-medium">{club.rating}</span>
                      <span className="text-gray-400 ml-1">(4.5/5)</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {club.description}
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-primary-500" />
                      {club.members}/{club.maxMembers} members
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                      {club.events} events
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-primary-500" />
                    {club.meetingSchedule.day}s at {club.meetingSchedule.time} ({club.meetingSchedule.frequency})
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                    {club.meetingSchedule.venue}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {club.tags.slice(0, 4).map((tag, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Membership</span>
                    <span>{Math.round((club.members / club.maxMembers) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(club.members / club.maxMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/clubs/${club.id}`}
                    className="btn-primary flex-1 text-center group-hover:bg-primary-700 transition-colors"
                  >
                    View Club
                  </Link>
                  <button className="btn-outline px-4 group-hover:bg-primary-50 transition-colors">
                    <Users className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;