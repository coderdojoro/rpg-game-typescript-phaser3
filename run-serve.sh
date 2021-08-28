# build-server.sh
#!/bin/bash
set PORT=${PORT:-'8000'} 
npx serve -l $PORT dist
