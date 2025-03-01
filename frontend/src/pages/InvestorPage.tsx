import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';

const InvestorPage: React.FC = () => {
  const { section } = useParams<{ section: string }>();
  
  const renderDealFlow = () => (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Deal Flow</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Access our curated pipeline of innovative startups and investment opportunities.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Investment Opportunities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">TechStartup {i}</h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Seed Stage</span>
              </div>
              <p className="text-gray-600 mb-4">Innovative AI-powered solution for enterprise workflow automation.</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Raising: $1.5M</span>
                <span>Valuation: $8M</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors">
            Request Full Access
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Investment Process</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "Discovery", desc: "Identify promising startups through our network and screening process." },
            { title: "Due Diligence", desc: "Comprehensive analysis of business model, team, market, and technology." },
            { title: "Investment", desc: "Structured investment process with clear terms and documentation." },
            { title: "Support", desc: "Post-investment support including mentorship, resources, and connections." }
          ].map((step, i) => (
            <div key={i} className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {i + 1}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderStrategicTeam = () => (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Strategic Team</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Meet our investment professionals who identify and support promising ventures.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { name: "Jennifer Lee", title: "Investment Director", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" },
          { name: "Mark Thompson", title: "Principal", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" },
          { name: "Sophia Rodriguez", title: "Investment Manager", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" },
          { name: "David Chen", title: "Investment Analyst", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" },
          { name: "Priya Sharma", title: "Investment Analyst", img: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" },
          { name: "Michael Johnson", title: "Venture Partner", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" }
        ].map((person, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 overflow-hidden">
              <img src={person.img} alt={person.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800">{person.name}</h3>
              <p className="text-orange-500">{person.title}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Our Investment Network</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Connect with our investment team to explore opportunities for collaboration and co-investment.
        </p>
        <button className="bg-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors">
          Contact Investment Team
        </button>
      </div>
    </div>
  );
  
  const renderPartners = () => (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Investment Partners</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our network of investment partners who collaborate with us to support innovative ventures.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-32">
            <img 
              src={`https://images.unsplash.com/photo-1560179707-${i}f14ecb4b53?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80`} 
              alt={`Partner ${i}`} 
              className="max-h-16"
            />
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Partnership Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Deal Access", desc: "Priority access to our curated pipeline of investment opportunities." },
            { title: "Co-Investment", desc: "Participate in syndicated deals with favorable terms and reduced fees." },
            { title: "Network", desc: "Connect with other investors, entrepreneurs, and industry experts." },
            { title: "Due Diligence", desc: "Leverage our comprehensive due diligence process and reports." },
            { title: "Events", desc: "Exclusive invitations to investment showcases and networking events." },
            { title: "Support", desc: "Post-investment monitoring and portfolio company support." }
          ].map((benefit, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderContent = () => {
    switch(section) {
      case 'dealflow':
        return renderDealFlow();
      case 'strategic':
        return renderStrategicTeam();
      case 'partners':
        return renderPartners();
      default:
        return renderDealFlow();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="ohub" />
      
      <main className="container mx-auto px-4 py-12">
        {renderContent()}
      </main>
    </div>
  );
};

export default InvestorPage;