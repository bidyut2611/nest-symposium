import React from 'react';

const HACKATHON_PROBLEMS = [
  {
    vertical: "Vertical 1: Innovation Hub on Grassroots Technologies",
    categories: [
      {
        name: "Class 8 to Class 12",
        problems: [
          {
            id: "PS01",
            title: "Frugal Innovation for Everyday Community Challenges",
            description: "Design and develop an affordable, easy-to-use prototype that addresses a day-to-day challenge faced by rural or underserved communities using locally available materials and simple technology."
          },
          {
            id: "PS02",
            title: "Technology for Local Artisans and Livelihoods",
            description: "Create a low-cost prototype that helps artisans, weavers, SHGs, FPOs or microenterprises improve productivity, product quality or market access."
          }
        ]
      },
      {
        name: "B.Tech. to Ph.D.",
        problems: [
          {
            id: "PS01",
            title: "Advanced Agarwood and Lemongrass Processing Technologies",
            description: "Develop scalable technologies for efficient extraction, quality standardization, traceability and value-added product development from agarwood/ lemongrass resources of Northeast India."
          },
          {
            id: "PS02",
            title: "Smart Poultry Ecosystems for Northeast India",
            description: "Design integrated IoT, AI and sensor-based solutions for poultry health monitoring, disease prediction, automated feeding, environmental control and supply-chain management."
          }
        ]
      }
    ]
  },
  {
    vertical: "Vertical 2: Technology Hub for Semiconductors and Artificial Intelligence",
    categories: [
      {
        name: "Class 8 to Class 12",
        problems: [
          {
            id: "PS01",
            title: "AI for Crop Health Monitoring",
            description: "Develop an AI enabled application or prototype capable of identifying crop diseases, pest attacks or nutrient deficiencies from images captured using mobile devices."
          },
          {
            id: "PS04",
            title: "Smart Waste Segregator",
            description: "Develop a computer vision system that identifies and classifies waste items (plastic, organic, paper, metal) from webcam images or uploaded photos."
          }
        ]
      },
      {
        name: "B.Tech. to Ph.D.",
        problems: [
          {
            id: "PS01",
            title: "Indigenous Edge AI Drone Platform for Precision Agriculture",
            description: "Develop an autonomous multi-rotor drone platform with onboard AI for crop health monitoring, precision spraying, terrain-following navigation and yield forecasting in Northeast India’s fragmented and hilly agricultural landscapes."
          },
          {
            id: "PS02",
            title: "AI-powered Multilingual Chatbot for Northeast Languages",
            description: "Develop speech-to-speech and text-based NPU-enabled AI systems supporting low-resource Northeast Indian languages and dialects for applications in healthcare, governance, education and rural development."
          }
        ]
      }
    ]
  },
  {
    vertical: "Vertical 3: Centre of Excellence for Innovation in Bamboo based technology, Entrepreneurial promotion & Skill development",
    categories: [
      {
        name: "Class 8 to Class 12",
        problems: [
          {
            id: "PS01",
            title: "Smart Bamboo Greenhouse",
            description: "Design a low-cost bamboo-framed greenhouse structure with basic smart features (moisture sensors, ventilation) to help small farmers grow crops year-round."
          },
          {
            id: "PS02",
            title: "Bamboo School Furniture Design",
            description: "Propose a lightweight, foldable, and affordable school commodity design (desk/chair/cycle) made from bamboo that can be easily assembled without tools."
          }
        ]
      },
      {
        name: "B.Tech. to Ph.D.",
        problems: [
          {
            id: "PS01",
            title: "Seismic-Resistant Bamboo Frame Structures",
            description: "Model and test a full-scale bamboo frame structural system with engineered joints (bolted, pinned, or composite) designed to meet seismic zone IV requirements, using FEM analysis (ANSYS/STAAD) validated by physical load testing."
          },
          {
            id: "PS02",
            title: "3D Printable Bamboo Composite Filament",
            description: "Develop a bamboo particle/PLA or bamboo particle/bioresin composite filament suitable for FDM 3D printing, optimizing particle size distribution, moisture content, and print parameters for structural applications in construction and furniture."
          }
        ]
      }
    ]
  },
  {
    vertical: "Vertical 4: Skill Development and Innovation Centre on Biodegradable, ecofriendly Plastics",
    categories: [
      {
        name: "Class 8 to Class 12",
        problems: [
          {
            id: "PS01",
            title: "Waste-to-Wealth Composting Models",
            description: "Build simple working models or kits demonstrating how kitchen/agricultural waste can be converted into compost or bio- packaging material, to be used as a school awareness tool."
          },
          {
            id: "PS02",
            title: "Flood Safe Pack",
            description: "Design a lightweight, waterproof, biodegradable, relief pouch from eco-friendly materials that can hold items such as ORS, medicines and biscuits which can stay intact for at least 7 days, then composts within 45-50 days."
          }
        ]
      },
      {
        name: "B.Tech. to Ph.D.",
        problems: [
          {
            id: "PS01",
            title: "Biodegradable Educational Learning Kits",
            description: "Design eco-friendly educational models, teaching aids or STEM kits using biodegradable materials that support experimental learning in schools."
          },
          {
            id: "PS02",
            title: "Phone-camera plastic sorter for NE India’s unorganized waste streams",
            description: "Build a mobile-app prototype (or physical model) that uses a camera + simple AI (or colour/ texture rules) to sort and label plastic waste types, enabling separate composting streams."
          }
        ]
      }
    ]
  }
];

export default function HackathonProblems() {
  return (
    <section id="hackathon" className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2>Hackathon: Problem Statements</h2>
          <p className="text-muted mt-2">Explore the challenges across four major technology verticals</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {HACKATHON_PROBLEMS.map((vert, idx) => (
            <div key={idx} className="card" style={{ borderTop: '4px solid var(--primary)', padding: '2rem' }}>
              <h3 style={{ color: 'var(--secondary)', marginBottom: '1.5rem', fontSize: '1.4rem' }}>{vert.vertical}</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {vert.categories.map((cat, catIdx) => (
                  <div key={catIdx}>
                    <h4 style={{ 
                      display: 'inline-block',
                      backgroundColor: 'var(--bg-main)',
                      padding: '0.4rem 1rem',
                      borderRadius: '8px',
                      color: 'var(--primary-dark)',
                      marginBottom: '1rem',
                      fontSize: '1.1rem'
                    }}>
                      {cat.name}
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {cat.problems.map((prob, pIdx) => (
                         <div key={pIdx} style={{ 
                           border: '1px solid var(--border)', 
                           borderRadius: '8px', 
                           padding: '1rem',
                           backgroundColor: 'white'
                         }}>
                           <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                             <span className="category-badge cat-workshop">{prob.id}</span>
                             <strong style={{ fontSize: '1rem', lineHeight: '1.3' }}>{prob.title}</strong>
                           </div>
                           <p className="text-muted mt-2" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                             {prob.description}
                           </p>
                         </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
