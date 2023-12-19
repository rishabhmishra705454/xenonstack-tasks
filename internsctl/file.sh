#!/bin/bash

# Function to display file information
get_file_info() {
    local file=$1
    local size=""
    local permissions=""
    local owner=""
    local last_modified=""

    # Check if the file exists
    if [ -e "$file" ]; then
        # Get size
        size=$(stat -c "%s" "$file")

        # Get permissions
        permissions=$(stat -c "%A" "$file")

        # Get owner
        owner=$(stat -c "%U" "$file")

        # Get last modified time
        last_modified=$(stat -c "%y" "$file")

        # Display information based on options
        if [ "$size_option" = true ]; then
            echo "$size"
        elif [ "$permissions_option" = true ]; then
            echo "$permissions"
        elif [ "$owner_option" = true ]; then
            echo "$owner"
        elif [ "$last_modified_option" = true ]; then
            echo "$last_modified"
        else
            echo "File: $file"
            echo "Access: $permissions"
            echo "Size(B): $size"
            echo "Owner: $owner"
            echo "Modify: $last_modified"
        fi
    else
        echo "File not found: $file"
    fi
}

# Initialize options
size_option=false
permissions_option=false
owner_option=false
last_modified_option=false

# Parse command-line options
while [ "$#" -gt 0 ]; do
    case "$1" in
        -s|--size)
            size_option=true
            ;;
        -p|--permissions)
            permissions_option=true
            ;;
        -o|--owner)
            owner_option=true
            ;;
        -m|--last-modified)
            last_modified_option=true
            ;;
        *)
            # Assuming the remaining argument is the file name
            file_name="$1"
            ;;
    esac
    shift
done

# Display file information
get_file_info "$file_name"
