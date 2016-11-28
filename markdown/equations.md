--------
__Name__: URI


__Description__:

Relation of **Voltage**, **Current** and **Resistance** ![Image of URI](http://www.elektronik-kompendium.de/sites/grd/schalt/15050611.gif)

__Equation__:

R * I - U = 0

__IO__:

* __U__ [ _Volt_ ] | R * I  
Input voltagesadsad as foobar  
sdsdsd blah
* __R__ [ _Ohm_ ] | U / I  
Input ohm1
* __I__ [ _Ampere_ ] | U / R  
Input sd

--------

__Name__: PUI


__Description__:

Relation of **Voltage**, **Current** and **POWER** 

__Equation__:

U * I - P = 0

__IO__:

* __P__ [ _Watt_ ] | U * I  
Power
* __U__ [ _Volt_ ] | P / I  
Input voltagesadsad as foobar  
sdsdsd blah
* __I__ [ _Ampere_ ] | P / U  
Input sd

--------

__Name__: Torque/RPM/Power


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

__Name__: Wire resistance


__Description__:

Relation of wire length, wire area, specific material resistance and total wire resistance. 

__Equation__:

(Rs * L  / A ) - R

__IO__:

* __Rs__ [ _Specific Resistance_ ] | (R * A) / L   
Wire materials specific resistance
* __R__ [ _Ohm_ ] | Rs * L  / A   
Wire resistance
* __L__ [ _Meter_ ] | (R * A) / Rs  
Wire length
* __A__ [ _Square Millimeter_ ] | Rs * L / R  
Wire area

--------

__Name__: Square Area


__Description__:

TEST

__Equation__:

TEST

__IO__:

* __C__ [ _Meter_ ] | math.sqrt(F)  
Length
* __F__ [ _Square Meter_ ] | C * C  
Area
--------

__Name__: Power/Flow/Pressure guestimation


__Description__:

Some hydraulic Power/Flow/Pressure guestimation

__Equation__:

(Power * 0.6 / Pressure) - Flow
__IO__:

* __Power__ [ _Watt_ ] | (Flow * Pressure) / 0.6  
Power in watt
* __Pressure__ [ _Bar_ ] |  (Power * 0.6) / Flow 
Pressure in Bar
* __Flow__ [ _Liter per minute_ ] | (Power * 0.6) / Pressure  
Low in Liter per minute

--------

__Name__: RC time constant TAO


__Description__:

It is the time required to charge the capacitor, through the resistor, by ≈ 63.2 percent of the difference between the initial value and final value or discharge the capacitor to ≈36.8 percent.

__Equation__:

R * C - TAO = 0

__IO__:

* __TAO__ [ _Second_ ] | R * C  
time constant
* __R__ [ _Ohm_ ] | TAO / C  
Resistor
* __C__ [ _Farad_ ] | TAO / R  
cap

--------

__Name__: RC Cut-off frequency


__Description__:

In physics and electrical engineering, a cutoff frequency, corner frequency, or break frequency is a boundary in a system's frequency response at which energy flowing through the system begins to be reduced (attenuated or reflected) rather than passing through.

__Equation__:

(1 / (2 * math.pi * R * C)) - F = 0

__IO__:

* __F__ [ _Hertz_ ] | 1 / (2 * math.pi * R * C)   
frequency
* __R__ [ _Ohm_ ] |  1 / (2 * math.pi * C * F)
Resistor
* __C__ [ _Farad_ ] | 1 / (2 * math.pi * R * F)
cap

--------

