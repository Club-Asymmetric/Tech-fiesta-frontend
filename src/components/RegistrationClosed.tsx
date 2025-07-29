"use client";

import { Mail, Phone, MapPin, Clock, Users, CalendarX } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { registrationConfig } from "@/config/registration";
import MinimalClockCollection from "./MinimalClock";

export default function RegistrationClosed() {
  const {
    message,
    offlineRegistrationAvailable,
    offlineRegistrationMessage,
    contactInfo,
  } = registrationConfig;

  return (
    <>
      {/* Background with clocks */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MinimalClockCollection mainClockSize={420} smallClockCount={5} />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 min-h-screen py-6 sm:py-12 px-4 overflow-x-hidden">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-500 to-red-500 bg-clip-text text-transparent leading-tight mb-4">
              Tech Fiesta 2025
            </h1>
            <div className="flex items-center justify-center gap-3 text-red-400 mb-4">
              <CalendarX className="w-6 h-6" />
              <h2 className="text-xl sm:text-2xl font-semibold">
                Registration Closed
              </h2>
            </div>
          </div>

          {/* Main Message Card */}
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-red-400/30 w-full mb-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <CalendarX className="w-8 h-8 text-red-400" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {message}
              </h3>

              <p className="text-gray-300 text-lg mb-6">
                Thank you for your interest in Tech Fiesta 2025! We have stopped
                accepting new online registrations.
              </p>
            </div>
          </div>

          {/* Offline Registration Available */}
          {offlineRegistrationAvailable && (
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-green-400/30 w-full mb-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-green-400" />
                </div>

                <h3 className="text-2xl font-bold text-green-400 mb-4">
                  Don&apos;t Worry! Offline Registration Available
                </h3>

                <p className="text-white text-lg mb-6">
                  {offlineRegistrationMessage}
                </p>

                <div className="grid sm:grid-cols-2 gap-6 text-left">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <h4 className="text-white font-semibold">Venue</h4>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Chennai Institute of Technology
                      <br />
                      Kundrathur, Chennai - 600069
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <h4 className="text-white font-semibold">
                        Registration Hours
                      </h4>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Event Day: 8:00 AM - 10:00 AM
                      <br />
                      Registration Desk Available
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    <strong>💡 Pro Tip:</strong> Arrive early for smooth
                    registration! Bring valid ID and exact change for faster
                    processing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-blue-400/30 w-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-blue-400 mb-2">
                Need Help? Contact Us
              </h3>
              <p className="text-gray-300">
                Have questions about offline registration or the event?
                We&apos;re here to help!
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Phone Numbers */}
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <h4 className="text-white font-semibold">Call Us</h4>
                </div>
                <div className="space-y-2">
                  {contactInfo.phone.map((phone, index) => (
                    <a
                      key={index}
                      href={`tel:${phone}`}
                      className="block text-green-400 hover:text-green-300 transition-colors text-sm"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FaWhatsapp className="w-5 h-5 text-green-400" />
                  <h4 className="text-white font-semibold">WhatsApp</h4>
                </div>
                <div className="space-y-2">
                  {contactInfo.whatsapp.map((whatsapp, index) => (
                    <a
                      key={index}
                      href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                      className="block text-green-400 hover:text-green-300 transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {whatsapp}
                    </a>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="bg-white/10 rounded-lg p-4 lg:col-span-1 sm:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <h4 className="text-white font-semibold">Email Us</h4>
                </div>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm break-all"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-gray-300 text-lg">
              Thank you for your enthusiasm! We look forward to seeing you at{" "}
              <span className="text-blue-400 font-semibold">
                Tech Fiesta 2025
              </span>
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Follow us on our social media for updates and announcements
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
