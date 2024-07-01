# Use the latest official Cypress base image
FROM cypress/base:latest

# Set the working directory
WORKDIR /e2e

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Verify Cypress installation
RUN npx cypress verify

# Run Cypress tests
CMD ["npx", "cypress", "run"]
