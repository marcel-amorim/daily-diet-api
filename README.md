# Daily Diet API

## Application Rules

- Users should be able to create an account.
- Users should be identifiable across requests.
- Users should be able to log their meals with the following details:
  *Each meal should be associated with a user.*
  - Name
  - Description
  - Date and Time
  - Whether it fits within the diet plan or not
- Users should be able to edit a meal, updating all the above details.
- Users should be able to delete a meal.
- Users should be able to list all their meals.
- Users should be able to view details of a specific meal.
- Users should be able to retrieve their diet statistics, including:
  - Total number of meals logged.
  - Total number of meals within the diet.
  - Total number of meals outside the diet.
  - Longest streak of consecutive meals within the diet.
- A user should only be able to view, edit, and delete their own meals.

## Application Context

When developing an API, it is common to consider how the data will be consumed by web and/or mobile clients.

For that reason, below is a link to the application layout that would use this API:

## Technologies Used

- **Fastify**: A lightweight and high-performance Node.js framework for building APIs.
- **Vitest**: A fast and efficient testing framework for JavaScript and TypeScript.
- **Supertest**: A testing library for HTTP assertions, useful for API testing.

## How to Run the Project

1. Clone this repository:
   ```sh
   git clone [repository_url]
   ```
2. Navigate to the project directory:
   ```sh
   cd daily-diet-api
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the application:
   ```sh
   npm run dev
   ```
5. Run tests:
   ```sh
   npm test
   ```

