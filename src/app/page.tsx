"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
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
  Zap,
  ShieldCheck,
  LayoutGrid,
  Linkedin
} from 'lucide-react';

const manrope = Manrope({ subsets: ['latin'] });

export default function Home() {
  const t = useTranslations("landing");
  const [billing, setBilling] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(1);

  return (
    <div className={`min-h-screen bg-[var(--landing-bg)] text-[var(--landing-text)] selection:bg-[var(--landing-accent)] selection:text-[var(--landing-brand)] ${manrope.className}`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--landing-bg)]/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-text.svg" alt="Civy" className="h-8 w-auto" />
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--landing-muted)]">
            <a href="#features" className="hover:text-[var(--landing-brand)] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[var(--landing-brand)] transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-[var(--landing-brand)] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[var(--landing-brand)] transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-semibold text-[var(--landing-brand)] hover:text-[var(--landing-muted)] transition-colors">
              Log in
            </Link>
            <Link href="/login?tab=signup&next=/dashboard" className="bg-[var(--landing-brand)] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[var(--landing-brand-hover)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center">
              Sign Up
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-[var(--landing-brand)]"
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
            <Link href="/dashboard" className="w-full text-center py-3 rounded-xl border-2 border-[var(--landing-brand)] text-[var(--landing-brand)] font-bold block whitespace-nowrap">
              Log in
            </Link>
            <Link href="/login?tab=signup&next=/dashboard" className="w-full text-center py-3 rounded-xl bg-[var(--landing-brand)] text-white font-bold block whitespace-nowrap">
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--landing-accent)]/20 rounded-full"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-yellow-200/20 rounded-full"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold">{t("heroBadge")}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--landing-brand)] tracking-tight mb-6 leading-tight">
            {t("heroTitle")}<br className="hidden md:block" />{t("heroTitleLine2")}<span className="text-[var(--landing-emphasis)] italic">{t("heroTitleBreak")}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--landing-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("heroSubtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-[var(--landing-brand)] text-white rounded-full font-bold hover:bg-[var(--landing-brand-hover)] transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2 group">
              {t("heroCta")}
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white text-[var(--landing-brand)] border-2 border-gray-200 rounded-full font-bold hover:border-[var(--landing-brand)] transition-all flex items-center justify-center gap-2">
              {t("heroViewTemplates")}
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
                  <span className="typing-animation text-sm text-gray-800 font-medium">{t("heroTypingTitle")}<span className="blink-caret text-[var(--landing-brand)] font-bold text-base">|</span></span>
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
            <div className="flex-1 bg-[var(--landing-brand)] rounded-2xl p-6 text-white relative overflow-hidden shadow-inner">
              <div className="absolute top-4 right-4 bg-[var(--landing-accent)] text-[var(--landing-brand)] text-xs font-bold px-2 py-1 rounded-md">Live Preview</div>
              <div className="w-full h-full bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Alex Morgan</h3>
                  <p className="typing-animation text-[var(--landing-accent)] font-medium text-sm" style={{ animationDelay: "3ms" }}>{t("heroTypingTitle")}</p>
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
            <div className="w-12 h-12 rounded-xl bg-[var(--landing-accent)] flex items-center justify-center text-[var(--landing-brand)]">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[var(--landing-brand)]">{t("statsResumes")}</h4>
              <p className="text-sm font-medium text-[var(--landing-muted)]">{t("statsResumesDesc")}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--landing-brand)] flex items-center justify-center text-white">
              <Globe size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[var(--landing-brand)]">9+ {t("statsLanguages")}</h4>
              <p className="text-sm font-medium text-[var(--landing-muted)]">{t("statsLanguagesDesc")}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[var(--landing-brand)]">{t("statsAts")}</h4>
              <p className="text-sm font-medium text-[var(--landing-muted)]">{t("statsAtsDesc")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="bg-[var(--landing-brand)] pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t("featuresTitle")}</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t("featuresSubtitle")}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <Play className="w-8 h-8 text-[var(--landing-accent)]" />
              <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[var(--landing-accent)] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t("featurePreviewTitle")}</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              No more &quot;Download to See.&quot; Changes reflect instantly in a pixel-perfect PDF preview as you type.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <LayoutTemplate className="w-8 h-8 text-[var(--landing-accent)]" />
              <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[var(--landing-accent)] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t("featureBlocksTitle")}</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {t("featureBlocksDesc")}
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <Globe className="w-8 h-8 text-[var(--landing-accent)]" />
              <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[var(--landing-accent)] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t("featureLanguagesTitle")}</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {t("featureLanguagesDesc")}
            </p>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <LinkIcon className="w-8 h-8 text-[var(--landing-accent)]" />
              <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[var(--landing-accent)] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t("featureShareTitle")}</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {t("featureShareDesc")}
            </p>
          </div>

          {/* Feature Card 5 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <History className="w-8 h-8 text-yellow-500" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-yellow-500 tracking-wider bg-yellow-500/10 px-2 py-1 rounded">Pro</span>
                <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[var(--landing-accent)] transition-colors" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Version History</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {t("featureHistoryDesc")}
            </p>
          </div>

          {/* Feature Card 6 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <Trash2 className="w-8 h-8 text-[var(--landing-accent)]" />
              <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[var(--landing-accent)] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t("featureTrashTitle")}</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {t("featureTrashDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--landing-accent)]/30 text-[var(--landing-brand)] text-sm font-bold mb-6">
              <Zap size={16} /> {t("howTitle")}
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--landing-brand)] mb-6 leading-tight">
              {t("howHeading")}
            </h2>
            <p className="text-[var(--landing-muted)] text-lg mb-10">
              We&apos;ve streamlined the entire process. Forget formatting headaches and focus on showcasing your true potential.
            </p>

            <div className="space-y-8">
              <div 
                className={`flex gap-4 cursor-pointer transition-opacity duration-300 ${activeStep === 1 ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                onClick={() => setActiveStep(1)}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg transition-colors ${activeStep === 1 ? 'bg-[var(--landing-brand)] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--landing-brand)] mb-2">{t("howStep1Title")}</h3>
                  <p className="text-[var(--landing-muted)]">{t("howStep1Desc")}</p>
                </div>
              </div>
              <div 
                className={`flex gap-4 cursor-pointer transition-opacity duration-300 ${activeStep === 2 ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                onClick={() => setActiveStep(2)}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg transition-colors ${activeStep === 2 ? 'bg-[var(--landing-brand)] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--landing-brand)] mb-2">{t("howStep2Title")}</h3>
                  <p className="text-[var(--landing-muted)]">{t("howStep2Desc")}</p>
                </div>
              </div>
              <div 
                className={`flex gap-4 cursor-pointer transition-opacity duration-300 ${activeStep === 3 ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                onClick={() => setActiveStep(3)}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg transition-colors ${activeStep === 3 ? 'bg-[var(--landing-accent)] text-[var(--landing-brand)]' : 'bg-gray-200 text-gray-500'}`}>3</div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--landing-brand)] mb-2">{t("howStep3Title")}</h3>
                  <p className="text-[var(--landing-muted)]">{t("howStep3Desc")}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full bg-[var(--landing-bg)] rounded-[40px] p-8 border border-gray-100 shadow-2xl relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-[var(--landing-accent)]/20 to-transparent rounded-[40px]"></div>
             <div className="relative z-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-[420px] flex flex-col">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="font-bold text-[var(--landing-brand)]">
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
                      <div className={`bg-white rounded-xl h-52 p-4 relative cursor-pointer shadow-md group overflow-hidden flex flex-col ${selectedTemplate === 1 ? 'border-2 border-[var(--landing-brand)]' : 'border-2 border-gray-200'}`} onClick={() => setSelectedTemplate(1)}>
                        {selectedTemplate === 1 && (
                        <div className="absolute top-2 right-2 bg-[var(--landing-brand)] text-white rounded-full p-1 z-10">
                          <CheckCircle2 size={14} />
                        </div>
                        )}
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 shadow-sm"></div>
                           <div>
                               <div className="w-16 h-2 bg-[var(--landing-brand)] rounded mb-1.5"></div>
                               <div className="w-10 h-1.5 bg-[var(--landing-muted)] rounded"></div>
                           </div>
                        </div>
                        {/* Body */}
                        <div className="space-y-4 flex-1">
                            <div>
                               <div className="w-12 h-1.5 bg-[var(--landing-brand)]/50 rounded mb-2"></div>
                               <div className="w-full h-1 bg-gray-100 rounded mb-1.5"></div>
                               <div className="w-5/6 h-1 bg-gray-100 rounded"></div>
                            </div>
                            <div>
                               <div className="w-12 h-1.5 bg-[var(--landing-brand)]/50 rounded mb-2"></div>
                               <div className="w-full h-1 bg-gray-100 rounded mb-1.5"></div>
                               <div className="w-4/5 h-1 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-[var(--landing-brand)]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>

                      <div className={`bg-white rounded-xl h-52 p-0 relative cursor-pointer shadow-sm hover:shadow-md transition-shadow group overflow-hidden flex flex-col ${selectedTemplate === 2 ? 'border-2 border-[var(--landing-brand)]' : 'border border-gray-200'}`} onClick={() => setSelectedTemplate(2)}>
                        {selectedTemplate === 2 && (
                        <div className="absolute top-2 right-2 bg-[var(--landing-brand)] text-white rounded-full p-1 z-10">
                          <CheckCircle2 size={14} />
                        </div>
                        )}
                        {/* Header */}
                        <div className="bg-[var(--landing-brand)] p-4 h-14 flex items-end shadow-sm">
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
                                   <div className="w-12 h-1 bg-[var(--landing-muted)] rounded mb-1.5"></div>
                                   <div className="w-full h-1 bg-gray-100 rounded mb-1.5"></div>
                                   <div className="w-5/6 h-1 bg-gray-100 rounded mb-1.5"></div>
                                   <div className="w-full h-1 bg-gray-100 rounded"></div>
                               </div>
                               <div>
                                   <div className="w-12 h-1 bg-[var(--landing-muted)] rounded mb-1.5"></div>
                                   <div className="w-full h-1 bg-gray-100 rounded mb-1.5"></div>
                                   <div className="w-full h-1 bg-gray-100 rounded"></div>
                               </div>
                           </div>
                        </div>
                        <div className="absolute inset-0 bg-[var(--landing-text)]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                             <span className="bg-white text-[var(--landing-brand)] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all">{t("howDemoSelect")}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2 Content */}
                  {activeStep === 2 && (
                    <div className="h-full flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="flex gap-3">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("howDemoFirstName")}</div>
                          <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
                        </div>
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("howDemoLastName")}</div>
                          <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("howDemoJobTitle")}</div>
                        <div className="w-1/3 h-3 bg-gray-300 rounded"></div>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{t("howDemoSummary")}</div>
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
                      <div className="w-20 h-20 bg-[var(--landing-accent)] rounded-full flex items-center justify-center text-[var(--landing-brand)] mb-6 shadow-sm border border-[#c5f0a4]">
                        <CheckCircle2 size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-[var(--landing-brand)] mb-2">{t("howDemoReady")}</h3>
                      <p className="text-gray-500 text-sm max-w-[250px] mx-auto mb-6">
                        {t("howDemoReadyDesc")}
                      </p>
                      <div className="flex gap-3">
                        <div className="px-4 py-2 bg-gray-100 text-[var(--landing-brand)] text-sm font-bold rounded-lg border border-gray-200 flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
                          <LinkIcon size={16} /> {t("howDemoCopyLink")}
                        </div>
                        <Link href="/dashboard" className="px-4 py-2 bg-[var(--landing-brand)] text-white text-sm font-bold rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[var(--landing-brand-hover)] transition-colors">
                          {t("howDemoDownload")}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setActiveStep(prev => prev === 3 ? 1 : prev + 1)}
                  className="w-full mt-6 py-3 bg-[var(--landing-brand)] text-white font-bold rounded-xl flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  {activeStep === 3 ? "Start Over" : "Continue"} 
                  {activeStep !== 3 && <ArrowUpRight size={18} />}
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-[var(--landing-text)] py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--landing-brand)]/20 transform skew-x-12 translate-x-32"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">{t("pricingTitle")}</h2>
            <p className="text-[var(--landing-muted)] text-lg max-w-xl mx-auto mb-10">
              {t("pricingSubtitle")}
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center bg-white/10 p-1 rounded-full border border-white/5">
              <button 
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${billing === 'monthly' ? 'bg-[var(--landing-brand)] text-white shadow-md' : 'text-white/60 hover:text-white'}`}
                onClick={() => setBilling('monthly')}
              >
                {t("pricingMonthly")}
              </button>
              <button 
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${billing === 'quarterly' ? 'bg-[var(--landing-brand)] text-white shadow-md' : 'text-white/60 hover:text-white'}`}
                onClick={() => setBilling('quarterly')}
              >
                {t("pricingQuarterly")}
              </button>
              <button 
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${billing === 'yearly' ? 'bg-[var(--landing-brand)] text-white shadow-md' : 'text-white/60 hover:text-white'}`}
                onClick={() => setBilling('yearly')}
              >
                {t("pricingYearly")} <span className="bg-[var(--landing-accent)] text-[var(--landing-brand)] text-[10px] px-2 py-0.5 rounded-full ml-1">{t("pricingSave")}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Free Tier */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-10 flex flex-col h-full shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-2">{t("pricingFreeTitle")}</h3>
              <p className="text-white/50 text-sm mb-6 h-10">{t("pricingFreeDesc")}</p>
              
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">$0</span>
                <span className="text-white/50">{t("pricingFreeForever")}</span>
              </div>
              
              <Link href="/dashboard" className="w-full py-4 flex justify-center rounded-xl border-2 border-white/20 text-white font-bold hover:bg-white/10 transition-colors mb-10">
                {t("pricingFreeCta")}
              </Link>
              
              <div className="space-y-4 flex-1">
                <p className="text-xs uppercase tracking-wider font-bold text-white/40 mb-4 border-b border-white/10 pb-2">Features</p>
                {[
                  t("pricingFreeFeature1"),
                  t("pricingFreeFeature2"),
                  t("pricingFreeFeature3"),
                  t("pricingFreeFeature4")
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white/40" />
                    <span className="text-white/80 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tier */}
            <div className="bg-[var(--landing-brand)] border border-[var(--landing-accent)]/30 rounded-[32px] p-10 flex flex-col relative h-full shadow-2xl">
              <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-yellow-500 text-[var(--landing-brand)] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                {t("pricingProBadge")}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t("pricingProTitle")}</h3>
              <p className="text-white/70 text-sm mb-6 h-10">{t("pricingProDesc")}</p>
              
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-[var(--landing-accent)]">
                  ${billing === 'yearly' ? '29.99' : billing === 'quarterly' ? '9.99' : '3.99'}
                </span>
                <span className="text-white/50">{billing === 'yearly' ? '/year' : billing === 'quarterly' ? '/3 months' : '/month'}</span>
              </div>
              
              <Link href="/dashboard" className="w-full flex justify-center py-4 rounded-xl bg-[var(--landing-accent)] text-[var(--landing-brand)] font-bold hover:bg-[#c5f0a4] transition-colors mb-10 shadow-lg">
                {t("pricingProCta")}
              </Link>
              
              <div className="space-y-4 flex-1">
                <p className="text-xs uppercase tracking-wider font-bold text-[var(--landing-accent)]/60 mb-4 border-b border-white/10 pb-2">Premium Features</p>
                {[
                  t("pricingProFeature1"),
                  t("pricingProFeature2"),
                  t("pricingProFeature3"),
                  t("pricingProFeature4"),
                  t("pricingProFeature5"),
                  t("pricingProFeature6")
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--landing-accent)]" />
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
            <h2 className="text-4xl font-extrabold text-[var(--landing-brand)] mb-4">{t("faqTitle")}</h2>
            <p className="text-[var(--landing-muted)] text-lg">Got questions? We&apos;ve got answers.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-[var(--landing-bg)] rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
              <h3 className="text-xl font-bold text-[var(--landing-brand)] mb-2 flex items-center justify-between">
                {t("faqFreeQ")}
              </h3>
              <p className="text-[var(--landing-muted)] leading-relaxed">
                Yes, you can create and download one professional resume for free, forever. You&apos;ll have access to our basic templates and standard PDF exports.
              </p>
            </div>

            <div className="bg-[var(--landing-bg)] rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
              <h3 className="text-xl font-bold text-[var(--landing-brand)] mb-2 flex items-center justify-between">
                {t("faqAtsQ")}
              </h3>
              <p className="text-[var(--landing-muted)] leading-relaxed">
                {t("faqAtsA")}
              </p>
            </div>

            <div className="bg-[var(--landing-bg)] rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
              <h3 className="text-xl font-bold text-[var(--landing-brand)] mb-2 flex items-center justify-between">
                {t("faqCancelQ")}
              </h3>
              <p className="text-[var(--landing-muted)] leading-relaxed">
                Yes, you can manage and cancel your subscription anytime through your account settings. If you cancel, you will retain Pro features until the end of your billing cycle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action & Footer */}
      <footer className="bg-[var(--landing-footer)] pt-24 pb-8 px-6 text-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--landing-brand)] via-[var(--landing-accent)] to-[var(--landing-brand)]"></div>
        
        <div className="max-w-4xl mx-auto text-center mb-20 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">{t("footerCtaTitle")}</h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            {t("footerCtaDesc")}
          </p>
          <Link href="/dashboard" className="px-10 py-5 bg-[var(--landing-accent)] flex justify-center text-[var(--landing-brand)] rounded-full font-extrabold text-lg hover:bg-[#c5f0a4] transition-colors shadow-lg max-w-max mx-auto">
            {t("footerCtaButton")}
          </Link>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo-text-w.svg" alt="Civy" className="h-8 w-auto" />
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              {t("footerContactDesc")}
            </p>
            <div className="text-white/80 text-sm font-medium">
              {t("footerContactEmail")}
            </div>
          </div>

          <div className="flex gap-16 flex-wrap">
            <div>
              <h4 className="text-white font-bold mb-6">{t("footerProduct")}</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">{t("footerCompany")}</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Customers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Newsroom</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">{t("footerLegal")}</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">{t("footerTerms")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("footerPrivacy")}</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center md:text-left text-xs text-white/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>{t("footerCopyright")}</p>
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
