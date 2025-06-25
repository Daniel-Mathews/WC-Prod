//TODO: Not functional. Switch from SSH to HTTP later on. Test it on another repo and 
//then come back and fix this. It is not working due to github URL not being encoded properly.
//We could add the password directly but that is not secure.
//https://copilot.microsoft.com/shares/DeYrBXj4mzSjT7rfk7Skj

pipeline {
    agent any
    environment {
        GIT_CREDENTIALS_ID = ''
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
                        bash -c "set -a && . /home/daniel/WC-Prod/.env && set +a"
                        git remote set-url origin https://${GIT_USERNAME}:${GITHUB_PASSWORD}@github.com/Daniel-Mathews/WC-Prod.git
                        pwd
                        git checkout main
                        git status
                        ls -la
                        git add -A
                        git commit -m "${COMMIT_MESSAGE}"
                        git push origin ${GIT_BRANCH}
                        '''
                    }
                }
            }
        }
    }
}
