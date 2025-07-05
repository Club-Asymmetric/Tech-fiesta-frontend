# Registration System Documentation

## Overview
The Tech Fiesta 2025 registration system provides a comprehensive solution for event and workshop registration with multiple entry points and flexible payment handling.

## Features

### Entry Methods
1. **Direct Registration** (`/registration`)
   - General registration for Tech Fiesta
   - User can select events/workshops manually
   - Shows payment QRs based on selections

2. **Event-Specific Registration** (`/registration?eventId=X&type=event`)
   - Pre-selects specific event
   - Automatically shows relevant payment QRs
   - Streamlined experience from event cards

3. **Workshop Registration** (`/registration?eventId=X&type=workshop`)
   - Pre-selects specific workshop
   - Shows workshop-specific payment QR

### Form Fields
- **Personal Information**: Name, Department, Email, WhatsApp, College, Year
- **Team Details**: Dynamic team member forms (shown only for team events)
- **Event Selection**: Tech Events, Workshops, Non-tech Events
- **Payment Details**: Transaction IDs for each payment type
- **Consent**: Mandatory agreement checkbox

### Payment Logic (Updated)
- **Entry Fee**: FREE! 🎉
- **Tech Events**: ₹100 per event (individual QR for each event)
- **Workshops**: ₹150 per workshop OR Free (as specified, individual QR for each workshop)
- **Non-tech Events**: Payment collected on-site (no immediate payment required)

### QR Code System (Updated)
- Individual QR codes for each selected event/workshop
- No general registration fee QR
- Each QR shows specific event/workshop name and amount
- Transaction ID required for each paid event/workshop
- Enhanced validation for Indian transaction IDs

### Enhanced Form Validation
- **Email**: Comprehensive email format validation
- **Phone Numbers**: Indian mobile/landline number validation
  - Mobile: 10 digits starting with 6,7,8,9
  - With country code: +91 followed by mobile number
  - Landline: Standard Indian landline format
- **Transaction IDs**: Indian payment system validation
  - UPI Transaction IDs (12 digits)
  - Bank transaction references
  - Alphanumeric transaction IDs
  - Various Indian payment gateway formats

### Improved UI/UX
- **Modern Design**: Glassmorphism effects with gradient backgrounds
- **Registration Summary**: Real-time summary of selected events and costs
- **Interactive Cards**: Hover effects and better visual feedback
- **Progress Indicators**: Clear visual indicators for required fields
- **Better Icons**: Contextual icons for different sections
- **Responsive Layout**: Optimized for all device sizes
- **Color Coding**: Different colors for events, workshops, and non-tech events

### Quick Contact
- Floating contact button for support
- Multiple contact methods (Phone, WhatsApp, Email)
- Immediate assistance for payment/registration issues

## Technical Implementation

### Components
- `RegistrationForm.tsx`: Main registration component
- `EventCard.tsx`: Updated with registration buttons
- `WorkshopCard.tsx`: Updated with enrollment buttons
- `NavBar.tsx`: Added registration link

### Types
- `RegistrationFormData`: Main form data structure
- `TeamMember`: Team member details
- `PaymentQR`: QR code information
- `RegistrationProps`: Component props for pre-selection

### Utilities
- `generateRegistrationUrl()`: Creates URLs with event parameters
- `validateEmail()`: Email format validation
- `validatePhone()`: Phone number validation
- `formatPrice()`: Price formatting utility

### Navigation
- NavBar includes "Register" link
- Event cards have "Register Now" buttons
- Workshop cards have "Enroll Now" buttons
- All buttons generate appropriate URLs with event parameters

## Usage

### Direct Registration
```
/registration
```

### Event-Specific Registration
```
/registration?eventId=1&type=event
/registration?eventId=2&type=workshop
/registration?eventId=3&type=non-tech
```

### Integration with Event Cards
```tsx
const handleRegisterClick = () => {
  const eventType = event.type === "tech" ? "event" : "non-tech";
  const registrationUrl = generateRegistrationUrl(event.id, eventType);
  window.location.href = registrationUrl;
};
```

## Future Enhancements
- Backend integration for form submission
- Email confirmation system
- Payment gateway integration
- Registration status tracking
- Admin dashboard for registration management
- QR code generation for actual payments
