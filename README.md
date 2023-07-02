## Travis CI
[![Travis Build Status](https://app.travis-ci.com/Albertocalib/WebProtasks.svg?branch=master)](https://app.travis-ci.com/Albertocalib/WebProtasks)
## SonarCloud
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Albertocalib_WebProtasks&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Albertocalib_WebProtasks)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Albertocalib_WebProtasks&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Albertocalib_WebProtasks)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Albertocalib_WebProtasks&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Albertocalib_WebProtasks)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Albertocalib_WebProtasks&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Albertocalib_WebProtasks)
# WebProtasks
WebProtasks es la aplicación web de Protasks desarrollada en Angular para la gestión y organización de equipos y proyectos. Es una herramienta que nos permite mediante un tablero Kanban gestionar el trabajo de un equipo y visualizar en todo momento el estado del proyecto. La aplicación Android y el backend que será necesario para el funcionamiento de esta aplicación, está en el repositorio de Github https://github.com/Albertocalib/ProTasks. El backend trabaja con una base de datos MySql.

## Despligue
Para desplegar la aplicación se han desarrollado dos Dockerfile, uno en el repositorio del Backend y otro en este repositorio. Será necesario por tanto, generar las imagenes ejecutando ambos archivos de la siguiente forma.
  1. Nos situamos en el directorio raíz.
  2. Ejecutamos la construcción de la imágen tanto de este proyecto como del backend del otro repositorio.
     `docker build -t webProTasks .`
  3. Ejecutamos el docker-compose situado en la carpeta raíz de este proyecto para levantar los servicios.
     ` docker-compose up`
  4. Una vez ejecutado el docker-compose up, bastará con abrir el navegador Web que se quiera en el puerto 4200. http://localhost:4200/
     



