// Registration Configuration
export interface RegistrationConfig {
  isOpen: boolean;
  message: string;
  offlineRegistrationAvailable: boolean;
  offlineRegistrationMessage: string;
  contactInfo: {
    phone: string[];
    whatsapp: string[];
    email: string;
  };
}

export const registrationConfig: RegistrationConfig = {
  isOpen: false, // Set to false to close registration
  message: "Online registration for Tech Fiesta 2025 is now closed.",
  offlineRegistrationAvailable: true,
  offlineRegistrationMessage:
    "However, offline registration is still available at the venue.",
  contactInfo: {
    phone: ["+91 8438190166", "+91 9245435888"],
    whatsapp: ["+91 8438190166", "+91 9245435888"],
    email: "asymmetric@citchennai.net",
  },
};
