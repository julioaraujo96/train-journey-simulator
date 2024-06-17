
FROM node:20.11.1-alpine as build

LABEL Developer="Júlio Araújo"

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Build the SvelteKit app
RUN npm run build

FROM node:20.11.1-alpine
COPY --from=build /app .

# Expose the port SvelteKit runs on (default is 3000)
EXPOSE 4173

# Command to run the app
CMD ["npm","run", "preview","--", "--host", "0.0.0.0"]
