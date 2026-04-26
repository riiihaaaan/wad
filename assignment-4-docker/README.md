# Assignment 4: Docker Container Environment

## Theory: What is Docker?
**Docker** is an open-source platform that enables developers to build, deploy, run, update, and manage containers. Containers are lightweight, standalone, executable packages of software that include everything needed to run an application: code, runtime, system tools, system libraries, and settings.

### Key Concepts:
1. **Docker Image**: A read-only template with instructions for creating a Docker container. It's essentially a snapshot of an application and its dependencies.
2. **Docker Container**: A runnable instance of a Docker image. It is isolated from the host system and other containers.
3. **Docker Hub**: A cloud-based registry service where developers can upload their custom images or download publicly available images (like Ubuntu, Python, MySQL, etc.).

---

## Practical Implementation Steps

Based on the laboratory whiteboard instructions, here is the exact sequence of commands to set up Docker, pull a Python image, execute a simple addition script inside the container, and clean up.

### 1. Install Docker and Configure User
Install the Docker engine on your Ubuntu machine and give your student user `sudo` privileges.
```bash
sudo apt install docker.io
su
usermod -aG sudo student
```

### 2. Check Docker Version
Verify that Docker has been successfully installed.
```bash
docker -v
```

### 3. Check Available Images
List all the Docker images currently downloaded on your system.
```bash
sudo docker images
```

### 4. Check Running Containers
List all currently running Docker containers.
```bash
sudo docker ps
```

### 5. Pull the Python Docker Image
Download the official Python image from Docker Hub.
```bash
sudo docker pull python
```

### 6. Verify Images
Check that the Python image is now in your local repository.
```bash
sudo docker images
```

### 7. Run the Image as a Container
Start a container from the downloaded Python image. We will name the container `py` and run it in detached/interactive mode.
```bash
sudo docker run -d --name py -it python
```

### 8. Check Container Availability
Verify that the `py` container is now running.
```bash
sudo docker ps
```

### 9. Execute into the Container
Enter the running container's terminal and start the Python 3 interpreter to write a simple addition program.
```bash
sudo docker exec -it py python3
```
*Inside the Python terminal, you can perform the addition:*
```python
>>> a = 5
>>> b = 10
>>> print("Sum is:", a + b)
```

### 10. Exit from Terminal
Leave the Python interpreter and go back to your host machine's terminal.
```python
>>> exit()
```
*(Or press `Ctrl + D`)*

### 11. Stop the Container
Stop the running container using its container ID or name (`py`).
```bash
sudo docker stop py
```

### 12. Remove the Container
Delete the container from your system completely.
```bash
sudo docker rm py
```
*(Note: Use `sudo docker container rm containerid` if using the exact ID)*

### 13. Remove All Images
Finally, clean up by deleting the downloaded Python image using its Image ID to save disk space.
```bash
sudo docker rmi <image-id>
```
*(Replace `<image-id>` with the actual ID you saw in step 6)*
