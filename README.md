## Setup Github Workflows
### Description
The firebase functions are deployed on 2 scenarios: 
1. Manualy deployment by using the `Tests, Build and Deploy` workflow.
2. By pushing changes to `main` or `dev`, where a change in `main` will trigger deployment to `production` and a change in `dev` will trigger a deployment to `staging`.
* If you are not working with a `staging` environment, don't use `dev` branch or remove it as a trigger from the workflow.

### Create a GCP service account
1. Go to "IAM and Admin" -> "Service accounts"
2. Create a service account by clicking on "Create a service account"
3. In the "Permissions" step, add the following roles:

- `API Keys Viewer`
- `Artifact Registry Writer`
- `Cloud Build Editor`
- `Cloud Functions Admin`
- `Firebase Viewer`
- `Project IAM Admin`
- `Service Account User`
  
4. Go back to "Service accounts", select your new service account and click on the 3 dots on the right and select "Manage Keys"
5. Click "Add Key" -> "Create new key" -> "JSON" -> "Create"
6. Save the file somewhere safe
### Add Repository Secrets and Variables
#### Add Repository Secrets
1. Go to your Github repository
2. Go to "Settings" -> "Secrets and variables" -> "Actions"
3.  Click on "New respository secret"
4.  Create a new secret named *`FIREBASE_SERVICE_ACCOUNT_PRODUCTION_BASE64`*
5.  Now add a base64 encoded version of the json you downloaded in step 7, by running `cat <your-json-file> | base64 | pbcopy` and pasting (ctrl+v) in the "Secret" field.
6.  Repeat this step *`FIREBASE_SERVICE_ACCOUNT_STAGING_BASE64`* if you have another Firebase account for staging - optional.
#### Add Repository Variables
1. Go to your Github repository
2. Go to "Settings" -> "Secrets and variables" -> "Actions"
3. Select the "Variables" tab
4. Click on "New respository variable"
5. Add the variable *`PRODUCTION_FIREBASE_PROJECT_ID`* with the id of your firebase project.
6. Like for the secrets, if you have a firebase staging account then add a *`STAGING_FIREBASE_PROJECT_ID`*.
### Enable GCP APIs
1. Go to "APIs & Services"
2. Make sure the following services are enabled:

- `Service Usage API`
- `Artifact Registry API`
- `Eventarc API`
- `Cloud Firestore API`
- `Identity and Access Management (IAM) API`
- `Cloud Build API`
- `Firebase Management API`
- `Firebase Extensions API`
- `Cloud Billing API`
- `Cloud Run Admin API`

## Create a new Firebase Function
### Modify workflows
1. Create a new directory for your `"new-function"`
2. Add your function to `firebase.json`:
```
{
  ...
  "functions": [
    {
      "source": "new-function",
      "codebase": "new-function",
      ...
    }
```
3. Modify the `auto_build_and_deploy.yaml`, add your function's directory name here:
```
  build-and-deploy:
    ...
    strategy:
    matrix:
      function_path:
        - function_a
        - function_b
        - new-function
```
1. Do the same in `build_and_deploy.yaml`, here:
```
  on: 
  workflow_dispatch:
    inputs:
      ...
      function_path:
        type: choice
        required: true
        options:
          - function_a
          - function_b
          - new-function
```