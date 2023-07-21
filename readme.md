# JavaScript Functional Google Translate API to translate JSON files.

### Based on [this project](https://github.com/qunabu/translate-script), adding certain modifications.

In order to run the code

1. Install dependencies with `yarn install`
2. Getting the Service Key
   - 2.1. Login or create an account in Google Developer Console
   - 2.2. Create or select a project.
   - 2.3. Enable the Cloud Translation API for that project.
   - 2.4. Create a service account.
   - 2.5. Download a private key as JSON.
   - 2.6. Once you save that on you disk copy to clipboard the absolute path to it. In my case this file path is `/home/mhernandez/Downloads/projects-web-dev-c559b84d84fb.json`
3. Install Google SDK
   - 3.1. Download https://cloud.google.com/sdk/docs/install?hl=es-419 and follow the instruction on Google SDK download page.
   - 3.2. Extract and run the installation script ./google-cloud-sdk/install.sh from the folder where SDK was extracted.
   - 3.3. After installation restart the shell and run command `gcloud auth application-default login` that should fail at this stage and ask for GOOGLE_APPLICATION_CREDENTIALS which is suppose to be path to key generated in the previous stage.
   - 3.4. Set the path to key by setting environmental variable with `export GOOGLE_APPLICATION_CREDENTIALS=/home/mhernandez/Downloads/projects-web-dev-c559b84d84fb.json`
4. Login with `gcloud auth application-default login`
5. Set quota in the project with `gcloud auth application-default set-quota-project XXX` where `XXX` is the project id.
6. Run the code `node index.js`
