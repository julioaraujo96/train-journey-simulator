When choosing a docker image, we need to take some things into consideration:

### Who is The Author? Is it from a secure source?

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f4c7b319-34d8-483b-9932-47179ddd0a1c/bf7f5c76-1915-4284-b40a-9eb6d09e0774/Untitled.png)

- [Docker Official Images](https://hub.docker.com/search?image_filter=official)
- [Verified Publisher](https://hub.docker.com/search?image_filter=store), this is from docker partnered organizations, with the content verified by docker.
- [Docker-Sponsored Open Source](https://hub.docker.com/search?image_filter=open_source) , open source projects submitted by a docker open source program.

### Architechture

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f4c7b319-34d8-483b-9932-47179ddd0a1c/d657390d-af3f-4926-aaf1-fc73e1759d83/Untitled.png)

linux/arm64

linux/amd64

windows/amd64

A specific image not compiled for a arm architecture , would not run directly on a macbook m1, or Raspberry pi.

### Tags

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f4c7b319-34d8-483b-9932-47179ddd0a1c/d1e06ed5-bfa1-4e79-9b20-afbce21c164a/Untitled.png)

Tags should be a hint for the image content, especially for the specific version of the image. We should choose python:3.10.6 instead of python:3 for example.

### Size

Since the image will be downloaded from the network, and use disk space, we should consider using the most minimal image possible without any additional bloat. This also impacts security, because bigger distros, more dependencies, more vulnerabilities, harder monitoring and higher vulnerability.

Therefore a image minimal like Alpine is considered a good approach.

### Standard library C

If we are dependant of something that isn’t standard library C, we might have problems on distros based on it.

We can use `FROM scratch` , to build a image completely from scratch and build the image ourselfs with is direct dependencies or use a project that has this goal, like Distroless.

## What are distroless container Images?

"Distroless" images contain only your application and its runtime dependencies. They do not contain package managers, shells or any other programs you would expect to find in a standard Linux distribution.

## Why we should use?

Restricting the image to what is necessary, is a best practice, in other to simplify monitoring of its behaviour and vulnerabilities.

These images are very small, one of the smallest distroless image is `gcr.io/distroless/static-debian11`.

### Considerations:

If you’re considering using distroless Docker images, there are some Important considerations to make:

- They are based on current stable Debian release versions, meaning they’re up to date with a far out *end of life* expiration date, which is a great thing.
- They are minimal, so usually node, npm and other common tools aren't included.
- Because they are Debian-based, they rely on the glibc implementation and are less likely to surprise you with issues in production.
- You will soon enough find out that the Distroless team doesn’t maintain fine-grained Node.js runtime versions. This means you need to rely on the general purpose `latest` tag that will be frequently updated, or install based on the SHA256 hash of the image at a certain time.´
