#! /usr/bin/env bash

# This script changes vagrant box configurations to match OVH default ubuntu
# instances e.g. default user account, SSH password authentication, ...
#!/bin/bash

# Create a default user
USERNAME="vagrant"
PASSWORD="ubuntu"

# Create the user with the specified password
useradd -m -s /bin/bash ${USERNAME}
echo "${USERNAME}:${PASSWORD}" | chpasswd

# Allow password authentication for SSH
sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
systemctl restart ssh

# Additional provisioning steps can go here
