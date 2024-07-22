
## Actulització de plugins

En aquest document descriurem com tenim que procedir per actualitzar el plugins.

# Procediments

És necessari tenir en conte els projectes que tenim en marxa i repasar els plugins que fem servir a cada un perque una vega actualitzem `core-native`, on són tots el plugins, i sustituim el contigut estiguin tots actualitzats.
Tindrem que actualitzar abans el plugins de METADOI i despres instal·lar los tots.

# Plugins de METACODI

Tindrem que pujar de versió de capacitor `@metacodi/capacitor-calendar` i `@metacodi/capacitor-electron`, per això en la web de capacitor ha d'haber un lloc que t'indiqui com actualitzar els plugins.

En aquest moments https://capacitorjs.com/docs/updating/plugins/6-0 i seguir els pasos que indiquen.

# Pasos a seguir instal·lar plugins i mes coses

1. Copiem l'script `do` a l'arrel del nou projecte, que conte paràmetres per fer la correcta seqüencia de la instal·lació.

1. Instal·lar tots els packages dels plugins.

  ```shell
  sh do npmi
  ```

  Si falla algun dels plugins, el tractarem per separat i les seves dependencies.

1. Instal·lar les seves dependències.

  ```shell
  sh do npmidev
  ```

1. Afagim les plataformes de ios, android i electron:

  ```shell
  sh do platforms
  ```
