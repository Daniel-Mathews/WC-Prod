pipeline {
    agent any
    environment {
        GIT_CREDENTIALS_ID = 'WCProdGithubAccess'
        GIT_REPO_URL = 'https://github.com/Daniel-Mathews/WC-Prod.git'
        LOCAL_REPO_PATH = '/home/daniel/WC-Prod'
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
                        // Configure git user name and email
                        sh '''
                        cd ${LOCAL_REPO_PATH}
                        git config --global user.name "Jenkins CI"
                        git config --global user.email "jenkins@example.com"
                        git config --global --add safe.directory /home/daniel/WC-Prod
                        git remote set-url origin https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Daniel-Mathews/WC-Prod.git
                        pwd
                        git checkout main
                        git status
                        ls -la
                        git add -A
                        git commit -m "${COMMIT_MESSAGE}"
                        git push origin main
                        '''
                    }
                }
            }
        }
    }
}
