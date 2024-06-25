# Stage 1: Build 
FROM node:20.11.1-alpine as build

LABEL Developer="Júlio Araújo"

WORKDIR /app

# Copy package and lock files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build  

# Stage 2: Run
# FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

# Copy the built JavaScript files from the previous stage
# COPY --from=build /app/dist/ .
# COPY src/nmeaFiles/leixoes_campanha.txt .

EXPOSE 3000

CMD ["node", "dist/index.js", "src/nmeaFiles/leixoes_campanha.txt", "2"]
