"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Event, Workshop, RegistrationFormData, TeamMember, PaymentQR } from "@/types";
import { events } from "@/data/events";
import { workshops } from "@/data/workshops";
import { validateEmail, validatePhone, validateIndianTransactionId } from "@/utils/registration";
import { CheckCircle, CreditCard, Mail, Phone, MessageCircle, PartyPopper, Calendar, MapPin, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import ClockCollection from "./ClockCollection";

export default function RegistrationForm() {
  const searchParams = useSearchParams();
  const preSelectedEventId = searchParams.get("eventId");
  const preSelectedEventType = searchParams.get("type") as "event" | "workshop" | "non-tech";

  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    department: "",
    email: "",
    whatsapp: "",
    college: "",
    year: "",
    isTeamEvent: false,
    teamSize: 1,
    teamMembers: [],
    selectedEvents: preSelectedEventId && preSelectedEventType === "event" ? [parseInt(preSelectedEventId)] : [],
    selectedWorkshops: preSelectedEventId && preSelectedEventType === "workshop" ? [parseInt(preSelectedEventId)] : [],
    selectedNonTechEvents: preSelectedEventId && preSelectedEventType === "non-tech" ? [parseInt(preSelectedEventId)] : [],
    transactionIds: {},
    hasConsented: false,
  });

  const [showQuickContact, setShowQuickContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Payment QR data - Free entry, individual QRs for each event/workshop
  const generatePaymentQRs = (): PaymentQR[] => {
    const qrs: PaymentQR[] = [];
    
    // Individual QRs for selected tech events
    formData.selectedEvents.forEach(eventId => {
      const event = techEvents.find(e => e.id === eventId);
      if (event) {
        qrs.push({
          type: "event",
          eventId: event.id,
          eventTitle: event.title,
          amount: event.price || "₹69", // Default price if undefined
          qrCode: `/qr-codes/event-${event.id}.png`,
          description: `${event.title} Registration`
        });
      }
    });
    
    // Individual QRs for selected workshops
    formData.selectedWorkshops.forEach(workshopId => {
      const workshop = workshops.find(w => w.id === workshopId);
      if (workshop) {
        qrs.push({
          type: "workshop",
          eventId: workshop.id,
          eventTitle: workshop.title,
          amount: workshop.price || "₹101",
          qrCode: `/qr-codes/workshop-${workshop.id}.png`,
          description: `${workshop.title} Workshop`
        });
      }
    });
    
    return qrs;
  };

  // Get tech and non-tech events
  const techEvents = events.filter(event => event.type === "tech");
  const nonTechEvents = events.filter(event => event.type === "non-tech");

  // Check if any selected events require teams
  const requiresTeam = [...formData.selectedEvents, ...formData.selectedWorkshops]
    .some(id => {
      const event = events.find(e => e.id === id);
      const workshop = workshops.find(w => w.id === id);
      // Add logic here based on your event/workshop data to determine team requirements
      return event?.title.toLowerCase().includes("team") || workshop?.title.toLowerCase().includes("team");
    });

  useEffect(() => {
    setFormData(prev => ({ ...prev, isTeamEvent: requiresTeam }));
  }, [requiresTeam]);

  const handleInputChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEventSelection = (eventId: number, type: "event" | "workshop" | "non-tech") => {
    setFormData(prev => {
      if (type === "event") {
        return {
          ...prev,
          selectedEvents: prev.selectedEvents.includes(eventId)
            ? prev.selectedEvents.filter(id => id !== eventId)
            : [...prev.selectedEvents, eventId]
        };
      } else if (type === "workshop") {
        return {
          ...prev,
          selectedWorkshops: prev.selectedWorkshops.includes(eventId)
            ? prev.selectedWorkshops.filter(id => id !== eventId)
            : [...prev.selectedWorkshops, eventId]
        };
      } else {
        return {
          ...prev,
          selectedNonTechEvents: prev.selectedNonTechEvents.includes(eventId)
            ? prev.selectedNonTechEvents.filter(id => id !== eventId)
            : [...prev.selectedNonTechEvents, eventId]
        };
      }
    });
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...(formData.teamMembers || [])];
    if (!updatedMembers[index]) {
      updatedMembers[index] = { name: "", department: "", year: "", email: "", whatsapp: "" };
    }
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, teamMembers: updatedMembers }));
  };

  const addTeamMember = () => {
    const newMember: TeamMember = { name: "", department: "", year: "", email: "", whatsapp: "" };
    setFormData(prev => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), newMember],
      teamSize: (prev.teamSize || 1) + 1
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: (prev.teamMembers || []).filter((_, i) => i !== index),
      teamSize: Math.max(1, (prev.teamSize || 1) - 1)
    }));
  };

  const getRequiredQRs = () => {
    return generatePaymentQRs().filter(qr => qr.amount !== "Free");
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Basic validations
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.whatsapp.trim()) newErrors.whatsapp = "WhatsApp number is required";
    else if (!validatePhone(formData.whatsapp)) newErrors.whatsapp = "Invalid phone number format";
    if (!formData.college.trim()) newErrors.college = "College name is required";
    if (!formData.year) newErrors.year = "Year of study is required";
    
    // Event selection validation
