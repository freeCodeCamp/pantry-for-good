## Deployment

### Azure
- Set up an [azure account](https://azure.microsoft.com/en-us/free/), if you haven't already, and install the [azure cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
- Install [terraform](https://www.terraform.io/downloads.html)
- Clone this repository and navigate to `resources/azure`
- Edit the variables in `terraform.tfvars`, if needed
- Login to the azure cli with `az login`
- Run `terraform apply`

You'll be asked for your ssh public key for remote access to the deployed app, this can be usually be found on linux by running `cat ~/.ssh/id_rsa.pub`, and your email address to be used for [letsencrypt](https://letsencrypt.org/).

When everything has been deployed you should see the domain name the app is running on, and the ssh command for connecting to the app server.