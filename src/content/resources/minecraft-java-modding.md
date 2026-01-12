---
title: "How to Mod Minecraft Java"
description: "Learn how to mod Minecraft Java Edition using NeoForge to understand the basics and build your own mods from scratch."
image: "/img/minecraft-java-modding.webp"
category: "Guide"
difficulty: "Beginner"
tags: ["Java", "Modding", "Minecraft", "NeoForge", "IntelliJ IDEA"]
date: 2026-01-12
readTime: 60
prerequisites: ["Windows", "Purchased: Minecraft Java Edition"]
version: "NeoForge 1.21.10"
---

## Introduction

Minecraft Java modding allows you to deeply customize gameplay, add new mechanics, blocks, items, and even entire systems.

This guide focuses on **NeoForge 1.21.10**, a modern and actively maintained modding platform. The goal is to help you set up a **clean development environment** and understand the foundations required to start creating your own mods.

This guide is written for beginners but aims to follow **real-world, professional workflows**.

---

### What is Modding?

Modding is the process of modifying a game’s behavior or content without changing its original source code. In Minecraft Java Edition, this is done by writing Java code that interacts with the game through a mod loader such as **NeoForge**.

Mods can range from small quality-of-life tweaks to complete gameplay overhauls.

---

### Why Mod Minecraft Java?

- Huge and active modding ecosystem
- Full Java access and powerful APIs
- Strong tooling (Gradle, IntelliJ, Git)
- Long-term mod compatibility
- Ideal environment to learn game modding concepts

---

## Setting Up

In this section, we’ll prepare a clean development environment for modding **Minecraft Java Edition** using **NeoForge 1.21.10**.

This guide assumes you are working on **Windows** and using **IntelliJ IDEA Community Edition**.

---

### System Requirements

Before we begin, make sure your system meets the following requirements:

- Windows 10 or later (64-bit)
- Purchased **Minecraft Java Edition**
- **Java Development Kit (JDK) 21**
- Minecraft uses a **64-bit JVM**. Check with: java -version
- Recommended **Git** for version control
- **IntelliJ IDEA Community Edition** or **Eclipse**

---

### Required Tools

You will need the following tools installed:

- **Java JDK 21**  <br>
  Recommended: Eclipse Adoptium (HotSpot):
  https://adoptium.net/es/temurin/releases?version=21&os=any&arch=any

-  **IDE**<br>
    IntelliJ IDEA Community Edition : https://www.jetbrains.com/idea/download/?section=windows
    Eclipse : https://eclipseide.org/

- **Git** (Optional)  <br>
  Used for version control and project initialization


---

### Creating the Git Repository

1. Create a new folder for your mod project.
2. Initialize Git inside the folder:

```bash
git init
```

*You can use GitHub Desktop and directly drag a folder inside it, and it will automatically create
a repository and the .git folder*


### Creating the NeoForge Project

NeoForge have a tool which help us generate our environment easier, [ModGenerator](https://neoforged.net/mod-generator/).
This tools automatically creates a simple project to start, you'll just require to decide the mod and package name.

Both GradlePlugins will work just fine so you can pick any of those: ModDevGradle or NeoGradle to check the differences you can
check this websites:

- ModDevGradle: https://projects.neoforged.net/neoforged/moddevgradle
- NeoGradle: https://projects.neoforged.net/neoforged/neogradle
