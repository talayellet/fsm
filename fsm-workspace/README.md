# FsmWorkspace

## Run tasks

### json-server

Before running the application, run the following commands to enable the json-server as well
To run the dev server for your app, use:

```sh
npm install
```

```sh
npx json-server --watch db.json --port 3000
```

### Run the application from local dev server

```sh
npx nx serve fsm-app
```

### To create a production bundle:

```sh
npx nx build fsm-app
```

### To see all available targets to run for a project, run:

```sh
npx nx show project fsm-app
```

### To run unit tests

```sh
npx nx run fsm-lib:test
```

### To run E2E tests

```sh
npx cypress open
```

or in headless mode:

```sh
npx nx run fsm-app-e2e:e2e --runner-ui
```
