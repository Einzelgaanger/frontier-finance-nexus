
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Users, BarChart3, Search, Database, FileText, TrendingUp, Globe, Building2, Mail, Phone, MapPin, ExternalLink, Github, Twitter, Linkedin, Facebook, Instagram, Target, Rocket, Lightbulb, Network, NetworkIcon, Award, DollarSign, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [fundCount, setFundCount] = useState(0);
  const [capitalCount, setCapitalCount] = useState(0);
  const [sgbCount, setSgbCount] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset counters and animate every time section is visible
            setFundCount(0);
            setCapitalCount(0);
            setSgbCount(0);
            
            // Animate fund count
            const fundTarget = 100;
            const fundDuration = 2000;
            const fundStep = fundTarget / (fundDuration / 16);
            let fundCurrent = 0;
            const fundInterval = setInterval(() => {
              fundCurrent += fundStep;
              if (fundCurrent >= fundTarget) {
                setFundCount(fundTarget);
                clearInterval(fundInterval);
              } else {
                setFundCount(Math.floor(fundCurrent));
              }
            }, 16);

            // Animate capital count
            const capitalTarget = 2.25;
            const capitalDuration = 2000;
            const capitalStep = capitalTarget / (capitalDuration / 16);
            let capitalCurrent = 0;
            const capitalInterval = setInterval(() => {
              capitalCurrent += capitalStep;
              if (capitalCurrent >= capitalTarget) {
                setCapitalCount(capitalTarget);
                clearInterval(capitalInterval);
              } else {
                setCapitalCount(Math.round(capitalCurrent * 100) / 100);
              }
            }, 16);

            // Animate SGB count
            const sgbTarget = 1200;
            const sgbDuration = 2000;
            const sgbStep = sgbTarget / (sgbDuration / 16);
            let sgbCurrent = 0;
            const sgbInterval = setInterval(() => {
              sgbCurrent += sgbStep;
              if (sgbCurrent >= sgbTarget) {
                setSgbCount(sgbTarget);
                clearInterval(sgbInterval);
              } else {
                setSgbCount(Math.floor(sgbCurrent));
              }
            }, 16);
          }
        });
      },
      { threshold: 0.3 }
    );

    const currentRef = statsRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white scrollbar-hide overflow-x-hidden">
      {/* Hero Section with Background Image - Full Screen */}
      <section className="relative min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/CFF.jpg)' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Top Left Logo - Responsive */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <img 
            src="/CFF LOGO.png" 
            alt="CFF Logo" 
            className="h-12 sm:h-16 md:h-20 w-auto object-contain"
          />
        </div>
        
        {/* Hero Content - Centered in the full screen */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Building a Better Financial Ecosystem
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 mb-3 sm:mb-4 max-w-4xl mx-auto font-medium px-2">
              for Small and Growing Businesses in Frontier Markets
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-8 sm:mb-10 max-w-3xl mx-auto px-2">
              The Collaborative for Frontier Finance is a multi-stakeholder initiative that aims to increase access to capital for small and growing businesses in emerging markets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 rounded-full"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-sm sm:text-base">Join the Network</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Button>
              </Link>
              <Link to="/network" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="group w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 rounded-full"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm sm:text-base">Browse Directory</span>
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

         {/* Mission & Vision Section - Animated with Image */}
         <section ref={sectionRef} className="relative py-8 sm:py-12 md:py-16 overflow-hidden rounded-t-[1.5rem] sm:rounded-t-[2rem] md:rounded-t-[2.5rem] bg-amber-50 -mt-8 sm:-mt-10 md:-mt-12">
        {/* Extra padding at the top to compensate for the negative margin */}
        <div className="absolute top-0 left-0 right-0 h-10 sm:h-14 md:h-18 bg-amber-50 rounded-t-[1.5rem] sm:rounded-t-[2rem] md:rounded-t-[2.5rem]"></div>

        {/* Floating Orbs Animation - Hidden on mobile */}
        <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="hidden md:block absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="hidden md:block absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-0 sm:mt-2 md:mt-4">
            {/* Top Section: Title and Image Side by Side */}
            <div className={`grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-6 sm:gap-8 mb-8 sm:mb-12 transition-all duration-[1500ms] ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Title and Content on the Left */}
              <div className="order-1 lg:order-1 flex flex-col justify-center">
                <div className="inline-block mb-2 sm:mb-3">
                 <span className="px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-xs sm:text-sm font-semibold">
                   Our Purpose
                 </span>
               </div>
               <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">
                 Why Frontier Finance?
               </h2>
               <div className="w-16 sm:w-20 md:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2 sm:mb-3 md:mb-4"></div>
               <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
                 Small and growing businesses (SGBs) are the backbone of frontier economies, yet face significant funding gaps that limit their growth potential.
               </p>
               
               {/* Our Mission Section */}
               <div className="mt-4 sm:mt-6 md:mt-8">
                 <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                   Our Mission
                 </h3>
                 <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                   To achieve a sustainable and growing small business finance ecosystem in Africa and beyond by addressing the <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">"missing middle"</span> financing gap. We support and enable local capital providers to accelerate financing solutions.
                 </p>
               </div>
             </div>
             
             {/* Large Image on the Right */}
             <div className="order-2 lg:order-2">
               <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-0 shadow-2xl border border-white/20 overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                 <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
                   <img 
                     src="/home.png" 
                     alt="CFF Network Gathering" 
                     className="w-full h-full object-cover"
                   />
                 </div>
               </div>
             </div>
           </div>
           
           {/* Bottom Section: Mission, Image, and Challenge Cards */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 -mt-6 sm:-mt-8 md:-mt-12">
                            {/* Left Column: Mission Card and Image */}
              <div className="space-y-4 sm:space-y-6">
                {/* Second Image */}
                <div className={`transition-all duration-[1500ms] delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-0 shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="relative h-[200px] sm:h-[250px] md:h-[280px]">
                      <img 
                        src="/eeee.png" 
                        alt="CFF Convening Event" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column: Challenge Content */}
              <div className={`mt-8 sm:mt-12 transition-all duration-[1500ms] delay-400 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  The Challenge
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                  Small and growing businesses create roughly <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">80%</span> of formal employment in frontier markets, yet face an estimated <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">$940 billion</span> financing gap.
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  These "missing middle" businesses are too big for microfinance, too small for private equity, and too risky for banks.
                </p>
              </div>
            </div>
         </div>

        {/* Custom Animations CSS */}
        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in-left {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fade-in-right {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slide-in-up {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes expand {
            from {
              width: 0;
            }
            to {
              width: 8rem;
            }
          }

          .animate-blob {
            animation: blob 7s infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out;
          }

          .animate-fade-in-left {
            animation: fade-in-left 0.8s ease-out 0.2s both;
          }

          .animate-fade-in-right {
            animation: fade-in-right 0.8s ease-out 0.4s both;
          }

          .animate-slide-in-up {
            animation: slide-in-up 1s ease-out 0.3s both;
          }

          .animate-expand {
            animation: expand 1s ease-out 0.6s both;
          }
        `}</style>
      </section>

      {/* Statistics Section */}
      <section ref={statsRef} className="py-16 relative overflow-hidden rounded-t-[3rem] -mt-4">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-t-[3rem]" style={{ backgroundImage: 'url(/image.png)' }}>
          <div className="absolute inset-0 bg-slate-900/40 rounded-t-[3rem]"></div>
        </div>
        
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 opacity-10 rounded-t-[3rem]">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.03)_50%,transparent_75%,transparent_100%)] bg-[length:40px_40px] rounded-t-[3rem]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Our Impact in Numbers</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fund Manager Members */}
            <div className="group relative text-center">
              <div className="flex justify-center mb-3">
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Network className="w-8 h-8 text-blue-300 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-100 mb-1">
                {fundCount}+
              </div>
              <div className="text-base text-white font-semibold mb-1">Fund Manager Members</div>
              <div className="text-sm text-blue-200">Across 30+ countries</div>
            </div>
            
            {/* Capital Target */}
            <div className="group relative text-center">
              <div className="flex justify-center mb-3">
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-8 h-8 text-emerald-300 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-100 mb-1">
                ${capitalCount}B
              </div>
              <div className="text-base text-white font-semibold mb-1">Capital Target</div>
              <div className="text-sm text-emerald-200">Collectively raising</div>
            </div>
            
            {/* SGBs Invested */}
            <div className="group relative text-center">
              <div className="flex justify-center mb-3">
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8 text-purple-300 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-100 mb-1">
                {sgbCount.toLocaleString()}+
              </div>
              <div className="text-base text-white font-semibold mb-1">SGBs Invested</div>
              <div className="text-sm text-purple-200">Portfolio companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-amber-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 -mt-12">
            <div className="inline-block mb-3">
              <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">
                Our Approach
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              How Does the Collaborative Work?
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4"></div>
            <p className="text-base text-gray-700 leading-relaxed mb-6">
              We work with diverse stakeholders to set common action agendas, test and scale financing models, and facilitate capital flow to the SGB market
            </p>
          </div>
          
          {/* Image and Points Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr,1fr] gap-8 items-start">
            {/* Left: Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500 h-[500px]">
              <img 
                src="/12.png" 
                alt="CFF Collaborative Work" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Right: Points in Column */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-800">Networks</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Connect stakeholders facing similar challenges to a peer network of actors operating with shared principles, values, and ambitions to learn from and support one another.
                </p>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-700 to-purple-800 rounded-lg flex items-center justify-center shadow-lg">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-800">Actionable Research</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Facilitate research on hot topics to improve transparency, provide practical guidance, and dispel common misconceptions within the small business finance sector.
                </p>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-700 to-orange-800 rounded-lg flex items-center justify-center shadow-lg">
                    <Rocket className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-orange-800">Initiatives</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Identify concrete initiatives to provide tangible support to early-stage investors. We leverage CFF network resources to amplify the voices of local capital providers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-24 relative overflow-hidden rounded-t-[3rem] -mt-4 bg-black">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section: Content on Left, Video on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-8 mb-12">
            {/* Left: Header Content */}
            <div className="flex flex-col">
              <div className="text-left mb-6">
                <div className="inline-block mb-3">
                  <span className="px-6 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full text-green-400 text-sm font-semibold border border-green-500/30">
                    Sustainable Development
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-green-300 to-emerald-300 bg-clip-text text-transparent mb-4">
                  The Impact of SGB Financing
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 mb-3"></div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Increasing appropriate capital for SGBs directly contributes to achieving the Sustainable Development Goals
                </p>
              </div>
              
              {/* Impact Items in Single Column */}
              <div className="space-y-4">
                <div className="group">
                  <div className="flex items-start space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-green-400 mt-1">Job Creation</h3>
                  </div>
                  <p className="text-sm text-gray-300 ml-11 leading-relaxed">Create quality, long-term employment opportunities that increase incomes</p>
                </div>
                
                <div className="group">
                  <div className="flex items-start space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-400 mt-1">Goods & Services</h3>
                  </div>
                  <p className="text-sm text-gray-300 ml-11 leading-relaxed">Provide access to essential goods and services like health, education, and transportation</p>
                </div>
                
                <div className="group">
                  <div className="flex items-start space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <NetworkIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-purple-400 mt-1">Value Chain</h3>
                  </div>
                  <p className="text-sm text-gray-300 ml-11 leading-relaxed">Integrate small businesses into supply chains, creating broader economic opportunities</p>
                </div>
                
                <div className="group">
                  <div className="flex items-start space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-orange-400 mt-1">Innovation</h3>
                  </div>
                  <p className="text-sm text-gray-300 ml-11 leading-relaxed">Catalyze new approaches to serve customers with innovative business models</p>
                </div>
              </div>
            </div>
            
            {/* Right: Video with Mute Button - Bigger */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video relative h-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/vQmrvp8R2fc?autoplay=1&loop=1&playlist=vQmrvp8R2fc&controls=1&mute=0&modestbranding=1&rel=0&showinfo=0"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                {/* Custom Mute Button */}
                <button 
                  onClick={() => {
                    const iframe = document.querySelector('iframe[title="YouTube video player"]') as HTMLIFrameElement;
                    if (iframe) {
                      // Toggle muted state by changing the src
                      const currentSrc = iframe.src;
                      if (currentSrc.includes('mute=0')) {
                        iframe.src = currentSrc.replace('mute=0', 'mute=1');
                      } else {
                        iframe.src = currentSrc.replace('mute=1', 'mute=0');
                      }
                    }
                  }}
                  aria-label="Toggle mute"
                  title="Toggle mute"
                  className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all group"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.482 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.482l3.901-3.793a1 1 0 011.617-.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features + CTA Combined */}
      <section className="py-24 relative bg-gradient-to-br from-amber-50 via-white to-blue-50 overflow-hidden rounded-t-[2.5rem] -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Platform Features */}
            <div>
              <div className="text-left mb-8">
                <div className="inline-block mb-4">
                  <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">
                    Our Platform
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                  Platform Features
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-3"></div>
                <p className="text-gray-700">Everything fund managers need to operate, connect, and grow</p>
              </div>
              
                            <div className="space-y-2">
                <div className="text-base font-semibold text-gray-800 hover:text-blue-600 transition-colors">Fund Manager Directory</div>
                <div className="text-base font-semibold text-gray-800 hover:text-green-600 transition-colors">Annual Surveys</div>
                <div className="text-base font-semibold text-gray-800 hover:text-purple-600 transition-colors">Market Insights</div>
                <div className="text-base font-semibold text-gray-800 hover:text-orange-600 transition-colors">Global Network</div>
                <div className="text-base font-semibold text-gray-800 hover:text-indigo-600 transition-colors">Learning Lab</div>
                <div className="text-base font-semibold text-gray-800 hover:text-red-600 transition-colors">Secure Platform</div>
              </div>
            </div>
            
            {/* Right Column: CTA */}
            <div className="flex flex-col justify-center">
              <div className="text-center lg:text-left mb-8">
                <div className="inline-block mb-4">
                  <span className="px-6 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-700 text-sm font-semibold">
                    Join Us
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent mb-4">
                  Ready to Join Our Network?
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-3"></div>
                <p className="text-gray-700 mb-8">
                  Connect with 100+ early-stage capital providers and access tools, resources, and insights to grow your fund.
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 rounded-full"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Users className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Button>
                </Link>
                <Link to="/network">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="group w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 rounded-full"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>Explore Directory</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-black via-blue-950 to-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 lg:col-span-2">
              <div className="flex justify-start mb-4">
                <img src="/CFF LOGO.png" alt="CFF Logo" className="h-16 w-auto object-contain" />
              </div>
              <p className="text-gray-300 mb-6 text-base leading-relaxed max-w-md">
                A multi-stakeholder initiative increasing access to capital for small and growing businesses in emerging markets through networks, research, and initiatives.
              </p>
              <div className="space-y-3">
                <a 
                  href="mailto:info@frontierfinance.org" 
                  className="flex items-center space-x-3 text-blue-300 hover:text-blue-200 transition-colors group"
                >
                  <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">info@frontierfinance.org</span>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-base flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/auth" className="text-blue-300 hover:text-blue-200 transition-colors flex items-center group">
                    <ExternalLink className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" />
                    Login / Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/network" className="text-blue-300 hover:text-blue-200 transition-colors flex items-center group">
                    <Globe className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" />
                    Fund Manager Directory
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Social Media */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-base flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Connect With Us
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Follow us for updates on small business finance and network news
              </p>
                <div className="flex space-x-3">
                <a href="https://twitter.com/CollabFFinance" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="https://www.linkedin.com/company/collaborative-for-frontier-finance/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-blue-300 text-sm mb-2 md:mb-0">
                © 2025 Collaborative for Frontier Finance. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">Privacy Policy</a>
                <span className="text-blue-600">•</span>
                <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
