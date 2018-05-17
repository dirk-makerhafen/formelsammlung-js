# Quantities:

### Example:
```
-------------
| Centimeter | cm | 10^-2 Meter | Millimeter | Meter  | Inch, Foot | 
|---|---|---|---|---|---|

Add some description here! 

-------------
```

### Rendered example:
-------------
| Centimeter | cm | 10^-2 Meter | Millimeter | Meter  | Inch, Foot | 
|---|---|---|---|---|---|

Add some description here! 

-------------

### Syntax:
```
-------------
| name, alias_name | shortname, alias_shortnames | unit | scale_down  | scale_up | convertable_to | 
|---|---|---|---|---|---|

Description

-------------
```

- name  
    The most commonly used unique name for this quantity. 
- alias_name  
    Optional alias name for this quantity, rarely if ever needed
- shortname  
    The most commonly used short name. 
- alias_shortnames  
    Optional alias shortname for this quantity, rarely if ever needed
- unit  
    Unit in a format compatible to mathjs. If this can be scaled to an SI unit, use the SI unit.
    If this is a completly new, non SI unit and can not be usefuly expressed in SI terms (like AWG), 
    keep this empty, mathjs will create a new unit based on the shortname. (make sure the shortname does not collide with si unit names)
- scale_down, scale_up  
    Most useful next unit for scaling. Don't simply use the next smaller/larger unit, use something common and useful and in the same unit system. 
    So don't for example scale foot to meter. And don't scale to teaspoons or Decimeter, because nobody uses theses units. If you define for example decimeter (10 cm)
    scale up to meter and down to centimeter. But let meter scale to cm and cm to meter, skipping decimeter, because we only want useful scalings. 
- convertable_to  
    Useful conversions for this quantity. max 2-3 per quantity. For example cm may also sanely be converted to "Inch, Foot" , but not to Miles. 
- Description  
    A useful, nice, short description of what this is. Way shorter than wikipedia. Should contain one sencence about the scale of this unit and/or where it is found. 
    For example mention "lightning strike" in quantity "Megavolt". or "atomic power plant" in "Gigawatt". 
    This field is rendered via markdown2html, so you may add markdown here and it will hopefully be shown nice in the interface.

## Translation:

###  Example
```

---------
| Volt | Voltschland | Voltschlandfoobar | 
|---|---|---|---|

Voltschland translated description

---------
```

### Rendered Example
---------
| Volt | Voltschland | Voltschlandfoobar | 
|---|---|---|---|

Voltschland translated description

---------


### Syntax
```
---------
| parent_name | translated_name, translated_alias_name | translated_shortname, translated_alias_shortnames | 
|---|---|---|

Translated description

---------
```

- parent_name
    Enlish name of unique parent
- translated_name, translated_alias_name, translated_shortname,  translated_alias_shortnames
    Translated values

    