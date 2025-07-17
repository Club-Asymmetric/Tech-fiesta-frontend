import jsPDF from "jspdf";
import { RegistrationFormData } from "@/types";
import { events } from "@/data/events";
import { workshops } from "@/data/workshops";

export interface RegistrationDownloadData extends RegistrationFormData {
  registrationId: string;
  submissionDate: string;
}

/**
 * Generate and download registration data as PDF
 */
export const downloadRegistrationPDF = (data: RegistrationDownloadData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 30;

  // Helper function to add text with word wrapping
  const addText = (
    text: string,
    fontSize: number = 10,
    isBold: boolean = false,
    color: [number, number, number] = [0, 0, 0]
  ) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    if (isBold) {
      doc.setFont("helvetica", "bold");
    } else {
      doc.setFont("helvetica", "normal");
    }

    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * (fontSize * 0.4) + 2;
    return yPosition;
  };

  const addSpacing = (space: number = 5) => {
    yPosition += space;
  };

  const addCenteredText = (text: string, fontSize: number = 10, isBold: boolean = false, color: [number, number, number] = [255, 255, 255]) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    if (isBold) {
      doc.setFont("helvetica", "bold");
    } else {
      doc.setFont("helvetica", "normal");
    }
    doc.text(text, pageWidth / 2, yPosition, { align: "center" });
    yPosition += fontSize * 0.4 + 2;
  };

  // Header with gradient-like effect
  doc.setFillColor(99, 102, 241); // Purple/blue background
  doc.rect(0, 0, pageWidth, 50, "F");

  // "Registration Confirmed!" with party emoji effect
  yPosition = 20;
  addCenteredText("Registration Confirmed!", 20, true, [255, 255, 255]);
  
  // Tech Fiesta 2025
  addCenteredText("Tech Fiesta 2025", 16, true, [255, 255, 255]);
  
  // Chennai Institute of Technology
  addCenteredText("Chennai Institute of Technology", 12, false, [255, 255, 255]);

  // Reset text color and position
  doc.setTextColor(0, 0, 0);
  yPosition = 70;

  // Registration Details Section with background
  doc.setFillColor(240, 248, 255); // Light blue background
  doc.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 85, "F");
  
  addText("Registration Details", 14, true);
  addSpacing(3);
  addText(`Registration ID: ${data.registrationId}`, 11, true);
  addText(`Participant Name: ${data.name}`, 11);
  addText(`Email: ${data.email}`, 11);
  addText(`College: ${data.college}`, 11);
  addText(`Department: ${data.department}`, 11);
  addText(`Year of Study: ${data.year}`, 11);
  addText(`WhatsApp: ${data.whatsapp}`, 11);
  addText(`Student Type: ${data.college.toLowerCase().includes('cit') ? 'CIT Student' : 'External Student'}`, 11);
  
  addSpacing(10);

  // Registration Type with colored background
  const isFreeMember = data.selectedEvents.length === 0 && data.selectedWorkshops.length === 0;
  if (isFreeMember || data.selectedNonTechEvents.length > 0) {
    doc.setFillColor(220, 252, 231); // Light green background
    doc.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 25, "F");
    addText("Registration Type: Free Registration", 11, true, [34, 197, 94]);
    addText("No payment required for your selected events", 10, false, [75, 85, 99]);
    addSpacing(10);
  }

  // Technical Events Section
  if (data.selectedEvents.length > 0) {
    addText("Technical Events Registered", 14, true);
    addSpacing(5);
    
    data.selectedEvents.forEach((selectedEvent) => {
      const event = events.find((e) => e.id === selectedEvent.id);
      if (event) {
        // Event name
        addText(selectedEvent.title, 12, true);
        
        // Event details with icons
        addText(`Date: 2025-07-30`, 10);
        addText(`Time: 11:00 AM - 1:00 PM`, 10);
        addText(`Venue: ${selectedEvent.title === 'TechFiesta Quiz' ? 'Quiz Arena' : 'Tech Lab'}`, 10);
        
        // Description
        if (event.description) {
          addText(`Description: ${event.description}`, 10);
        }
        
        // Payment info
        addText(`Payment: At venue on arrival`, 10);
        addSpacing(8);
      }
    });
  }

  // Non-Technical Events Section
  if (data.selectedNonTechEvents.length > 0) {
    addText("Non-Technical Events Registered", 14, true);
    addSpacing(2);
    
    // Warning box
    doc.setFillColor(254, 243, 199); // Light yellow background
    doc.rect(margin - 5, yPosition - 2, pageWidth - 2 * margin + 10, 20, "F");
    addText("Important: Payment for non-technical events is required at the venue on the day of the event.", 10, true, [146, 64, 14]);
    addSpacing(8);
    
    data.selectedNonTechEvents.forEach((selectedEvent) => {
      const event = events.find((e) => e.id === selectedEvent.id);
      if (event) {
        // Event name
        addText(selectedEvent.title, 12, true);
        
        // Event details based on event type
        if (selectedEvent.title === 'Channel Surfing') {
          addText(`Date: 2025-07-30`, 10);
          addText(`Time: 3:00 PM - 5:00 PM`, 10);
          addText(`Venue: Entertainment Hall`, 10);
          addText(`Description: Fast-paced improv game where teams act out scenes from random TV genres - news, drama, sports, etc. Switch roles on the spot with humor and creativity!`, 10);
        } else {
          addText(`Date: 2025-07-30`, 10);
          addText(`Time: TBA`, 10);
          addText(`Venue: TBA`, 10);
          if (event.description) {
            addText(`Description: ${event.description}`, 10);
          }
        }
        
        addText(`Payment: At venue on arrival`, 10);
        addSpacing(8);
      }
    });
  }

  // Workshops Section
  if (data.selectedWorkshops.length > 0) {
    addText("Workshops Registered", 14, true);
    addSpacing(5);
    
    data.selectedWorkshops.forEach((selectedWorkshop) => {
      const workshop = workshops.find((w) => w.id === selectedWorkshop.id);
      if (workshop) {
        addText(selectedWorkshop.title, 12, true);
        addText(`Date: 2025-07-30`, 10);
        addText(`Duration: ${workshop.duration}`, 10);
        addText(`Venue: Workshop Hall`, 10);
        addText(`Payment: ${workshop.price}`, 10);
        addSpacing(8);
      }
    });
  }

  // Team Information
  if (data.isTeamEvent && data.teamMembers && data.teamMembers.length > 0) {
    addText("Team Information", 14, true);
    addSpacing(3);
    addText(`Team Size: ${data.teamSize}`, 11);
    addText("Team Members:", 12, true);
    data.teamMembers.forEach((member, index) => {
      addText(`${index + 2}. ${member.name} (${member.email})`, 10);
      addText(`   Department: ${member.department}, Year: ${member.year}`, 9);
    });
    addSpacing(10);
  }

  // Important Instructions Box
  doc.setFillColor(59, 130, 246); // Blue background
  doc.rect(margin - 5, yPosition - 7, pageWidth - 2 * margin + 10, 55, "F");
  
  addText("Important Instructions", 14, true, [255, 255, 255]);
  addSpacing(3);
  addText("• Save this email for your records - you'll need it for event entry", 10, false, [255, 255, 255]);
  addText("• Bring a valid ID card to all events for verification", 10, false, [255, 255, 255]);
  addText("• Arrive 15 minutes early to all registered events", 10, false, [255, 255, 255]);
  addText("• Non-tech events require payment at the venue before participation", 10, false, [255, 255, 255]);
  addText("• Follow event-specific guidelines that will be shared at the venue", 10, false, [255, 255, 255]);
  addText("• Contact support if you have any questions about your registration", 10, false, [255, 255, 255]);
  
  addSpacing(15);

  // Contact Information
  doc.setTextColor(0, 0, 0);
  addText("Contact Information", 14, true);
  addSpacing(3);
  addText("Email: asymmetric@citchennai.net", 11);
  addText("Event Queries: Contact event coordinators at the venue", 11);
  addText("Registration Support: Show this email and your ID at registration desk", 11);
  
  addSpacing(15);

  // Footer
  addCenteredText("Thank you for registering for Tech Fiesta 2025!", 12, false, [75, 85, 99]);
  addCenteredText("Chennai Institute of Technology", 11, true, [75, 85, 99]);
  addSpacing(5);
  addCenteredText("For any queries, contact us at asymmetric@citchennai.net", 10, false, [75, 85, 99]);
  addCenteredText("© 2025 Tech Fiesta - Chennai Institute of Technology", 8, false, [128, 128, 128]);
  addSpacing(5);

  // Save the PDF
  doc.save(`Tech-Fiesta-2025-Registration-${data.registrationId}.pdf`);
};

