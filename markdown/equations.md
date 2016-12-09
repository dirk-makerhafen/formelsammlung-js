--------
__Name__: URI

__Description__:

Relation of **Voltage**, **Current** and **Resistance** 

![Image of URI](http://www.elektronik-kompendium.de/sites/grd/schalt/15050611.gif)

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

1 / (2 * math.pi * R * C)  = F


__IO__:

* __F__ [ _Hertz_ ] | 1 / (2 * math.pi * R * C)  
Frequency
* __R__ [ _Ohm_ ] |  1 / (2 * math.pi * C * F)  
Resistor
* __C__ [ _Farad_ ] | 1 / (2 * math.pi * R * F)  
Capacitance

--------

__Name__: Second moment of area of Circle

__Description__:


https://en.wikipedia.org/wiki/List_of_second_moments_of_area


![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Moment_of_area_of_an_annulus.svg/345px-Moment_of_area_of_an_annulus.svg.png)

__Equation__:

Ix = Iy = (math.pi / 4) * ( r2^4 - r1^4 )

__IO__:

* __r1__ [ _Meter_ ] |  (r2^4 - ((4 * I) / math.pi))^(1/4)  
inner radius, or 0
* __r2__ [ _Meter_ ] |  (r1^4 + ((4 * I) / math.pi))^(1/4)  
Outer Radius
* __I__ [ _Second moment of area_ ] |  (math.pi / 4) * ( r2^4 - r1^4 )  
Second moment of area

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


Vc = Vs + ( (Vi - Vs) * math.e**(-T/R*C) )  

__IO__:

* __Vi__ [ _Volt_ ] |   (( Vc - Vs ) /  math.e**(-T/R*C))+Vs
From voltage - Initial voltage of the capacitor
* __Vc__ [ _Volt_ ] |  Vs + ( (Vi - Vs) * math.e**(-T/R*C) )  
To voltage - Voltage of the capacitor after time has passed
* __Vs__ [ _Volt_ ] |  Vc - (Vi * math.e**(-T/R*C)) / ( 1 - math.e**(-T/R*C) ) 
Supply voltage - Voltage of the power supply. This can also be zero to represent a short
* __C__ [ _Farad_ ] |  (-T / math.log((Vc - Vs) / (Vi-Vs))) / R
Capacitance - Capacitance of the capacitor
* __R__ [ _Ohm_ ] |  (-T / (math.log((Vc - Vs) / (Vi-Vs)))) / C
Resistance - Resistance of the resistor
* __T__ [ _Second_ ] |  ( C * R ) * math.log((Vc - Vs) / (Vi-Vs))  *-1   
Time - Charging or discharging time period


--------

__Name__: Milling RPM /  Tool Diameter / Cutting Speed

__Description__:

 Milling stuff

__Equation__:

S / (math.pi * Dt / 1000) - RPM = 0

__IO__:

* __Dt__ [ _Millimeter_ ] | (S / (RPM * math.pi)) * 1000
Tool diamter
* __RPM__ [ _Rotations per minute_ ] |  S / (math.pi * Dt / 1000)  
Tool RPM
* __S__ [ _Surface cutting speed_ ] |  RPM * (math.pi * Dt / 1000)
Surface cutting speed

S / (math.pi * Dt) = RPM

--------

__Name__: Milling Feedrate / RPM / Chipload / Number of teeth

__Description__:

 Milling stuff

__Equation__:

RPM =  FR / ( n * CL/1000 ) 
__IO__:

* __n__ [ _Number of_ ] | FR / ( CL/1000 * RPM)  
Number of teeth
* __RPM__ [ _Rotations per minute_ ] | FR / ( n * CL/1000 )  
Tool RPM
* __FR__ [ _Meter per minute_ ] | RPM * n * CL/1000  
Feed rate
* __CL__ [ _Chip load_ ] | FR / ( n * RPM ) * 1000 
Chip load in mm

--------

__Name__: Cantilever beam deflection, End-loaded

__Description__:

https://en.wikipedia.org/wiki/Deflection_(engineering)

![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Cantilever_with_end_load.svg/330px-Cantilever_with_end_load.svg.png)
![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Cantilever_beam_deflection.svg/330px-Cantilever_beam_deflection.svg.png)
 
__Equation__:

f = (F * L^3) / (3 * E * I * 10^4)

__IO__:

* __f__ [ _Millimeter_ ] |  (F * L^3) / (3 * E * I * 10^4)  
Biegung durch Kraft F in mm
* __F__ [ _Newton_ ] |  ( 3 * E * f * I * 10^4) / L^3  
Belastung
* __L__ [ _Meter_ ] |  ((3 * E * f * I * 10^4) / F)^(1/3)  
Laenge
* __E__ [ _E-Modul_ ] |  ( F * L^3 ) / ( 3 * f * I * 10^4)  
E-Modul
* __I__ [ _Second moment of area_ ] |  ( F * L^3 ) / ( 3 * E * f * 10^4 )  
Second moment of area
   
   
--------

__Name__: Cantilever beam deflection, Uniformly-loaded

__Description__:


![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Cantilever_with_uniform_distributed_load.svg/330px-Cantilever_with_uniform_distributed_load.svg.png)


__Equation__:

f = (Fg * L^4) / (8 * E * I * 10^4)

__IO__:

* __f__ [ _Millimeter_ ] |  ( Fg * L^4 ) / ( 8 * E * I * 10^4)  
Biegung _Millimeter_
* __Fg__ [ _Newton_ ] |  ( 8 * E * f * I * 10^4) / L^4  
Eigengewicht in newton
* __L__ [ _Meter_ ] |  ((8 * E * f * I * 10^4) / Fg)^(1/4)  
Laenge
* __E__ [ _E-Modul_ ] |  ( Fg * L^4 ) / ( 8 * f * I * 10^4)  
E-Modul
* __I__ [ _Second moment of area_ ] |  ( Fg * L^4 ) / ( 8 * E * f * 10^4)  
Second moment of area
   
--------

__Name__: Simply-supported beam deflection, Center-loaded

__Description__:

Robotunits-Profile-Durchbiegung-Torsion-Berechnungsschema%20(1).pdf

![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Simple_beam_with_center_load.svg/564px-Simple_beam_with_center_load.svg.png)
![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_beam_deflection.svg/330px-Simple_beam_deflection.svg.png)

__Equation__:

f = (F * L^3) / (48 * E * I * 10^4)

__IO__:

* __f__ [ _Millimeter_ ] |  ( F * L^3 ) / ( 48 * E * I * 10^4)  
Biegung _Millimeter_
* __F__ [ _Newton_ ] |  ( 48 * E * f * I * 10^4) / L^3  
Belastung
* __L__ [ _Meter_ ] |  (( 48 * E * f * I * 10^4) / F)^(1/3)  
Laenge
* __E__ [ _E-Modul_ ] |  ( F * L^3 ) / ( 48 * f * I * 10^4)  
E-Modul
* __I__ [ _Second moment of area_ ] |  ( F * L^3 ) / ( 48 * E * f * 10^4)  
Second moment of area
   
--------

__Name__: Simply-supported beam deflection, Off-center-loaded

__Description__:

https://en.wikipedia.org/wiki/Deflection_(engineering)

![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Simple_beam_with_offset_load.svg/330px-Simple_beam_with_offset_load.svg.png)

__Equation__:

f = (F * d * ( L^2 - d^2 )^(3/2)) /  ( 9 * L * E * I * math.sqrt(3) )

__IO__:

* __f__ [ _Millimeter_ ] |  (F * d * ( L^2 - d^2 )^(3/2)) /  ( 9 * L * E * I * math.sqrt(3) )  
Biegung _Millimeter_
* __F__ [ _Newton_ ] |  (9 * E * f * I * L * math.sqrt(3) ) / (d * (L^2 - d^2)^(3/2)  )  
Force acting on the beam
* __L__ [ _Meter_ ] | 42  
Length of the beam between the supports
* __E__ [ _E-Modul_ ] |  (d * F * (L^2 - d^2)^(3/2)) / (9 * f * I * L * math.sqrt(3))  
Modulus of elasticity
* __I__ [ _Second moment of area_ ] |  ( d * F * ( L^2 - d^2 )^(3/2)  ) / ( 9 * E * f * L * math.sqrt(3) )  
Area moment of inertia of cross section
* __d__ [ _Meter_ ] |  23  
Distance from the load to the closest support 
   
   
   
--------

__Name__: Simply-supported beam deflection, Uniformly-loaded 

__Description__:

![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Simple_beam_with_uniform_distributed_load.svg/330px-Simple_beam_with_uniform_distributed_load.svg.png)

__Equation__:

f = (5 * Fg * L^4) / (384 * E * l)

__IO__:

* __f__ [ _Millimeter_ ] |  ( 5 * Fg * L^4 ) / ( 384 * E * I )  
Biegung _Millimeter_r
* __Fg__ [ _Newton_ ] |  ( 384 * E * f * I ) / ( 5 * L^4 ) 
Eigengewicht in newton
* __L__ [ _Meter_ ] |  ( ( 384 * E * f * I ) / ( 5 * Fg ) )^(1/4)     
Laenge
* __E__ [ _E-Modul_ ] |  ( 5 * Fg * L^4 ) / ( 384 * f * I )  
E-Modul
* __I__ [ _Second moment of area_ ] |  ( 5 * Fg * L^4 ) / ( 384 * E * f )   
Second moment of area
   
--------

            
   
   