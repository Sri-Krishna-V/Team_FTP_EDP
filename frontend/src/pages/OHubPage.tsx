import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import FeatureCard from '../components/FeatureCard';
import { BarChart2, ShoppingBag, Cpu, Database, ArrowRight } from 'lucide-react';

const OHubPage: React.FC = () => {
  const features = [
    {
      title: "ML Statistics Analyzer",
      description: "Advanced machine learning tools to analyze and visualize complex datasets with predictive modeling capabilities.",
      icon: <BarChart2 className="h-8 w-8" />,
      link: "/ml-analyzer",
      bgColor: "bg-gradient-to-br from-blue-600 to-indigo-700"
    },
    {
      title: "Virtual Marketplace",
      description: "Connect with partners, investors, and customers in our digital ecosystem designed for innovation and growth.",
      icon: <ShoppingBag className="h-8 w-8" />,
      link: "/marketplace",
      bgColor: "bg-gradient-to-br from-orange-500 to-red-600"
    },
    {
      title: "Innovation Lab",
      description: "Access cutting-edge tools and resources to prototype, test, and refine your technological solutions.",
      icon: <Cpu className="h-8 w-8" />,
      link: "/innovation",
      bgColor: "bg-gradient-to-br from-green-500 to-teal-600"
    },
    {
      title: "Knowledge Repository",
      description: "Comprehensive database of research papers, case studies, and industry insights to fuel your innovation journey.",
      icon: <Database className="h-8 w-8" />,
      link: "/knowledge-base",
      bgColor: "bg-gradient-to-br from-purple-600 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="ohub" />
      
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Future-Proofing Growth Through Innovation</h1>
            <p className="text-xl mb-8 text-gray-300">India's First EDP Integrated Ecosystem, Innovation Hub & Startup Incubation.</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-medium transition-colors inline-flex items-center">
              Learn More <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Innovation Ecosystem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover powerful tools and resources designed to accelerate your growth and innovation journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              link={feature.link}
              bgColor={feature.bgColor}
            />
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-16">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Global Conference</h3>
              <p className="text-gray-600 mb-6">
                Join industry leaders, innovators, and investors at our annual global conference focused on emerging technologies and market trends.
              </p>
              <div className="flex items-center">
                <Link to="/events" className="text-orange-500 font-medium hover:text-orange-600 inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Conference" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Startup Membership</h3>
            <p className="text-gray-600 mb-4">
              Access mentorship, funding opportunities, and resources tailored for early-stage startups.
            </p>
            <Link to="/membership/startup" className="text-orange-500 font-medium hover:text-orange-600 inline-flex items-center">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Partner Membership</h3>
            <p className="text-gray-600 mb-4">
              Collaborate with innovative startups and access our network of industry experts and resources.
            </p>
            <Link to="/membership/partner" className="text-orange-500 font-medium hover:text-orange-600 inline-flex items-center">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Partner Offers</h3>
            <p className="text-gray-600 mb-4">
              Exclusive deals and services from our network of partners to help accelerate your business.
            </p>
            <Link to="/partner-offers" className="text-orange-500 font-medium hover:text-orange-600 inline-flex items-center">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  O
                </div>
                <span className="ml-2 text-xl font-bold">hub</span>
              </div>
              <p className="text-gray-400">
                Catalyzing innovation and growth through technology and collaboration.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/team" className="text-gray-400 hover:text-white">Our Team</Link></li>
                <li><Link to="/events" className="text-gray-400 hover:text-white">Events</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/resources/news" className="text-gray-400 hover:text-white">News</Link></li>
                <li><Link to="/resources/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link to="/resources/studio" className="text-gray-400 hover:text-white">Studio</Link></li>
                <li><Link to="/faqs" className="text-gray-400 hover:text-white">FAQs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <address className="not-italic text-gray-400">
                <p>123 Innovation Street</p>
                <p>Tech City, TC 12345</p>
                <p className="mt-2">info@ohub.com</p>
                <p>+1 (555) 123-4567</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 OHUB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OHubPage;