pipeline {
    agent any
    environment {
        GIT_CREDENTIALS_ID = 'WCProdGithubAccess' // Replace with your Jenkins Git credentials ID
        GIT_REPO_URL = 'https://github.com/Daniel-Mathews/WC-Prod.git' // Use HTTPS URL
        GIT_BRANCH = 'main'
    }
    stages {
        stage('Get Custom Commit Message') {
            steps {
                script {
                    env.COMMIT_MESSAGE = input(
                        message: 'Enter the commit message:',
                        parameters: [
                            string(defaultValue: 'Automated commit by Jenkins pipeline', description: 'Commit message to use', name: 'CustomMessage')
                        ]
                    )
                }
            }
        }

        stage('Add, Commit and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: GIT_CREDENTIALS_ID, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        sh '''
                        git config --global credential.helper store
                        git add .
                        git commit -m "${COMMIT_MESSAGE}"
                        git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Daniel-Mathews/WC-Prod.git
                        '''
                    }
                }
            }
        }
    }
}
