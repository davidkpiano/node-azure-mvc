# node-azure-mvc
Example application for creating an MVC Express + Node + TypeScript app and deploying it to Azure

- [Getting Started](#getting-started)
- [What is TypeScript?](#what-is-typescript)
- [Project Setup](#project-setup)

## Getting Started

This tutorial will focus on creating a basic MVC web app with Node, Express, and TypeScript. We'll approach this from the angle of already being familiar with creating an ASP.NET Core MVC app in C#, so this tutorial will model the structure of the [MVC web app](https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-mvc-app/start-mvc?view=aspnetcore-2.1&tabs=aspnetcore2x) tutorial.

In short, if you are a C# developer and want to learn how to make Express MVC apps in Node and TypeScript, this tutorial is for you!

### Install Node

TODO: explain what Node is
https://nodejs.org/en/download/

### Using NPM

NPM is Node's package manager, similar to Nuget. It's included in Node. When adding dependencies to your projects, the first thing you'll need to do in a new project is run `npm init`. This will take you through the steps of creating a new `package.json` file, which will contain the manifest of all the installed dependencies on your project, as well as custom scripts and other configuration settings.

There's two types of dependencies:
- `dependencies` refers to any dependencies your running app actually depends on
  - To install and save a dependency, `npm install some-dependency --save`
  - (or `npm i some-dependency -S` for short)
- `devDependencies` refers to any dependencies needed to build, test, lint, etc. your app, and are not necessary for running the app.
  - To install and save a devDependency, `npm install some-dependency --save-dev`
  - (or `npm i some-dependency -D` for short)

More info:
- https://docs.npmjs.com/files/package.json

### Install VS Code

VS Code is the preferred editor for creating TypeScript projects, as it has built-in support for TypeScript. You can get it here: https://code.visualstudio.com/download

## What is TypeScript?

TypeScript is a "typed superset of JavaScript that compiles to plain JavaScript." JavaScript is not a typed language, which may make it feel unfamiliar when coming from a strongly-typed language like C#. Thankfully, TypeScript (TS for short) provides strong typing support to make JavaScript feel similar to C#.

Throughout the course, we'll compare the TypeScript we write to C#, and explore the differences.

More info:
- http://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- https://www.lynda.com/course-tutorials/Typescript-C-Programmers/543000-2.html

## Project Setup

Create a new directory which will contain our Node app.

```bash
mkdir my-app
cd my-app
```

Initialize the `package.json` file. You can just press <kbd>Enter</kbd> through all the steps, unless you want to set any of the package configuration settings (which you can do at any time in the `package.json` file).

```bash
npm init
```

To get up and running quickly, we'll just install `express` as a dependency:

```bash
npm install express --save
```

[Express](https://expressjs.com/) is the most popular minimalist web framework for Node apps, and you will see many Node apps authored either in Express or variants of Express, such as [Koa](https://koajs.com/) or [Nest](https://nestjs.com/).

Now install TypeScript and the Express types as devDependencies (since they are not required to run the app):

```bash
npm install typescript @types/express --save-dev
```

The `@types/express` package adds the proper typings for `express`, so that it can be strongly typed and work with Intellisense even though it's written in JavaScript.

After installing TypeScript, add a `tsconfig.json` file to the project root with the following configuration:

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "esModuleInterop": true,
        "target": "es6",
        "noImplicitAny": true,
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist",
        "baseUrl": ".",
        "paths": {
            "*": [
                "node_modules/*",
                "src/types/*"
            ]
        }
    },
    "include": [
        "src/**/*"
    ]
}
```

This file contains the config settings for compiling the TypeScript code. In short, it tells TypeScript to look for `.ts` files in the `src/` directories and subdirectories, compile it according to the config settings, and output the compiled `.js` files in the `dist/` directory. To dive deeper into what each of these configuration settings mean, check out the [TypeScript Node Starter readme](https://github.com/Microsoft/TypeScript-Node-Starter#configuring-typescript-compilation) or the [TypeScript config file docs](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html).
