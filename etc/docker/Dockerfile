FROM nginx:latest
COPY etc/docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY conf.d/ /etc/nginx/conf.d/
COPY release/ /usr/share/nginx/html/
ENTRYPOINT ["docker-entrypoint.sh"]
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
CMD ["nginx", "-g", "daemon off;"]
