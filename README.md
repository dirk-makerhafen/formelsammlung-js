# Formelsammlung-js

Lets build a human and machine readable repository of all physical quantities, all commonly used material properties and all equations connecting them. 


## Why

Just google "capacitor discharge calculator", click the first few hits and get annoyed by ad overloaded shit websites. Or go to wikipedia, to any site that contains equations and get annoyed that you can't use equations in any way because they are an image. 


## How

Formelsammlung-js uses human and machine reachable markdown to define Quantities, Materials and Equations. See their individial documentation for all syntax details, or check the markdown folder for existing data.

### [Online Demo](https://dirk-attraktor.github.io/formelsammlung-js/)

To get an impression of how this works take this simple example:
 - Under "Quantities" search and add  "AWG", "Meter" and "Ampere"
 - Under "Materials" add "Copper"
 - Then go to "Equations". They should be sorted by usefulness* and your way to "Watt" (Via AWG2mm2, Wire resistance, URI, PUI) should be straight forward.
 - For the lazy: [Saved Demo Stack](https://dirk-attraktor.github.io/formelsammlung-js/?link=stack:NobwRALmBcYMoEUwBowBMbgG4EMA2ArgKYwDMqAlhrIgPqkpgB2OAtibLgE4AEAjIwCOTGGACC7LhQDGOJjwDqFLkR4BxHAQDmJAL67k4KDSSpq2fMRgAmcmCqi6AFkYt2o7j2tCRsALJEEERcYPqGkI6m6JhguIQcTtaU1PAItACsrmwcsTi8DKjCohIADsF6BkaOfozmzNmirDhBUvj8jA40frQAbIysMBBcxKisvmAAwgD2JWUhqCUwwAC6YVU0AKK1MW45KgDOBHgQ7cmOG7R8AqODw0SUUzsxAyb0oag4z6IA8gCqACoABQBoQMYCIRVgYgA7loeBApjxWKxvGsIptttBwLtRAcjidvGdNpcXDdoEMRvZHliwAAlfZfLq9d50xlgP5AkFggAybOcLLEfIuV1BqAh4yUKh4Bwo%2BwgcmkFXCxngWzMOwasDxxx4BXsKTgwoAnP1bpSKNTwL82Rzgf8WbShSSWQBJPlpTJhcGQsC-WlutEqw2Y7GasDak6k-XnWi2U3ku4PGKAm0Au0s600l6qy4msFurORDKi73jYEB3TLIA)
 
 
*actually, number of input variables that can be associated to the stuff you added before. 


## Syntax documentation

#### [Quantities](readme_quanity.md)
Quantities are all physical entities. (Meter, Miles, Second moment of inertial, Specific resistance..)

#### [Equation](readme_equation.md)
Equations connect Quantities

#### [Material](readme_material.md)
Materials are materials and their propertiers like "mass" or "specific resistance" 
where "mass" and "specific resistance" are known quantities.

