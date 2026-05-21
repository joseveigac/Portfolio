---
title: "Cómo Crear Mods para Minecraft Java"
description: "Aprende a crear mods para Minecraft Java Edition con NeoForge para dominar lo básico y construir tus propios mods desde cero."
image: "/img/minecraft-java-modding.webp"
category: "Guide"
difficulty: "Beginner"
tags: ["Java", "Modding", "Minecraft", "NeoForge", "IntelliJ IDEA"]
date: 2026-01-12
readTime: 60
prerequisites: ["Windows", "Minecraft Java Edition comprado"]
version: "NeoForge 1.21.10"
wip: true
---

## Introducción

El modding de Minecraft Java permite personalizar el juego a fondo: añadir nuevas mecánicas, bloques, objetos e incluso sistemas completos.

Esta guía se centra en **NeoForge 1.21.10**, una plataforma de modding moderna y con mantenimiento activo. El objetivo es ayudarte a montar un **entorno de desarrollo limpio** y entender las bases necesarias para empezar a crear tus propios mods.

Esta guía está pensada para principiantes, pero busca seguir **flujos de trabajo profesionales y reales**.

---

### ¿Qué es el modding?

El modding es el proceso de modificar el comportamiento o el contenido de un juego sin tocar su código fuente original. En Minecraft Java Edition, esto se hace escribiendo código Java que interactúa con el juego a través de un cargador de mods como **NeoForge**.

Los mods pueden ir desde pequeños ajustes de comodidad hasta revisiones completas de la jugabilidad.

---

### ¿Por qué modear Minecraft Java?

- Un ecosistema de modding enorme y activo
- Acceso completo a Java y APIs potentes
- Herramientas sólidas (Gradle, IntelliJ, Git)
- Compatibilidad de mods a largo plazo
- Un entorno ideal para aprender conceptos de modding de videojuegos

---

## Preparar el entorno

En esta sección prepararemos un entorno de desarrollo limpio para modear **Minecraft Java Edition** con **NeoForge 1.21.10**.

Esta guía da por hecho que trabajas en **Windows** y que usas **IntelliJ IDEA Community Edition**.

---

### Requisitos del sistema

Antes de empezar, asegúrate de que tu sistema cumple los siguientes requisitos:

- Windows 10 o posterior (64 bits)
- **Minecraft Java Edition** comprado
- **Java Development Kit (JDK) 21**
- Minecraft usa una **JVM de 64 bits**. Compruébalo con: java -version
- **Git** recomendado para el control de versiones
- **IntelliJ IDEA Community Edition** o **Eclipse**

---

### Herramientas necesarias

Necesitarás tener instaladas las siguientes herramientas:

- **Java JDK 21**  <br>
  Recomendado: Eclipse Adoptium (HotSpot):
  https://adoptium.net/es/temurin/releases?version=21&os=any&arch=any

-  **IDE**<br>
    IntelliJ IDEA Community Edition : https://www.jetbrains.com/idea/download/?section=windows
    Eclipse : https://eclipseide.org/

- **Git** (opcional)  <br>
  Para el control de versiones y la inicialización del proyecto


---

### Crear el repositorio Git

1. Crea una carpeta nueva para tu proyecto de mod.
2. Inicializa Git dentro de la carpeta:

```bash
git init
```

*Puedes usar GitHub Desktop y arrastrar una carpeta directamente dentro; creará automáticamente
un repositorio y la carpeta .git*


### Crear el proyecto de NeoForge

NeoForge tiene una herramienta que nos facilita generar el entorno, [ModGenerator](https://neoforged.net/mod-generator/).
Crea automáticamente un proyecto sencillo para empezar; solo tendrás que decidir el nombre del mod y del paquete.

Cualquiera de los dos plugins de Gradle funciona bien, así que puedes elegir el que quieras: ModDevGradle o NeoGradle. Para ver las diferencias puedes
consultar estas webs:

- ModDevGradle: https://projects.neoforged.net/neoforged/moddevgradle
- NeoGradle: https://projects.neoforged.net/neoforged/neogradle
