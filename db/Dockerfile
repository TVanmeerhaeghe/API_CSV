FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=
ENV MYSQL_DATABASE=docker_api
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

COPY docker_api.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
