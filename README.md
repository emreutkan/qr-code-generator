# QR Code Generator

A modern, responsive web application for generating QR codes for various types of content.

## Features

- **Multiple QR Code Types:**
  - **URL**: Generate QR codes for websites and links
  - **Text**: Create QR codes for plain text
  - **Phone Number**: Generate callable phone number QR codes
  - **Wi-Fi**: Create QR codes for Wi-Fi network connections
  - **SMS**: Generate SMS message QR codes
  - **Email**: Create email QR codes with subject and body
  - **vCard**: Generate contact information QR codes

- **Modern UI**: Clean, responsive design with a beautiful gradient background
- **Download Functionality**: Download generated QR codes as PNG images
- **Mobile Responsive**: Works perfectly on all device sizes
- **Real-time Generation**: QR codes are generated instantly using Google Charts API

## How to Use

1. **Select a Type**: Click on one of the type buttons (URL, Text, Phone, etc.)
2. **Enter Content**: Fill in the required fields for your chosen type
3. **Generate**: Click the "Generate QR" button to create your QR code
4. **Download**: Use the "Download QR Code" button to save the QR code image

## Supported Formats

### URL
- Enter any valid URL (e.g., https://example.com)

### Text
- Enter any text you want to encode

### Phone Number
- Select country code
- Enter phone number

### Wi-Fi
- Select encryption type (WPA/WPA2, WEP, or None)
- Enter network name (SSID)
- Enter password (if required)

### SMS
- Enter recipient phone number
- Enter message text (optional)

### Email
- Enter recipient email address
- Enter subject (optional)
- Enter message body (optional)

### vCard
- Enter full name
- Enter organization (optional)
- Enter phone number (optional)
- Enter email address (optional)

## Technical Details

- Built with vanilla TypeScript and CSS
- Uses Google Charts API for QR code generation
- Responsive design with CSS Grid and Flexbox
- Modern CSS features including backdrop-filter and gradients
- No external dependencies required

## Getting Started

1. Clone or download the project
2. Open `index.html` in a modern web browser
3. Start generating QR codes!

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License.
