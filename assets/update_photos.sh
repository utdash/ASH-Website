#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

main() {
    configFile="$DIR/../_data/photos.yaml"

    rm -f "$configFile"

    doThisFolder "$DIR/photos"
}

doThisFolder() {
    for f in "$1"/*; do
        #  If the file is not hidden
        if [[ $f =~ ^([^.].*)$ ]]; then
            # If this is a directory
            if [[ -d "$f" ]]; then
                doThisFolder "$f"
            # If this file does not contain ".thumbnail."
            elif ! [[ $f =~ \.thumbnail\. ]]; then
                # If this file has an extension
                if [[ $f =~ ^(.+)\.([^.]+)$ ]]; then
                    thumbnail="${BASH_REMATCH[1]}.thumbnail.${BASH_REMATCH[2]}"

                    # If there's just 1 photo here, not a big version and a small one,
                    # then we need to make a thumbnail
                    if ! [[ -f "$thumbnail" ]]; then
                        echo 'Generating thumbnail for "'"$f"'".'
                        # Scale height to 400px for thumbnail.
                        convert -sample x400 "$f" "$thumbnail"
                    fi

                    prefixChars=$((${#DIR} - 7))
                    f="${f:$prefixChars}"
                    thumbnail="${thumbnail:$prefixChars}"

                    # Add config for this photo
                    echo '- ' >>"$configFile"
                    echo "  original: $f" >>"$configFile"
                    echo "  thumbnail: $thumbnail" >>"$configFile"
                fi
            fi
        fi
    done
}

main
