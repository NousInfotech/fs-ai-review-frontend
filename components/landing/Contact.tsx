"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import FadeIn from "./animations/FadeIn";
import TextReveal from "./animations/TextReveal";
import LandingButton from "./LandingButton";
import { Mail, MessageCircle, Globe, Send, Phone } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    alert("Thank you for your message. We will get back to you soon!");
  };

  return (
    <section className="relative py-10 overflow-hidden bg-(--landing-background)" id="contact">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-(--landing-primary-blue)/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-(--landing-purple-logo)/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="relative mx-auto px-5 md:px-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          
          {/* Left Side: Contact Information */}
          <div className="space-y-10">
            <FadeIn direction="left">
              <div>
                <h2 className="text-xs md:text-base font-semibold text-(--landing-primary-blue) uppercase tracking-widest mb-3">Get in Touch</h2>
                <TextReveal
                  text="Let's discuss how we can help."
                  as="h2"
                  className="text-2xl md:text-5xl font-medium text-(--landing-text-heading) tracking-tight mb-3"
                />
                <p className="text-(--landing-text-gray) md:text-xl leading-relaxed">
                  Have questions about our volume pricing or need a custom demonstration? Our team is here to help you automate your audit workflow.
                </p>
              </div>
            </FadeIn>

            <div className="space-y-6">
              <FadeIn direction="left" delay={0.2}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 text-(--landing-primary-blue)">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Email Us</h4>
                    <p className="text-slate-600">hello@financialreview.ai</p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="left" delay={0.3}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Support Chat</h4>
                    <p className="text-slate-600">Available Mon-Fri, 9am - 6pm CET</p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="left" delay={0.4}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 text-(--landing-primary-blue)">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Global Offices</h4>
                    <p className="text-slate-600">Remote-first team with hubs in London & Paris</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <FadeIn direction="right">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-(--landing-primary-blue) focus:ring-4 focus:ring-(--landing-primary-blue)/5 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-(--landing-primary-blue) focus:ring-4 focus:ring-(--landing-primary-blue)/5 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-slate-700 ml-1">Phone No (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-(--landing-primary-blue) focus:ring-4 focus:ring-(--landing-primary-blue)/5 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-slate-700 ml-1">How can we help?</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your firm's needs..."
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-(--landing-primary-blue) focus:ring-4 focus:ring-(--landing-primary-blue)/5 outline-none transition-all resize-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-(--landing-primary-blue) text-white font-semibold py-4 rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/20 active:scale-95"
                >
                  Send Message
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
