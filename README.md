# Prescriptioner

This project is a web application that scans medical prescriptions, extracts data from them, and sets reminders in Google Calendar according to the specified lunch and dinner timings. It leverages Amazon Textract for text extraction, Mixtral AI for extracting useful information, Firebase for image saving, MongoDB as the database, and Google Calendar API for scheduling reminders.

## Features

- **Prescription Scanning**: Upload prescription images for analysis.
- **Text Extraction**: Extracts text using Amazon Textract.
- **Information Parsing**: Mixtral AI processes the extracted text to identify relevant data such as medicine names, doses, and timings.
- **Reminders Integration**: Automatically sets reminders in Google Calendar for medication times based on lunch and dinner schedules.
- **Image Storage**: Uses Firebase to store uploaded prescription images.
- **User Data Management**: MongoDB stores user details, prescription data, and settings.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js
- **Database**: MongoDB
- **Authentication**: Firebase
- **APIs Used**:
  - Amazon Textract
  - Google Calendar API
- **AI Model**: Mixtral AI for extracting useful prescription data

## Prerequisites

Before running the project, ensure you have:

- Node.js installed
- Firebase project set up
- AWS account for using Amazon Textract
- Google Cloud account for Calendar API

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/definitelynotchirag/prescriptioner
   cd prescriptioner
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and include:

   ```env
    PORT =
    MONGODB_URI = 
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    GOOGLE_REDIRECT_URI=
    JWT_SECRET = 

   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open the application in your browser at `http://localhost:3000`.

## Usage

1. **Upload Prescription**: Log in and upload an image of the prescription.
2. **Process Image**: The application extracts text using Amazon Textract and parses the information using Mixtral AI.
3. **Set Timings**: Provide your lunch and dinner timings.
4. **Reminders**: The app sets medication reminders in Google Calendar based on the prescription and your timings.


## APIs Used

- **Amazon Textract**: Extracts text from prescription images.
- **Mixtral AI**: Identifies relevant information (medicines, doses, timings) from the extracted text.
- **Google Calendar API**: Schedules reminders for medication.

## Future Enhancements

- Add support for multiple languages in prescriptions.
- Integrate OCR for handwritten prescriptions.
- Notify users with push notifications.
- Improve AI model for enhanced accuracy.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributors

- [Chirag](https://github.com/definitelynotchirag)
- [Soham](https://github.com/sohamlate)
- [Omkar](https://github.com/Omkar4965)
- [Adarsh]()

Feel free to contribute to this project by submitting issues or pull requests!

