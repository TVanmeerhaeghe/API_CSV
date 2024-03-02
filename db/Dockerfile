FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=
ENV MYSQL_DATABASE=docker_api
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
