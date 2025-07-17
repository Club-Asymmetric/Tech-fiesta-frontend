// Pass Configuration - Defines what each pass includes and limits
export interface PassLimits {
  passId: number;
  // Workshop configuration
  workshopsIncluded: number; // Number of workshops included in pass price
  maxAdditionalWorkshops: number; // Max additional workshops user can select
  workshopSelectionEnabled: boolean; // Whether user can select workshops
  
  // Event configuration  
  techEventsIncluded: number; // Number of tech events included in pass price
  maxAdditionalTechEvents: number; // Max additional tech events user can select
  techEventSelectionEnabled: boolean; // Whether user can select tech events
  
  // Non-tech event configuration
  nonTechEventsIncluded: number; // Number of non-tech events included in pass price
  maxAdditionalNonTechEvents: number; // Max additional non-tech events user can select
  nonTechEventSelectionEnabled: boolean; // Whether user can select non-tech events
  
  description: string;
}

export const passLimits: PassLimits[] = [
  {
    passId: 1,
    // Workshop settings - 1 included + up to 4 additional = 5 total workshops
    workshopsIncluded: 1,
    maxAdditionalWorkshops: 4,
    workshopSelectionEnabled: true,
    
    // Event settings - unlimited access, no additional selection needed
    techEventsIncluded: 6, // Unlimited
    maxAdditionalTechEvents: 0,
    techEventSelectionEnabled: false, // Disabled - unlimited access
    
    // Non-tech events - not included in pass
    nonTechEventsIncluded: 4,
    maxAdditionalNonTechEvents: 0,
    nonTechEventSelectionEnabled: false, // Disabled - pay on arrival
    
    description: "1 workshop included + select up to 4 additional workshops. 3 tech events included + 3 additional tech events."
  }
];

// Helper function to get limits for a specific pass
export const getPassLimits = (passId: number): PassLimits | null => {
  return passLimits.find(limit => limit.passId === passId) || null;
};

// Helper function to check if selection is within limits
export const isWithinPassLimits = (
  passId: number,
  selectedWorkshops: number,
  selectedEvents: number = 0,
  selectedNonTechEvents: number = 0
): { 
  withinLimits: boolean;
  workshopsOk: boolean;
  techEventsOk: boolean;
  nonTechEventsOk: boolean;
  maxWorkshops: number;
} => {
  const limits = getPassLimits(passId);
  
  if (!limits) {
    return {
      withinLimits: false,
      workshopsOk: false,
      techEventsOk: false,
      nonTechEventsOk: false,
      maxWorkshops: 0
    };
  }

  const maxWorkshops = limits.workshopsIncluded + limits.maxAdditionalWorkshops;
  const workshopsOk = selectedWorkshops <= maxWorkshops;
  const techEventsOk = !limits.techEventSelectionEnabled || selectedEvents <= limits.maxAdditionalTechEvents;
  const nonTechEventsOk = !limits.nonTechEventSelectionEnabled || selectedNonTechEvents <= limits.maxAdditionalNonTechEvents;

  return {
    withinLimits: workshopsOk && techEventsOk && nonTechEventsOk,
    workshopsOk,
    techEventsOk,
    nonTechEventsOk,
    maxWorkshops
  };
};
