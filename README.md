# Student Management Application — DevOps Mini Project

A simple Node.js + Express REST API demonstrating Git/GitHub, Jenkins CI, Docker, Kubernetes and automated testing.

## 1. Features and API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Health check |
| GET | `/api/students` | List all students |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Add a student |
| DELETE | `/api/students/:id` | Delete a student |

Example POST body:

```json
{
  "name": "Meera",
  "course": "Data Science",
  "year": 1
}
```

The app uses in-memory sample data. Data resets when the process/container restarts; a database can be added as an extension.

## 2. Run locally

Install Node.js 20+ and npm.

```bash
npm install
npm test
npm start
```

Open `http://localhost:3000/api/students`. Test the health endpoint at `http://localhost:3000/health`.

## 3. Git and GitHub

Create an empty repository on GitHub, then run these commands from this project folder (replace the URL):

```bash
git init
git status
git add .
git commit -m "Initial student management application"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/student-management-devops.git
git push -u origin main
```

Demonstrate basic commands:

```bash
git status
git log --oneline
git branch
git add .
git commit -m "Add API tests and deployment files"
git push
git pull
```

## 4. Jenkins CI pipeline

Prerequisites: Jenkins agent with Git, Node.js 20+, npm and Docker installed. The Jenkins agent must be allowed to run Docker commands.

1. Open Jenkins and choose **New Item**.
2. Enter `student-management-pipeline`; choose **Pipeline**.
3. Under **Pipeline**, choose **Pipeline script from SCM**.
4. Select **Git**, enter your GitHub repository URL and credentials if it is private.
5. Set branch to `*/main`; Script Path to `Jenkinsfile`.
6. Save and select **Build Now**.
7. Open **Console Output**. The stages perform checkout, `npm ci`, automated tests and Docker image build.

For a GitHub-triggered build, configure a GitHub webhook to your Jenkins endpoint or enable SCM polling. The Jenkins server must be reachable by GitHub for webhooks.

## 5. Docker

Build and run:

```bash
docker build -t student-management:1 .
docker run --name student-app -p 3000:3000 student-management:1
```

Visit `http://localhost:3000/api/students`.

Useful commands:

```bash
docker ps
docker logs student-app
docker stop student-app
docker rm student-app
```

## 6. Kubernetes

The supplied manifests use two replicas and a NodePort Service. For a local cluster, enable Docker Desktop Kubernetes or start Minikube.

Build the image first:

```bash
docker build -t student-management:1 .
```

For Minikube, make the image available to its node before applying manifests:

```bash
minikube image load student-management:1
kubectl apply -f k8s/deployment.yaml
kubectl get deployments
kubectl get pods
kubectl get services
kubectl rollout status deployment/student-management
```

Access with Minikube:

```bash
minikube service student-management-service --url
```

With Docker Desktop Kubernetes, open `http://localhost:30080` (if NodePort routing is supported by your setup).

Cleanup:

```bash
kubectl delete -f k8s/deployment.yaml
```

**Image registry note:** For a remote Kubernetes cluster, push the image to Docker Hub or another registry, then change `image:` in `k8s/deployment.yaml` to `YOUR-DOCKERHUB-USERNAME/student-management:1` and authenticate the cluster to that registry if required. The local image name is intended for a local cluster.

## 7. Automated tests

Tests are in `tests/students.test.js` and use Jest + Supertest. Four tests cover:
1. Listing students successfully (HTTP 200).
2. Creating a student successfully (HTTP 201).
3. Rejecting invalid student data (HTTP 400).
4. Returning 404 for an unknown student.

Run:

```bash
npm test
```

## 8. Architecture / workflow

```text
Developer
   |
   v
Git local repository ---> GitHub
                             |
                             v
                         Jenkins
                   (checkout + npm ci)
                             |
                             v
                       Jest tests
                             |
                             v
                     Docker image build
                             |
                             v
                     Kubernetes Deployment
                        (2 Pods)
                             |
                             v
                     Kubernetes Service
                             |
                             v
                         Client
```

## 9. Evidence to capture for a lab record

- GitHub repository page showing uploaded source files.
- Terminal showing `git status`, `git log` and successful `git push`.
- Jenkins pipeline stage view and successful console output.
- `npm test` output showing all tests passed.
- Docker image listing (`docker images`) and running container (`docker ps`).
- Kubernetes outputs for `kubectl get deployments`, `kubectl get pods` and `kubectl get services`.
- Browser/Postman response from `/api/students` and `/health`.

## 10. Conclusion

The Student Management REST API was developed using Node.js and Express. Git and GitHub were used for version control and source-code hosting. Jenkins automated dependency installation, testing and Docker image creation. Docker packaged the application, while Kubernetes deployed multiple replicas and exposed them through a Service. Automated tests validated successful retrieval and creation, invalid input handling and not-found behavior.
