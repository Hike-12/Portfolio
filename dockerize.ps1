# ===== CONFIG =====
$IMAGE_NAME = "hike12/next-portfolio"
$TAG = "latest"
$CONTAINER_NAME = "next-portfolio-container"
$PORT = 3000

$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptRoot

Write-Host "Starting Docker automation..."

# ===== CHECK DOCKER =====
docker --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker not installed or not running"
    exit
}

# ===== BUILD IMAGE =====
Write-Host "Building Docker image..."
docker image rm -f ${IMAGE_NAME}:${TAG} 2>$null
docker build -t ${IMAGE_NAME}:${TAG} .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed"
    exit
}

# ===== RUN CONTAINER (LOCAL TEST) =====
Write-Host "Running container locally..."

# Remove old container if exists
docker rm -f $CONTAINER_NAME 2>$null

docker run -d -p ${PORT}:3000 --name $CONTAINER_NAME ${IMAGE_NAME}:${TAG}
if ($LASTEXITCODE -ne 0) {
    Write-Host "Container run failed"
    exit
}

Write-Host "App should be running at http://localhost:$PORT"

Start-Sleep -Seconds 5

# ===== LOGIN =====
Write-Host "Logging into Docker Hub..."
docker login
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker login failed"
    exit
}

# ===== PUSH =====
Write-Host "Pushing image to Docker Hub..."
docker push ${IMAGE_NAME}:${TAG}
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker push failed"
    exit
}

# ===== CLEANUP LOCAL IMAGE =====
Write-Host "Removing local image for pull test..."
docker rm -f $CONTAINER_NAME 2>$null
docker rmi ${IMAGE_NAME}:${TAG}

# ===== PULL =====
Write-Host "Pulling image from Docker Hub..."
docker pull ${IMAGE_NAME}:${TAG}
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker pull failed"
    exit
}

# ===== RUN AGAIN =====
Write-Host "Running container from pulled image..."
docker run -d -p ${PORT}:3000 --name $CONTAINER_NAME ${IMAGE_NAME}:${TAG}
if ($LASTEXITCODE -ne 0) {
    Write-Host "Final container run failed"
    exit
}

Write-Host "Done. App is live at http://localhost:$PORT"