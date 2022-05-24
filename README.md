# revo-compounder
Auto-compounding bot for the Revo platform

## Deployment
### GCP setup
If you deploy your compounder with Google Cloud, the following instructions may be helpful.
#### Secrets Manager
First add your private key to Secrets Manager with the instructions [here](https://cloud.google.com/secret-manager/docs).
#### Cloud Function
To deploy a cloud function for your compounder, you should first create a configuration file (see `config.mainnet.json.example` for an example).

Next create a service account for your cloud function.
```bash
gcloud iam service-accounts create compounder-cf \
  --display-name "Compounder cloud function"
```

You may want to set `PROJECT_ID` to your GCP project id in your CLI for the next steps.

Give your service account access to your new secret.
```bash
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member serviceAccount:compounder-cf@${PROJECT_ID}.iam.gserviceaccount.com \
  --role roles/secretmanager.secretAccessor
```

Next, you may use the following command to deploy your cloud function:
```bash
yarn build && gcloud functions deploy compound --entry-point=main --runtime=nodejs16 --max-instances=5 \
--env-vars-file=config.mainnet.json --trigger-http --no-allow-unauthenticated \
--set-secrets=PRIVATE_KEY=<your-private-key-secret-name>:latest \
--service-account=compounder-cf@${PROJECT_ID}.iam.gserviceaccount.com
```
(Remember to fill in `<your-private-key-secret-name>` with the name of the secret you created in Secrets Manager earlier,
and delete the brackets `<>`. Same goes for bracketed arguments for the rest of this guide.).

See [here](https://cloud.google.com/functions/docs/deploying/filesystem) for more options on deploying from the CLI 
(and [here](https://cloud.google.com/sdk/gcloud/reference/functions/deploy) for all the possible arguments to `gcloud deploy`)

#### Cloud Scheduler
By default, creating a Cloud Scheduler job from the GUI will not give the cron job access to your cloud function. It's 
easier to do it from the CLI.

Create a service account for your cloud function.
```bash
gcloud iam service-accounts create compounder-cron \
  --display-name "Compounder cron job"
```

Give your service account access to your cloud functions.
```bash
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member serviceAccount:compounder-cron@${PROJECT_ID}.iam.gserviceaccount.com \
  --role roles/cloudfunctions.invoker
```

Deploy the cron job:
```bash
gcloud scheduler jobs create http compound \
--schedule "0-59/10 * * * *" \
--time-zone "America/Los_Angeles" \
--uri "<your-cloud-function-uri>" \
--oidc-service-account-email compounder-cron@${PROJECT_ID}.iam.gserviceaccount.com \
--location us-central1
```
(Note that this has the compounder run every 10 minutes, but can be configured to run as often as you like via the 
`schedule` parameter.)
