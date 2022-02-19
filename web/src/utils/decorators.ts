export function wasmAwaitRewind(constructor: any) {
  const ignoreStaticFunctions = ['length', 'name', 'prototype', 'wasmAsyncMethods'];
  let staticFunctions = Object.getOwnPropertyNames(constructor).filter(
    (name) => ignoreStaticFunctions.indexOf(name) === -1,
  );
  if (constructor.wasmAsyncMethods && constructor.wasmAsyncMethods.length > 0) {
    staticFunctions = staticFunctions.filter((name) => constructor.wasmAsyncMethods.indexOf(name) === -1);
  }

  let functions = Object.getOwnPropertyNames(constructor.prototype).filter(
    (name) => name !== 'constructor' && typeof constructor.prototype[name] === 'function',
  );
  if (constructor.prototype.wasmAsyncMethods && constructor.prototype.wasmAsyncMethods.length > 0) {
    functions = functions.filter((name) => constructor.prototype.wasmAsyncMethods.indexOf(name) === -1);
  }

  const proxyFn = (target, methodName) => {
    const fn = target[methodName];
    target[methodName] = function (...args) {
      if (constructor.module.Asyncify.currData !== null) {
        const currData = constructor.module.Asyncify.currData;
        constructor.module.Asyncify.currData = null;
        const ret = fn.call(this, ...args);
        constructor.module.Asyncify.currData = currData;
        return ret;
      } else {
        return fn.call(this, ...args);
      }
    };
  };

  staticFunctions.forEach((name) => proxyFn(constructor, name));
  functions.forEach((name) => proxyFn(constructor.prototype, name));
}

export function wasmAsyncMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  if (!target.wasmAsyncMethods) {
    target.wasmAsyncMethods = [];
  }
  target.wasmAsyncMethods.push(propertyKey);
}