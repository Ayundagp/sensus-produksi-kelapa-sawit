
Built by https://www.blackbox.ai

---

```markdown
# Sensus Produksi Kelapa Sawit

## Project Overview
Sensus Produksi Kelapa Sawit is a web application designed for tracking and recording data related to oil palm trees. The system allows users to input and manage information about the trees, including their age, height, health condition, and production levels. It also features an interactive map for locating trees and a user-friendly interface for managing data entries.

## Installation
To get started with the project, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/sensus-produksi-kelapa-sawit.git
   cd sensus-produksi-kelapa-sawit
   ```

2. **Open the Project**
   - Open `index.html` in your preferred web browser.

3. **No Additional Packages or Dependencies Required**
   - The project uses CDN links for CSS and JavaScript libraries, thus no installation of npm packages is necessary.

## Usage
1. **Login**
   - Navigate to `login.html` and enter your credentials to access the application. 
   - After logging in, you will be redirected to the main application interface.
   
2. **Adding Tree Data**
   - Fill out the form with the respective tree data, including:
     - ID Pohon (Tree ID)
     - Umur Pohon (Tree Age)
     - Tinggi Pohon (Tree Height)
     - Produksi (Production)
     - Kondisi Kesehatan (Health Condition)
     - Catatan (Notes)
   - Click the "Simpan Data" button to save the information.

3. **Map Interaction**
   - Click on the map to set the coordinates of the tree location. The latitude and longitude will be populated in the respective fields.

4. **View Tree List**
   - A dynamic list of trees will be displayed as you enter and save data.

## Features
- **User Authentication:** Secure login to access the application.
- **Data Input for Trees:** Collect comprehensive data such as age, height, production, and health status.
- **Interactive Map:** Utilize a map to visually track tree locations.
- **Responsive Design:** Mobile-friendly design that works on various screen sizes.
- **Real-time Data List:** View and manage a list of entered trees dynamically.

## Dependencies
This project relies on the following external libraries:
- **Tailwind CSS**: For styling the application.
- **Leaflet**: For interactive mapping functionality.
- **Font Awesome**: For icons used in buttons and inputs.

These libraries are included via CDN links in the HTML files.

## Project Structure
```
.
├── index.html         # Main application file
├── login.html         # Login page for user authentication
└── js/                # JavaScript folder
    ├── app.js         # Main script for handling application logic
    └── login.js       # Script for handling login functionality
```

## License
This project is licensed under the MIT License. See the LICENSE file for details.
```

Feel free to modify any specific entries based on your project setup or additional features!