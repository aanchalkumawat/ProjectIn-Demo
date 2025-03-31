import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import background from "../assests/images/banner1.jpeg";
import Footer from "./Footer1";
import logo from "../assests/images/Banasthali_Vidyapeeth_Logo.png";
import img1 from "../images/img1.png";
import img2 from "../images/img2.png";
import img3 from "../images/img3.png";
import Roadmap from "./Roadmap"

const LandingPage = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [navbarSolid, setNavbarSolid] = useState(false);
  const [flipped, setFlipped] = useState([]);
  const [isAutoSlidePaused, setIsAutoSlidePaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const slides = [
    {
      title: "ProjectIn - Collaborative Platform",
      text: [
        "ProjectIn is an innovative collaboration platform designed specifically for academic projects. It provides real-time collaboration tools, version control, and seamless integration with popular development environments. Students can work together on code, documents, and presentations simultaneously from different locations.",
        "Tech Stack: MERN stack (MongoDB, Express.js, React, Node.js) with Socket.io for real-time features. Challenges included implementing conflict resolution for concurrent edits and ensuring data security while maintaining performance. The team overcame these by developing a custom operational transform algorithm and optimizing database queries."
      ],
      team: ["Astha Shukla (Team Lead)", "Aanchal Kumawat", "Kirtika Dwivedi", "Aishwarya Verma"],
      leaderContact: {
        linkedin: "https://linkedin.com/in/astha-shukla",
        email: "astha.shukla@banasthali.ac.in"
      },
      image:img1
    },
    {
      title: "Secure Online Voting System",
      text: [
        "A blockchain-based online voting system that ensures transparency and prevents tampering. The system allows students to vote for college elections remotely while maintaining complete anonymity and verifiability. Features include voter authentication, encrypted ballots, and immutable result recording.",
        "Tech Stack: Ethereum blockchain, Solidity smart contracts, React frontend, and Node.js backend. Major challenges were designing a user-friendly interface for non-technical voters and optimizing gas costs for blockchain operations. The team implemented a layered architecture with offline signature collection to reduce transaction costs."
      ],
      team: ["Rahul Sharma (Team Lead)", "Neha Verma", "Saurabh Mehta", "Ishita Pandey"],
      leaderContact: {
        linkedin: "https://linkedin.com/in/rahul-sharma",
        email: "rahul.sharma@banasthali.ac.in"
      },
      image:img2
    },
    {
      title: "Smart Laundry Management System",
      text: [
        "An IoT-enabled laundry management system for hostels that tracks machine availability, notifies students when laundry is done, and handles payments automatically. The system reduced laundry waiting times by 60% and eliminated payment disputes in pilot testing.",
        "Tech Stack: Raspberry Pi with RFID sensors for machine monitoring, Flutter mobile app, Firebase backend. Challenges included creating accurate sensors for different fabric types and integrating with existing college payment systems. The team developed custom machine learning models to predict wash cycles based on load weight and fabric type."
      ],
      team: ["Priya Jain (Team Lead)", "Rohit Agarwal", "Simran Kaur", "Manoj Tripathi"],
      leaderContact: {
        linkedin: "https://linkedin.com/in/priya-jain",
        email: "priya.jain@banasthali.ac.in"
      },
      image:img3
    }
  ];

  const faqs = [
    {
      question: "How do I submit my project?",
      answer: "Navigate to the project submission page from your dashboard and fill out the required details including project title, description, and supporting documents."
    },
    {
      question: "What are the evaluation criteria?",
      answer: "Projects are evaluated based on innovation (30%), implementation (30%), documentation (20%), and presentation (20%)."
    },
    {
      question: "Can I work in a team?",
      answer: "Yes, teams of up to 4 members are encouraged. All team members must be registered in the system."
    },
    {
      question: "What is the submission deadline?",
      answer: "The deadline for this year's submissions is December 15th. Late submissions will not be accepted."
    },
    {
      question: "How will I receive feedback?",
      answer: "You'll receive detailed feedback through the platform dashboard within 4 weeks after submission."
    },
    {
      question: "Are there any format requirements?",
      answer: "Yes, all documents must be in PDF format, and presentations should be in PowerPoint format (PPTX)."
    },
    {
      question: "Can I update my submission after submitting?",
      answer: "You may update your submission up until the deadline by resubmitting through the same process."
    }
  ];

  useEffect(() => {
    setFlipped(new Array(slides.length).fill(false));
  }, [slides.length]);

  // Auto-slide every 5s (pauses when cards are flipped)
  useEffect(() => {
    if (isAutoSlidePaused) return;
    
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoSlidePaused, slides.length]);

  useEffect(() => {
    const handleScroll = () => {
      const infoSection = document.querySelector(".info-section");
      const scrollPosition = window.scrollY;
      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
      
      if (infoSection) {
        const infoSectionTop = infoSection.offsetTop - navbarHeight;
        setNavbarSolid(scrollPosition >= infoSectionTop);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelection = (role) => navigate({ 
    teacher: "/login-teacher", 
    student: "/login", 
    coordinator: "/login" 
  }[role]);

  const toggleFlip = (i) => {
    const newFlippedState = !flipped[i];
    setFlipped(prev => prev.map((f, idx) => (idx === i ? newFlippedState : f)));
    setIsAutoSlidePaused(newFlippedState);
  };

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="landing-page" style={{ backgroundImage: `url(${background})` }}>
      {/* Top Banner */}
      <header className="top-banner">
        <img src={logo} alt="Banasthali Logo" className="banner-logo" />
        <span className="banner-text">BANASTHALI VIDYAPITH</span>
      </header>

      {/* Navbar */}
      <nav className={`navbar ${navbarSolid ? "solid" : ""}`}>
        <ul className="nav-links">
          {["Home", "About the Process", "Highlights", "FAQ"].map((item, i) => (
            <li key={i}><a href={`#${item.toLowerCase().replace(/ /g, "-")}`}>{item}</a></li>
          ))}
        </ul>
      </nav>

      {/* Role Selection Section */}
      <section className="landing-container">
        <h1>Welcome to Project Inn</h1>
        <p>Select your role to proceed:</p>
        <div className="role-buttons">
          {["Coordinator", "Teacher", "Student"].map((role) => (
            <button key={role} onClick={() => handleSelection(role.toLowerCase())}>{role}</button>
          ))}
        </div>
      </section>
       
      {/* Slideshow Section */}
      <section id="highlights" className="info-section">
        <h2 className="section-heading">Top 3 Projects Of The Year</h2>
        <div className="slideshow">
          <div className="slides-container">
            <div className="slides" style={{ 
              transform: `translateX(-${index * 100}%)`,
              transition: 'transform 0.8s ease-in-out'
            }}>
              {slides.map((slide, i) => (
                <div className={`slide ${flipped[i] ? 'flipped-slide' : ''}`} key={i}>
                  {/* Flip Card */}
                  <div className="flip-card" onClick={() => toggleFlip(i)}>
                    <div className={`flip-card-inner ${flipped[i] ? "flipped" : ""}`}>
                      {/* Front Side */}
                      <div className="flip-card-front">
                        <img src={slide.image} alt={slide.title} />
                      </div>
                      {/* Back Side */}
                      <div className="flip-card-back">
                        <h3>Team Members</h3>
                        {slide.team.map((member, idx) => <p key={idx}>{member}</p>)}
                        <div className="leader-contact">
                          <h4>Reach Out to the Leader</h4>
                          <a href={slide.leaderContact.linkedin} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                          </a>
                          <a href={`mailto:${slide.leaderContact.email}`}>
                            Email
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slide Content */}
                  <div className="slide-content">
                    <h2>{slide.title}</h2>
                    {slide.text.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div id="about-the-process">
        <Roadmap></Roadmap>
      </div>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <h2 className="section-heading">Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span className="faq-toggle">{activeIndex === index ? '−' : '+'}</span>
              </div>
              {activeIndex === index && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;