FROM node:19-alpine

# Install packages
RUN apk add --update --no-cache supervisor chromium

# Setup app
RUN mkdir -p /app

# Add application
WORKDIR /app
COPY challenge .

# Install dependencies
RUN npm install
RUN npm rebuild

# Setup superivsord
COPY supervisord.conf /etc/supervisord.conf

# Expose the port node-js is reachable on
EXPOSE 1337

# Start the node-js application
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]