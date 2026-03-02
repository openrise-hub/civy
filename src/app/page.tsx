"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Manrope } from 'next/font/google';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Globe, 
  LayoutTemplate, 
  Link as LinkIcon, 
  History, 
  Trash2, 
  Play, 
  Star,
  Menu,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  LayoutGrid,
  Linkedin
} from 'lucide-react';

const manrope = Manrope({ subsets: ['latin'] });

export default function Home() {
  const [isYearly, setIsYearly] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-[#282930] selection:bg-[#E3FFCC] selection:text-[#142F32] ${manrope.className}`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#F8F9FA]/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#142F32] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#E3FFCC]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#142F32]">Civy</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#777C90]">
            <a href="#features" className="hover:text-[#142F32] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#142F32] transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-[#142F32] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#142F32] transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-semibold text-[#142F32] hover:text-[#777C90] transition-colors">
              Log in
            </Link>
            <Link href="/dashboard" className="bg-[#142F32] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1a3d42] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center">
              Sign Up
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-[#142F32]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-medium">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
            <div className="h-px w-full bg-gray-100 my-4" />
            <Link href="/dashboard" className="w-full text-center py-3 rounded-xl border-2 border-[#142F32] text-[#142F32] font-bold block whitespace-nowrap">
              Log in
            </Link>
            <Link href="/dashboard" className="w-full text-center py-3 rounded-xl bg-[#142F32] text-white font-bold block whitespace-nowrap">
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#E3FFCC]/20 rounded-full"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-yellow-200/20 rounded-full"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold">Join 10,000+ job seekers globally</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#142F32] tracking-tight mb-6 leading-tight">
            Build a Professional <br className="hidden md:block" />
            Resume in Minutes.
          </h1>
          
          <p className="text-lg md:text-xl text-[#777C90] max-w-2xl mx-auto mb-10 leading-relaxed">
            The modern, multilingual resume builder designed to help you land your dream job. Real-time preview, expert templates, and seamless PDF export.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-[#142F32] text-white rounded-full font-bold hover:bg-[#1a3d42] transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2 group">
              Get Started for Free
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white text-[#142F32] border-2 border-gray-200 rounded-full font-bold hover:border-[#142F32] transition-all flex items-center justify-center gap-2">
              View Templates
            </a>
          </div>

          {/* Editor Mockup */}
          <div className="relative mx-auto max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 sm:p-4 flex flex-col md:flex-row gap-4 h-[500px] overflow-hidden">
            {/* Form Editor */}
            <div className="flex-1 bg-gray-50 rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-white border border-gray-200 rounded-lg flex items-center px-4">
                  <span className="text-sm text-gray-800 font-medium typing-animation border-r-2 border-[#142F32] pr-1">Senior Product Designer</span>
                </div>
                <div className="h-4 w-32 bg-gray-200 rounded mt-4"></div>
                <div className="h-24 w-full bg-white border border-gray-200 rounded-lg p-4">
                  <div className="h-2 w-3/4 bg-gray-100 rounded mb-2"></div>
                  <div className="h-2 w-full bg-gray-100 rounded mb-2"></div>
                  <div className="h-2 w-5/6 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="flex-1 bg-[#142F32] rounded-2xl p-6 text-white relative overflow-hidden shadow-inner">
              <div className="absolute top-4 right-4 bg-[#E3FFCC] text-[#142F32] text-xs font-bold px-2 py-1 rounded-md">Live Preview</div>
              <div className="w-full h-full bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Alex Morgan</h3>
                  <p className="text-[#E3FFCC] font-medium text-sm">Senior Product Designer</p>
                </div>
                <div className="h-px w-full bg-white/20 my-2"></div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-white/20 rounded"></div>
                  <div className="h-2 w-5/6 bg-white/20 rounded"></div>
                  <div className="h-2 w-4/6 bg-white/20 rounded"></div>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-white/50 font-bold tracking-wider uppercase mb-2">Experience</div>
                  <div className="h-3 w-1/2 bg-white/30 rounded mb-2"></div>
                  <div className="h-2 w-full bg-white/10 rounded mb-1"></div>
                  <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-6 relative z-20 -mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E3FFCC] flex items-center justify-center text-[#142F32]">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[#142F32]">10,000+</h4>
              <p className="text-sm font-medium text-[#777C90]">Resumes Created</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#142F32] flex items-center justify-center text-white">
              <Globe size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[#142F32]">2+ Languages</h4>
              <p className="text-sm font-medium text-[#777C90]">English & Spanish Native</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[#142F32]">ATS-Friendly</h4>
              <p className="text-sm font-medium text-[#777C90]">Optimized Exports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="bg-[#142F32] pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Why Civy?</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Everything you need to craft a standout resume. Simplify your job hunt with our efficient, quality-focused tools.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <Play className="w-8 h-8 text-[#E3FFCC]" />
              <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[#E3FFCC] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-Time Preview</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              No more &quot;Download to See.&quot; Changes reflect instantly in a pixel-perfect PDF preview as you type.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <LayoutTemplate className="w-8 h-8 text-[#E3FFCC]" />
              <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[#E3FFCC] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Block-Based Editing</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Use intuitive drag-and-drop blocks to build your story. Experience, Education, Skills, and Custom sections - reorder them in seconds.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <Globe className="w-8 h-8 text-[#E3FFCC]" />
              <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[#E3FFCC] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Go Global</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Switch between English and Spanish with one click. Civy handles the structural translations seamlessly.
            </p>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <LinkIcon className="w-8 h-8 text-[#E3FFCC]" />
              <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[#E3FFCC] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Shareable Links</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Generate a public link to your resume in one click. Share it with recruiters or on LinkedIn with a professional web view.
            </p>
          </div>

          {/* Feature Card 5 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <History className="w-8 h-8 text-yellow-500" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-yellow-500 tracking-wider bg-yellow-500/10 px-2 py-1 rounded">Pro</span>
                <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[#E3FFCC] transition-colors" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Version History</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Never lose a great bullet point again. Browse past edits and restore any version with a single click.
            </p>
          </div>

          {/* Feature Card 6 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <Trash2 className="w-8 h-8 text-[#E3FFCC]" />
              <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[#E3FFCC] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Trash & Recovery</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Accidentally deleted a resume? No problem. Use the 3-day recovery window to bring it back effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3FFCC]/30 text-[#142F32] text-sm font-bold mb-6">
              <Zap size={16} /> Fast & Easy
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#142F32] mb-6 leading-tight">
              From Blank Page to Interview Ready
            </h2>
            <p className="text-[#777C90] text-lg mb-10">
              We&apos;ve streamlined the entire process. Forget formatting headaches and focus on showcasing your true potential.
            </p>

            <div className="space-y-8">
              <div 
                className={`flex gap-4 cursor-pointer transition-opacity duration-300 ${activeStep === 1 ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                onClick={() => setActiveStep(1)}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg transition-colors ${activeStep === 1 ? 'bg-[#142F32] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <div>
                  <h3 className="text-xl font-bold text-[#142F32] mb-2">Pick a Style</h3>
                  <p className="text-[#777C90]">Choose from our selection of minimal or bold templates. Optimized to beat the ATS.</p>
                </div>
              </div>
              <div 
                className={`flex gap-4 cursor-pointer transition-opacity duration-300 ${activeStep === 2 ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                onClick={() => setActiveStep(2)}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg transition-colors ${activeStep === 2 ? 'bg-[#142F32] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <div>
                  <h3 className="text-xl font-bold text-[#142F32] mb-2">Fill the Blocks</h3>
                  <p className="text-[#777C90]">Add your details using our structured forms. Reorder sections with simple drag-and-drop mechanics.</p>
                </div>
              </div>
              <div 
                className={`flex gap-4 cursor-pointer transition-opacity duration-300 ${activeStep === 3 ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                onClick={() => setActiveStep(3)}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg transition-colors ${activeStep === 3 ? 'bg-[#E3FFCC] text-[#142F32]' : 'bg-gray-200 text-gray-500'}`}>3</div>
                <div>
                  <h3 className="text-xl font-bold text-[#142F32] mb-2">Download & Apply</h3>
                  <p className="text-[#777C90]">Export a high-resolution PDF or share your unique web link, and start your next chapter.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full bg-[#F8F9FA] rounded-[40px] p-8 border border-gray-100 shadow-2xl relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#E3FFCC]/20 to-transparent rounded-[40px]"></div>
             <div className="relative z-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-[420px] flex flex-col">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="font-bold text-[#142F32]">
                    {activeStep === 1 && "Template Selection"}
                    {activeStep === 2 && "Fill the Blocks"}
                    {activeStep === 3 && "Ready to Export"}
                  </div>
                  <div className="text-xs font-bold text-gray-400">Step {activeStep} of 3</div>
                </div>

                <div className="flex-1 overflow-hidden">
                  {/* Step 1 Content */}
                  {activeStep === 1 && (
                    <div className="grid grid-cols-2 gap-4 h-full animate-in fade-in slide-in-from-right-4 duration-500">
                      {/* Template 1: Minimal */}
                      <div className="bg-white border-2 border-[#142F32] rounded-xl h-52 p-4 relative cursor-pointer shadow-md group overflow-hidden flex flex-col">
                        <div className="absolute top-2 right-2 bg-[#142F32] text-white rounded-full p-1 z-10">
                          <CheckCircle2 size={14} />
                        </div>
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 shadow-sm"></div>
                           <div>
                               <div className="w-16 h-2 bg-[#142F32] rounded mb-1.5"></div>
                               <div className="w-10 h-1.5 bg-[#777C90] rounded"></div>
                           </div>
                        </div>
                        {/* Body */}
                        <div className="space-y-4 flex-1">
                            <div>
                               <div className="w-12 h-1.5 bg-[#142F32]/50 rounded mb-2"></div>
                               <div className="w-full h-1 bg-gray-100 rounded mb-1.5"></div>
                               <div className="w-5/6 h-1 bg-gray-100 rounded"></div>
                            </div>
                            <div>
                               <div className="w-12 h-1.5 bg-[#142F32]/50 rounded mb-2"></div>
                               <div className="w-full h-1 bg-gray-100 rounded mb-1.5"></div>
                               <div className="w-4/5 h-1 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-[#142F32]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>

                      {/* Template 2: Modern Accent */}
                      <div className="bg-white border border-gray-200 rounded-xl h-52 relative cursor-pointer shadow-sm hover:shadow-md transition-shadow group overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="bg-[#142F32] p-4 h-14 flex items-end shadow-sm">
                            <div className="w-16 h-2 bg-white rounded mb-1"></div>
                        </div>
                        {/* Content */}
                        <div className="p-3 flex gap-3 flex-1">
                           <div className="w-1/3 space-y-2 border-r border-gray-100 pr-2">
                               <div className="w-full h-1 bg-gray-200 rounded"></div>
                               <div className="w-4/5 h-1 bg-gray-200 rounded"></div>
                               <div className="w-full h-1 bg-gray-200 rounded"></div>
                           </div>
                           <div className="w-2/3 space-y-3">
                               <div>
                                   <div className="w-12 h-1 bg-[#777C90] rounded mb-1.5"></div>
                                   <div className="w-full h-1 bg-gray-100 rounded mb-1.5"></div>
                                   <div className="w-5/6 h-1 bg-gray-100 rounded mb-1.5"></div>
                                   <div className="w-full h-1 bg-gray-100 rounded"></div>
                               </div>
                               <div>
                                   <div className="w-12 h-1 bg-[#777C90] rounded mb-1.5"></div>
                                   <div className="w-full h-1 bg-gray-100 rounded mb-1.5"></div>
                                   <div className="w-full h-1 bg-gray-100 rounded"></div>
                               </div>
                           </div>
                        </div>
                        <div className="absolute inset-0 bg-[#282930]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white text-[#142F32] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all">Select</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2 Content */}
                  {activeStep === 2 && (
                    <div className="h-full flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="flex gap-3">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">First Name</div>
                          <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
                        </div>
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Last Name</div>
                          <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Job Title</div>
                        <div className="w-1/3 h-3 bg-gray-300 rounded"></div>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Professional Summary</div>
                        <div className="space-y-2">
                          <div className="w-full h-2 bg-gray-200 rounded"></div>
                          <div className="w-full h-2 bg-gray-200 rounded"></div>
                          <div className="w-4/5 h-2 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 Content */}
                  {activeStep === 3 && (
                    <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="w-20 h-20 bg-[#E3FFCC] rounded-full flex items-center justify-center text-[#142F32] mb-6 shadow-sm border border-[#c5f0a4]">
                        <CheckCircle2 size={40} className="animate-bounce" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#142F32] mb-2">Resume Ready!</h3>
                      <p className="text-gray-500 text-sm max-w-[250px] mx-auto mb-6">
                        Your professional resume has been successfully generated.
                      </p>
                      <div className="flex gap-3">
                        <div className="px-4 py-2 bg-gray-100 text-[#142F32] text-sm font-bold rounded-lg border border-gray-200 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
                          <LinkIcon size={16} /> Copy Link
                        </div>
                        <Link href="/dashboard" className="px-4 py-2 bg-[#142F32] text-white text-sm font-bold rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#1a3d42] transition-colors">
                          Download PDF
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setActiveStep(prev => prev === 3 ? 1 : prev + 1)}
                  className="w-full mt-6 py-3 bg-[#142F32] text-white font-bold rounded-xl flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  {activeStep === 3 ? "Start Over" : "Continue"} 
                  {activeStep !== 3 && <ArrowUpRight size={18} />}
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-[#282930] py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#142F32]/20 transform skew-x-12 translate-x-32"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Tailored Plans for Your Career</h2>
            <p className="text-[#777C90] text-lg max-w-xl mx-auto mb-10">
              Flexible pricing whether you are casually browsing or actively hunting.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center bg-white/10 p-1 rounded-full border border-white/5">
              <button 
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${!isYearly ? 'bg-[#142F32] text-white shadow-md' : 'text-white/60 hover:text-white'}`}
                onClick={() => setIsYearly(false)}
              >
                Monthly
              </button>
              <button 
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${isYearly ? 'bg-[#142F32] text-white shadow-md' : 'text-white/60 hover:text-white'}`}
                onClick={() => setIsYearly(true)}
              >
                Yearly <span className="bg-[#E3FFCC] text-[#142F32] text-[10px] px-2 py-0.5 rounded-full ml-1">Save 35%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Free Tier */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-10 flex flex-col h-full shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <p className="text-white/50 text-sm mb-6 h-10">The basic features you need to get your foot in the door.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">$0</span>
                <span className="text-white/50">/forever</span>
              </div>
              
              <Link href="/dashboard" className="w-full py-4 flex justify-center rounded-xl border-2 border-white/20 text-white font-bold hover:bg-white/10 transition-colors mb-10">
                Get Started
              </Link>
              
              <div className="space-y-4 flex-1">
                <p className="text-xs uppercase tracking-wider font-bold text-white/40 mb-4 border-b border-white/10 pb-2">Features</p>
                {[
                  '1 Active Resume',
                  'Basic Templates',
                  'Standard PDF Export',
                  'English & Spanish Support'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white/40" />
                    <span className="text-white/80 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tier */}
            <div className="bg-[#142F32] border border-[#E3FFCC]/30 rounded-[32px] p-10 flex flex-col relative h-full shadow-2xl">
              <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-yellow-500 text-[#142F32] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                <Sparkles size={14} /> Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise / Pro</h3>
              <p className="text-white/70 text-sm mb-6 h-10">Full access to all premium features and analytics to stand out.</p>
              
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-[#E3FFCC]">
                  ${isYearly ? '29.99' : '3.99'}
                </span>
                <span className="text-white/50">{isYearly ? '/year' : '/month'}</span>
              </div>
              
              <Link href="/dashboard" className="w-full flex justify-center py-4 rounded-xl bg-[#E3FFCC] text-[#142F32] font-bold hover:bg-[#c5f0a4] transition-colors mb-10 shadow-lg">
                Upgrade to Pro
              </Link>
              
              <div className="space-y-4 flex-1">
                <p className="text-xs uppercase tracking-wider font-bold text-[#E3FFCC]/60 mb-4 border-b border-white/10 pb-2">Premium Features</p>
                {[
                  'Unlimited Resumes',
                  'All Premium Templates',
                  'Resume Version History',
                  'Personal Analytics (views/downloads)',
                  'Priority Support',
                  'Early access to new features'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#E3FFCC]" />
                    <span className="text-white text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#142F32] mb-4">Frequently Asked Questions</h2>
            <p className="text-[#777C90] text-lg">Got questions? We&apos;ve got answers.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
              <h3 className="text-xl font-bold text-[#142F32] mb-2 flex items-center justify-between">
                Is Civy really free?
              </h3>
              <p className="text-[#777C90] leading-relaxed">
                Yes, you can create and download one professional resume for free, forever. You&apos;ll have access to our basic templates and standard PDF exports.
              </p>
            </div>

            <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
              <h3 className="text-xl font-bold text-[#142F32] mb-2 flex items-center justify-between">
                Are the resumes ATS-friendly?
              </h3>
              <p className="text-[#777C90] leading-relaxed">
                Absolutely. Our templates are tested against major Applicant Tracking Systems to ensure your data is parsed correctly. Clean underlying code means your text gets read accurately.
              </p>
            </div>

            <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
              <h3 className="text-xl font-bold text-[#142F32] mb-2 flex items-center justify-between">
                Can I cancel my Pro subscription?
              </h3>
              <p className="text-[#777C90] leading-relaxed">
                Yes, you can manage and cancel your subscription anytime through your account settings. If you cancel, you will retain Pro features until the end of your billing cycle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action & Footer */}
      <footer className="bg-[#0b1b1c] pt-24 pb-8 px-6 text-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#142F32] via-[#E3FFCC] to-[#142F32]"></div>
        
        <div className="max-w-4xl mx-auto text-center mb-20 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to land that interview?</h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have leveled up their career with Civy.
          </p>
          <Link href="/dashboard" className="px-10 py-5 bg-[#E3FFCC] flex justify-center text-[#142F32] rounded-full font-extrabold text-lg hover:bg-[#c5f0a4] transition-colors shadow-lg max-w-max mx-auto">
            Create Your Resume Now
          </Link>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#E3FFCC]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Civy</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Our solution makes resume creation faster and seamless. Contact us for more information.
            </p>
            <div className="text-white/80 text-sm font-medium">
              hello@civy.live
            </div>
          </div>

          <div className="flex gap-16 flex-wrap">
            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Customers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Newsroom</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center md:text-left text-xs text-white/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Civy. All rights reserved.</p>
          <div className="flex gap-4">
             {/* Social Links */}
             <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors" aria-label="LinkedIn">
               <Linkedin className="w-4 h-4" />
             </a>
             <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors" aria-label="X (formerly Twitter)">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                 <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298l13.312 17.404z" />
               </svg>
             </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
