# core-native

Capa nativa que fa de wrapper pels plugins de Cordova i Capacitor per utilitzar en projectes `angular`.

En un futur, aquests arxius constituiran un nou package `@metacodi/core-native` que es podrà instal·lar via `npm`.

De moment, per utilitzar-lo en projectes angular només cal copiar la carpeta a dins de `src` i importar el mòdul al mòdul principal de l'aplicació:

`src/app.module.ts`
```typescript
import { NgModule } from '@angular/core';

import { NativeModule } from 'src/core-native';


@NgModule({
  imports: [
    NativeModule.forRoot({ debugEnabled: true }),
  ],
})
export class AppModule {}
```