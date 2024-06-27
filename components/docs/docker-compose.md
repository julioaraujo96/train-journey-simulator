# Creating a Docker Compose File

Docker Compose allows you to define and manage multi-container Docker applications.

## Prerequisites

- Docker installed on your system.

### Step-by-Step Explanation

### Services

#### 1. Frontend Service

The `frontend` service builds an image from the Dockerfile located in the `./components/client` directory.

```yaml
frontend:
  build:
    context: ./components/client
    dockerfile: Dockerfile
  expose:
    - 4173
  networks:
    - private
  env_file:
    - 'prod.env'
  environment:
    - VITE_SERVER_URL
    - SERVER_PATH
  depends_on:
    - backend
```

- **build:** Specifies the build context and Dockerfile.
- **expose:** Exposes port 4173 to other services in the same network.
- **networks:** Connects the service to the `private` network.
- **env_file:** Loads environment variables from the `prod.env` file.
- **environment:** Lists environment variables to pass to the container.
- **depends_on:** Ensures the `backend` service is started before this service.

#### 2. Backend Service

The `backend` service builds an image from the Dockerfile located in the `./components/server` directory.

```yaml
backend:
  build:
    context: ./components/server
    dockerfile: Dockerfile
  expose:
    - 3000
  networks:
    - private
  volumes:
    - ./components/server/src/nmeaFiles/leixoes_campanha.txt:/app/src/nmeaFiles/leixoes_campanha.txt:ro
  env_file:
    - 'prod.env'
  environment:
    - SERVER_PATH
    - SERVER_PORT
```

- **build:** Specifies the build context and Dockerfile.
- **expose:** Exposes port 3000 to other services in the same network.
- **networks:** Connects the service to the `private` network.
- **volumes:** Mounts a local file as read-only file inside the container.
- **env_file:** Loads environment variables from the `prod.env` file.
- **environment:** Lists environment variables to pass to the container.

#### 3. Nginx Service

The `nginx` service uses a pre-built Nginx image and acts as a reverse proxy.

```yaml
nginx:
  image: nginx:stable-alpine3.19-perl
  ports:
    - '8080:80'
  networks:
    - private
    - public
  volumes:
    - ./infra/playbooks/roles/reverse-proxy/files/nginx.conf:/etc/nginx/nginx.conf:ro
  depends_on:
    - backend
    - frontend
```

- **image:** Uses the specified Nginx image.
- **ports:** Maps port 8080 on the host to port 80 in the container.
- **networks:** Connects the service to both `private` and `public` networks.
- **volumes:** Mounts the Nginx configuration file as read-only.
- **depends_on:** Ensures `backend` and `frontend` services are started before this service.

### Networks

Two networks are defined: `public` and `private`.

```yaml
networks:
  public:
    driver: bridge
  private:
    driver: bridge
```

- **public:** A bridge network accessible from outside.
- **private:** A bridge network isolated from external access.

### Conclusion

This Docker Compose file sets up a multi-container application with `frontend`, `backend`, and `nginx` services, each with specific configurations and dependencies. The services are interconnected via defined networks, nginx acts as a reverse-proxy in order to only expose port 8080 to the user.
Requests to / go to the client, /api, go to the server.

To use this Docker Compose file, save it as `compose.yml` and run the following command:

```sh
docker compose up -d
```

This command will build and start all the defined services. The -d flag, is to run the containers in background.

---

### Other useful commands

```sh
docker ps
```

Lists all the running containers

```sh
docker images
```

Lists all the images on the machine

```sh
docker rmi image_id or image_name
```

Removes a specific image from the machine

```sh
docker logs container_name or id
```

To check the container logs
