When choosing a docker image, we need to take some things into consideration:

### Who is The Author? Is it from a secure source?

![image](https://github.com/julioaraujo96/train-journey-simulator/assets/49203294/f7603027-5525-4698-a821-0396b8d6130b)

- [Docker Official Images](https://hub.docker.com/search?image_filter=official)
- [Verified Publisher](https://hub.docker.com/search?image_filter=store), this is from docker partnered organizations, with the content verified by docker.
- [Docker-Sponsored Open Source](https://hub.docker.com/search?image_filter=open_source) , open source projects submitted by a docker open source program.

### Architechture

![image](https://github.com/julioaraujo96/train-journey-simulator/assets/49203294/059201d3-c81b-425b-812d-37fb5f99d420)

linux/arm64

linux/amd64

windows/amd64

A specific image not compiled for a arm architecture , would not run directly on a macbook m1, or Raspberry pi.

### Tags

![image](https://github.com/julioaraujo96/train-journey-simulator/assets/49203294/a22a9399-a11a-4c05-a844-3e9f1fd3d33e)

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
