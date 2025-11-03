FROM nginx:alpine

# Copy nginx config to listen on 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy your website files
COPY . /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]