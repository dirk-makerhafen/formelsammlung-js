--------
__Name__: URI

__Description__:

Relation of **Voltage**, **Current** and **Resistance** 

![Image of URI](http://www.elektronik-kompendium.de/sites/grd/schalt/15050611.gif)

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

__IO__:

* __C__ [ _Meter_ ] | sqrt(F)  
Length
* __F__ [ _Square Meter_ ] | C * C  
Area

--------

__Name__: Power/Flow/Pressure guestimation

__Description__:

Some hydraulic Power/Flow/Pressure guestimation

__IO__:

* __Power__ [ _Watt_ ] | (Flow * Pressure) / 0.6  
Power in watt
* __Pressure__ [ _Bar_ ] |  (Power * 0.6) / Flow  
Pressure in Bar
* __Flow__ [ _lpm_ ] | (Power * 0.6) / Pressure  
Low in Liter per minute

--------

__Name__: RC time constant TAO

__Description__:

It is the time required to charge the capacitor, through the resistor, by ≈ 63.2 percent of the difference between the initial value and final value or discharge the capacitor to ≈36.8 percent.

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

__IO__:

* __F__ [ _Hertz_ ] | 1 / (2 * PI * R * C)  
Frequency
* __R__ [ _Ohm_ ] |  1 / (2 * PI * C * F)  
Resistor
* __C__ [ _Farad_ ] | 1 / (2 * PI * R * F)  
Capacitance

--------

__Name__: Second moment of area of Circle

__Description__:


<https://en.wikipedia.org/wiki/List_of_second_moments_of_area>


![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Moment_of_area_of_an_annulus.svg/345px-Moment_of_area_of_an_annulus.svg.png)

__IO__:

* __r1__ [ _Meter_ ] |  (r2^4 - ((4 * I) / PI))^(1/4)  
inner radius, or 0
* __r2__ [ _Meter_ ] |  (r1^4 + ((4 * I) / PI))^(1/4)  
Outer Radius
* __I__ [ _Second moment of area_ ] |  (PI / 4) * ( r2^4 - r1^4 )  
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


__IO__:

* __Vi__ [ _Volt_ ] |   (( Vc - Vs ) /  e^(-T/(R*C)))+Vs
From voltage - Initial voltage of the capacitor
* __Vc__ [ _Volt_ ] |  Vs + ( (Vi - Vs) * e^(-T/(R*C)) )  
To voltage - Voltage of the capacitor after time has passed
* __Vs__ [ _Volt_ ] |  Vc - (Vi * e^(-T/R*C)) / ( 1 - e^(-T/(R*C)) ) 
Supply voltage - Voltage of the power supply. This can also be zero to represent a short
* __C__ [ _Farad_ ] |  (-T / log((Vc - Vs) / (Vi-Vs))) / R
Capacitance - Capacitance of the capacitor
* __R__ [ _Ohm_ ] |  (-T / (log((Vc - Vs) / (Vi-Vs)))) / C
Resistance - Resistance of the resistor
* __T__ [ _Second_ ] |  ( C * R ) * log((Vc - Vs) / (Vi-Vs))  *-1   
Time - Charging or discharging time period


--------

__Name__: Milling RPM /  Tool Diameter / Cutting Speed

__Description__:

 Milling stuff


__IO__:

* __Dt__ [ _mm_ ] | (S / (RPM * PI)) * 1000
Tool diamter
* __RPM__ [ _rpm_ ] |  S / (PI * Dt / 1000)  
Tool RPM
* __S__ [ _Surface cutting speed_ ] |  RPM * (PI * Dt / 1000)
Surface cutting speed

S / (PI * Dt) = RPM

--------

__Name__: Milling Feedrate / RPM / Chipload / Number of teeth

__Description__:

 Milling stuff


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

<https://en.wikipedia.org/wiki/Deflection_(engineering)>

![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Cantilever_with_end_load.svg/330px-Cantilever_with_end_load.svg.png)
![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Cantilever_beam_deflection.svg/330px-Cantilever_beam_deflection.svg.png)
 
__IO__:

* __f__ [ _Millimeter_ ] |  (F * L^3) / (3 * E * I * 10^4)  
Biegung durch Kraft F in mm
* __F__ [ _Newton_ ] |  ( 3 * E * f * I * 10^4) / L^3  
Belastung
* __L__ [ _Meter_ ] |  ((3 * E * f * I * 10^4) / F)^(1/3)  
Laenge
* __E__ [ _Youngs modulus_ ] |  ( F * L^3 ) / ( 3 * f * I * 10^4)  
Youngs modulus
* __I__ [ _Second moment of area_ ] |  ( F * L^3 ) / ( 3 * E * f * 10^4 )  
Second moment of area
   
   
--------

__Name__: Cantilever beam deflection, Uniformly-loaded

__Description__:


![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Cantilever_with_uniform_distributed_load.svg/330px-Cantilever_with_uniform_distributed_load.svg.png)


__IO__:

* __f__ [ _Millimeter_ ] |  ( Fg * L^4 ) / ( 8 * E * I * 10^4)  
Biegung _Millimeter_
* __Fg__ [ _Newton_ ] |  ( 8 * E * f * I * 10^4) / L^4  
Eigengewicht in newton
* __L__ [ _Meter_ ] |  ((8 * E * f * I * 10^4) / Fg)^(1/4)  
Laenge
* __E__ [ _Youngs modulus_ ] |  ( Fg * L^4 ) / ( 8 * f * I * 10^4)  
Youngs modulus
* __I__ [ _Second moment of area_ ] |  ( Fg * L^4 ) / ( 8 * E * f * 10^4)  
Second moment of area
   
--------

__Name__: Simply-supported beam deflection, Center-loaded

__Description__:

Robotunits-Profile-Durchbiegung-Torsion-Berechnungsschema%20(1).pdf

![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Simple_beam_with_center_load.svg/564px-Simple_beam_with_center_load.svg.png)
![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_beam_deflection.svg/330px-Simple_beam_deflection.svg.png)

__IO__:

* __f__ [ _Millimeter_ ] |  ( F * L^3 ) / ( 48 * E * I * 10^4)  
Biegung _Millimeter_
* __F__ [ _Newton_ ] |  ( 48 * E * f * I * 10^4) / L^3  
Belastung
* __L__ [ _Meter_ ] |  (( 48 * E * f * I * 10^4) / F)^(1/3)  
Laenge
* __E__ [ _Youngs modulus_ ] |  ( F * L^3 ) / ( 48 * f * I * 10^4)  
Youngs modulus
* __I__ [ _Second moment of area_ ] |  ( F * L^3 ) / ( 48 * E * f * 10^4)  
Second moment of area
   
--------

__Name__: Simply-supported beam deflection, Off-center-loaded

__Description__:

<https://en.wikipedia.org/wiki/Deflection_(engineering)>

![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Simple_beam_with_offset_load.svg/330px-Simple_beam_with_offset_load.svg.png)

__IO__:

* __f__ [ _Millimeter_ ] |  (F * d * ( L^2 - d^2 )^(3/2)) /  ( 9 * L * E * I * sqrt(3) )  
Biegung _Millimeter_
* __F__ [ _Newton_ ] |  (9 * E * f * I * L * sqrt(3) ) / (d * (L^2 - d^2)^(3/2)  )  
Force acting on the beam
* __L__ [ _Meter_ ] | 42  
Length of the beam between the supports
* __E__ [ _Youngs modulus_ ] |  (d * F * (L^2 - d^2)^(3/2)) / (9 * f * I * L * sqrt(3))  
Modulus of elasticity
* __I__ [ _Second moment of area_ ] |  ( d * F * ( L^2 - d^2 )^(3/2)  ) / ( 9 * E * f * L * sqrt(3) )  
Area moment of inertia of cross section
* __d__ [ _Meter_ ] |  23  
Distance from the load to the closest support 
   
   
   
--------

__Name__: Simply-supported beam deflection, Uniformly-loaded 

__Description__:

![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Simple_beam_with_uniform_distributed_load.svg/330px-Simple_beam_with_uniform_distributed_load.svg.png)

__IO__:

* __f__ [ _Millimeter_ ] |  ( 5 * Fg * L^4 ) / ( 384 * E * I )  
Biegung _Millimeter_r
* __Fg__ [ _Newton_ ] |  ( 384 * E * f * I ) / ( 5 * L^4 ) 
Eigengewicht in newton
* __L__ [ _Meter_ ] |  ( ( 384 * E * f * I ) / ( 5 * Fg ) )^(1/4)     
Laenge
* __E__ [ _Youngs modulus_ ] |  ( 5 * Fg * L^4 ) / ( 384 * f * I )  
Youngs modulus
* __I__ [ _Second moment of area_ ] |  ( 5 * Fg * L^4 ) / ( 384 * E * f )   
Second moment of area
   
--------

__Name__: Op-Amp Non-Inverting

__Description__:

<https://en.wikipedia.org/wiki/Operational_amplifier_applications#Non-inverting_amplifier>

![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Op-Amp_Non-Inverting_Amplifier.svg/450px-Op-Amp_Non-Inverting_Amplifier.svg.png)

__IO__:

* __Vi__ [ _Volt_ ] |  Vo / ( 1 + ( R2 / R1 ) )  
Input Voltage
* __Vo__ [ _Volt_ ] |  ( 1 + ( R2 / R1 ) ) * Vi  
Output Voltage
* __R1__ [ _Ohm_ ] |  R2 / ((Vo / Vi) -1)  
R1
* __R2__ [ _Ohm_ ] |  ((Vo / Vi) -1) * R1
R2

   
--------

__Name__: Op-Amp Inverting

__Description__:

<https://en.wikipedia.org/wiki/Operational_amplifier_applications#Inverting_amplifier>

![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Op-Amp_Inverting_Amplifier.svg/450px-Op-Amp_Inverting_Amplifier.svg.png)

__IO__:

* __Vi__ [ _Volt_ ] |  -1 * (Vo / ( Rf / Ri ))  
Input Voltage
* __Vo__ [ _Volt_ ] |  -1 * ( Rf / Ri ) * Vi  
Output Voltage
* __Rf__ [ _Ohm_ ] | (Vo / (-1 * Vi)) * Ri  
Rf
* __Ri__ [ _Ohm_ ] |  Rf / ( Vo / ( -1 * Vi ))  
Ri input resistance

   
--------

__Name__: Op-Amp Differential 

__Description__:

<https://en.wikipedia.org/wiki/Operational_amplifier_applications>

In order for this circuit to produce a signal proportional to the voltage difference of the input terminals, the coefficient of the Vcom term (the common-mode gain) must be zero, or R1/Rf = R2/Rg

![Image of URI](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Op-Amp_Differential_Amplifier.svg/450px-Op-Amp_Differential_Amplifier.svg.png)


__IO__:

* __V1__ [ _Volt_ ] | ( (V2 * Rg * (R1 + Rf)) - ( R1 * Vo * (R2 + Rg))) / ( Rf * ( R2 + Rg))   
Input Voltage 1
* __V2__ [ _Volt_ ] | ( (R2 + Rg ) * ((V1 * Rf) + (R1*Vo))) / (Rg * ( R1+Rf))  
Input Voltage 2
* __R1__ [ _Ohm_ ] |  ( Rf * (V1 *(R2+Rg) - (V2*Rg) ) ) / ((V2*Rg)- (Vo*(R2+Rg)))  
Input resistor 1
* __R2__ [ _Ohm_ ] |  ( Rg * ( ( -1 * V1 * Rf ) + ( V2 * ( R1 + Rf ) ) - ( R1 * Vo ) ) ) / ( ( V1 * Rf ) + ( R1 * Vo ) )  
Input resistor 2
* __Rf__ [ _Ohm_ ] |  ( R1 * ( ( V2 * Rg ) - ( Vo * ( R2 + Rg ) ) ) ) / ( ( V1 * ( R2 + Rg ) ) - ( V2 * Rg ) )  
Rf
* __Rg__ [ _Ohm_ ] |  ( R2 * ( ( V1 * Rf ) + ( R1 * Vo ) ) ) / ( ( V1 * Rf ) - ( V2 * ( R1 + Rf ) ) + ( R1 * Vo ) )  
Rg
* __Vo__ [ _Volt_ ] |  ( ( ( ( Rf + R1 ) * Rg) /  ( ( Rg + R2 ) * R1) ) * V2 ) - (( Rf / R1 ) * V1 )
Output Voltage


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

__Name__: Acceleration 2

__Description__:

From some speed Vi to some other speed Vf with acceleration a in distance d

<http://www.physicsclassroom.com/class/1DKin/Lesson-6/Kinematic-Equations-and-Free-Fall>


![Image of URI](http://www.physicsclassroom.com/Class/1DKin/U1L6b1.gif)


__IO__:

* __d__ [ _Meter_ ] |  ( vf^2 - vi^2 ) / ( 2  * a )  
Displacement
* __a__ [ _Meter per second square_ ] |  ( vf^2 - vi^2 ) / (2  * d )  
Acceleration
* __vi__ [ _Meter per second_ ] |  sqrt( vf^2 - ( 2 * a * d  ) )  
Initial velocity
* __vf__ [ _Meter per second_ ] | sqrt((2 * a * d ) + vi^2 )  
Final velocity


--------

__Name__: Acceleration 3

__Description__:

From some speed Vi to some other speed Vf with acceleration a in time t.

<http://www.physicsclassroom.com/class/1DKin/Lesson-6/Kinematic-Equations-and-Free-Fall>

![Image of URI](http://www.physicsclassroom.com/Class/1DKin/U1L6b3.gif)


__IO__:

* __t__ [ _Second_ ] |  (vf - vi) / a  
Time
* __a__ [ _Meter per second square_ ] |  (vf - vi) / t  
Acceleration
* __vi__ [ _Meter per second_ ] |  vf - a * t  
Initial velocity
* __vf__ [ _Meter per second_ ] |  vi + a * t  
Final velocity


--------

__Name__: Acceleration 4

__Description__:

From some speed Vi to some other speed Vf in distance d and time t.

<http://www.physicsclassroom.com/class/1DKin/Lesson-6/Kinematic-Equations-and-Free-Fall>


__IO__:

* __d__ [ _Meter_ ] |  (( vi + vf ) / 2 ) * t  
Displacement
* __t__ [ _Second_ ] |  ( 2 * d ) / ( vf + vi )  
Time
* __vi__ [ _Meter per second_ ] |  (( 2 * d ) / t ) - vf  
Initial velocity
* __vf__ [ _Meter per second_ ] |  ( ( 2 * d ) / t ) - vi  
Final velocity

   
--------

__Name__: Capacitive reactance

__Description__:

the resistance of a capacitor at some frequency



__IO__:

* __f__ [ _Hertz_ ] |  ( 1 / Xc ) / ( 2 * pi * C )  
Frequency
* __C__ [ _Farad_ ] |  ( 1 / Xc ) / ( 2 * pi * f )  
Capacitance
* __Xc__ [ _Ohm_ ] |  1 / ( 2 * pi * f * C)  
Resistance
   
--------

__Name__: Coplanar Waveguide With Ground Characteristic Impedance

__Description__:

The original formulas are in Transmission Line Design Handbook by Brian C Wadell, Artech House 1991 page 79. The formulas use "a" for the track width and "b" for the sum of the track width plus the gaps either side.


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
* __K__ :  These recursive equations were originally given for use in calculating the inductance of helical coils and are taken from Miller, H Craig, "Inductance Formula for a Single-Layer Circular Coil" Proceedings of the IEEE, Vol. 75, No 2, February 1987, pp. 256-257.

<http://chemandy.com/calculators/elliptical-integrals-of-the-first-kind-calculator.htm>

```
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
```
   
--------