/*     
    const totalSelections = formData.selectedEvents.length + formData.selectedWorkshops.length + formData.selectedNonTechEvents.length;
    if (totalSelections === 0) {
      newErrors.events = "Please select at least one event or workshop";
    }
*/ 
      
    // Team member validation
    if (formData.isTeamEvent && formData.teamMembers) {
      formData.teamMembers.forEach((member, index) => {
        if (!member.name.trim()) newErrors[`team_${index}_name`] = `Team member ${index + 2} name is required`;
        if (!member.email.trim()) newErrors[`team_${index}_email`] = `Team member ${index + 2} email is required`;
        else if (!validateEmail(member.email)) newErrors[`team_${index}_email`] = `Invalid email for team member ${index + 2}`;
      });
    }
    
    // Payment validation
    const requiredQRs = getRequiredQRs();
    requiredQRs.forEach(qr => {
      const transactionKey = qr.eventId ? `${qr.type}_${qr.eventId}` : qr.type;
      const transactionId = formData.transactionIds[transactionKey as keyof typeof formData.transactionIds];
      if (!transactionId?.trim()) {
        newErrors[`transaction_${transactionKey}`] = `Transaction ID for ${qr.description} is required`;
      } else if (!validateIndianTransactionId(transactionId)) {
        newErrors[`transaction_${transactionKey}`] = `Invalid transaction ID format for ${qr.description}`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hasConsented) {
      toast.error("Please consent to the terms and conditions");
      return;
    }
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would implement the actual submission logic
      // For now, just simulate a submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const eventCount = formData.selectedEvents.length + formData.selectedWorkshops.length + formData.selectedNonTechEvents.length;
      const paymentTotal = getRequiredQRs().reduce((total, qr) => total + (qr.amount === "Free" ? 0 : parseInt(qr.amount.replace('₹', ''))), 0);
      
      toast.success(
        `Registration submitted successfully! ✓ Events registered: ${eventCount} | ₹ Total payment: ₹${paymentTotal} | ✉ Confirmation email will be sent to: ${formData.email}. Please keep your transaction receipts safe for verification.`,
        { duration: 6000 }
      );
      
      // Reset form or redirect
      // window.location.href = "/";
      
    } catch (error) {
      toast.error("Registration failed. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Add the same fixed clock background as other pages */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ClockCollection
          mainClockSize={420}
          smallClockCount={60}
        />
        <div className="absolute inset-0 bg-black/60"></div> {/* Overlay for better readability */}
      </div>

      <div className="relative z-10 min-h-screen py-6 sm:py-12 px-4 overflow-x-hidden">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
              Tech Fiesta 2025 Registration
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
              Register for exciting events and workshops! Entry is <span className="text-green-400 font-semibold">FREE</span> - pay only for the events you choose.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl w-full overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 w-full">
            {/* Personal Information */}
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full overflow-hidden transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="break-words">Personal Information</span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
              <div>
                <label className="block text-white font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 ${
                    errors.name ? 'border-red-400' : 'border-white/30'
                  }`}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Department *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Computer Science, Electronics, etc."
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 ${
                    errors.department ? 'border-red-400' : 'border-white/30'
                  }`}
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                />
                {errors.department && <p className="text-red-400 text-sm mt-1">{errors.department}</p>}
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 ${
                    errors.email ? 'border-red-400' : 'border-white/30'
                  }`}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210 or 9876543210"
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 ${
                    errors.whatsapp ? 'border-red-400' : 'border-white/30'
                  }`}
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                />
                {errors.whatsapp && <p className="text-red-400 text-sm mt-1">{errors.whatsapp}</p>}
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">College Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your college/university name"
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 ${
                    errors.college ? 'border-red-400' : 'border-white/30'
                  }`}
                  value={formData.college}
                  onChange={(e) => handleInputChange("college", e.target.value)}
                />
                {errors.college && <p className="text-red-400 text-sm mt-1">{errors.college}</p>}
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Year of Study *</label>
                <select
                  required
                  className={`w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm border rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 ${
                    errors.year ? 'border-red-400' : 'border-white/30'
                  }`}
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                >
                  <option value="" className="text-black">Select Year</option>
                  <option value="1st" className="text-black">1st Year</option>
                  <option value="2nd" className="text-black">2nd Year</option>
                  <option value="3rd" className="text-black">3rd Year</option>
                  <option value="4th" className="text-black">4th Year</option>
                  <option value="Postgraduate" className="text-black">Postgraduate</option>
                </select>
                {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year}</p>}
              </div>
              </div>
            </div>

            {/* Event Selection */}
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full overflow-hidden transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex flex-wrap items-center gap-2">
                <span className="break-words">Select Events & Workshops</span>
                <span className="text-xs sm:text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded-full whitespace-nowrap">Entry FREE</span>
              </h3>
              {errors.events && <p className="text-red-400 text-sm mb-4">{errors.events}</p>}
              
              {/* Technical Events */}
              <div className="space-y-4 w-full">
                <h4 className="text-lg font-semibold text-blue-400 mb-4 flex flex-wrap items-center gap-2">
                  <span className="break-words">Technical Events</span>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded whitespace-nowrap">₹69 each</span>
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                  {techEvents.map(event => (
                    <label key={event.id} className="group relative flex items-start space-x-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/15 cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full overflow-hidden">
                      <input
                        type="checkbox"
                        checked={formData.selectedEvents.includes(event.id)}
                        onChange={() => handleEventSelection(event.id, "event")}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500 flex-shrink-0 mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-white font-medium group-hover:text-blue-300 transition-colors block break-words">{event.title}</span>
                        <p className="text-gray-400 text-sm flex flex-wrap items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="break-words">{event.venue}</span>
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Workshops */}
              <div className="space-y-4 w-full">
                <h4 className="text-lg font-semibold text-green-400 my-4 flex flex-wrap items-center gap-2">
                  <span className="break-words">Workshops</span>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded whitespace-nowrap">Varies by workshop</span>
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                  {workshops.map(workshop => (
                    <label key={workshop.id} className="group relative flex items-start space-x-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/15 cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full overflow-hidden">
                      <input
                        type="checkbox"
                        checked={formData.selectedWorkshops.includes(workshop.id)}
                        onChange={() => handleEventSelection(workshop.id, "workshop")}
                        className="w-5 h-5 text-green-600 bg-white/10 border-white/30 rounded focus:ring-green-500 flex-shrink-0 mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-white font-medium group-hover:text-green-300 transition-colors block break-words">{workshop.title}</span>
                        <p className="text-gray-400 text-sm flex flex-wrap items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="break-words">{workshop.venue}</span>
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Non-Tech Events */}
              <div className="space-y-4 w-full">
                <h4 className="text-lg font-semibold text-purple-400 my-4 flex flex-wrap items-center gap-2">
                  <span className="break-words">Non-Technical Events</span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded whitespace-nowrap">Payment on arrival</span>
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                  {nonTechEvents.map(event => (
                    <label key={event.id} className="group relative flex items-start space-x-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/15 cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full overflow-hidden">
                      <input
                        type="checkbox"
                        checked={formData.selectedNonTechEvents.includes(event.id)}
                        onChange={() => handleEventSelection(event.id, "non-tech")}
                        className="w-5 h-5 text-purple-600 bg-white/10 border-white/30 rounded focus:ring-purple-500 flex-shrink-0 mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-white font-medium group-hover:text-purple-300 transition-colors block break-words">{event.title}</span>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-gray-400 text-sm flex flex-wrap items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="break-words">{event.venue}</span>
                          </p>
                          <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded whitespace-nowrap">Pay on arrival</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Details */}
            {formData.isTeamEvent && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full overflow-hidden hover:bg-white/15 transition-all duration-300">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Team Details</h3>
                <div className="space-y-4">
                  {(formData.teamMembers || []).map((member, index) => (
                    <div key={index} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 w-full overflow-hidden">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-white font-medium">Team Member {index + 2}</h4>
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Name"
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Department"
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                          value={member.department}
                          onChange={(e) => handleTeamMemberChange(index, "department", e.target.value)}
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                          value={member.email}
                          onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                        />
                        <input
                          type="tel"
                          placeholder="WhatsApp"
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                          value={member.whatsapp}
                          onChange={(e) => handleTeamMemberChange(index, "whatsapp", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="w-full py-3 bg-white/10 backdrop-blur-sm border border-blue-400/50 rounded-lg text-blue-400 hover:bg-white/15 hover:border-blue-400 transition-all duration-300"
                  >
                    + Add Team Member
                  </button>
                </div>
              </div>
            )}

            {/* Registration Summary */}
            {(formData.selectedEvents.length > 0 || formData.selectedWorkshops.length > 0 || formData.selectedNonTechEvents.length > 0) && (
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full overflow-hidden transition-all duration-300">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="break-words">Registration Summary</span>
                </h3>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                  {/* Tech Events */}
                  {formData.selectedEvents.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30 hover:bg-white/15 transition-all duration-300">
                      <h4 className="font-semibold text-blue-400 mb-3">Technical Events ({formData.selectedEvents.length})</h4>
                      <ul className="space-y-2">
                        {formData.selectedEvents.map(eventId => {
                          const event = techEvents.find(e => e.id === eventId);
                          return event ? (
                            <li key={eventId} className="text-sm text-white break-words">• {event.title} <span className="text-green-300">({event.price})</span></li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                  
                  {/* Workshops */}
                  {formData.selectedWorkshops.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-green-400/30 hover:bg-white/15 transition-all duration-300">
                      <h4 className="font-semibold text-green-400 mb-3">Workshops ({formData.selectedWorkshops.length})</h4>
                      <ul className="space-y-2">
                        {formData.selectedWorkshops.map(workshopId => {
                          const workshop = workshops.find(w => w.id === workshopId);
                          return workshop ? (
                            <li key={workshopId} className="text-sm text-white break-words">
                              • {workshop.title} <span className="text-green-300">({workshop.price})</span>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                  
                  {/* Non-Tech Events */}
                  {formData.selectedNonTechEvents.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30 hover:bg-white/15 transition-all duration-300">
                      <h4 className="font-semibold text-purple-400 mb-3">Non-Tech Events ({formData.selectedNonTechEvents.length})</h4>
                      <ul className="space-y-2">
                        {formData.selectedNonTechEvents.map(eventId => {
                          const event = nonTechEvents.find(e => e.id === eventId);
                          return event ? (
                            <li key={eventId} className="text-sm text-white break-words">• {event.title}</li>
                          ) : null;
                        })}
                      </ul>
                      <p className="text-yellow-300 font-medium mt-2">Payment on arrival</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <p className="text-center text-white break-words">
                    <span className="text-green-400 font-bold text-lg">Total Online Payment: </span>
                    <span className="text-2xl font-bold">
                      ₹{getRequiredQRs().reduce((total, qr) => total + (qr.amount === "Free" ? 0 : parseInt(qr.amount.replace('₹', ''))), 0)}
                    </span>
                  </p>
                  {formData.selectedNonTechEvents.length > 0 && (
                    <p className="text-center text-yellow-400 text-sm mt-1 break-words">
                      + Non-tech event fees to be paid on arrival
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Payment Section */}
            {getRequiredQRs().length > 0 && (
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full overflow-hidden transition-all duration-300">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="break-words">Payment Details</span>
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {getRequiredQRs().map((qr, index) => {
                    const transactionKey = qr.eventId ? `${qr.type}_${qr.eventId}` : qr.type;
                    return (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 w-full overflow-hidden">
                        <div className="text-center mb-4">
                          <h4 className="text-white font-semibold mb-1 text-lg break-words">{qr.eventTitle || qr.description}</h4>
                          <p className="text-green-400 font-bold text-2xl mb-3">{qr.amount}</p>
                        </div>
                        <div className="w-full h-48 bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-600">
                          <div className="text-center">
                            <div className="w-32 h-32 mx-auto mb-2 bg-white rounded-lg p-2 flex items-center justify-center">
                              <img 
                                src={qr.qrCode} 
                                alt="QR Code" 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  // Fallback to placeholder if image fails to load
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <svg className="w-16 h-16 text-gray-500 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4m-4 0l2-2m-2 2l2 2M4 7h4v1.7M8 7a4 4 0 100 8m0-8V5a2 2 0 012-2h4.01M12 5h4a2 2 0 012 2v4" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-400 font-medium">QR Code</p>
                            <p className="text-xs text-gray-500">Scan to pay {qr.amount}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2">Transaction ID *</label>
                          <input
                            type="text"
                            placeholder="Enter transaction ID"
                            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/15 transition-all duration-300 ${
                              errors[`transaction_${transactionKey}`] ? 'border-red-400' : 'border-white/30'
                            }`}
                            value={formData.transactionIds[transactionKey as keyof typeof formData.transactionIds] || ""}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              transactionIds: {
                                ...prev.transactionIds,
                                [transactionKey]: e.target.value
                              }
                            }))}
                          />
                          {errors[`transaction_${transactionKey}`] && (
                            <p className="text-red-400 text-sm mt-1 break-words">{errors[`transaction_${transactionKey}`]}</p>
                          )}
                        </div>
                        <div className="mt-3 text-xs text-gray-400">
                          <p>• Enter the transaction ID after payment</p>
                          <p>• Keep the payment receipt safe</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Non-tech events payment notice */}
            {formData.selectedNonTechEvents.length > 0 && (
              <div className="bg-black/60 backdrop-blur-sm border border-yellow-400/50 rounded-lg p-4 w-full overflow-hidden transition-all duration-300">
                <h4 className="text-yellow-400 font-medium mb-2">Non-Technical Events Payment</h4>
                <p className="text-yellow-300 break-words">
                  Payment for non-technical events will be collected on the day of the event. 
                  Please ensure you have the required amount ready.
                </p>
              </div>
            )}

            {/* Consent */}
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full overflow-hidden transition-all duration-300">
              <label className="flex items-start space-x-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-6 h-6 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                  checked={formData.hasConsented}
                  onChange={(e) => handleInputChange("hasConsented", e.target.checked)}
                />
                <div className="text-gray-300 leading-relaxed break-words">
                  <p className="font-medium text-white mb-2">Data Consent & Verification</p>
                  <p className="text-sm">
                    I hereby confirm that all the information provided above is <span className="text-blue-400 font-medium">accurate and complete</span>. 
                    I understand that any false information may lead to <span className="text-red-400 font-medium">disqualification</span> from the events. 
                    I consent to the processing of my personal data for registration and event management purposes in accordance with privacy guidelines.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Double-check all details before submission<br/>
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Keep payment receipts for verification<br/>
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Contact support for any issues
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <div className="text-center w-full">
              <button
                type="submit"
                disabled={!formData.hasConsented || isSubmitting}
                className="w-full max-w-md mx-auto py-4 px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Registration...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Submit Registration
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        </div>

        {/* Quick Contact Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowQuickContact(!showQuickContact)}
            className="bg-green-600/80 backdrop-blur-sm hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 border border-green-500/50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          
          {showQuickContact && (
            <div className="absolute bottom-16 right-0 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-xl border border-white/20 w-64 max-w-[calc(100vw-2rem)] z-50">
              <h4 className="text-white font-medium mb-2">Quick Contact</h4>
              <p className="text-gray-300 text-sm mb-3 break-words">
                Having payment or registration issues? Contact us immediately!
              </p>
              <div className="space-y-2">
                <a href="tel:+1234567890" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors break-words">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  +91 12345 67890
                </a>
                <a href="https://wa.me/1234567890" className="flex items-center text-green-400 hover:text-green-300 transition-colors break-words">
                  <FaWhatsapp className="w-4 h-4 mr-2 flex-shrink-0" />
                  WhatsApp Support
                </a>
                <a href="mailto:support@asymmetric.in" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors break-words">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  support@asymmetric.in
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
