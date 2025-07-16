"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Event,
  Workshop,
  Pass,
  RegistrationFormData,
  TeamMember,

} from "@/types";
import { eventsApi, workshopsApi, passesApi, registrationApi } from "@/services/api";
import { paymentApi, loadRazorpayScript, PaymentOrder, PaymentResponse, getPaymentWarnings, PaymentWarnings } from "@/services/payment";
import { useAuth } from "@/contexts/AuthContext";
import PaymentWarningModal from "./PaymentWarningModal";
import { getPassLimits, isWithinPassLimits } from "@/config/passLimits";
import {
  validateEmail,
  validatePhone,
  validateIndianTransactionId,
} from "@/utils/registration";
import {
  CheckCircle,
  CreditCard,
  Mail,
  Phone,
  MessageCircle,
  PartyPopper,
  Calendar,
  MapPin,
  Clock,
  LogOut,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  downloadRegistrationPDF,
  downloadRegistrationText,
  downloadRegistrationJSON,
  RegistrationDownloadData,
} from "@/utils/downloadUtils";
import MinimalClockCollection from "./MinimalClock";

export default function RegistrationForm() {
  const { user, isCit, signOut, getAuthToken } = useAuth();
  const searchParams = useSearchParams();
  const preSelectedEventId = searchParams.get("eventId");
  const preSelectedEventType = searchParams.get("type") as
    | "event"
    | "workshop"
    | "non-tech";

  // ALL STATE HOOKS - MUST BE AT THE TOP TO MAINTAIN CONSISTENT ORDER
  const [events, setEvents] = useState<Event[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: user?.displayName || "",
    department: "",
    email: user?.email || "",
    whatsapp: "",
    college: "",
    year: "",
    isTeamEvent: false,
    teamSize: 1,
    teamMembers: [],
    selectedEvents: [],
    selectedWorkshops: [],
    selectedNonTechEvents: [],
    transactionIds: {},
    hasConsented: false,
  });
  const [showQuickContact, setShowQuickContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [successData, setSuccessData] = useState<{
    registrationId: string;
    formData: RegistrationFormData;
    submissionDate: string;
  } | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [paymentWarnings, setPaymentWarnings] = useState<PaymentWarnings | null>(null);
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  // Load events, workshops, and passes from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, workshopsData, passesData] = await Promise.all([
          eventsApi.getAll(),
          workshopsApi.getAll(),
          passesApi.getAll(),
        ]);
        setEvents(eventsData);
        setWorkshops(workshopsData);
        setPasses(passesData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load events, workshops, and passes");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const loadScript = async () => {
      const loaded = await loadRazorpayScript();
      setRazorpayLoaded(loaded);
      if (!loaded) {
        console.error("Failed to load Razorpay script");
      }
    };
    loadScript();
  }, []);

  // Load payment warnings
  useEffect(() => {
    const loadWarnings = async () => {
      try {
        const warnings = await getPaymentWarnings();
        setPaymentWarnings(warnings);
      } catch (error) {
        console.error("Failed to load payment warnings:", error);
      }
    };
    loadWarnings();
  }, []);

  // Prevent navigation during payment
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (paymentInProgress) {
        e.preventDefault();
        e.returnValue = 'Payment in progress. Are you sure you want to leave? This may result in payment without registration.';
        return e.returnValue;
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (paymentInProgress) {
        const confirmLeave = window.confirm(
          'Payment in progress. Are you sure you want to leave? This may result in payment without registration.'
        );
        if (!confirmLeave) {
          // Push the current state back to prevent navigation
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [paymentInProgress]);

  // Update form data when events/workshops load and there's a preselected item
  useEffect(() => {
    if (preSelectedEventId && events.length > 0 && workshops.length > 0) {
      if (preSelectedEventType === "event") {
        const event = events.find((e) => e.id === parseInt(preSelectedEventId));
        if (event) {
          setFormData((prev) => ({
            ...prev,
            selectedEvents: [{ id: event.id, title: event.title }],
          }));
        }
      } else if (preSelectedEventType === "workshop") {
        const workshop = workshops.find(
          (w) => w.id === parseInt(preSelectedEventId)
        );
        if (workshop) {
          setFormData((prev) => ({
            ...prev,
            selectedWorkshops: [{ id: workshop.id, title: workshop.title }],
          }));
        }
      } else if (preSelectedEventType === "non-tech") {
        const event = events.find(
          (e) => e.id === parseInt(preSelectedEventId) && e.type === "non-tech"
        );
        if (event) {
          setFormData((prev) => ({
            ...prev,
            selectedNonTechEvents: [{ id: event.id, title: event.title }],
          }));
        }
      }
    }
  }, [preSelectedEventId, preSelectedEventType, events, workshops]);

  // Get tech and non-tech events - memoized to prevent unnecessary re-renders
  const techEvents = useMemo(
    () => events.filter((event) => event.type === "tech"),
    [events]
  );
  const nonTechEvents = useMemo(
    () => events.filter((event) => event.type === "non-tech"),
    [events]
  );

  // Check if any selected events require teams and get the maximum team size allowed
  const teamRequirements = useMemo(() => {
    const selectedEventsWithTeamLimits = formData.selectedEvents
      .map((selectedEvent) => events.find((e) => e.id === selectedEvent.id))
      .filter(
        (event): event is Event =>
          event !== undefined && event.maxTeamSize !== undefined
      );

    const allTeamEvents = selectedEventsWithTeamLimits;

    if (allTeamEvents.length === 0) {
      return { requiresTeam: false, maxTeamSize: 1 };
    }

    // Get the minimum maxTeamSize among selected events (most restrictive)
    const maxTeamSize = Math.min(
      ...allTeamEvents.map((event) => event.maxTeamSize!)
    );

    return { requiresTeam: true, maxTeamSize };
  }, [formData.selectedEvents, events]);

  // Get pass limits information for the selected pass
  const passLimitsInfo = useMemo(() => {
    if (!formData.selectedPass) return null;
    return getPassLimits(formData.selectedPass);
  }, [formData.selectedPass]);

  // Force re-render when pass limits configuration changes (for development)
  const passConfigHash = useMemo(() => {
    return JSON.stringify(passLimitsInfo);
  }, [passLimitsInfo]);

  // Update form data when team requirements change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      isTeamEvent: teamRequirements.requiresTeam,
      // Adjust team size if it exceeds the new limit
      teamSize: teamRequirements.requiresTeam
        ? Math.min(prev.teamSize || 1, teamRequirements.maxTeamSize)
        : 1,
      // Remove excess team members if team size is reduced
      teamMembers:
        teamRequirements.requiresTeam && prev.teamMembers
          ? prev.teamMembers.slice(
              0,
              Math.max(0, teamRequirements.maxTeamSize - 1)
            )
          : [],
    }));
  }, [teamRequirements.requiresTeam, teamRequirements.maxTeamSize]);

  // Get price based on user type (CIT or regular) and pass status
  const getPrice = (item: Event | Workshop): string => {
    if (isCit && item.citPrice) {
      return item.citPrice;
    }
    return item.price || "₹0";
  };

  // Get price for workshop considering pass limits
  const getWorkshopPrice = (workshop: Workshop, workshopIndex: number): string => {
    if (formData.selectedPass && passLimitsInfo) {
      // If this workshop is within the included count, it's free
      if (workshopIndex < passLimitsInfo.workshopsIncluded) {
        return "Included in Pass";
      }
      // Additional workshops are charged normally
      return getPrice(workshop);
    }
    // No pass selected, show normal price
    return getPrice(workshop);
  };

  // Get price for tech event considering pass limits
  const getTechEventPrice = (event: Event, eventIndex: number): string => {
    if (formData.selectedPass && passLimitsInfo) {
      if (!passLimitsInfo.techEventSelectionEnabled) {
        return "Unlimited Access";
      }
      // If this event is within the included count, it's free
      if (eventIndex < passLimitsInfo.techEventsIncluded) {
        return "Included in Pass";
      }
      // Additional events are charged normally
      return getPrice(event);
    }
    // No pass selected, show normal price
    return getPrice(event);
  };

  // Get price for non-tech event considering pass limits
  const getNonTechEventPrice = (event: Event, eventIndex: number): string => {
    if (formData.selectedPass && passLimitsInfo) {
      if (!passLimitsInfo.nonTechEventSelectionEnabled) {
        return "Pay on Arrival";
      }
      // If this event is within the included count, it's free
      if (eventIndex < passLimitsInfo.nonTechEventsIncluded) {
        return "Included in Pass";
      }
      // Additional events are charged normally
      return "Pay on Arrival"; // Non-tech events are typically paid on arrival
    }
    // No pass selected, show normal behavior
    return "Pay on Arrival";
  };

  // Calculate total payment amount
  const calculateTotalAmount = () => {
    let total = 0;
    
    // If pass is selected, charge for pass + additional items
    if (formData.selectedPass && passLimitsInfo) {
      const selectedPass = passes.find(p => p.id === formData.selectedPass);
      if (selectedPass) {
        // Add pass cost
        if (isCit) {
          total += parseInt(selectedPass.citPrice.replace('₹', ''));
        } else {
          total += parseInt(selectedPass.price.replace('₹', ''));
        }
        
        // Add cost for additional tech events beyond what's included (if selection is enabled)
        if (passLimitsInfo.techEventSelectionEnabled) {
          const additionalEvents = Math.max(0, formData.selectedEvents.length - passLimitsInfo.techEventsIncluded);
          if (additionalEvents > 0) {
            formData.selectedEvents.slice(passLimitsInfo.techEventsIncluded).forEach((selectedEvent) => {
              const event = techEvents.find((e) => e.id === selectedEvent.id);
              if (event) {
                if (isCit && event.citPrice) {
                  total += parseInt(event.citPrice.replace('₹', ''));
                } else if (event.price) {
                  total += parseInt(event.price.replace('₹', ''));
                }
              }
            });
          }
        }
        
        // Add cost for additional workshops beyond what's included
        const additionalWorkshops = Math.max(0, formData.selectedWorkshops.length - passLimitsInfo.workshopsIncluded);
        if (additionalWorkshops > 0) {
          formData.selectedWorkshops.slice(passLimitsInfo.workshopsIncluded).forEach((selectedWorkshop) => {
            const workshop = workshops.find((w) => w.id === selectedWorkshop.id);
            if (workshop) {
              if (isCit && workshop.citPrice) {
                total += parseInt(workshop.citPrice.replace('₹', ''));
              } else if (workshop.price) {
                total += parseInt(workshop.price.replace('₹', ''));
              }
            }
          });
        }
      }
      return total;
    }
    
    // Otherwise, charge for individual events and workshops
    // Add tech events cost
    formData.selectedEvents.forEach((selectedEvent) => {
      const event = techEvents.find((e) => e.id === selectedEvent.id);
      if (event) {
        if (isCit && event.citPrice) {
          total += parseInt(event.citPrice.replace('₹', ''));
        } else if (event.price) {
          total += parseInt(event.price.replace('₹', ''));
        }
      }
    });
    
    // Add workshops cost
    formData.selectedWorkshops.forEach((selectedWorkshop) => {
      const workshop = workshops.find((w) => w.id === selectedWorkshop.id);
      if (workshop) {
        if (isCit && workshop.citPrice) {
          total += parseInt(workshop.citPrice.replace('₹', ''));
        } else if (workshop.price) {
          total += parseInt(workshop.price.replace('₹', ''));
        }
      }
    });
    
    return total;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">
          Loading events and workshops...
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEventSelection = (
    eventId: number,
    type: "event" | "workshop" | "non-tech"
  ) => {
    setFormData((prev) => {
      if (type === "event") {
        const event = techEvents.find((e) => e.id === eventId);
        if (!event) return prev;

        const isSelected = prev.selectedEvents.some(
          (item) => item.id === eventId
        );
        return {
          ...prev,
          selectedEvents: isSelected
            ? prev.selectedEvents.filter((item) => item.id !== eventId)
            : [...prev.selectedEvents, { id: event.id, title: event.title }],
        };
      } else if (type === "workshop") {
        const workshop = workshops.find((w) => w.id === eventId);
        if (!workshop) return prev;

        const isSelected = prev.selectedWorkshops.some(
          (item) => item.id === eventId
        );
        return {
          ...prev,
          selectedWorkshops: isSelected
            ? prev.selectedWorkshops.filter((item) => item.id !== eventId)
            : [
                ...prev.selectedWorkshops,
                { id: workshop.id, title: workshop.title },
              ],
        };
      } else {
        const event = nonTechEvents.find((e) => e.id === eventId);
        if (!event) return prev;

        const isSelected = prev.selectedNonTechEvents.some(
          (item) => item.id === eventId
        );
        return {
          ...prev,
          selectedNonTechEvents: isSelected
            ? prev.selectedNonTechEvents.filter((item) => item.id !== eventId)
            : [
                ...prev.selectedNonTechEvents,
                { id: event.id, title: event.title },
              ],
        };
      }
    });
  };

  const handlePassSelection = (passId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedPass: prev.selectedPass === passId ? undefined : passId,
      // If selecting a pass, clear individual workshop selections
      // but keep events since pass allows unlimited events
      selectedWorkshops: prev.selectedPass === passId ? prev.selectedWorkshops : [],
    }));
  };

  const handleTeamMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const updatedMembers = [...(formData.teamMembers || [])];
    if (!updatedMembers[index]) {
      updatedMembers[index] = {
        name: "",
        department: "",
        year: "",
        email: "",
        whatsapp: "",
      };
    }
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData((prev) => ({ ...prev, teamMembers: updatedMembers }));
  };

  const addTeamMember = () => {
    const currentTeamSize = formData.teamSize || 1;
    const maxAllowedSize = teamRequirements.maxTeamSize;

    if (currentTeamSize >= maxAllowedSize) {
      toast.error(
        `Maximum team size for selected events is ${maxAllowedSize} members.`,
        { duration: 4000 }
      );
      return;
    }

    const newMember: TeamMember = {
      name: "",
      department: "",
      year: "",
      email: "",
      whatsapp: "",
    };
    setFormData((prev) => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), newMember],
      teamSize: (prev.teamSize || 1) + 1,
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: (prev.teamMembers || []).filter((_, i) => i !== index),
      teamSize: Math.max(1, (prev.teamSize || 1) - 1),
    }));
  };



  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validations
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.whatsapp.trim())
      newErrors.whatsapp = "WhatsApp number is required";
    else if (!validatePhone(formData.whatsapp))
      newErrors.whatsapp = "Invalid phone number format";
    if (!formData.college.trim())
      newErrors.college = "College name is required";
    if (!formData.year) newErrors.year = "Year of study is required";

    // Team member validation
    if (formData.isTeamEvent && formData.teamMembers) {
      // Check team size limit
      const currentTeamSize = formData.teamSize || 1;
      if (currentTeamSize > teamRequirements.maxTeamSize) {
        newErrors.teamSize = `Team size cannot exceed ${teamRequirements.maxTeamSize} members for selected events`;
      }

      formData.teamMembers.forEach((member, index) => {
        if (!member.name.trim())
          newErrors[`team_${index}_name`] = `Team member ${
            index + 2
          } name is required`;
        if (!member.email.trim())
          newErrors[`team_${index}_email`] = `Team member ${
            index + 2
          } email is required`;
        else if (!validateEmail(member.email))
          newErrors[`team_${index}_email`] = `Invalid email for team member ${
            index + 2
          }`;
      });
    }

    // Consent validation
    if (!formData.hasConsented) {
      newErrors.consent = "You must agree to the terms and conditions";
    }

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

    if (!razorpayLoaded) {
      toast.error("Payment system is loading. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get authentication token
      const token = await getAuthToken();
      if (!token) {
        toast.error("Authentication required. Please sign in again.");
        setIsSubmitting(false);
        return;
      }

      // Check for duplicates first
      setIsCheckingDuplicates(true);
      const duplicateCheck = await registrationApi.checkDuplicate(
        formData.email,
        formData.whatsapp,
        token
      );

      setIsCheckingDuplicates(false);

      if (duplicateCheck.exists) {
        toast.error(
          `Registration already exists with the same ${duplicateCheck.duplicateFields.join(
            ", "
          )}. Please use different details or contact support.`,
          { duration: 6000 }
        );
        setIsSubmitting(false);
        return;
      }

      // Check if payment is required
      const totalAmount = calculateTotalAmount();
      
      if (totalAmount === 0) {
        // No payment required, directly register
        try {
          const registrationResponse = await registrationApi.submit(formData, token);
          
          if (registrationResponse.success) {
            setSuccessData({
              registrationId: registrationResponse.data.registrationId,
              formData: { ...formData },
              submissionDate: new Date().toLocaleString(),
            });
            
            const eventCount =
              formData.selectedEvents.length +
              formData.selectedWorkshops.length +
              formData.selectedNonTechEvents.length;

            toast.success(
              `Registration completed successfully! Registration ID: ${registrationResponse.data.registrationId}. Events registered: ${eventCount}. No payment required.`,
              { duration: 8000 }
            );
          } else {
            toast.error(registrationResponse.message || "Registration failed");
          }
        } catch (error) {
          console.error("Registration error:", error);
          toast.error("Registration failed. Please try again or contact support.");
        } finally {
          setIsSubmitting(false);
        }
        return;
      }

      // Payment required - show warnings first
      if (!paymentWarnings) {
        toast.error("Loading payment instructions. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setShowWarningModal(true);
      setIsSubmitting(false); // Reset submitting state, will be set again when proceeding with payment
    } catch (error) {
      console.error("Registration preparation error:", error);
      toast.error("Failed to prepare registration. Please try again.");
      setIsSubmitting(false);
      setIsCheckingDuplicates(false);
    }
  };

  // Handle payment after warnings are accepted
  const handleProceedWithPayment = async () => {
    setShowWarningModal(false);
    setIsSubmitting(true);
    setPaymentInProgress(true);

    try {
      // Get authentication token
      const token = await getAuthToken();
      if (!token) {
        toast.error("Authentication required. Please sign in again.");
        setIsSubmitting(false);
        setPaymentInProgress(false);
        return;
      }

      setPaymentLoading(true);
      
      // Create payment order with dynamic pricing calculation
      const orderResponse = await paymentApi.createOrder(
        token,
        formData
      );

      if (!orderResponse.success || !orderResponse.data) {
        toast.error("Failed to create payment order");
        setPaymentLoading(false);
        setIsSubmitting(false);
        return;
      }

      const order: PaymentOrder = orderResponse.data;

      // Razorpay options
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Tech Fiesta 2025",
        description: "Registration Fee",
        order_id: order.orderId,
        handler: async (response: PaymentResponse) => {
          try {
            // Verify payment
            const verifyResponse = await paymentApi.verifyPayment(
              response,
              token,
              formData
            );

            if (verifyResponse.success) {
              setSuccessData({
                registrationId: verifyResponse.data.registrationId,
                formData: { ...formData },
                submissionDate: new Date().toLocaleString(),
              });
              
              const eventCount =
                formData.selectedEvents.length +
                formData.selectedWorkshops.length +
                formData.selectedNonTechEvents.length;

              toast.success(
                `Payment successful! Registration completed. Registration ID: ${verifyResponse.data.registrationId}. Events registered: ${eventCount}. Amount paid: ₹${verifyResponse.data.amount}`,
                { duration: 8000 }
              );
            } else {
              toast.error(verifyResponse.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support with your payment details.");
          } finally {
            setPaymentLoading(false);
            setIsSubmitting(false);
            setPaymentInProgress(false);
            // Clear any polling when payment completes
            if ((window as any).paymentPollingInterval) {
              clearInterval((window as any).paymentPollingInterval);
              (window as any).paymentPollingInterval = null;
            }
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            setPaymentLoading(false);
            setIsSubmitting(false);
            setPaymentInProgress(false);
            // Clear polling when modal is dismissed
            if ((window as any).paymentPollingInterval) {
              clearInterval((window as any).paymentPollingInterval);
              (window as any).paymentPollingInterval = null;
            }
          },
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.whatsapp,
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Open Razorpay checkout
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      setPaymentLoading(false);

      // Start polling for QR code payments (desktop users who scan with mobile)
      // This handles the case where desktop shows QR code but payment happens on mobile
      const pollInterval = setInterval(async () => {
        try {
          // Check if payment was completed for this order
          const statusResponse = await paymentApi.getPaymentStatus(order.orderId, token);
          
          if (statusResponse.success && statusResponse.data.status === 'completed') {
            // Payment completed via QR scan! Close modal and simulate success
            clearInterval(pollInterval);
            (window as any).paymentPollingInterval = null;
            
            // Close Razorpay modal if still open
            rzp.close();
            
            // Simulate the handler response for QR payments
            // We don't have the actual payment response, so we'll verify using order ID
            toast.success("Payment detected! Verifying...", { duration: 3000 });
            
            // Create a mock response for verification
            const mockResponse = {
              razorpay_order_id: order.orderId,
              razorpay_payment_id: statusResponse.data.registrationId || 'qr_payment_detected',
              razorpay_signature: 'qr_scan_detected' // We'll handle this in backend
            };
            
            // Use the same verification logic
            const verifyResponse = await paymentApi.verifyPayment(
              mockResponse as any,
              token,
              formData
            );

            if (verifyResponse.success) {
              setSuccessData({
                registrationId: verifyResponse.data.registrationId,
                formData: { ...formData },
                submissionDate: new Date().toLocaleString(),
              });
              
              const eventCount =
                formData.selectedEvents.length +
                formData.selectedWorkshops.length +
                formData.selectedNonTechEvents.length;

              toast.success(
                `QR Payment successful! Registration completed. Registration ID: ${verifyResponse.data.registrationId}. Events registered: ${eventCount}. Amount paid: ₹${verifyResponse.data.amount}`,
                { duration: 8000 }
              );
              
              setPaymentLoading(false);
              setIsSubmitting(false);
              setPaymentInProgress(false);
            }
          }
        } catch (error) {
          // Silent fail for polling - don't spam user with errors
          console.log("Payment status polling:", error);
        }
      }, 3000); // Check every 3 seconds

      // Store interval reference globally for cleanup
      (window as any).paymentPollingInterval = pollInterval;

      // Clear polling after 10 minutes (600 seconds) to prevent infinite polling
      setTimeout(() => {
        if ((window as any).paymentPollingInterval) {
          clearInterval((window as any).paymentPollingInterval);
          (window as any).paymentPollingInterval = null;
          console.log("Payment polling timeout - stopped checking");
        }
      }, 600000);

    } catch (error) {
      console.error("Registration submission error:", error);
      toast.error("Registration failed. Please try again or contact support.");
      setPaymentLoading(false);
      setIsSubmitting(false);
      setPaymentInProgress(false);
      setIsCheckingDuplicates(false);
    }
  };

  // Download functions
  const handleDownloadPDF = () => {
    if (!successData) return;

    const downloadData: RegistrationDownloadData = {
      ...successData.formData,
      registrationId: successData.registrationId,
      submissionDate: successData.submissionDate,
    };

    downloadRegistrationPDF(downloadData);
    toast.success("Registration PDF downloaded successfully!", {
      duration: 3000,
    });
  };

  const handleDownloadText = () => {
    if (!successData) return;

    const downloadData: RegistrationDownloadData = {
      ...successData.formData,
      registrationId: successData.registrationId,
      submissionDate: successData.submissionDate,
    };

    downloadRegistrationText(downloadData);
    toast.success("Registration text file downloaded successfully!", {
      duration: 3000,
    });
  };

  const handleDownloadJSON = () => {
    if (!successData) return;

    const downloadData: RegistrationDownloadData = {
      ...successData.formData,
      registrationId: successData.registrationId,
      submissionDate: successData.submissionDate,
    };

    downloadRegistrationJSON(downloadData);
    toast.success("Registration JSON file downloaded successfully!", {
      duration: 3000,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      department: "",
      email: "",
      whatsapp: "",
      college: "",
      year: "",
      isTeamEvent: false,
      teamSize: 1,
      teamMembers: [],
      selectedEvents: [],
      selectedWorkshops: [],
      selectedNonTechEvents: [],
      transactionIds: {},
      hasConsented: false,
    });
    setErrors({});
    setSuccessData(null);
    toast.success("Form reset! You can now submit a new registration.", {
      duration: 3000,
    });
  };

  return (
    <>
      {/* Add the same fixed clock background as other pages */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <MinimalClockCollection mainClockSize={420} smallClockCount={5} />
        <div className="absolute inset-0 bg-black/60"></div>{" "}
        {/* Overlay for better readability */}
      </div>

      <div className="relative z-10 min-h-screen py-6 sm:py-12 px-4 overflow-x-hidden">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex flex-col mb-4 gap-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
                Tech Fiesta 2025 Registration
              </h1>
              <div className="flex flex-col items-center gap-2">
                <div className="text-center sm:text-right">
                  <p className="text-white text-xs sm:text-sm">
                    Welcome, {user?.displayName || user?.email}
                  </p>
                  {isCit && (
                    <p className="text-green-400 text-xs font-medium">
                      CIT Student - Special Pricing Applied!
                    </p>
                  )}
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm whitespace-nowrap"
                >
                  <LogOut size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </button>
              </div>
            </div>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
              Register for exciting events and workshops! Entry is{" "}
              <span className="text-green-400 font-semibold">FREE</span> - pay
              only for the events you choose.
              {isCit && (
                <span className="block mt-2 text-green-400 font-semibold">
                  🎉 CIT Student Special: Enjoy discounted pricing on all events
                  and workshops!
                </span>
              )}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl w-full overflow-hidden">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 sm:space-y-8 w-full"
            >
              {/* Personal Information */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full overflow-hidden transition-all duration-300">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="break-words">Personal Information</span>
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 ${
                        errors.name ? "border-red-400" : "border-white/30"
                      }`}
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Computer Science, Electronics, etc."
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 ${
                        errors.department ? "border-red-400" : "border-white/30"
                      }`}
                      value={formData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                    />
                    {errors.department && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 ${
                        errors.email ? "border-red-400" : "border-white/30"
                      }`}
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210 or 9876543210"
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 ${
                        errors.whatsapp ? "border-red-400" : "border-white/30"
                      }`}
                      value={formData.whatsapp}
                      onChange={(e) =>
                        handleInputChange("whatsapp", e.target.value)
                      }
                    />
                    {errors.whatsapp && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.whatsapp}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      College Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your college/university name"
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 ${
                        errors.college ? "border-red-400" : "border-white/30"
                      }`}
                      value={formData.college}
                      onChange={(e) =>
                        handleInputChange("college", e.target.value)
                      }
                    />
                    {errors.college && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.college}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Year of Study *
                    </label>
                    <select
                      required
                      className={`w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm border rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 ${
                        errors.year ? "border-red-400" : "border-white/30"
                      }`}
                      value={formData.year}
                      onChange={(e) =>
                        handleInputChange("year", e.target.value)
                      }
                    >
                      <option value="" className="text-black">
                        Select Year
                      </option>
                      <option value="1st" className="text-black">
                        1st Year
                      </option>
                      <option value="2nd" className="text-black">
                        2nd Year
                      </option>
                      <option value="3rd" className="text-black">
                        3rd Year
                      </option>
                      <option value="4th" className="text-black">
                        4th Year
                      </option>
                      <option value="Postgraduate" className="text-black">
                        Postgraduate
                      </option>
                    </select>
                    {errors.year && (
                      <p className="text-red-400 text-sm mt-1">{errors.year}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Selection */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full overflow-hidden transition-all duration-300">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex flex-wrap items-center gap-2">
                  <span className="break-words">Select Events & Workshops</span>
                  <span className="text-xs sm:text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded-full whitespace-nowrap">
                    Entry FREE
                  </span>
                </h3>
                {errors.events && (
                  <p className="text-red-400 text-sm mb-4">{errors.events}</p>
                )}

                {/* Technical Events */}
                <div className="space-y-4 w-full">
                  <h4 className={`text-lg font-semibold mb-4 flex flex-wrap items-center gap-2 ${
                    formData.selectedPass && !passLimitsInfo?.techEventSelectionEnabled ? 'text-gray-500' : 'text-blue-400'
                  }`}>
                    <span className="break-words">Technical Events</span>
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                      formData.selectedPass && !passLimitsInfo?.techEventSelectionEnabled
                        ? 'bg-gray-500/20 text-gray-400' 
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {formData.selectedPass && !passLimitsInfo?.techEventSelectionEnabled
                        ? 'Unlimited Access with Pass' 
                        : formData.selectedPass && passLimitsInfo?.techEventSelectionEnabled
                        ? `${passLimitsInfo.techEventsIncluded} included + ${passLimitsInfo.maxAdditionalTechEvents} additional`
                        : (isCit ? "₹59 each (CIT Special)" : "₹99 each")
                      }
                    </span>
                  </h4>
                  
                  {formData.selectedPass && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                      <p className="text-blue-300 text-sm">
                        {passLimitsInfo?.techEventSelectionEnabled ? (
                          <>
                            <strong>🎫 Pass Active:</strong> Select up to {(passLimitsInfo.techEventsIncluded || 0) + (passLimitsInfo.maxAdditionalTechEvents || 0)} technical events!
                            ({passLimitsInfo.techEventsIncluded || 0} included + {passLimitsInfo.maxAdditionalTechEvents || 0} additional)
                            {formData.selectedEvents.length > 0 && (
                              <span className="block text-blue-300 text-xs mt-1">
                                Selected: {formData.selectedEvents.length}/{(passLimitsInfo.techEventsIncluded || 0) + (passLimitsInfo.maxAdditionalTechEvents || 0)} events
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <strong>🎫 Pass Active:</strong> You have unlimited access to ALL technical events! 
                            No need to select individual events.
                          </>
                        )}
                      </p>
                    </div>
                  )}
                  
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 w-full ${
                    formData.selectedPass && !passLimitsInfo?.techEventSelectionEnabled ? 'opacity-50 pointer-events-none' : ''
                  }`}>
                    {techEvents.map((event, index) => {
                      const isSelected = formData.selectedEvents.some(item => item.id === event.id);
                      const maxEvents = (passLimitsInfo?.techEventsIncluded || 0) + (passLimitsInfo?.maxAdditionalTechEvents || 0);
                      const isDisabled = Boolean(formData.selectedPass && passLimitsInfo?.techEventSelectionEnabled && 
                        !isSelected && 
                        formData.selectedEvents.length >= maxEvents);
                      const isPassDisabled = Boolean(formData.selectedPass && !passLimitsInfo?.techEventSelectionEnabled);
                      
                      return (
                        <label
                          key={event.id}
                          className={`group relative flex items-start space-x-3 p-4 backdrop-blur-md rounded-xl border transition-all duration-300 w-full overflow-hidden ${
                            isDisabled || isPassDisabled
                              ? 'bg-gray-800/20 border-gray-600/30 cursor-not-allowed opacity-50'
                              : isSelected
                              ? 'bg-blue-500/20 border-blue-400/50 cursor-pointer'
                              : 'bg-white/10 border-white/20 hover:bg-white/15 cursor-pointer hover:scale-[1.02]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={isDisabled || isPassDisabled}
                            checked={isSelected}
                            onChange={() =>
                              handleEventSelection(event.id, "event")
                            }
                            className="w-5 h-5 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500 flex-shrink-0 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-white font-medium group-hover:text-blue-300 transition-colors break-words">
                                {event.title}
                              </span>
                              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded whitespace-nowrap">
                                {formData.selectedPass 
                                  ? (() => {
                                      if (!passLimitsInfo?.techEventSelectionEnabled) {
                                        return "Unlimited Access";
                                      }
                                      const selectedIndex = formData.selectedEvents.findIndex(e => e.id === event.id);
                                      if (selectedIndex === -1) {
                                        // Not selected, show normal price
                                        return getPrice(event);
                                      }
                                      // Selected, check if it's within included count
                                      return selectedIndex < passLimitsInfo.techEventsIncluded ? "Included in Pass" : getPrice(event);
                                    })()
                                  : getPrice(event)
                                }
                              </span>
                              {event.maxTeamSize && (
                                <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded whitespace-nowrap">
                                  Team: max {event.maxTeamSize}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm flex flex-wrap items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="break-words">{event.venue}</span>
                              <span className="text-gray-500">•</span>
                              <span className="break-words">{event.time}</span>
                            </p>
                            <p className="text-gray-300 text-sm mt-1 break-words">
                              {event.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Workshops */}
                <div className="space-y-4 w-full">
                  <h4 className={`text-lg font-semibold my-4 flex flex-wrap items-center gap-2 ${
                    formData.selectedPass ? 'text-gray-500' : 'text-green-400'
                  }`}>
                    <span className="break-words">Workshops</span>
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                      formData.selectedPass 
                        ? 'bg-gray-500/20 text-gray-400' 
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {formData.selectedPass 
                        ? 'Included in Pass' 
                        : (isCit ? "₹100 each (CIT Special)" : "₹100 each")
                      }
                    </span>
                  </h4>
                  
                  {formData.selectedPass && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
                      <p className="text-green-300 text-sm">
                        <strong>🎫 Pass Active:</strong> Select up to {(passLimitsInfo?.workshopsIncluded || 1) + (passLimitsInfo?.maxAdditionalWorkshops || 4)} workshops! 
                        ({passLimitsInfo?.workshopsIncluded || 1} included + {passLimitsInfo?.maxAdditionalWorkshops || 4} additional)
                      </p>
                      {formData.selectedWorkshops.length > 0 && (
                        <p className="text-blue-300 text-xs mt-1">
                          Selected: {formData.selectedWorkshops.length}/{(passLimitsInfo?.workshopsIncluded || 1) + (passLimitsInfo?.maxAdditionalWorkshops || 4)} workshops
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                    {workshops.map((workshop, index) => {
                      const isSelected = formData.selectedWorkshops.some(item => item.id === workshop.id);
                      const maxWorkshops = (passLimitsInfo?.workshopsIncluded || 1) + (passLimitsInfo?.maxAdditionalWorkshops || 4);
                      const isDisabled = Boolean(formData.selectedPass && 
                        !isSelected && 
                        formData.selectedWorkshops.length >= maxWorkshops);
                      
                      return (
                        <label
                          key={workshop.id}
                          className={`group relative flex items-start space-x-3 p-4 backdrop-blur-md rounded-xl border transition-all duration-300 w-full overflow-hidden ${
                            isDisabled
                              ? 'bg-gray-800/20 border-gray-600/30 cursor-not-allowed opacity-50'
                              : isSelected
                              ? 'bg-green-500/20 border-green-400/50 cursor-pointer'
                              : 'bg-white/10 border-white/20 hover:bg-white/15 cursor-pointer hover:scale-[1.02]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={isDisabled}
                            checked={isSelected}
                            onChange={() =>
                              handleEventSelection(workshop.id, "workshop")
                            }
                            className="w-5 h-5 text-green-600 bg-white/10 border-white/30 rounded focus:ring-green-500 flex-shrink-0 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-white font-medium group-hover:text-green-300 transition-colors break-words">
                                {workshop.title}
                              </span>
                              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded whitespace-nowrap">
                                {formData.selectedPass 
                                  ? (() => {
                                      const selectedIndex = formData.selectedWorkshops.findIndex(w => w.id === workshop.id);
                                      if (selectedIndex === -1) {
                                        // Not selected, show normal price
                                        return getPrice(workshop);
                                      }
                                      // Selected, check if it's within included count
                                      return selectedIndex < (passLimitsInfo?.workshopsIncluded || 1) ? "Included in Pass" : getPrice(workshop);
                                    })()
                                  : getPrice(workshop)
                                }
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm flex flex-wrap items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="break-words">
                                {workshop.venue}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="break-words">{workshop.time}</span>
                            </p>
                            <p className="text-gray-300 text-sm mt-1 break-words">
                              {workshop.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Non-Tech Events */}
                <div className="space-y-4 w-full">
                  <h4 className={`text-lg font-semibold my-4 flex flex-wrap items-center gap-2 ${
                    formData.selectedPass && !passLimitsInfo?.nonTechEventSelectionEnabled ? 'text-gray-500' : 'text-purple-400'
                  }`}>
                    <span className="break-words">Non-Technical Events</span>
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                      formData.selectedPass && !passLimitsInfo?.nonTechEventSelectionEnabled
                        ? 'bg-gray-500/20 text-gray-400' 
                        : formData.selectedPass && passLimitsInfo?.nonTechEventSelectionEnabled
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {formData.selectedPass && !passLimitsInfo?.nonTechEventSelectionEnabled
                        ? 'Pay on Arrival' 
                        : formData.selectedPass && passLimitsInfo?.nonTechEventSelectionEnabled
                        ? `${passLimitsInfo.nonTechEventsIncluded} included + ${passLimitsInfo.maxAdditionalNonTechEvents} additional`
                        : 'Payment on arrival'
                      }
                    </span>
                  </h4>
                  
                  {formData.selectedPass && passLimitsInfo?.nonTechEventSelectionEnabled && (
                    <div className="mb-4 p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg">
                      <p className="text-purple-300 text-sm">
                        <strong>🎫 Pass Active:</strong> Select up to {(passLimitsInfo.nonTechEventsIncluded || 0) + (passLimitsInfo.maxAdditionalNonTechEvents || 0)} non-technical events!
                        ({passLimitsInfo.nonTechEventsIncluded || 0} included + {passLimitsInfo.maxAdditionalNonTechEvents || 0} additional)
                        {formData.selectedNonTechEvents.length > 0 && (
                          <span className="block text-purple-300 text-xs mt-1">
                            Selected: {formData.selectedNonTechEvents.length}/{(passLimitsInfo.nonTechEventsIncluded || 0) + (passLimitsInfo.maxAdditionalNonTechEvents || 0)} events
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 w-full ${
                    formData.selectedPass && !passLimitsInfo?.nonTechEventSelectionEnabled ? 'opacity-50 pointer-events-none' : ''
                  }`}>
                    {nonTechEvents.map((event, index) => {
                      const isSelected = formData.selectedNonTechEvents.some(item => item.id === event.id);
                      const maxEvents = (passLimitsInfo?.nonTechEventsIncluded || 0) + (passLimitsInfo?.maxAdditionalNonTechEvents || 0);
                      const isDisabled = Boolean(formData.selectedPass && passLimitsInfo?.nonTechEventSelectionEnabled && 
                        !isSelected && 
                        formData.selectedNonTechEvents.length >= maxEvents);
                      const isPassDisabled = Boolean(formData.selectedPass && !passLimitsInfo?.nonTechEventSelectionEnabled);
                      
                      return (
                        <label
                          key={event.id}
                          className={`group relative flex items-start space-x-3 p-4 backdrop-blur-md rounded-xl border transition-all duration-300 w-full overflow-hidden ${
                            isDisabled || isPassDisabled
                              ? 'bg-gray-800/20 border-gray-600/30 cursor-not-allowed opacity-50'
                              : isSelected
                              ? 'bg-purple-500/20 border-purple-400/50 cursor-pointer'
                              : 'bg-white/10 border-white/20 hover:bg-white/15 cursor-pointer hover:scale-[1.02]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={isDisabled || isPassDisabled}
                            checked={isSelected}
                            onChange={() =>
                              handleEventSelection(event.id, "non-tech")
                            }
                            className="w-5 h-5 text-purple-600 bg-white/10 border-white/30 rounded focus:ring-purple-500 flex-shrink-0 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-white font-medium group-hover:text-purple-300 transition-colors block break-words">
                              {event.title}
                            </span>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-gray-400 text-sm flex flex-wrap items-center gap-1">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="break-words">{event.venue}</span>
                              </p>
                              <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded whitespace-nowrap">
                                {formData.selectedPass 
                                  ? (() => {
                                      if (!passLimitsInfo?.nonTechEventSelectionEnabled) {
                                        return "Pay on Arrival";
                                      }
                                      const selectedIndex = formData.selectedNonTechEvents.findIndex(e => e.id === event.id);
                                      if (selectedIndex === -1) {
                                        // Not selected, show normal behavior
                                        return "Pay on Arrival";
                                      }
                                      // Selected, check if it's within included count
                                      return selectedIndex < (passLimitsInfo.nonTechEventsIncluded || 0) ? "Included in Pass" : "Pay on Arrival";
                                    })()
                                  : "Pay on arrival"
                                }
                              </span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* General Pass Section */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full overflow-hidden transition-all duration-300">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex flex-wrap items-center gap-2">
                  <span className="break-words">🎫 General Pass</span>
                  <span className="text-xs sm:text-sm bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full whitespace-nowrap">
                    Best Value!
                  </span>
                </h3>
                
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    <strong>💡 Smart Choice:</strong> Get unlimited access to ALL technical events + choose any ONE workshop! 
                    Perfect for maximum flexibility and savings.
                  </p>
                </div>

                <div className="space-y-4 w-full">
                  {passes.map((pass) => (
                    <label
                      key={pass.id}
                      className={`group relative flex items-start space-x-3 p-4 sm:p-6 backdrop-blur-md rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full overflow-hidden ${
                        formData.selectedPass === pass.id
                          ? 'bg-yellow-500/20 border-yellow-400/70 shadow-lg shadow-yellow-400/20'
                          : 'bg-white/10 border-white/20 hover:bg-white/15'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={formData.selectedPass === pass.id}
                        onChange={() => handlePassSelection(pass.id)}
                        className="w-5 h-5 text-yellow-600 bg-white/10 border-white/30 rounded focus:ring-yellow-500 flex-shrink-0 mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-white font-bold text-lg group-hover:text-yellow-300 transition-colors break-words">
                            {pass.title}
                          </span>
                          <div className="flex gap-2">
                            <span className="text-sm bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded whitespace-nowrap">
                              {isCit ? pass.citPrice : pass.price}
                            </span>
                            {isCit && (
                              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded whitespace-nowrap">
                                CIT Special
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3 break-words">
                          {pass.description}
                        </p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-white font-medium mb-2">✨ What's Included:</h5>
                            <ul className="text-sm text-gray-300 space-y-1">
                              {pass.includes.slice(0, 3).map((item, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <span className="text-yellow-400 flex-shrink-0">•</span>
                                  <span className="break-words">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-white font-medium mb-2">🎯 Key Benefits:</h5>
                            <ul className="text-sm text-gray-300 space-y-1">
                              {pass.benefits.slice(0, 3).map((benefit, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <span className="text-green-400 flex-shrink-0">✓</span>
                                  <span className="break-words">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {formData.selectedPass === pass.id && (
                          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                            <p className="text-yellow-300 text-sm font-medium">
                              🎉 Pass Selected! You can now participate in unlimited technical events. 
                              Workshop selection will be available on event day.
                            </p>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                
                {formData.selectedPass && (
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 text-xl">ℹ️</span>
                      <div>
                        <h5 className="text-blue-300 font-medium mb-1">Important Notes:</h5>
                        <ul className="text-blue-200 text-sm space-y-1">
                          <li>• You can still select technical events below (all included in your pass)</li>
                          <li>• Workshop selection disabled - choose any workshop on event day</li>
                          <li>• Non-technical events can be added separately</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Team Details */}
              {formData.isTeamEvent && (
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full overflow-hidden transition-all duration-300">
                  <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      Team Details
                    </h3>
                    <div className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                      Max team size: {teamRequirements.maxTeamSize} members
                    </div>
                  </div>
                  <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      <strong>Team Required:</strong> The selected events
                      require team participation. Please add your team members
                      below (including yourself, max{" "}
                      {teamRequirements.maxTeamSize} total).
                    </p>
                  </div>
                  <div className="space-y-4">
                    {(formData.teamMembers || []).map((member, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 w-full overflow-hidden"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-white font-medium">
                            Team Member {index + 2}
                          </h4>
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
                            onChange={(e) =>
                              handleTeamMemberChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="text"
                            placeholder="Department"
                            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                            value={member.department}
                            onChange={(e) =>
                              handleTeamMemberChange(
                                index,
                                "department",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                            value={member.email}
                            onChange={(e) =>
                              handleTeamMemberChange(
                                index,
                                "email",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="tel"
                            placeholder="WhatsApp"
                            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                            value={member.whatsapp}
                            onChange={(e) =>
                              handleTeamMemberChange(
                                index,
                                "whatsapp",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addTeamMember}
                      disabled={
                        (formData.teamSize || 1) >= teamRequirements.maxTeamSize
                      }
                      className={`w-full py-3 backdrop-blur-sm border rounded-lg transition-all duration-300 ${
                        (formData.teamSize || 1) >= teamRequirements.maxTeamSize
                          ? "bg-gray-600/20 border-gray-500/50 text-gray-400 cursor-not-allowed"
                          : "bg-white/10 border-blue-400/50 text-blue-400 hover:bg-white/15 hover:border-blue-400"
                      }`}
                    >
                      {(formData.teamSize || 1) >= teamRequirements.maxTeamSize
                        ? `Team limit reached (${teamRequirements.maxTeamSize} max)`
                        : "+ Add Team Member"}
                    </button>
                  </div>
                </div>
              )}

              {/* Registration Summary */}
              {(formData.selectedEvents.length > 0 ||
                formData.selectedWorkshops.length > 0 ||
                formData.selectedNonTechEvents.length > 0) && (
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full overflow-hidden transition-all duration-300">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <span className="break-words">Registration Summary</span>
                  </h3>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                    {/* Tech Events */}
                    {formData.selectedEvents.length > 0 && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30 hover:bg-white/15 transition-all duration-300">
                        <h4 className="font-semibold text-blue-400 mb-3">
                          Technical Events ({formData.selectedEvents.length})
                        </h4>
                        <ul className="space-y-2">
                          {formData.selectedEvents.map((selectedEvent, index) => {
                            const event = techEvents.find(
                              (e) => e.id === selectedEvent.id
                            );
                            return event ? (
                              <li
                                key={selectedEvent.id}
                                className="text-sm text-white break-words"
                              >
                                • {selectedEvent.title}{" "}
                                <span className="text-green-300">
                                  ({getTechEventPrice(event, index)})
                                </span>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Workshops */}
                    {formData.selectedWorkshops.length > 0 && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-green-400/30 hover:bg-white/15 transition-all duration-300">
                        <h4 className="font-semibold text-green-400 mb-3">
                          Workshops ({formData.selectedWorkshops.length})
                        </h4>
                        <ul className="space-y-2">
                          {formData.selectedWorkshops.map(
                            (selectedWorkshop, index) => {
                              const workshop = workshops.find(
                                (w) => w.id === selectedWorkshop.id
                              );
                              return workshop ? (
                                <li
                                  key={selectedWorkshop.id}
                                  className="text-sm text-white break-words"
                                >
                                  • {selectedWorkshop.title}{" "}
                                  <span className="text-green-300">
                                    ({getWorkshopPrice(workshop, index)})
                                  </span>
                                </li>
                              ) : null;
                            }
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Non-Tech Events */}
                    {formData.selectedNonTechEvents.length > 0 && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30 hover:bg-white/15 transition-all duration-300">
                        <h4 className="font-semibold text-purple-400 mb-3">
                          Non-Tech Events (
                          {formData.selectedNonTechEvents.length})
                        </h4>
                        <ul className="space-y-2">
                          {formData.selectedNonTechEvents.map(
                            (selectedEvent, index) => {
                              const event = nonTechEvents.find(
                                (e) => e.id === selectedEvent.id
                              );
                              return event ? (
                                <li
                                  key={selectedEvent.id}
                                  className="text-sm text-white break-words"
                                >
                                  • {selectedEvent.title}{" "}
                                  <span className="text-yellow-300">
                                    ({getNonTechEventPrice(event, index)})
                                  </span>
                                </li>
                              ) : null;
                            }
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Section */}
              {calculateTotalAmount() > 0 && (
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full overflow-hidden transition-all duration-300">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-yellow-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="break-words">Payment Summary</span>
                  </h3>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/20 mb-4">
                    <div className="space-y-3">
                      {/* Pass-based billing */}
                      {formData.selectedPass && passLimitsInfo ? (
                        <>
                          {/* Pass cost */}
                          {(() => {
                            const selectedPass = passes.find(p => p.id === formData.selectedPass);
                            if (!selectedPass) return null;
                            const passPrice = isCit ? selectedPass.citPrice : selectedPass.price;
                            return (
                              <div className="flex justify-between items-center text-white">
                                <span className="text-sm font-medium">{selectedPass.title}</span>
                                <span className="font-medium text-yellow-400">{passPrice}</span>
                              </div>
                            );
                          })()}
                          
                          {/* Additional tech events beyond included count (if enabled) */}
                          {passLimitsInfo.techEventSelectionEnabled && 
                           formData.selectedEvents.slice(passLimitsInfo.techEventsIncluded).map((selectedEvent, index) => {
                            const event = techEvents.find((e) => e.id === selectedEvent.id);
                            if (!event) return null;
                            const price = getPrice(event);
                            return (
                              <div key={`additional-event-${event.id}`} className="flex justify-between items-center text-white">
                                <span className="text-sm">{event.title} (Additional)</span>
                                <span className="font-medium text-blue-400">{price}</span>
                              </div>
                            );
                          })}
                          
                          {/* Additional non-tech events beyond included count (if enabled) */}
                          {passLimitsInfo.nonTechEventSelectionEnabled && 
                           formData.selectedNonTechEvents.slice(passLimitsInfo.nonTechEventsIncluded).map((selectedEvent, index) => {
                            const event = nonTechEvents.find((e) => e.id === selectedEvent.id);
                            if (!event) return null;
                            return (
                              <div key={`additional-nontech-${event.id}`} className="flex justify-between items-center text-white">
                                <span className="text-sm">{event.title} (Additional)</span>
                                <span className="font-medium text-purple-400">Pay on Arrival</span>
                              </div>
                            );
                          })}
                          
                          {/* Additional workshops beyond included count */}
                          {formData.selectedWorkshops.slice(passLimitsInfo.workshopsIncluded).map((selectedWorkshop, index) => {
                            const workshop = workshops.find((w) => w.id === selectedWorkshop.id);
                            if (!workshop) return null;
                            const price = getPrice(workshop);
                            return (
                              <div key={`additional-workshop-${workshop.id}`} className="flex justify-between items-center text-white">
                                <span className="text-sm">{workshop.title} (Additional)</span>
                                <span className="font-medium text-green-400">{price}</span>
                              </div>
                            );
                          })}
                          
                          {/* Show included items for clarity */}
                          {(formData.selectedEvents.slice(0, passLimitsInfo.techEventsIncluded).length > 0 ||
                            formData.selectedWorkshops.slice(0, passLimitsInfo.workshopsIncluded).length > 0 ||
                            formData.selectedNonTechEvents.slice(0, passLimitsInfo.nonTechEventsIncluded).length > 0 ||
                            !passLimitsInfo.techEventSelectionEnabled) && (
                            <>
                              <hr className="border-white/20" />
                              <div className="text-gray-400 text-sm">
                                <span className="font-medium">Included in Pass:</span>
                                <ul className="mt-1 space-y-1">
                                  {/* Included tech events */}
                                  {passLimitsInfo.techEventSelectionEnabled ? (
                                    formData.selectedEvents.slice(0, passLimitsInfo.techEventsIncluded).map((selectedEvent) => {
                                      const event = techEvents.find((e) => e.id === selectedEvent.id);
                                      return event ? (
                                        <li key={`included-event-${event.id}`} className="text-xs">
                                          • {event.title}
                                        </li>
                                      ) : null;
                                    })
                                  ) : (
                                    <li className="text-xs">• Unlimited access to all technical events</li>
                                  )}
                                  {/* Included workshops */}
                                  {formData.selectedWorkshops.slice(0, passLimitsInfo.workshopsIncluded).map((selectedWorkshop) => {
                                    const workshop = workshops.find((w) => w.id === selectedWorkshop.id);
                                    return workshop ? (
                                      <li key={`included-workshop-${workshop.id}`} className="text-xs">
                                        • {workshop.title}
                                      </li>
                                    ) : null;
                                  })}
                                  {/* Included non-tech events */}
                                  {passLimitsInfo.nonTechEventSelectionEnabled && 
                                   formData.selectedNonTechEvents.slice(0, passLimitsInfo.nonTechEventsIncluded).map((selectedEvent) => {
                                    const event = nonTechEvents.find((e) => e.id === selectedEvent.id);
                                    return event ? (
                                      <li key={`included-nontech-${event.id}`} className="text-xs">
                                        • {event.title}
                                      </li>
                                    ) : null;
                                  })}
                                  <li className="text-xs">• Unlimited access to all technical events</li>
                                </ul>
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Individual billing (no pass) */}
                          {/* Selected Events */}
                          {formData.selectedEvents.map((selectedEvent) => {
                            const event = techEvents.find((e) => e.id === selectedEvent.id);
                            if (!event) return null;
                            const price = getPrice(event);
                            return (
                              <div key={`event-${event.id}`} className="flex justify-between items-center text-white">
                                <span className="text-sm">{event.title}</span>
                                <span className="font-medium text-green-400">{price}</span>
                              </div>
                            );
                          })}
                          
                          {/* Selected Workshops */}
                          {formData.selectedWorkshops.map((selectedWorkshop) => {
                            const workshop = workshops.find((w) => w.id === selectedWorkshop.id);
                            if (!workshop) return null;
                            const price = getPrice(workshop);
                            return (
                              <div key={`workshop-${workshop.id}`} className="flex justify-between items-center text-white">
                                <span className="text-sm">{workshop.title}</span>
                                <span className="font-medium text-green-400">{price}</span>
                              </div>
                            );
                          })}
                        </>
                      )}
                      
                      <hr className="border-white/20" />
                      <div className="flex justify-between items-center text-white font-bold text-lg">
                        <span>Total Amount</span>
                        <span className="text-yellow-400">₹{calculateTotalAmount()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-300 text-sm mb-4">
                      Payment will be processed securely through Razorpay after form submission
                    </p>
                  </div>
                </div>
              )}

              {/* Non-tech events payment notice */}
              {formData.selectedNonTechEvents.length > 0 && (
                <div className="bg-black/60 backdrop-blur-sm border border-yellow-400/50 rounded-lg p-4 w-full overflow-hidden transition-all duration-300">
                  <h4 className="text-yellow-400 font-medium mb-2">
                    Non-Technical Events Payment
                  </h4>
                  <p className="text-yellow-300 break-words">
                    Payment for non-technical events will be collected on the
                    day of the event. Please ensure you have the required amount
                    ready.
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
                    onChange={(e) =>
                      handleInputChange("hasConsented", e.target.checked)
                    }
                  />
                  <div className="text-gray-300 leading-relaxed break-words">
                    <p className="font-medium text-white mb-2">
                      Data Consent & Verification
                    </p>
                    <p className="text-sm">
                      I hereby confirm that all the information provided above
                      is{" "}
                      <span className="text-blue-400 font-medium">
                        accurate and complete
                      </span>
                      . I understand that any false information may lead to{" "}
                      <span className="text-red-400 font-medium">
                        disqualification
                      </span>{" "}
                      from the events. I consent to the processing of my
                      personal data for registration and event management
                      purposes in accordance with privacy guidelines.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Double-check all details before submission
                      <br />
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Keep payment receipts for verification
                      <br />
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
                  disabled={
                    !formData.hasConsented ||
                    isSubmitting ||
                    isCheckingDuplicates ||
                    paymentLoading ||
                    paymentInProgress ||
                    successData !== null
                  }
                  className="w-full max-w-md mx-auto py-4 px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isCheckingDuplicates ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Checking for duplicates...
                    </>
                  ) : isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting Registration...
                    </>
                  ) : paymentInProgress ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      🔒 Payment in Progress - DO NOT CLOSE THIS PAGE
                    </>
                  ) : paymentLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing Payment...
                    </>
                  ) : successData ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Registration Completed Successfully!
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {calculateTotalAmount() > 0 
                        ? `Pay ₹${calculateTotalAmount()} & Complete Registration`
                        : 'Complete Registration'
                      }
                    </>
                  )}
                </button>
              </div>

              {/* Download Section - Show after successful registration */}
              {successData && (
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-green-400/50 w-full overflow-hidden transition-all duration-300">
                  <h3 className="text-xl sm:text-2xl font-bold text-green-400 mb-4 flex items-center">
                    <CheckCircle className="w-6 h-6 mr-3" />
                    Registration Successful!
                  </h3>

                  <div className="text-center mb-6">
                    <p className="text-white text-lg mb-2">
                      <span className="font-semibold">Registration ID:</span>
                      <span className="text-green-400 font-mono text-xl ml-2">
                        {successData.registrationId}
                      </span>
                    </p>
                    <p className="text-gray-300 text-sm">
                      Submitted on: {successData.submissionDate}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                    <h4 className="text-white font-semibold mb-3 text-center">
                      Download Your Registration Details
                    </h4>
                    <p className="text-gray-300 text-sm text-center mb-4">
                      Save your registration information for your records.
                      Choose your preferred format:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={handleDownloadPDF}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        PDF Document
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadText}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Text File
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadJSON}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        JSON Data
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="py-3 px-6 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/15 hover:border-white/50 transition-all duration-300"
                    >
                      Start New Registration
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Quick Contact Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowQuickContact(!showQuickContact)}
            className="bg-blue-600/80 backdrop-blur-sm hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 border border-blue-500/50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>

          {showQuickContact && (
            <div className="absolute bottom-16 right-0 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-xl border border-white/20 w-64 max-w-[calc(100vw-2rem)] z-50">
              <h4 className="text-white font-medium mb-2">Quick Contact</h4>
              <p className="text-gray-300 text-sm mb-3 break-words">
                Having payment or registration issues? Contact us immediately!
              </p>
              <div className="space-y-2">
                <a
                  href="tel:+8438190166"
                  className="flex items-center text-blue-400 hover:text-blue-300 transition-colors break-words"
                >
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  +91 8438190166
                </a>
                <a
                  href="https://wa.me/8438190166"
                  className="flex items-center text-green-400 hover:text-green-300 transition-colors break-words"
                >
                  <FaWhatsapp className="w-4 h-4 mr-2 flex-shrink-0" />
                  WhatsApp Support
                </a>
                <a
                  href="mailto:asymmetric@citchennai.net"
                  className="flex items-center text-purple-400 hover:text-purple-300 transition-colors break-words"
                >
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  Asymmetric@citchennai.net
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Warning Modal */}
      {paymentWarnings && (
        <PaymentWarningModal
          isOpen={showWarningModal}
          onClose={() => {
            setShowWarningModal(false);
            setIsSubmitting(false);
          }}
          onProceed={handleProceedWithPayment}
          warnings={paymentWarnings}
        />
      )}
    </>
  );
}
