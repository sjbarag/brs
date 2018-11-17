import { Callable, ValueKind, Int32, Float } from "../brsTypes";
import { Interpreter } from "../interpreter";

/** Returns the absolute value of a float. */
export const Abs = new Callable(
    {
      name: "Abs",
      args: [{name: "x", type: ValueKind.Float}],
      returns: ValueKind.Float
    },
    (interpreter: Interpreter, x: Float) => new Float(Math.abs(x.getValue()))
);

/*
 * Returns the integer as a 32-bit float. 
 * ** NOTE: the function name implies it makes a 64-bit float, but the docs say
 *     it currently returns a 32-bit float, but may return a 64-bit float in the future.
 */
export const Cdbl = new Callable(
    {
      name: "Cdbl",
      args: [{name: "x", type: ValueKind.Int32}],
      returns: ValueKind.Float
    },
    (interpreter: Interpreter, x: Int32) => new Float(x.getValue())
);

/** Returns an integer from a float rounding up from midpoints */
export const Cint = new Callable(
    {
      name: "Cint",
      args: [{name: "x", type: ValueKind.Float}],
      returns: ValueKind.Int32
    },
    (interpreter: Interpreter, x: Float) => new Int32(Math.round(x.getValue()))
);

/** Returns the integer as a 32-bit float. */
export const Csng = new Callable(
    {
      name: "Csng",
      args: [{name: "x", type: ValueKind.Int32}],
      returns: ValueKind.Float
    },
    (interpreter: Interpreter, x: Int32) => new Float(x.getValue())
);

/** Returns an integer from a float removing fractional parts. */
export const Fix = new Callable(
    {
      name: "Fix",
      args: [{name: "x", type: ValueKind.Float}],
      returns: ValueKind.Int32
    },
    (interpreter: Interpreter, x: Int32) => new Int32(Math.trunc(x.getValue()))
);


/** Returns an integer from a float. */
export const Int = new Callable(
    {
      name: "Int",
      args: [{name: "x", type: ValueKind.Float}],
      returns: ValueKind.Int32
    },
    (interpreter: Interpreter, x: Int32) => new Int32(Math.floor(x.getValue()))
);

/** Returns -1 if parameter is negative, 0 if zero, and 1 if positive. */
export const Sgn = new Callable(
    {
      name: "Sgn",
      args: [{name: "x", type: ValueKind.Float}],
      returns: ValueKind.Int32
    },
    (interpreter: Interpreter, x: Float) => {
        let val = x.getValue();
        if (val > 0.0) return new Int32(1);
        else if (val < 0.0) return new Int32(-1);
        else return new Int32(0);
    }
);

/** Returns the arc-tangent (in radians) of a float. */
export const Atn = new Callable(
    {
      name: "Atn",
      args: [{name: "x", type: ValueKind.Float}],
      returns: ValueKind.Float
    },
    (interpreter: Interpreter, x: Float) => new Float(Math.atan(x.getValue()))
);

/** Returns the cosine of a float (argument must be provided in radians). */
export const Cos = new Callable(
    {
      name: "Cos",
      args: [{name: "x", type: ValueKind.Float}],
      returns: ValueKind.Float
    },
    (interpreter: Interpreter, x: Float) => new Float(Math.cos(x.getValue()))
);

/** Returns the sine of a float (argument must be provided in radians). */
export const Sin = new Callable(
    {
      name: "Sin",
      args: [{name: "x", type: ValueKind.Float}],
      returns: ValueKind.Float
    },
    (interpreter: Interpreter, x: Float) => new Float(Math.sin(x.getValue()))
);

/** Returns the tangent float (argument must be provided in radians). */
export const Tan = new Callable(
    {
      name: "Tan",
      args: [{name: "x", type: ValueKind.Float}],
      returns: ValueKind.Float
    },
    (interpreter: Interpreter, x: Float) => new Float(Math.tan(x.getValue()))
);

/** Returns the natural exponent of a float. */
export const Exp = new Callable(
    {
      name: "Exp",
      args: [{name: "x", type: ValueKind.Float}],
      returns: ValueKind.Float
    },
    (interpreter: Interpreter, x: Float) => new Float(Math.exp(x.getValue()))
);

/** Returns the log of a float. */
export const Log = new Callable(
    {
      name: "Log",
      args: [{name: "x", type: ValueKind.Float}],
      returns: ValueKind.Float
    },
    (interpreter: Interpreter, x: Float) => new Float(Math.log(x.getValue()))
);

/** Returns the square root of a float. */
export const Sqr = new Callable(
    {
      name: "Sqr",
      args: [{name: "x", type: ValueKind.Float}],
      returns: ValueKind.Float
    },
    (interpreter: Interpreter, x: Float) => new Float(Math.sqrt(x.getValue()))
);

/** 
 * Returns a random number in a given range. If the range is zero, a random
 * float between [0,1) is returned. If the range is a positive number, a
 * random integer between 1 and that number is returned (inclusive is returned). 
 * 
 * **NOTE:** the float returned is in the range [0,1) to match the javascript
 *     implementation, while the brightscript specification calls for (0,1). 
 *     This should be okay in practice, but if this is necessary a more complicated
 *     implementation will be necessary.  
 */
export const Rnd = new Callable(
    {
      name: "Rnd",
      args: [{name: "range", type: ValueKind.Int32}],
      returns: ValueKind.Dynamic
    },
    (interpreter: Interpreter, range: Int32) => {
        if (range.getValue() === 0) return new Float(Math.random());
        else return new Int32(Math.floor(Math.random() * range.getValue() + 1));
    }
);

