import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  Calendar, 
  Users, 
  Trophy, 
  Star, 
  ArrowRight,
  Clock,
  MapPin,
  User
} from 'lucide-react'
import EventRegistrationModal from '../components/modals/EventRegistrationModal'

const Home = () => {
  const { user } = useSelector((state) => state.auth)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)

  const stats = [
    { label: 'Active Events', value: '24', icon: Calendar, color: 'text-blue-600' },
    { label: 'Clubs', value: '15', icon: Users, color: 'text-green-600' },
    { label: 'Participants', value: '1,200+', icon: User, color: 'text-purple-600' },
    { label: 'Winners', value: '180+', icon: Trophy, color: 'text-yellow-600' },
  ]

  const upcomingEvents = [
    {
      id: '68c59b7f88b83ae1611ffef8',
      title: 'AI Tools Workshop 2024',
      date: '2024-03-15',
      time: '10:00 AM',
      venue: 'Main Auditorium',
      type: 'Workshop',
      participants: 150,
      maxParticipants: 200,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&crop=center',
      description: 'Learn about the latest AI tools including ChatGPT, Claude, Midjourney, and more.'
    },
    {
      id: '68c59b7f88b83ae1611ffefd',
      title: 'Prompt Engineering Masterclass',
      date: '2024-03-22',
      time: '9:00 AM',
      venue: 'Computer Lab 101',
      type: 'Workshop',
      participants: 45,
      maxParticipants: 50,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&crop=center',
      description: 'Master the art of prompt engineering for AI models with advanced techniques.'
    },
    {
      id: '68c59b7f88b83ae1611fff02',
      title: 'Hackathon: Build with AI',
      date: '2024-04-05',
      time: '6:00 PM',
      venue: 'Innovation Lab',
      type: 'Competition',
      participants: 80,
      maxParticipants: 100,
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=200&fit=crop&crop=center',
      description: '48-hour hackathon focused on building innovative solutions using AI.'
    }
  ]

  const featuredClubs = [
    {
      id: '68c59b7f88b83ae1611ffeec',
      name: 'MLSC (Machine Learning Student Community)',
      category: 'Technical',
      members: 95,
      events: 8,
      description: 'A community passionate about machine learning, AI, and data science',
      logo: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=60&h=60&fit=crop&crop=center',
      color: 'bg-blue-500'
    },
    {
      id: '68c59b7f88b83ae1611ffeef',
      name: 'GFG (GeeksforGeeks) Student Chapter',
      category: 'Technical',
      members: 120,
      events: 12,
      description: 'Focused on competitive programming and algorithms',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=60&h=60&fit=crop&crop=center',
      color: 'bg-green-500'
    },
    {
      id: '68c59b7f88b83ae1611ffef2',
      name: 'GDG (Google Developer Group)',
      category: 'Technical',
      members: 65,
      events: 6,
      description: 'Google technologies, cloud computing, and developer tools',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=60&h=60&fit=crop&crop=center',
      color: 'bg-red-500'
    },
    {
      id: '68c59b7f88b83ae1611ffef5',
      name: 'BlackBox - Cybersecurity Club',
      category: 'Technical',
      members: 45,
      events: 10,
      description: 'Cybersecurity, ethical hacking, and digital forensics',
      logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=60&h=60&fit=crop&crop=center',
      color: 'bg-purple-500'
    }
  ]

  const handleRegisterClick = (event) => {
    setSelectedEvent(event)
    setIsRegistrationModalOpen(true)
  }

  const handleRegistration = async (eventId, formData) => {
    try {
      console.log('Registering for event:', eventId, formData)
      
      // Make API call to register for the event
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }
      
      console.log('Registration successful:', result)
      
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-400">CampusConnect</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Your gateway to college events, club management, and student engagement. 
              Connect, participate, and excel in your college journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg px-8"
              >
                Explore Events
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/clubs"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 btn-lg px-8"
              >
                Join Clubs
                <Users className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these exciting events happening around campus
            </p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className="relative overflow-hidden rounded-t-lg">
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
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
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

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Registration Progress</span>
                        <span>{Math.round((event.participants / event.maxParticipants) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
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

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="btn-primary btn-lg"
            >
              View All Events
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Clubs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Clubs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join these amazing clubs and be part of something bigger
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredClubs.map((club) => (
              <div key={club.id} className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${club.color} rounded-lg flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <img 
                        src={club.logo} 
                        alt={club.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {club.name}
                      </h3>
                      <span className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {club.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                    {club.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-primary-500" />
                        {club.members} members
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-primary-500" />
                        {club.events} events
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/clubs/${club.id}`}
                      className="btn-primary flex-1 text-center group-hover:bg-primary-700 transition-colors"
                    >
                      View Club
                    </Link>
                    <button className="btn-outline px-3 group-hover:bg-primary-50 transition-colors">
                      <Users className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/clubs"
              className="btn-primary btn-lg"
            >
              Explore All Clubs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already using CampusConnect to manage their college experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg px-8"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 btn-lg px-8"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Registration Modal */}
      <EventRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        event={selectedEvent}
        onRegister={handleRegistration}
      />
    </div>
  )
}

export default Home
