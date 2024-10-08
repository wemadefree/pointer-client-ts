## Pointer client package

This is an integration package for the Pointer API.

The package is written in TypeScript and utilizes Axios.

- [Setup](#setup)
- [Authenticate](#authenticate)
- [Usage](#usage)
- [Available functions](#available-functions)

### Setup
```npm install @we-made/pointer-client```

Import the package into you main javascript file and create a new pointer client. To authenticate you'll need to include an auth client. See the [Authenticate](#authenticate) section for more information.


The PointerClient requires ```PointerTenantID``` and ```PointerBaseApiUrl```

Remember to run the ```build```function after creating the new ```PointerClient```

Example for Vue.js (main.js):

```
import { createApp } from 'vue'
import App from './App.vue'
import { PointerClient } from '@we-made/pointer-client'
import { FirebaseAuthClient } from '@we-made/firebase-auth-client'

const app = createApp(App)

const authClient = new FirebaseAuthClient(
    process.env.VUE_APP_POINTER_BASE_URL,
    {
        projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID, // Firebase project ID
        authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN, // Firebase auth domain
        apiKey: process.env.VUE_APP_FIREBASE_API_KEY, // Firebase API key
        appId: process.env.VUE_APP_FIREBASE_APP_ID, // Firebase app ID
        measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID, // Firebase measurement ID
        tenantId: process.env.VUE_APP_FIREBASE_TENANT_ID // Firebase tenant ID
    }
)

await authClient.build();

const pointerClient = new PointerClient(
    process.env.VUE_APP_POINTER_TENANT_ID // Tenant ID in pointer
    process.env.VUE_APP_POINTER_BASE_URL,
    authClient
)

await pointerClient.build()
app.config.globalProperties.$pointerClient = pointerClient
app.mount('#app')
```

### Authenticate

There are 2 available packages for authentication. It's also possible to write your own auth client.

#### Available auth clients
- [ServiceAccountAuthClient](https://github.com/wemadefree/service-account-auth-client) for service account authentication (server side authentication).
- [FirebaseAuthClient](https://github.com/wemadefree/firebase-auth-client) for firebase authentication (client side authentication).


### Usage

In the setup example the pointer client was made as a global property.

Example using the global property:

```
const customers = await this.$pointerClient.listEntityRows('customers');
```

The function called will fetch the customers for the pointer tenant.

### Available functions

- [login](#login)
- [getLoginOptions](#getloginoptions)
- [listEntityRows](#listentityrows)
- [getEntityRow](#getentityrow)
- [createEntityRow](#createentityrow)
- [updateEntityRow](#updateentityrow)
- [deleteEntityRow](#deleteentityrow)
- [getEntityProperties](#getentityproperties)
- [getEnumLabel](#getenumlabel)

#### login
Triggers the authentication process in firebase. This defaults to use the google provider (```google.com```)

##### Input parameters:
- providerId: ```string```, optional

##### Example: 
```
await this.$pointerClient.login('microsoft.com');
```

#### getLoginOptions
Fetches the available login providers. These providers can be passed as providerId in the ```login```function

##### Example: 
```
const result = await this.$pointerClient.getLoginOptions();
```

#### listEntityRows
Fetches a list of entity rows for a given entity. 

##### Input parameters:
- Entity: ```string```, required
- Query params: ```object```, optional

##### Example: 
```
const result = await this.$pointerClient.listEntityRows('tasks',
    {
        q: 'Test',
        limit: 10
    }
);
```

#### getEntityRow
Fetches a row of a given entity based on the ID of the row.

##### Input parameters:
- Entity: ```string```, required
- RowID: ```string```, required

##### Example: 
```
const result = await this.$pointerClient.getEntityRow('tasks', '6566fef5fd151145ffs');
```

#### createEntityRow
Creates a row of a given entity. The required fields to create a row of an entity varies. See swagger docs for the entity you wish to create.

##### Input parameters:
- Entity: ```string```, required
- Form params: ```object```, required

##### Example: 
```
const result = await this.$pointerClient.createEntityRow(
    'tasks',
    {
        "name": "Test task"
    }
);
```

#### updateEntityRow
Updates a row of a given entity based on the given row ID. The required fields to update a row of an entity varies. See swagger docs for the entity you wish to update.

##### Input parameters:
- Entity: ```string```, required
- RowID: ```string```, required
- Form params: ```object```, required

##### Example: 
```
const result = await this.$pointerClient.updateEntityRow(
    'tasks',
    '6566fef5fd151145ffs',
    {
        "name": "Updated task"
    }
);
```

#### deleteEntityRow
Deletes a row of a given entity based on the given row ID. This function sets the field ```isArchived``` to ```true``` for the given row.

##### Input parameters:
- Entity: ```string```, required
- RowID: ```string```, required

##### Example: 
```
const result = await this.$pointerClient.deleteEntityRow(
    'tasks',
    '6566fef5fd151145ffs',
    {
        "name": "Updated task"
    }
);
```

#### getEntityProperties
Fetches the properties/fields for a given entity with information about typing, if it's required or not, etc.

##### Input parameters:
- Entity: ```string```, required

##### Example: 
```
const result = await this.$pointerClient.getEntityProperties('tasks');
```

#### getEnumLabel
A helper function to fetch the label value of an enum option based on the enum option value passed as a paramater. If the entity doesn't exist, entity property doesn't exist or isn't an enum, or the enum value doesn't exists, the function will return the provided value and throw an error in the console.

##### Input parameters:
- Entity: ```string```, required
- Entity property: ```string```, required
- Entity property value: ```string```, required

##### Example: 
```
const result = await this.$pointerClient.getEnumLabel('tasks', 'statusPhase', 'OPEN');
```

