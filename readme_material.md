
# Material

### Example:
```
-------------
__Copper__ 

This is the default lorem ipsum you will find in most electric wires

* Specific Resistance : 0.017  
* Another Quantity: 23

-------------
```

### Rendered example:
-------------
__Copper__ 

This is the default lorem ipsum you will find in most electric wires

* Specific Resistance : 0.017  
* Another Quantity: 23

-------------

### Syntax:
```
-------------
__Uniq material name__ 

Description

* some_quantity : value  

-------------
```

- Uniq material name  
    As the name suggests, the unique material name
- Description  
    A useful short description of this material. This field is rendered via markdown2html, so you may add markdown here and it will hopefully be shown nice in the interface.
- some_quantity  
    A quantity name, note that they must exist. So if you add for example a new material constant, you must add it to quantities first.
- value  
    Floatingpoint number
  
## Translation

### Example:
```
-------------
__Copper__ 
__Kupfer__

Normales Kupfer, wie in Stromkabeln.

-------------
```

### Rendered example:
-------------
__Copper__ 
__Kupfer__

Normales Kupfer, wie in Stromkabeln.

-------------

### Syntax:
```
-------------
__Uniq material name__ 
__Translated name__

Translated Description

-------------
```
- Uniq material name  
    The uniq material name as use in Materials.
- Translated name  
    A translated version of that english name
- Translated Description  
    Translated Description
