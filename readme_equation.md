
# Equations:

### Example:
```
--------
__Name__: Acceleration 1

__Description__:

From some speed Vi with acceleration a to distance d in time t

<http://www.physicsclassroom.com/class/1DKin/Lesson-6/Kinematic-Equations-and-Free-Fall>

__IO__:

* __d__ [ _Meter_ ] |  vi * t + 1/2 * a * t^2   
Displacement
* __t__ [ _Second_ ] | ( sqrt( ( 2 * a * d ) + vi^2) - vi ) / a  
Time
* __a__ [ _Meter per second square_ ] | (d - ( vi * t )) / (1/2 * t^2)  
Acceleration
* __vi__ [ _Meter per second_ ] | (d - 1/2 * a * t^2) / t  
Initial velocity
 
--------
```

### Rendered example:

--------
__Name__: Acceleration 1

__Description__:

From some speed Vi with acceleration a to distance d in time t

<http://www.physicsclassroom.com/class/1DKin/Lesson-6/Kinematic-Equations-and-Free-Fall>

__IO__:

* __d__ [ _Meter_ ] |  vi * t + 1/2 * a * t^2   
Displacement
* __t__ [ _Second_ ] | ( sqrt( ( 2 * a * d ) + vi^2) - vi ) / a  
Time
* __a__ [ _Meter per second square_ ] | (d - ( vi * t )) / (1/2 * t^2)  
Acceleration
* __vi__ [ _Meter per second_ ] | (d - 1/2 * a * t^2) / t  
Initial velocity
 
--------


### Syntax:
```
--------
__Name__: uniq_name

__Description__:

Description

__IO__:

* __letter__ [ _quantity_ ] | equation
io_display_name
 
--------
```
- uniq_name  
    A uniq name for this equation. Choose wisely, this a a permament uniq identifier for this equation.
- Description  
    A useful description for this equation
- letter  
    A 1 or 2 letter identifier
- quantity  
    uniq name of a quantity
- equation  
    the actual equation transformed to 'letter'. Format is as nice a you can, with spaces, many brackets, no shortcuts.
- io_display_name  
    a short name that should be display near the letter. may just be the quantity name, but thinks like "Initial velocity" and "Final velocity" may be useful
    

## Translation:

### Example:
```
--------
__ParentName__: A unique name  
__Name__: Ein eindeutiger Name

__Description__:

Deutsche Bescheibung.

__IO__:

* __A__   
Blah zu A in deutsch.
* __B__   
Blah zu B in deutsch.

--------
```

### Rendered example:
--------
__ParentName__: A unique name  
__Name__: Ein eindeutiger Name

__Description__:

Deutsche Bescheibung.

__IO__:

* __A__   
Blah zu A in deutsch.
* __B__   
Blah zu B in deutsch.

--------

### Syntax:
```
--------
__ParentName__: uniq_name 
__Name__: translated_name

__Description__:

translated_description

__IO__:

* __letter__   
translated_io_display_name

--------
```


## Advanced:

Therer are some things that can not be expressed with mathjs yet. For example the equation used in  "Coplanar Waveguide With Ground Characteristic Impedance"
In that case you can add arbitary javascript functions to equations like in the example below. Note how 'K' is used in the equation for 'Z' and defined the the function block at the end.


### Example function usage
```
--------

__Name__: Coplanar Waveguide With Ground Characteristic Impedance

__Description__:

<http://chemandy.com/calculators/coplanar-waveguide-with-ground-calculator.htm>

__IO__:

* __Er__ [ _Relative Dielectric Constant_ ] |  
Material Property of PCB
* __Wt__ [ _Meter_ ] |  
Width of the track
* __Wg__ [ _Meter_ ] |  
Width of the gap
* __h__ [ _Meter_ ] |  
Height of the dielectric
* __Z__ [ _Ohm_ ] |  ( 60 * PI / sqrt(Eeff) ) * ( 1 / ( ( K(k) / K(ka) ) + ( K(kl) / K(kla) ) ) )  
    | b  = Wt + 2 * Wg  
    | k  = Wt / b  
    | ka = sqrt(1 - k^2)  
    | kl = tanh( PI * Wt / ( 4 * h ) ) / tanh( PI * b / ( 4 * h ) )  
    | kla = sqrt( 1 - kl^2 )  
    | Eeff = (1 + (  Er * ( ( K(ka) * K(kl) ) / ( K(k) * K(kla) ) ) ) ) / ( 1 + ( ( K(ka) * K(kl) ) / ( K(k) * K(kla) ) ) )  
Characteristic Impedance

__Function__:
* __K__ :  
    some awsome description. See how 'K' is used in the equation above.

``` `
function(k){ 
    var a = 1;
    var b = math.sqrt(1 - k**2);
    var c = k;
    var ka = math.PI/2;
    // Refine the value of K(k') in a loop from n=1 to n=7
    for(var i =0;i<7;i++){
        var d = a;
        var e = b;
        a = (d+e)/2;
        b = math.sqrt(d * e);
        c = (d-e)/2;
        ka = math.PI / (2 * a);
    }
    return ka;
}
``` `
```

NOTE the FOUR ` above seperated by one space, thats just for the example to render correctly, in the real file it must just be THREE, just like a normal markdown code block
