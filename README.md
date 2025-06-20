# Kingsman Cafe and Event Management System

## Description
A web application system for Kingsman Cafe and Event Management located in Polathumodara, Mirissa. The system manages cafe items, food sales, inventory, attendance, salaries, and event management, including special events with artists.

## Table of Contents
- [Installation](#installation)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Contact](#contact)

## Installation
### Prerequisites
- Node.js
- npm (Node Package Manager)
- JDK 11 or later
- Apache Maven
- MySQL

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/FOT-level-3-group-project/Cafe-and-event-management-system.git
   cd kingsman

2. **Install dependencies:**
   ```bash
   npm install

3. **Set up the back-end:**
   Navigate to the back-end directory and follow steps for setting up the Spring Boot application.
   - Navigate to the backend directory
   - Configure Database Settings
        - Open src/main/resources/application.properties and update the database configuration with your database details. For example :
          ```bash
          spring.datasource.url=jdbc:mysql://localhost:3306/your-database
          spring.datasource.username=your-username
          spring.datasource.password=your-password

          spring.jpa.hibernate.ddl-auto=update
          spring.jpa.show-sql=true
          spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5Dialect
   
   - Build the project using Maven
   - Run the Spring Boot application

5. **Start the development server:**
   ```bash
   npm run dev

   Access the application at http://localhost:5173.

## Features
- Cafe Items Management
- Food Sales
- Inventory Management
- Attendance Management
- Salary Management
- Event Management

## Technologies Used
- Front-end: ReactJS
- Back-end: Spring Boot
- Database: MySQL
- Languages: Java, JavaScript, CSS
- Other Tools: Tailwind CSS

## Contact
 If you have any questions or suggestions, feel free to reach out to the project maintainers.
- C.D. Senarathne (LinkedIn: [Chathumina Senarathne](https://www.linkedin.com/in/chathumina))
- W.A.T.I. Bandara (LinkedIn: [Thisara Bandara](https://www.linkedin.com/in/thisara-bandara-294773240))
- H. Dilmika (LinkedIn: [Hiruni Dilmika](https://www.linkedin.com/in/hiruni-dilmika))
- A.K. Senavirathne (LinkedIn: [Ashen Kavindu](https://www.linkedin.com/in/))
     






