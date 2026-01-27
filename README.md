# Sistema de Gestión Institucional — Frontend

Frontend del sistema de gestión institucional.
Este proyecto forma parte de una plataforma real en uso continuo, desarrollada y evolucionada a lo largo de varios años para el Conservatorio de Música "Juan José Castro".

El objetivo principal del frontend es ofrecer una interfaz clara, mantenible y adaptable, acompañando la evolución del sistema sin comprometer su estabilidad.

## Contexto

El sistema tiene su origen en un software desarrollado en Delphi + Firebase.
Frente a la necesidad de ampliar el alcance y facilitar el acceso remoto, se dio inicio a un proceso de migración web, priorizando:

- continuidad operativa
- compatibilidad funcional
- adopción gradual de nuevas tecnologías

## Evolución técnica del frontend

La arquitectura del frontend deriva de las necesidades reales del sistema y la institución, evitando los cambios arbitrarios de stack.

- **2017**  
  Primera versión web desarrollada en PHP con renderización del lado del servidor, replicando la lógica y flujos del sistema de escritorio original.

- **2018 – 2020**  
  Separación progresiva entre backend y frontend.  
  Incorporación de JavaScript y jQuery para mejorar la interactividad sin alterar la estructura general del sistema.

- **2020 – 2022**  
  Migración del frontend a una arquitectura basada en componentes utilizando Vue 2 y Bootstrap 4.  
  Mejora en la organización del código, reutilización de vistas y manejo de estados de la interfaz.

- **Actualidad**  
  Proceso de refactorización hacia Vue 3 + Bootstrap 5, con foco en:
  - mayor claridad estructural
  - mantenibilidad
  - adopción de un flujo de trabajo versionado con Git

La evolución se realizó de manera controlada, evitando refactors disruptivos que pudieran afectar la estabilidad del sistema en producción.


## Enfoque de diseño y desarrollo

Las decisiones técnicas del frontend se rigen por los siguientes principios:

- refactorización incremental en lugar de reescrituras completas
- respeto por las restricciones del sistema existente
- separación clara entre lógica y presentación
- prioridad en la legibilidad del código
- diseño orientado a la mantenibilidad a largo plazo


## Relación con el backend

Si bien este repositorio corresponde al frontend, el desarrollo se realizó en estrecha relación con el backend del sistema, el cual también se encuentra en refactorización, con su propio proyecto.

El backend está implementado en PHP siguiendo una arquitectura MVC, con base de datos MySQL/MariaDB.
Se respetan contratos implícitos y flujos existentes.

Este repositorio representa únicamente la capa de interfaz y no incluye configuraciones sensibles ni dependencias del backend.

## Tecnologías utilizadas

- JavaScript (ES6+)
- Vue 3 (Composition API)
- HTML5
- CSS3
- Bootstrap 5


## Estado actual del proyecto

El frontend se encuentra en proceso de refactorización progresiva hacia Vue 3. Las secciones del sistema original se van incorporando a medida que se adaptan.

El sistema antiguo continúa en producción mientras se realiza el diseño y testeo de todas las secciones.

El objetivo no es una migración inmediata, sino una transición ordenada y sostenible.


## Notas finales

Algunas configuraciones, integraciones y recursos específicos de producción no forman parte del código versionado.

El foco del proyecto está puesto en la claridad estructural, la evolución controlada y la continuidad operativa.

