import React from 'react'
import { Trophy, Calendar, User, Search, Filter } from 'lucide-react'

const Results = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Results</h1>
          <p className="text-gray-600">View event results and winners</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search results..."
                  className="input w-full pl-10"
                />
              </div>
            </div>
            <select className="input min-w-32">
              <option>All Events</option>
              <option>Tech Symposium</option>
              <option>Cultural Night</option>
              <option>Sports Championship</option>
            </select>
            <select className="input min-w-32">
              <option>All Positions</option>
              <option>1st Place</option>
              <option>2nd Place</option>
              <option>3rd Place</option>
            </select>
            <button className="btn-primary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Sample Event {i}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      February {10 + i}, 2024
                    </div>
                  </div>
                  <span className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded">
                    Technical
                  </span>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((position) => (
                    <div key={position} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full mr-4">
                          {position}
                        </div>
                        <div>
                          <p className="font-medium">Sample Participant {position}</p>
                          <p className="text-sm text-gray-500">Computer Science</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Score: {95 - position * 5}/100</p>
                        <p className="text-sm text-gray-500">Position: {position}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Trophy className="w-4 h-4 mr-1" />
                      {3} winners announced
                    </div>
                    <button className="btn-outline btn-sm">
                      View Full Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Results
