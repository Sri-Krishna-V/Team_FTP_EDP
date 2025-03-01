import React from 'react';
import Header from '../components/Header';
import Calendar from '../components/Calendar';

const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="ohub" />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Events Calendar</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with our upcoming events, workshops, and networking opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Calendar />
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Featured Event</h2>
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Innovation Summit" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Annual Innovation Summit</h3>
              <div className="text-sm text-gray-600 mb-2">January 15, 2025 • Virtual</div>
              <p className="text-gray-700 mb-4">
                Join industry leaders and innovators for our flagship event focused on emerging technologies and market trends.
              </p>
              <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors">
                Register Now
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Event Categories</h2>
              <div className="space-y-2">
                {[
                  { name: "Workshops", count: 12, color: "bg-blue-100 text-blue-800" },
                  { name: "Networking", count: 8, color: "bg-green-100 text-green-800" },
                  { name: "Conferences", count: 4, color: "bg-purple-100 text-purple-800" },
                  { name: "Webinars", count: 15, color: "bg-orange-100 text-orange-800" },
                  { name: "Pitch Days", count: 6, color: "bg-red-100 text-red-800" }
                ].map((category, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                    <span className="font-medium">{category.name}</span>
                    <span className={`${category.color} text-xs font-medium px-2.5 py-0.5 rounded`}>
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;