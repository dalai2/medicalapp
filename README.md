# Description

The assessment is divided into two main sections:

1. **API Development and Integration:**
    * Implementation of a function to unify doctor availability.
    * Database modeling and CRUD operations for patients.
2. **Automated Testing:**
    * Writing unit and integration tests using Jest.

## Requirements

* Node.js (recommended version: 20.16.0)
* npm (or yarn)
* Docker and Docker Compose (for deployment)
* MongoDB

## Installation Instructions

1. **Clone the repository:**

    ```bash
    git clone <REPOSITORY_URL>
    cd <PROJECT_NAME>
    ```

2. **Install dependencies:**

    ```bash
    make install
    ```

    * This command installs dependencies inside the Docker container.

3. **Configure environment variables:**
    * Create a `.env` file in the project root.
    * Add the MongoDB connection URI:
        * `MONGODB_URI=mongodb://mongodb:27017/plenna`
        * `TESTDB_URI=mongodb://mongodb:27017/testdb`

## Execution Instructions

1. **Start the application with Docker Compose:**

    ```bash
    make run
    ```

    * This builds the Docker image and starts the containers (application and MongoDB).

2. **Stop the application:**

    ```bash
    make stop
    ```

3. **Clean containers and volumes:**

    ```bash
    make clean
    ```

## API Endpoints

* **GET /doctors/availability:**
  * Returns the unified doctor availability.
* **Patient CRUD:**
  * POST /patients: Creates a new patient.
  * GET /patients: Retrieves all patients.
  * GET /patients/:id: Retrieves a patient by ID.
  * PUT /patients/:id: Updates a patient.
  * DELETE /patients/:id: Deletes a patient.

* **Medical History CRUD:**
  * POST /medical-history: Creates a new medical history entry.
  * GET /medical-history/:patientId: Retrieves medical history for a specific patient.
  * PUT /medical-history/:id: Updates a medical history entry.
  * DELETE /medical-history/:id: Deletes a medical history entry.

## Example Request Bodies

* **POST /patients:**

    ```json
    {
      "name": "John Doe",
      "dob": "1990-01-01",
      "contactInfo": {
        "phone": "123-456-7890",
        "email": "john.dee@example.com",
        "address": "123 Main St"
      }
    }
    ```

* **PUT /patients/:id:**

    ```json
    {
      "name": "Updated Name",
      "contactInfo": {
        "phone": "987-654-3210"
      }
    }
    ```

* **POST /consultations:**

    ```json
    {
        "patientId": "patient_object_id",
        "date": "2024-01-15T10:00:00Z",
        "doctorId": "Doc1",
        "notes": "Patient reported mild fever.",
    }
    ```

* **PUT /consultations/:id:**

    ```json
    {
        "prescriptions": ["prescription1"]
    }
    ```

## Testing

* To run unit and integration tests:

    ```bash
    make test
    ```

  * This command executes tests inside the Docker container using Jest.

## Project Structure

express-docker-app/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.ts
├── dist/
├── pruebaTecnica.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── docker-compose.yml
├── Makefile
└── README.md

* `src/`: Contains the application source code.
* `dist/`: Contains the compiled TypeScript code.
* `pruebaTecnica.json`: JSON file with doctor availability data.
* `docker-compose.yml`: Docker Compose configuration.
* `Makefile`: Commands to facilitate project execution.

## Error Handling

* Global middleware is implemented to handle empty POST requests and return a 400 error.
* Robust error handling is implemented for patient CRUD operations, including ID validation and handling non-existent patients.
* Logs are implemented to track application state.
