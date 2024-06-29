#!/bin/sh

# Directory to store secrets
SECRET_DIR="/app/secrets"
mkdir -p $SECRET_DIR

# Function to prompt for secret if not already set
prompt_secret() {
  local secret_name=$1
  local secret_file="$SECRET_DIR/$secret_name"

  if [ ! -f "$secret_file" ]; then
    echo "Enter value for $secret_name:"
    read secret_value
    echo $secret_value > $secret_file
  fi
}

# Prompt for secrets
prompt_secret "OPENAI_API_KEY"
prompt_secret "MONGODB_URI"
prompt_secret "GROUP_NAME"
prompt_secret "GOOGLE_CREDENTIALS_JSON"

echo "Secrets setup complete."
