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

Add me

__Equation__:

C * C - F = 0

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
Time constant
* __R__ [ _Ohm_ ] | TAO / C  
Resistor
* __C__ [ _Farad_ ] | TAO / R  
Capacitance

--------

__Name__: RC Cut-off frequency

__Description__:

In physics and electrical engineering, a cutoff frequency, corner frequency, or break frequency is a boundary in a system's frequency response at which energy flowing through the system begins to be reduced (attenuated or reflected) rather than passing through.

__Equation__:

(1 / (2 * math.pi * R * C)) - F = 0

__IO__:

* __F__ [ _Hertz_ ] | 1 / (2 * math.pi * R * C)  
Frequency
* __R__ [ _Ohm_ ] |  1 / (2 * math.pi * C * F)  
Resistor
* __C__ [ _Farad_ ] | 1 / (2 * math.pi * R * F)  
Capacitance

--------

__Name__: Flächenträgheitsmoment (translate me)

__Description__:

http://www.maschinenbau-wissen.de/skript3/mechanik/balken-biegung/209-biegung-berechnen

__Equation__:

b * h**3 - I = 0

__IO__:

* __b__ [ _Meter_ ] | i / h**3  
Breite
* __h__ [ _Meter_ ] |  12**(1/3) * (i/b)**(1/3)  
Height
* __I__ [ _Flächenträgheitsmoment_ ] | ( b * h**3 ) / 12  
Flächenträgheitsmoment

--------

__Name__: Wavelength

__Description__:

Frequency to wavelength

__Equation__:

299792458 / F = L

__IO__:

* __L__ [ _Meter_ ] | 299792458 / F 
Wavelength
* __F__ [ _Hertz_ ] |  299792458 / L
Frequency

--------

__Name__: Capacitor Charge/Discharge

__Description__:

Capacitor Charge/Discharge

__Equation__:

Vc = Vs + ((Vi-Vs) * math.e**(-T/R*C)  )

__IO__:

* __Vi__ [ _Volt_ ] |   
From voltage - Initial voltage of the capacitor
* __Vc__ [ _Volt_ ] |  Vs + ( (Vi - Vs) * math.e**(-T/R*C) )  
To voltage - Voltage of the capacitor after time has passed
* __Vs__ [ _Volt_ ] |  Vc - ( (Vi - Vs) * math.e**(-T/R*C) )
Supply voltage - Voltage of the power supply. This can also be zero to represent a short
* __C__ [ _Farad_ ] |   
Capacitance - Capacitance of the capacitor
* __R__ [ _Ohm_ ] |  
Resistance - Resistance of the resistor
* __T__ [ _Second_ ] |  
Time - Charging or discharging time period


--------



