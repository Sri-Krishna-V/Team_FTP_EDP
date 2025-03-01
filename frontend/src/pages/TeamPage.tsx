import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';

interface TeamMember {
  id: number;
  name: string;
  title: string;
  imageUrl: string;
  bio: string;
}

const TeamPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  
  const boardMembers: TeamMember[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Chairperson",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Dr. Johnson has over 20 years of experience in technology innovation and corporate leadership."
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Vice Chairperson",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Michael brings extensive experience in venture capital and startup ecosystems across Asia and North America."
    },
    {
      id: 3,
      name: "Dr. Amara Patel",
      title: "Board Member",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "A renowned researcher in AI and machine learning with multiple patents to her name."
    },
    {
      id: 4,
      name: "Robert Kim",
      title: "Board Member",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Former CEO of TechGlobal with expertise in scaling technology companies internationally."
    },
    {
      id: 5,
      name: "Elena Rodriguez",
      title: "Board Member",
      imageUrl: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Specializes in corporate innovation strategies and digital transformation."
    },
    {
      id: 6,
      name: "David Okafor",
      title: "Board Member",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Brings 15 years of experience in financial technology and regulatory compliance."
    },
    {
      id: 7,
      name: "Jennifer Wu",
      title: "Board Member",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Expert in sustainable technology and environmental innovation."
    },
    {
      id: 8,
      name: "Thomas Müller",
      title: "Board Member",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Former CTO with extensive background in hardware and software integration."
    }
  ];
  
  const advisoryMembers: TeamMember[] = [
    {
      id: 1,
      name: "Prof. James Wilson",
      title: "Scientific Advisor",
      imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Leading researcher in quantum computing and advanced materials."
    },
    { id: 2,
      name: "Dr. Lisa Nakamura",
      title: "Technology Advisor",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Pioneering researcher in biotechnology and medical innovations."
    },
    {
      id: 3,
      name: "Alex Thompson",
      title: "Investment Advisor",
      imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Managing partner at Venture Capital firm with focus on deep tech investments."
    },
    {
      id: 4,
      name: "Maria Gonzalez",
      title: "Policy Advisor",
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Former government official specializing in technology policy and regulation."
    },
    {
      id: 5,
      name: "Dr. Raj Patel",
      title: "Innovation Advisor",
      imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Expert in corporate innovation strategies and digital transformation frameworks."
    },
    {
      id: 6,
      name: "Sophia Kim",
      title: "Entrepreneurship Advisor",
      imageUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Serial entrepreneur with multiple successful exits in the technology sector."
    },
    {
      id: 7,
      name: "Dr. Omar Hassan",
      title: "Research Advisor",
      imageUrl: "https://images.unsplash.com/photo-1562788869-4ed32648eb72?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Leading academic in artificial intelligence and machine learning applications."
    },
    {
      id: 8,
      name: "Claire Bennett",
      title: "Strategic Advisor",
      imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Former executive with expertise in scaling global technology operations."
    }
  ];
  
  const members = type === 'board' ? boardMembers : advisoryMembers;
  const title = type === 'board' ? 'Board of Directors' : 'Advisory Committee';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="ohub" />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {type === 'board' 
              ? 'Our board of directors brings diverse expertise to guide our strategic direction and governance.' 
              : 'Our advisory committee consists of industry experts providing specialized guidance and insights.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map(member => (
            <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="h-64 overflow-hidden">
                <img 
                  src={member.imageUrl} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-orange-500 font-medium mb-3">{member.title}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeamPage;