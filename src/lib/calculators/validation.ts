export function finite(name:string,value:number){if(!Number.isFinite(value))throw new RangeError(name+' must be finite');}
export function positive(name:string,value:number){finite(name,value);if(value<=0)throw new RangeError(name+' must be > 0');}
export function nonNegative(name:string,value:number){finite(name,value);if(value<0)throw new RangeError(name+' must be >= 0');}
export function positiveInteger(name:string,value:number){positive(name,value);if(!Number.isInteger(value))throw new RangeError(name+' must be an integer');}