/**
 * Generate and download registration data as JSON
 */
export const downloadRegistrationJSON = (data: RegistrationDownloadData) => {
  const jsonData = {
    registrationDetails: {
      registrationId: data.registrationId,
      submissionDate: data.submissionDate,
      personalInfo: {
        name: data.name,
        department: data.department,
        email: data.email,
        whatsapp: data.whatsapp,
        college: data.college,
        year: data.year,
      },
      eventRegistrations: {
        technicalEvents: data.selectedEvents.map((selectedEvent) => {
          const event = events.find((e) => e.id === selectedEvent.id);
          return event
            ? {
                id: selectedEvent.id,
                title: selectedEvent.title,
                price: event.price || "₹69",
              }
            : { id: selectedEvent.id, title: selectedEvent.title };
        }),
        workshops: data.selectedWorkshops.map((selectedWorkshop) => {
          const workshop = workshops.find((w) => w.id === selectedWorkshop.id);
          return workshop
            ? {
                id: selectedWorkshop.id,
                title: selectedWorkshop.title,
                price: workshop.price || "₹101",
              }
            : { id: selectedWorkshop.id, title: selectedWorkshop.title };
        }),
        nonTechEvents: data.selectedNonTechEvents.map((selectedEvent) => {
          const event = events.find((e) => e.id === selectedEvent.id);
          return event
            ? {
                id: selectedEvent.id,
                title: selectedEvent.title,
                note: "Payment on arrival",
              }
            : { id: selectedEvent.id, title: selectedEvent.title };
        }),
      },
      teamInfo: data.isTeamEvent
        ? {
            teamSize: data.teamSize,
            teamMembers: data.teamMembers || [],
          }
        : null,
      paymentInfo: data.transactionIds,
    },
  };

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Tech-Fiesta-2025-Registration-${data.registrationId}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate and download registration data as text file
 */
export const downloadRegistrationText = (data: RegistrationDownloadData) => {
  let content = "=".repeat(60) + "\n";
  content += "          TECH FIESTA 2025 - REGISTRATION CONFIRMATION\n";
  content += "=".repeat(60) + "\n\n";

  content += `Registration ID: ${data.registrationId}\n`;
  content += `Submission Date: ${data.submissionDate}\n\n`;

  content += "PERSONAL INFORMATION\n";
  content += "-".repeat(30) + "\n";
  content += `Name: ${data.name}\n`;
  content += `Department: ${data.department}\n`;
  content += `Email: ${data.email}\n`;
  content += `WhatsApp: ${data.whatsapp}\n`;
  content += `College: ${data.college}\n`;
  content += `Year of Study: ${data.year}\n\n`;

  if (
    data.selectedEvents.length > 0 ||
    data.selectedWorkshops.length > 0 ||
    data.selectedNonTechEvents.length > 0
  ) {
    content += "EVENT REGISTRATIONS\n";
    content += "-".repeat(30) + "\n";

    if (data.selectedEvents.length > 0) {
      content += "Technical Events:\n";
      data.selectedEvents.forEach((selectedEvent) => {
        const event = events.find((e) => e.id === selectedEvent.id);
        if (event) {
          content += `  • ${selectedEvent.title} - ${event.price || "₹69"}\n`;
        }
      });
      content += "\n";
    }

    if (data.selectedWorkshops.length > 0) {
      content += "Workshops:\n";
      data.selectedWorkshops.forEach((selectedWorkshop) => {
        const workshop = workshops.find((w) => w.id === selectedWorkshop.id);
        if (workshop) {
          content += `  • ${selectedWorkshop.title} - ${
            workshop.price || "₹101"
          }\n`;
        }
      });
      content += "\n";
    }

    if (data.selectedNonTechEvents.length > 0) {
      content += "Non-Technical Events:\n";
      data.selectedNonTechEvents.forEach((selectedEvent) => {
        const event = events.find((e) => e.id === selectedEvent.id);
        if (event) {
          content += `  • ${selectedEvent.title} - Payment on arrival\n`;
        }
      });
      content += "\n";
    }
  }

  if (data.isTeamEvent && data.teamMembers && data.teamMembers.length > 0) {
    content += "TEAM INFORMATION\n";
    content += "-".repeat(30) + "\n";
    content += `Team Size: ${data.teamSize}\n`;
    content += "Team Members:\n";
    data.teamMembers.forEach((member, index) => {
      content += `  ${index + 2}. ${member.name} (${member.email})\n`;
      content += `     Department: ${member.department}, Year: ${member.year}\n`;
    });
    content += "\n";
  }

  const hasPayments = Object.keys(data.transactionIds).length > 0;
  if (hasPayments) {
    content += "PAYMENT INFORMATION\n";
    content += "-".repeat(30) + "\n";
    Object.entries(data.transactionIds).forEach(([key, transactionId]) => {
      if (transactionId) {
        content += `${key}: ${transactionId}\n`;
      }
    });
    content += "\n";
  }

  content += "IMPORTANT NOTES\n";
  content += "-".repeat(30) + "\n";
  content += "• Please bring this registration confirmation to the event\n";
  content += "• Keep your payment receipts safe for verification\n";
  content += "• Contact support if you need to make any changes\n";
  content += "• Arrive at least 15 minutes before your event time\n\n";

  content += "=".repeat(60) + "\n";
  content +=
    "This is an automatically generated document. Please preserve it for your records.\n";
  content += "=".repeat(60);

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Tech-Fiesta-2025-Registration-${data.registrationId}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
