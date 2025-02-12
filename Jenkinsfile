pipeline {
    agent any

    stages {
        stage('Build') {
            agent {
                docker {
                 image 'node:18-alpine'   
                 reuseNode true
                }
            }
            steps {
                sh'''
                ls -la
                node --version
                npm --version
                cd fortune400
                npm ci
                npm install typescript
                npm run build
                ls -la
                '''
            }
        }
    }
}
