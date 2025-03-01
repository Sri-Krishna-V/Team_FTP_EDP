import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import UnitNavigation from '../components/UnitNavigation';

interface UnitContent {
  title: string;
  description: string;
  sections: {
    title: string;
    content: string;
    imageUrl?: string;
  }[];
}

const UnitPage: React.FC = () => {
  const { unitNumber } = useParams<{ unitNumber: string }>();
  const unitNum = parseInt(unitNumber || '1', 10);
  
  // Sample progress data (percentage complete for each unit)
  const unitProgress = [100, 85, 70, 50, 30, 10, 0, 0];
  
  const [unitContent, setUnitContent] = useState<UnitContent | null>(null);
  
  useEffect(() => {
    // In a real application, this would fetch data from an API
    const content: UnitContent = {
      title: `Unit ${unitNum}: ${getUnitTitle(unitNum)}`,
      description: `This unit covers the fundamental concepts of ${getUnitTitle(unitNum).toLowerCase()} in entrepreneurship development.`,
      sections: generateSectionsForUnit(unitNum),
    };
    
    setUnitContent(content);
  }, [unitNum]);
  
  if (!unitContent) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{unitContent.title}</h1>
          <p className="text-gray-600">{unitContent.description}</p>
        </div>
        
        <UnitNavigation activeUnit={unitNum} progress={unitProgress} />
        
        <div className="flex justify-end mb-6">
          <a 
            href="http://127.0.0.1:8000" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
          >
            <span className="mr-2">🚀</span>
            Student Analyzer
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {unitContent.sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{section.title}</h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                {section.imageUrl && (
                  <div className="md:w-1/3">
                    <img 
                      src={section.imageUrl} 
                      alt={section.title} 
                      className="rounded-lg w-full h-auto"
                    />
                  </div>
                )}
                
                <div className={section.imageUrl ? 'md:w-2/3' : 'w-full'}>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// Helper functions to generate content
const getUnitTitle = (unitNum: number): string => {
  const titles = [
    'Introduction to Entrepreneurship',
    'Market Research and Validation',
    'Business Model Development',
    'Financial Planning',
    'Marketing and Sales Strategies',
    'Funding and Investment',
    'Legal and Regulatory Aspects',
    'Scaling and Growth Strategies',
  ];
  
  return titles[unitNum - 1] || 'Unknown Unit';
};

const generateSectionsForUnit = (unitNum: number) => {
  const sections = [];
  
  // Generate 3-5 sections per unit
  const numSections = 3 + (unitNum % 3);
  
  for (let i = 1; i <= numSections; i++) {
    sections.push({
      title: `Section ${i}: ${getSectionTitle(unitNum, i)}`,
      content: getContentForSection(unitNum, i),
      imageUrl: getImageForSection(unitNum, i),
    });
  }
  
  return sections;
};

const getSectionTitle = (unitNum: number, sectionNum: number): string => {
  const sectionTitles = [
    ['Entrepreneurial Mindset', 'Identifying Opportunities', 'Idea Validation', 'Entrepreneurial Ecosystem', 'Case Studies'],
    ['Market Research Basics', 'Customer Discovery', 'Competitive Analysis', 'Market Sizing', 'Validation Techniques'],
    ['Business Model Canvas', 'Value Proposition', 'Customer Segments', 'Revenue Models', 'Cost Structure'],
    ['Financial Projections', 'Cash Flow Management', 'Break-even Analysis', 'Pricing Strategies', 'Financial Statements'],
    ['Brand Development', 'Digital Marketing', 'Sales Funnel', 'Customer Acquisition', 'Retention Strategies'],
    ['Bootstrapping', 'Angel Investment', 'Venture Capital', 'Pitch Deck Creation', 'Negotiation Skills'],
    ['Business Registration', 'Intellectual Property', 'Contracts and Agreements', 'Compliance', 'Risk Management'],
    ['Team Building', 'Operational Efficiency', 'International Expansion', 'Exit Strategies', 'Sustainable Growth'],
  ];
  
  return sectionTitles[unitNum - 1][sectionNum - 1] || 'Topic';
};

const getImageForSection = (unitNum: number, sectionNum: number): string => {
  const images = [
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  ];
  
  // Use a deterministic but seemingly random selection
  const index = (unitNum + sectionNum) % images.length;
  return images[index];
};

const getContentForSection = (unitNum: number, sectionNum: number): string => {
  const entrepreneurshipContent = [
    "Entrepreneurship is about identifying opportunities, taking calculated risks, and creating value through innovative solutions. This section explores the entrepreneurial mindset and how to develop it. You'll learn about the key traits of successful entrepreneurs and how to cultivate them in your own approach to business.",
    
    "Market research is the foundation of any successful business venture. In this section, you'll learn how to conduct effective market research to validate your business idea. We'll cover techniques for gathering data, analyzing market trends, and identifying customer needs that your business can address.",
    
    "A well-defined business model is essential for translating your idea into a viable enterprise. This section introduces the Business Model Canvas as a tool for mapping out the key components of your business. You'll learn how to articulate your value proposition, identify customer segments, and define revenue streams.",
    
    "Financial planning is critical for business success. This section covers the fundamentals of financial projections, cash flow management, and break-even analysis. You'll learn how to create financial statements that will help you make informed decisions and attract potential investors.",
    
    "Effective marketing and sales strategies are essential for reaching your target customers. This section explores various marketing channels, customer acquisition techniques, and sales funnel optimization. You'll learn how to develop a comprehensive marketing plan that aligns with your business goals.",
    
    "Securing funding is often necessary for business growth. This section covers different funding options, from bootstrapping to venture capital. You'll learn how to create a compelling pitch deck, approach investors, and negotiate favorable terms for your business.",
    
    "Understanding the legal and regulatory aspects of business is crucial for long-term success. This section covers business registration, intellectual property protection, and compliance requirements. You'll learn how to navigate the legal landscape and protect your business interests.",
    
    "Scaling your business requires strategic planning and execution. This section explores team building, operational efficiency, and international expansion strategies. You'll learn how to grow your business sustainably while maintaining your core values and vision."
  ];
  
  return entrepreneurshipContent[(unitNum - 1) % entrepreneurshipContent.length];
};

export default UnitPage;