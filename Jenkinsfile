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
                npm run build
                ls -la
                '''
            }
        }
        stage('Test') {
        steps {
            sh 'test -f fortune400/.next/BUILD_ID'
        }
    }
        stage('Deploy') {
        steps {
            echo 'Deploying'
        }
        }
    }
}
