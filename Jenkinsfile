pipeline {
    agent any
    tools { maven 'maven-3.6.3' }
    
    environment {
        PROJECT_ID = 'amiable-mix-418317'
        APP_NAME = 'my-web-app'
        REPO_NAME = 'my-app-repo'
        REGION = 'us-central1'
        IMAGE_TAG = "${BUILD_NUMBER}"
        IMAGE_NAME = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${APP_NAME}"
        GCP_CREDS = credentials('gcp-service-account')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "Checking out code from GitHub..."
                checkout scm
            }
        }
        
        stage('Build with Maven') {
            steps {
                sh 'mvn -B -V clean package'
                junit 'target/surefire-reports/*.xml' // Optional, if you use Surefire
            }
        }
        
        stage('Test') {
            steps {
                echo "Running tests..."
                script {
                    // For static website - no tests
                    echo "No tests for static website"
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                script {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                    sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
                }
            }
        }
        
        stage('Push to Artifact Registry') {
            steps {
                echo "Pushing image to GCP Artifact Registry..."
                script {
                    sh """
                        gcloud auth activate-service-account --key-file=${GCP_CREDS}
                        gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${IMAGE_NAME}:latest
                    """
                }
            }
        }
        
        stage('Deploy to Cloud Run') {
            steps {
                echo "Deploying to Google Cloud Run..."
                script {
                    sh """
                        gcloud config set project ${PROJECT_ID}
                        gcloud run deploy ${APP_NAME} \
                            --image ${IMAGE_NAME}:${IMAGE_TAG} \
                            --platform managed \
                            --region ${REGION} \
                            --allow-unauthenticated \
                            --port 8080 \
                            --max-instances 3
                    """
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                echo "Cleaning up local Docker images..."
                script {
                    sh """
                        docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true
                        docker rmi ${IMAGE_NAME}:latest || true
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo "Pipeline completed successfully!"
            emailext (
                subject: "SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    Build succeeded!
                    
                    Project: ${env.JOB_NAME}
                    Build Number: ${env.BUILD_NUMBER}
                    Build URL: ${env.BUILD_URL}
                    
                    Application deployed to Cloud Run successfully.
                """,
                to: "raghav.vijayanand@gmail.com"
            )
        }
        failure {
            echo "Pipeline failed!"
            emailext (
                subject: "FAILED: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    Build failed!
                    
                    Project: ${env.JOB_NAME}
                    Build Number: ${env.BUILD_NUMBER}
                    Build URL: ${env.BUILD_URL}
                    
                    Check Jenkins console output for details.
                """,
                to: "raghav.vijayanand@gmail.com"
            )
        }
    }
}