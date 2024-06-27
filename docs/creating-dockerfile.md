# Creating a Dockerfile

This is an example of a SvelteKit app contained using multi-stage builds for efficiency.

With multi-stage builds, you use multiple FROM statements in your Dockerfile. Each FROM instruction can use a different base, and each of them begins a new stage of the build. You can selectively copy artifacts from one stage to another, leaving behind everything you don't want in the final image.

Meaning in the end. we only have the strictly necessary to run the app on the image, being the binary or other thing related to the production ready app.

We can also target specific stages, like if we want to debug a specific stage, we can just run `docker build --target build -t hello .`

## Prerequisites

- Docker installed on your system.
- An application ready for containerization.

## Dockerfile Structure

Here is the complete Dockerfile:

```dockerfile
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
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```

### Step-by-Step Explanation

### Stage 1: Build Stage

In the first stage, we use a Node.js Alpine image to build the SvelteKit application. We chose this image, because it's considerably small, having less chance for a vulnerability, less dependencies, reduced size.

```dockerfile
FROM node:20.11.1-alpine as build
```

- **FROM node:20.11.1-alpine as build:** Uses the official Node.js image based on Alpine Linux, and we name this first step build. This is where the dependencies are installed, and everything is setup properly to run the project.

```dockerfile
LABEL Developer="Júlio Araújo"
```

- **LABEL Developer="Júlio Araújo":** Adds metadata to the image, specifying the developer's name.

```dockerfile
WORKDIR /app
```

- **WORKDIR /app:** Sets the working directory inside the container to `/app`.

```dockerfile
COPY package*.json ./
```

- **COPY package\*.json ./:** Copies `package.json` and `package-lock.json` (if it exists) to the working directory.

```dockerfile
# Install dependencies
RUN npm install
```

- **RUN npm install:** Installs the dependencies listed in `package.json`.

```dockerfile
COPY . .
```

- **COPY . .:** Copies the rest of the application's source code to the working directory.

```dockerfile
# Build the SvelteKit app
RUN npm run build
```

- **RUN npm run build:** Builds the SvelteKit application using the `npm run build` command.

### Stage 2: Runtime Stage

In the second stage, we use a clean Node.js Alpine image to run the built application.

```dockerfile
FROM node:20.11.1-alpine
```

- **FROM node:20.11.1-alpine:** Uses the official Node.js image based on Alpine Linux for the runtime environment.

```dockerfile
COPY --from=build /app .
```

- **COPY --from=build /app .:** Copies the built application from the `build` stage to the current stage.

```dockerfile
# Expose the port SvelteKit runs on (default is 3000)
EXPOSE 4173
```

- **EXPOSE 4173:** Exposes port 4173, which the SvelteKit application will run on.

```dockerfile
# Command to run the app
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```

- **CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]:** Specifies the command to run the application.

### Conclusion

To build and run the Docker image, use the following commands:

```sh
# Build the Docker image (defaults to latest if no :tag is specified)
docker build -t my-app .
docker build -t my-app:1.0 .

# Run the Docker container
docker run -p 4173:4173 my-app
```

This will build the image and start a container running your application, accessible on port 4173.

---
