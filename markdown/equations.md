--------
__Name__: URI


__Description__:

Relation of **Voltage**, **Current** and **Resistance** ![Image of URI](http://www.elektronik-kompendium.de/sites/grd/schalt/15050611.gif)

__Equation__:

R * I - U = 0

__IO__:

* __U__ [ _Volt_ ] | R*I  
Input voltagesadsad as foobar  
sdsdsd blah
* __R__ [ _Ohm_ ] | U/I  
Input ohm1
* __I__ [ _Ampere_ ] | U/R  
Input sd

--------

__Name__: PUI


__Description__:

Relation of **Voltage**, **Current** and **POWER** 

__Equation__:

U * I - P = 0

__IO__:

* __P__ [ _Watt_ ] | U*I  
Power
* __U__ [ _Volt_ ] | P/I  
Input voltagesadsad as foobar  
sdsdsd blah
* __I__ [ _Ampere_ ] | P/U  
Input sd

--------

__Name__: Motor Torque/RPM/Watt Formula


__Description__:

Relation of Motor RPM, Power and Torque

__Equation__:

(9.5488 * P / RPM) - T = 0

__IO__:

* __P__ [ _Watt_ ] | T /  9.5488 * RPM   
Power
* __RPM__ [ _Rotations per minute_ ] | 9.5488 * P / T  
BLAH
* __T__ [ _Newton Meter_ ] | 9.5488 * P / RPM  
Input sd

--------

__Name__: Widerstand_Draht


__Description__:

todo

__Equation__:

(Rs * L  / A ) - R

__IO__:

* __Rs__ [ _Specific Resistance_ ] | (R * A) / L   
asdads
* __R__ [ _Ohm_ ] | Rs * L  / A   
BLAH
* __L__ [ _Meter_ ] | (R * A) / Rs  
Input sd
* __A__ [ _Square Millimeter_ ] | Rs * L / R  
Input sd

--------

__Name__: TEST


__Description__:

TEST

__Equation__:

TEST

__IO__:

* __C__ [ _Meter_ ] | math.sqrt(F)
Power
* __F__ [ _Square Meter_ ] | C * C
Input voltagesadsad as foobar  
sdsdsd blah

--------

__Name__: power/flow/pressure guestimation


__Description__:

Some hydraulic power/flow/pressure guestimation

__Equation__:

(Watt * 0.6 / Bar) - Flow
__IO__:

* __Watt__ [ _Watt_ ] | (Flow * Bar) / 0.6
    foo
* __Bar__ [ _Bar_ ] |  (Watt * 0.6) / Flow
    bar
* __Flow__ [ _Liter per minute_ ] | (Watt * 0.6) / Bar
    blub

--------