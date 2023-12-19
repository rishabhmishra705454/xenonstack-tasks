#!/bin/bash

# Function to create a new user
create_user() {
    local username="$1"

    # Check if the username is provided
    if [ -z "$username" ]; then
        echo "Usage: $0 create <username>"
        exit 1
    fi

    # Check if the user already exists
    if id "$username" &>/dev/null; then
        echo "User $username already exists."
        exit 1
    fi

    # Create the user
    sudo useradd -m -s /bin/bash "$username"

    # Set a password for the user (you may want to prompt for a password)
    sudo passwd "$username"

    echo "User $username created successfully."
}

# Function to list all regular users
list_users() {
    getent passwd | cut -d: -f1
}

# Function to list users with sudo permissions
list_sudo_users() {
    getent passwd | grep -E 'sudo|admin' | cut -d: -f1
}

# Parse command-line options
case "$1" in
    create)
        create_user "$2"
        ;;
    list)
        list_users
        ;;
    list-sudo)
        list_sudo_users
        ;;
    *)
        echo "Usage: $0 {create|list|list-sudo} <username>"
        exit 1
        ;;
esac
