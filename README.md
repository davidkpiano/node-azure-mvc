# node-azure-mvc
Example application for creating an MVC Express + Node + TypeScript app and deploying it to Azure

- [Getting Started](#getting-started)
- [What is TypeScript?](#what-is-typescript)
- [Project Setup](#project-setup)
- [Hello World](#hello-world)
- [Add a controller](#add-a-controller)

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

We will be installing most dependencies as normal dependencies, so that we can use Azure to build the app as part of the deployment process.

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

Now install TypeScript and the Express types:

```bash
npm install typescript @types/express --save
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

### Folder Structure
Here's what our overall folder structure will look like:

```
src/
├─ controllers/
|  └─ MoviesController.ts
├─ models/
|  └─ Movie.ts
├─ routers/
|  └─ MoviesRouter.ts
├─ views/
│  ├─ layouts
|  |  └─ base.tsx
│  └─ movies
|     └─ index.tsx
└─ index.ts
```

Create these directories:

- `touch index.ts`
- `mkdir src && cd src`
- `mkdir models views controllers`
- `cd ../`

When TypeScript compiles this app, it will recursively compile all `.ts` files within these folders and output them in `dist/` with the same structure.

## Hello World

Now that our project is set up, let's set up a simple running Node + Express + TypeScript app. Import the `express` package in `src/index.ts`:

```ts
// src/index.ts

import express from 'express';
```

<details>
  <summary>ℹ️ Compare TS imports to C#</summary>
  <br />
  
In JavaScript/TypeScript, external references to variables/functions/etc. must be explicitly imported and referenced. This is different than C#, where you would use the `using` directive to reference external namespaces.

For example, in C#, the `ReadAllText` function is implicitly available from `using System.IO.File`:
```cs
using System.IO.File;

class ReadFromFile
{
    static void Main()
    {
        // ReadAllText is implicitly available from System.IO.File
        string text = ReadAllText(@"path\to\file.txt");
    }
}
```

Whereas in TypeScript, it is referenced from [the built-in `fs` module](https://nodejs.org/api/fs.html):
```ts
import { readFileSync } from 'fs';

export class ReadFromFile {
    constructor() {
        // readFileSync is explicitly imported from the fs module
        this.text = readFileSync('path/to/file.txt');
    }
}
```

The above can also be written without [import destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import):
```ts
import * as fs from 'fs';

export class ReadFromFile {
    constructor() {
        // readFileSync is referenced from the fs module
        this.text = fs.readFileSync('path/to/file.txt');
    }
}
```
---
</details>
<br />

Following the [hello world guide in the Express docs](https://expressjs.com/en/starter/hello-world.html), continue creating the app:

```ts
// src/index.ts

import express from 'express';

// Creates a new Express app instance
const app = express();

// Configures the http://localhost:5000/ route to send a text response
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Starts the app on port 5000, then calls the callback when 
// the app successfully starts.
app.listen(5000, () => {
    console.log('Listening on port 5000: http://localhost:5000');
});
```

You'll notice that the above TS code is almost the same as the normal JS code, thanks to type inference. We'll make the port configurable later.

### Running the App

There's two steps to run this app:
1. Compile the TypeScript files
2. Run the compiled JavaScript `dist/index.js` file.

To compile the TypeScript files, you can use the `tsc` terminal command, which is made available from installing the `typescript` dependency in this project:

```bash
tsc
```

This will:
1. read the configuration settings and compiler options from `tsconfig.json`
2. compile the TypeScript files from the `"include"` setting (in this case, `"src/**/*`)
3. output the compiled TypeScript files as JavaScript to the specified `"outDir"` setting (in this case, `dist/`)

From there, you can run the compiled `dist/index.js` file via `node`:

```bash
node dist/index.js
# Listening on port 5000: http://localhost:5000
```

### Adding NPM Scripts

Of course, we don't want to manually run `tsc && node dist/index.js` whenever we want the app to run. Thankfully, we can add [custom NPM scripts](https://docs.npmjs.com/misc/scripts) that will both help us in development, as well as provide an easy way for Azure deployment scripts to build and run the app in the cloud.

In `package.json`, add the following scripts:

```json
...
    "scripts": {
        "start": "npm run build-ts && npm run serve",
        "serve": "node dist/index.js",
        "build-ts": "tsc",
        "watch-ts": "tsc --watch",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
...
```

To break these down:
- `npm run start` (or just `npm start`) will run `npm run build-ts` and then `npm run serve` once that completes...
- `npm run serve` will serve the compiled JS app via `node`
- `npm run build-ts` will compile the TS files via `tsc`
- `npm run watch-ts` can be used in development to automatically compile the TS files whenever the files change
- `npm run test` (or just `npm test`) is not specified yet, but will be used to run the unit/E2E tests

Now, you can run the below command to run your Node app:
```bash
npm start
```

## Add a controller

Although Express is unopinionated, a common architectural pattern to implementing web apps and APIs is MVC (**M**model **V**iew **C**ontroller), which will be familiar to you if you have experience with [ASP.NET MVC](https://docs.microsoft.com/en-us/aspnet/core/mvc/overview?view=aspnetcore-2.1#what-is-the-mvc-pattern). We'll be creating our application using the same architecture, with these responsibilities:

- **Models** will be responsible for fetching, modifying, and storing data that the app will use. They'll connect to the database(s), external APIs, and other data sources that our app might need.
  - e.g., `src/models/UserModel.ts`
- **Views** will be used for displaying the app's UI. With single-page apps (SPAs), views will remain mostly static, as the app will be used in a RESTful way.
  - e.g., `src/views/users.pug`
- **Controllers** will handle requests, make calls to the necessary models to fetch/update data, and respond with a representation of that data -- which can be an HTML response (with MVC apps), a JSON response (RESTful API + SPA), a status code response, etc.
  - e.g., `src/controllers/MoviesController.ts`
- **Routers** will map URLs to controller request handlers.
  - e.g., `src/routers/MoviesRouter.ts`

Create `src/controllers/MoviesController.ts`:

```ts
// Reference the Request and Response types from express
import { Request, Response } from 'express';

export function index(req: Request, res: Response) {
    res.send('This is my default response..');
}

export function getWelcome(req: Request, res: Response) {
    res.send('This is my welcome response...');
}
```

<details>
  <summary>ℹ️ Where's the class? Compare TS to C#</summary>
  <br />
  
  In [ASP.NET MVC](https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-mvc-app/adding-controller?view=aspnetcore-2.1), you would be `using Microsoft.AspNetCore.MVC` to inherit from its `Controller` base class to create the controller. This has the advantages of automatically mapping to the default `/[Controller]/[ActionName]/[Parameters]` route logic in an ASP.NET MVC app.
  
  However, since Express is unopinionated, we will just be `export`-ing the request handler functions, for use in the routers. These functions don't `return` anything, but instead they call `res.send(...)` to send the response with the given `body` (in this case, plain text).
  
  Since they are just functions, they don't need a class to group them. "Namespacing" is taken care of by importing entire modules using the `import * as someVariable from '/some/path'`:
  
  ```ts
  // Places the exported { index, getWelcome } functions into moviesController
  import * as moviesController from '../controllers/MoviesController';
  
  moviesController.index // function
  moviesController.getWelcome // function
  ```
  
  This is the idiomatic way to group related variables and functions into a single module in TS/JS, without the use of an explicit `namespace` or `class`.
  
  ---
</details>
<br />

Now create `src/routers/MoviesRouter.ts` to group these route handlers to actual routes:

```ts
// src/routers/MovieRouter.ts

import { Router } from 'express';
import * as moviesController from '../controllers/MoviesController';

// Create a new router to handle /movies routes
const moviesRouter = Router();

// GET /movies/
moviesRouter.get('/', moviesController.index);

// GET /movies/welcome
moviesRouter.get('/welcome', moviesController.getWelcome);

export default moviesRouter;
```

To connect this router to the app, use [`app.use()`](https://expressjs.com/en/4x/api.html#app.use) to configure the app and tell Express that whenever an incoming request's URL matches `/movies`, use the `moviesRouter` to handle the request.

```ts
// src/index.ts

// ...
const app = express();

// Handles /movies routes
app.use('/movies', moviesRouter); // << Add this line

// ...
```

The `app.use(...)` method is a way to mount [middleware](https://expressjs.com/en/guide/using-middleware.html) for the specified path (in this case, `'/movies'`). You can think of Express routers as middleware, since they intercept the requests matching that URL, make changes to the request/response objects, and (in this case) end the request/response cycle by calling `res.send(...)` or `res.end(...)`.

Now compile and run the app and visit http://localhost:5000/movies/ and http://localhost:5000/movies/welcome. You'll see the correct responses for each of the routes.

```bash
npm run build-ts && npm start
```

Here's what's happening when each request (e.g., `http://localhost:5000/movies/welcome`) is made:
- The `app` listens for the request
- Request URL matches `'/movies'`, so the request is sent to the `moviesRouter` middleware (defined in `src/routers/MoviesRouter.ts`)
- The URL sub-path matches `'/welcome'` and the request method matches `GET`, so `moviesController.getWelcome` handles the request (defined in `src/controllers/MoviesController.ts`)
- `moviesController.getWelcome(req, res)` receives the request and response, and...
- Finally, that `getWelcome(req, res)` function calls `res.send(...)`, which sends the response and ends the request/response cycle.

### Query parameters

Modify the code to pass some query parameter data from the URL to the controller. For example, `http://localhost:5000/movies/welcome?name=David&numTimes=4`. Change the `getWelcome` method to read from the query data:

```ts
// src/controllers/MoviesController.ts
// ...

export function getWelcome(req: Request, res: Response) {
    const { name, numTimes } = req.query;

    res.send(`Hello ${name}, numTimes is: ${numTimes}`);
}
```

<details>
  <summary>ℹ️ What's the weird variable bracket syntax? Destructuring in TS</summary>
  
  In ES6, variables can be "destructured" from an object or an array (see the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) for more info and use cases). So:
  
  ```ts
  // req.query is an object, e.g., { name: 'David', numTimes: 4 }
  const { name, numTimes } = req.query;
  
  // is the same as
  const name = req.query.name;
  const numTimes = req.query.numTimes;
  ```
  
  In C#, this idea is called [deconstructing](https://docs.microsoft.com/en-us/dotnet/csharp/deconstruct), and (at the time of writing) only works for tuples and user-defined types.
  
  You can also destructure arrays in ES6 as well:
  
  ```ts
  const numbers = [1, 2, 3, 4];
  const [_, two, __, four] = numbers;
  
  console.log(two, four); // 2 4
  ```
  
  ---
</details>

<details>
  <summary>ℹ️ String interpolation: C# vs TS</summary>
  <br />
  
  In ES6, backticks are used to interpolate expressions in strings. This is similar to the `$` special character in C#:
  
  ```cs
  // C#
  var str = $"Hello {name}, numTimes is: {numTimes}";
  ```
  
  Expressions are interpolated inside the backticked string via the `${ expr }` syntax:
  
  ```ts
  // ES6
  const str = `Hello ${name}, numTimes is: ${numTimes}`;
  ```
  
  These are called **template literals**. More info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  
  ---
</details>
<br />

Compile and run the app (`npm run build-ts && npm start`) and navigate to http://localhost:5000/movies/welcome?name=David&numTimes=4 . You can try different values for `name` and `numTimes`.

### Route parameters

For parameters defined directly on the route, you can use [route parameters](https://expressjs.com/en/guide/routing.html#route-parameters) in Express. To define a route parameter, use the colon (`:`) prefix on the route:

```ts
// src/routers/MoviesRouter.ts
// ...

// GET /movies/welcome
// Add the /:id route parameter
// This will add the 'id' property to req.params
moviesRouter.get('/welcome/:id', moviesController.getWelcome);
```

The route parameters will be placed on the `req.params` object, which you can handle in the controller:

```ts
// src/controllers/MoviesController.ts
// ...

export function getWelcome(req: Request, res: Response) {
    const { id } = req.params; // the 'id' param that was just added
    const { name } = req.query;

    res.send(`Hello ${name}, ID is: ${id}`);
}
```

Now if you navigate to http://localhost:5000/movies/welcome/42?name=David , you should see:

```
Hello David, ID is: 42
```

## Add a view

There are a few different types of JavaScript [template engines](https://expressjs.com/en/guide/using-template-engines.html) which let you interpolate dynamic data into static views. This is useful if you don't want to create a full <abbr title="single-page application">SPA</abbr>.

However, in this tutorial, we're going to use [Express React views](https://github.com/reactjs/express-react-views), which is a "view engine which renders React components on the server." This is helpful if you want to use React in the future, learn it, or avoid deviating from the normal HTML syntax while still maintaining the full expressivity of JS.

Install these three modules (and their types):
- `express-react-views` - the template engine for Express to understand `.jsx` files
  - Note: you don't need to install types for this since it's implicitly loaded by Express
- `react` - the framework for creating React components
- `react-dom` - parses React components and outputs them as HTML (hence DOM, or Document Object Model)

```bash
# install the modules
npm install express-react-views react react-dom --save
# install the types
npm install @types/react @types/react-dom --save
```

```ts
// src/index.ts
// ...
import * as path from 'path';

// Creates a new Express app instance
const app = express();

// Sets up the view engine
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

// ...
```

<details>
  <summary>ℹ️ What is __dirname?</summary>
  <br />
  
  [`__dirname` is a global variable](https://nodejs.org/docs/latest/api/modules.html#modules_dirname) in Node, and it refers to the directory name of the current _module_ (not of the current file). 
  
  ```ts
  path.join(__dirname, '/src/views');
  // will join '/the/path/to/your/project' and '/src/views'
  ```
  
  ---
</details>
<br/>

### Adding the TSX (JSX) view

With the above configuration, views rendered from `res.render('path/to/view')` will be:
1. resolved from the `'views'` path (in this case, `/src/views`)
2. compiled through the view engine (in this case, `'express-react-views'`)
3. sent as an HTML response.

Before we start, we need to make one quick config change to `tsconfig.json`. Add `"jsx": "preserve"` to `"compilerOptions"`:

```js
// tsconfig.json

{
    "compilerOptions": {
        // ...
        "jsx": "preserve",
        // ...
    },
    // ...
}
```

This will tell the TypeScript compiler to preserve the JSX output when compiling it. That is, instead of compiling as `React.createElement('Something', ...)`, it will compile as the original `<Something ...>`. More info: https://www.typescriptlang.org/docs/handbook/jsx.html

Let's make an index view for our `/movies/` route. We will render from `res.render('movies/index')`, so create `src/views/movies/index.tsx`:

```tsx
// src/views/movies/index.tsx
import * as React from 'react';

interface IMoviesViewProps {
    title: string;
}

class MoviesView extends React.Component<IMoviesViewProps> {
    render() {
        return (
            <div>
                <h2>Index</h2>
                <p>Hello from our MoviesView component!</p>
            </div>
        );
    }
}

export default MoviesView;
```

<details>
  <summary>ℹ️ Do I see an interface? Compare C# to TS</summary>
  <br />
  
  Yes! in TypeScript, [interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html) are similar to C# interfaces. They're defined with the same `interface` keyword, and they do support generics.
  
  ```cs
  // C#
  interface IMoviesViewProps
  {
      string title
      {
          get;
      }
  }
  ```
  
  ```ts
  interface IMoviesViewProps {
      readonly title: string;
  }
  ```
  
  Note the difference on where the type is defined. In ES6/TS, all variables are defined with `var`, `let`, or `const`, so types are defined _after_ the variable in TS (e.g., `const title: string = 'some title';`).
  
  ---
</details>
<br />

Now let's modify the `index` handler on the `MoviesController.ts`:

```ts
// src/controllers/MoviesController.ts
import { Request, Response } from 'express';

export function index(req: Request, res: Response) {
    // The second argument ({ title: ... }) will be passed to the view engine,
    // which will pass the data to the React component as props.
    res.render('movies/index', { title: 'Movies' });
}

// ...
```

Build and run the app, navigate to http://localhost:5000/movies/, and you should see the rendered view, saying "Hello from our MoviesView component!".

### Adding a layout

With React, you create [components](https://reactjs.org/docs/react-component.html) which can be composed together. This is helpful when creating layouts. Let's create a base HTML page layout in `src/layouts/base.tsx`:

```tsx
// src/views/layouts/base.tsx
import * as React from 'react';

interface IBaseLayoutProps {
    title: string;
}

class BaseLayout extends React.Component<IBaseLayoutProps> {
    render() {
        return (
            <html>
                <head>
                    <title>{this.props.title}</title>
                </head>
                <body>
                    <header>
                        <h1>{this.props.title} - Movie App</h1>
                    </header>
                    <main>{this.props.children}</main>
                </body>
            </html>
        );
    }
}

export default BaseLayout;
```

There is a special component property called `this.props`, which contains the passed-in attributes and children of the custom React component.

In this example, `this.props.title` refers to the variable passed into `<BaseLayout title="some title">`

The interpolated `{this.props.children}` variable contains the child elements that are passed into the `<BaseLayout>` component.

Import `BaseLayout` and use it in the `MoviesView`:

```tsx
// src/views/movies/index.tsx
import * as React from 'react';
import BaseLayout from '../layouts/base';

interface IMoviesViewProps {
    title: string;
}

class MoviesView extends React.Component<IMoviesViewProps> {
    render() {
        return (
            <BaseLayout title={this.props.title}>
                <h2>Index</h2>
                <p>Hello from our MoviesView component!</p>
            </BaseLayout>
        );
    }
}

export default MoviesView;
```

You should see the "Movies - Movie App" text (from our interpolated `"Movies"` title) as well as the content of the `<MoviesView>` component. Here's what's happening:

1. The Movies controller (`src/controllers/MoviesController.ts`) passes the `{ title: 'Movies' }` props into the `'movies/index'` view via `res.render('movies/index', { title: 'Movies' })`
2. The view engine maps that view path to `views/movies/index.tsx` and passes the props into the `<MoviesView>` component
    - i.e., `<MoviesView title="Movies" />`
3. The `<MoviesView>` component renders the `<BaseLayout>` component and passes its received `title` prop into it via `this.props.title`
    - i.e., `<BaseLayout title={this.props.title}>` which becomes `<BaseLayout title={"Movies"}>`
4. The `<BaseLayout>` component renders its view, which recursively renders all its child views.

## Add a model

In a real app, the data that the controller retrieves, which is then passed to the view, usually comes from a data store somewhere, whether that's via an external API or a database. We're going to use MongoDB and Mongoose to create our models:

- [MongoDB](https://docs.mongodb.com/manual/introduction/) is "an open-source document database that provides high performance, high availability, and automatic scaling." Sounds similar to CosmosDB? You're right, but more on that later.
- [Mongoose](http://mongoosejs.com/) helps you create, update, and validate model schemas for MongoDB. 

First install Mongoose and its types:

```bash
npm install mongoose @types/mongoose --save
```

Now create a `Movie` model in `src/models/Movie.ts`. This will be responsible for creating, updating, deleting, querying, etc. our movies.

```ts
// src/models/Movie.ts
import { Schema, model } from 'mongoose';

// Create Movie schema
const MovieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    releaseDate: Date,
    genre: String,
    price: Number
});
// Create Movie model
const Movie = model('Movie', MovieSchema);

export default Movie;
```

That `{ type, required }` syntax for the `title` property is part of [Mongoose's validation](http://mongoosejs.com/docs/validation.html).

Before we go further, we need an actual MongoDB database to store our data. Follow [the MongoDB installation steps](https://docs.mongodb.com/manual/installation/#tutorial-installation) and then run the `mongod` process. You should see terminal output that includes the line:

```
[initandlisten] waiting for connections on port 27017
```

To [connect Mongoose to MongoDB](http://mongoosejs.com/docs/connections.html), we'll call `mongoose.connect(...)`. Since this is an app-specific call, put it in `index.ts` for now.

```ts
// src/index.ts
// ...
import { connect } from 'mongoose';

// Connect the database
// We'll remove the hardcoded URL later.
const mongoUrl = 'mongodb://127.0.0.1:27017/moviesapp';
connect(mongoUrl)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// ...
```

<details>
  <summary>ℹ️ What is that then/catch pattern? Promises in TS vs. Tasks in C#</summary>
  <br/>
  
  A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) is a pattern for doing asynchronous programming in JS. It represents something that happens over time, and either _resolves_ or _rejects_. The callbacks provided for a resolved or rejected promise are `.then(resolvedCallback)` or `.catch(rejectedCallback)`, respectively.
  
  A near-equivalent in C# are [Tasks](https://docs.microsoft.com/en-us/dotnet/csharp/async). What's interesting to note is that, in TypeScript, the `async/await` model can be used for promises as well, so in an async function, the above code can be written as:
  
  ```ts
  async function connectToDatabase(url) {
      try {
          // This would be e.g.,
          // const response = await connect(url);
          // but in this case, it resolves with undefined.
          await connect(url);
          console.log('Connected to database');
      } catch(err) {
          console.error('MongoDB connection error: ', err);
      }
  }
  
  // in another async function, this can be await-ed as well
  connectToDatabase(mongoUrl);
  ```
  
  More info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
  ---
</details>
<br />

### Environment variables

Of course, hard-coding the connection string isn't the best idea, especially if we want this to be configurable in different environments. In Node, environment variables are loaded into the global [`process.env`](https://nodejs.org/api/process.html#process_process_env) object. For example, let's make the port configurable by editing the `"serve"` script in `package.json` and using the `PORT` environment variable to serve our app:

```js
// package.json
// ...
    "scripts": {
        "start": "npm run serve",
        "serve": "PORT=5001 node dist/index.js",
        "build-ts": "tsc",
        "watch-ts": "tsc --watch",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
// ...
```

```ts
// src/index.ts

// ...

const port = process.env.PORT || 5000;

// Starts the app on the configured port, then calls the callback when
// the app successfully starts.
app.listen(port, () => {
    console.log(`Listening on port ${port}: http://localhost:${port}`);
});
```

That `PORT=5001` command will put `"5001"` into `process.env.PORT`, which we can use directly in the Node scripts. Now when you build and run the app, you should see `Listening on port 5001: http://localhost:5001`.

However, we will have many environment variables to manage. To make this easier, we can create a `.env` file at the root of our project that contains these environment variables, and then automatically load them in using a [handy module called `dotenv`](https://www.npmjs.com/package/dotenv).

First, create the `.env` file:

```bash
# .env
PORT=5001
MONGODB_URL=mongodb://127.0.0.1:27017/moviesapp
```

Install `dotenv` and its types:

```bash
npm install dotenv --save && npm install @types/dotenv --save-dev
```

And initialize `dotenv` in `index.ts` (this is [straight from the readme](https://www.npmjs.com/package/dotenv#usage)):

```ts
// src/index.ts
// ...

import * as dotenv from 'dotenv';

dotenv.config();

// Connect the database
// Notice how we got rid of the hardcoded URL:
connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log('MongoDB connection error.');
    });
    
// ...

const port = process.env.PORT;

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${port}: http://localhost:${port}`);
});
```

And go ahead and revert the `"serve"` script change in `package.json` -- it's no longer needed. Build and run your app (`npm run start`) to verify that everything still works.

⚠️ **Warning:** Before you make any commits, always make sure that your `.env` files are ignored. Check that this is in your `.gitignore` file:

```bash
# dotenv environment variables file
.env
```

## Automatic building

If you find yourself repeating something a lot, it's best to automate it away. Right now, we're finding ourselves having to stop and restart the app (`npm run start`) every time we make a change that we want to view.

Instead, we can use the popular [`nodemon`](https://nodemon.io/) package to reload the app automatically.

1. Install `nodemon`: `npm install nodemon --save-dev` (not used in production)
2. Add this NPM script to your `package.json` file:

```js
{
    // ...
    "scripts": {
        // ...
        "watch": "npm run watch-ts & npm run serve-dev",
        "serve-dev": "./node_modules/.bin/nodemon dist/index.js",
        // ...
    }
}
```

This will:
- Run the `watch-ts` and `serve-dev` in parallel
- `serve-dev` will detect changes to `dist/index.js` and the files it references and reload the running app whenever a change is made, which occurs whenever `watch-ts` rebuilds the `.ts` files.

ℹ️ At the time of writing, pressing <kbd>control</kbd> + <kbd>C</kbd> will stop both processes but return an `errno 130`. This is innocuous, and is a temporary issue. See [here](https://github.com/remy/nodemon/issues/1390) for more details.

Run the app in watch mode via `npm run watch` to prevent having to manually rebuild the app.

## Create a POST request

Let's work with the actual database and persist some data into it. Here's the plan:

- Create a `postMovie(...)` method in `MoviesController.ts` that will create a new `Movie` model based on the JSON request body and save (persist) it
- Create a `POST /movies/new` route that uses that `postMovie(...)` controller method 
- Configure the app to handle JSON requests

### Handling JSON requests

Express includes middleware for handling requests with the header `Content-Type: application/json` which (assumedly) has a body with JSON content. This middleware is built into Express: `express.json()`. Configure the app to use this middleware:

```ts
// src/index.ts
// ...

app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

// Parses JSON in body
app.use(express.json()); // << Add this line

// ...
```

Create the POST request handler in `MoviesController.ts`:

```ts
// src/controllers/MoviesController.ts
// ...

export async function postMovie(req: Request, res: Response) {
    try {
        // Create the new movie using the JSON data from the request body
        const newMovie = new Movie(req.body);

        // Persist the movie to the database
        const savedMovie = await newMovie.save();

        // Respond with the persisted data
        return res.json(savedMovie);
    } catch (ex) {
    	// Catch any validation errors
        return res.status(400).send(ex.message);
    }
}
```

And then create the route in `MoviesRouter.ts`:

```ts
// src/routes/MoviesRouter.ts
// ...

// POST /movies/new
moviesRouter.post('/new', moviesController.postMovie);
```

Using [Postman](https://www.getpostman.com/) or [cURL](https://curl.haxx.se/), make a POST request with:

- Headers: `Content-Type: application/json`
- Body: any sample movie data that fits the `Movie` model schema:

```json
{
	"title": "Mission Impossible",
	"releaseDate": "2018-06-06",
	"genre": "Action",
	"price": 10.5
}
```

You should get a response like:

```json
{
    "_id": "5b6db66479f65945894e0d1c",
    "title": "Mission Impossible",
    "releaseDate": "2018-06-06T00:00:00.000Z",
    "genre": "Action",
    "price": 10.5,
    "__v": 0
}
```

If you try to send an invalid request, such as missing the `title` attribute, Mongoose will throw an error like:

> `Movie validation failed: title: Path 'title' is required.`

In our code, we're surfacing that error to the user with a `400 Bad Request` status code.

## Create a GET request

When creating a [document in MongoDB](http://mongoosejs.com/docs/documents.html) (that is, an instance of a model), a unique ID is automatically assigned to it. Add a GET endpoint to retrieve movies by their ID:

1. Create the `getMovie` request handler in `MoviesController.ts`
    - This will query the database for a `Movie` model by its `_id` and respond with it as JSON
    - If not found, this should respond with `404 Not Found`.
2. Add the `GET /movies/:id` route to `MoviesRouter.ts`

```ts
// src/controllers/MoviesController.ts
// ...

export async function getMovie(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { id } = req.params;

        const movie = await Movie.findById(id).exec();

        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        return res.json(movie);
    } catch (e) {
        next(e);
    }
}

// ...
```

```ts
// src/routers/MoviesRouter.ts
// ...

// GET /movies/:id
moviesRouter.get('/:id', moviesController.getMovie);

// ...
```

You can make a `POST /movies/` request to create a movie, get its ID, and verify that the `GET /movies/:id` endpoint is working. Keep in mind that this route expects a JSON body. We can add middleware to the router to ensure that this is the case:

```ts
// src/routers/MoviesRouter.ts
// Create a new router to handle /movies routes
const moviesRouter = Router();

// Ensure that POST, PUT, and PATCH methods only accept Content-Type: application/json bodies
moviesRouter.use((req, res, next) => {
    if (
        ['POST', 'PUT', 'PATCH'].indexOf(req.method) !== -1 &&
        !req.is('json')
    ) {
        return res.status(415).send('Content-Type must be application/json');
    }

    return next();
});
```

## Deploy to Azure

At this point, we have a solid <attr title="Minimum Viable Product">MVP</attr> for our Movies app, and we can deploy it to the cloud. We'll be using [Azure App Service]() to do this. If you want more info on how to deploy a Node and MongoDB app to Azure App Service, check out [this tutorial](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-nodejs-mongodb-app), which we will be following.

Here's the plan:
1. Create a production MongoDB instance using Cosmos DB
2. Configure environment variables on Azure
3. Test the production environment locally
4. Deploy app to Azure App Service
    - Configure a deployment user
    - Create an App Service Plan
    - Create a Web App using local git
    - Push to Azure from Git
    
### Create a resource group

This resource group will contain the web app and CosmosDB instance. https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-nodejs-mongodb-app#create-a-resource-group

```bash
az group create \
    --name moviesResourceGroup \
    --location "East US"
```

### Create an app service plan

https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-nodejs-mongodb-app#create-an-app-service-plan

```bash
az appservice plan create \
    --name moviesServicePlan \
    --resource-group moviesResourceGroup \
    --sku FREE
```

### Create an Azure web app

To find the available Node runtimes, run `az webapp list-runtimes | grep node`

```bash
az webapp create \
    --resource-group moviesResourceGroup \
    --plan moviesServicePlan \
    --name someGloballyUniqueMoviesApp \
    --runtime "node|8.1" \
    --deployment-local-git
```

### Create a Cosmos DB account

Using Cosmos DB, we can interface with a database instance with the MongoDB API. This is done by specifying the `--kind MongoDB` argument. Create a database with a globally unique name. Grab a coffee, because this might take a while. https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-nodejs-mongodb-app#create-a-cosmos-db-account

⚠️ The database name has to be globally unique and lowercase. Don't use `globally-unique-movies`, I'm already using it.

```bash
az cosmosdb create \
    --name globally-unique-movies \
    --resource-group moviesResourceGroup \
    --kind MongoDB
```

Once created, the database keys can be retrieved. https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-nodejs-mongodb-app#connect-app-to-production-mongodb

```bash
az cosmosdb list-keys --name globally-unique-movies --resource-group moviesResourceGroup
```

The linked tutorial stores the production-specific environment variables locally; however, this is not recommended. Instead, you should be using Azure itself to manage production environment variables, and only keeping local environment variables locally.

### Add deployment script

There's an important non-obvious step that must be done for this Node app to deploy successfully. We need to create two files:

- `.deployment` - Contains the Azure deployment config
- `deploy.sh` - The actual script to run upon deployment

These files are automatically generated with the Azure-CLI `deploymentscript` command:

```bash
azure site deploymentscript --node
```

When these files are generated, open `deploy.sh`. You'll see all the fun stuff that's happening to succesfully deploy the Node project, but we need to add one thing. Go to step 3:

```sh
# deploy.sh
# ...

# 3. Install npm packages
if [ -e "$DEPLOYMENT_TARGET/package.json" ]; then
  cd "$DEPLOYMENT_TARGET"
  eval $NPM_CMD install --production
  eval $NPM_CMD run build-ts # << Add this line
  exitWithMessageOnError "npm failed"
  cd - > /dev/null
fi



### Configuring environment variables

We'll need to configure one environment variable to connect to MongoDB:

- `MONGODB_URL` - the database connection URL (e.g., `"mongodb://127.0.0.1:27017/moviesapp"`)

To set this in Azure, use [`az webapp config appsettings set`](https://docs.microsoft.com/en-us/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set):

```bash
az webapp config appsettings set \
    --name someGloballyUniqueMoviesApp \
    --resource-group moviesResourceGroup \
    --settings MONGODB_URL="mongodb://<cosmosdb_name>:<primary_master_key>@<cosmosdb_name>.documents.azure.com:10250/mean?ssl=true"
```

Replace `<cosmosdb_name>` with the created Cosmos DB database name (e.g., `globally-unique-moviesmovies`) and `<primary_master_key>` with the `primaryMasterKey` property from running `az cosmosdb list-keys --name globally-unique-movies --resource-group moviesResourceGroup` previously.

This will allow us to work with two separate environments - our local `development` environment as well as our `production` environment:

- The local development app will find the `MONGODB_URL` in the local `.env` file (which is not checked in, thanks to the `.gitignore` file)
- The production app will have the `MONGODB_URL` environment variable set by Azure, and will read it from there.

### Deploy app to Azure

Create deployment credentials using the [`az webapp deployment user set`](https://docs.microsoft.com/en-us/cli/azure/webapp/deployment/user?view=azure-cli-latest#az_webapp_deployment_user_set) command. https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-nodejs-mongodb-app#deploy-app-to-azure

```bash
az webapp deployment user set --user-name <username> --password <password>
```

We will use Git to deploy the app, using the `deploymentLocalGitUrl` from the `az webapp create` step:

> https://<username>@<appname>.scm.azurewebsites.net/<appname>.git

