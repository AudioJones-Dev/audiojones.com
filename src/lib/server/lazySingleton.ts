import 'server-only';

/**
 * Defers singleton construction until first property access on the returned
 * proxy. Lets engine modules expose a `default` instance without forcing the
 * class to be evaluated at import time — which is the failure mode that
 * makes Next.js page-data collection trip on any constructor side-effect
 * (Firebase Admin initialization, Stripe SDK init, background setInterval,
 * eventBus.publishEvent, etc.) during the build.
 *
 * Usage:
 *   const eventStreamingEngine = lazySingleton(() => EventStreamingEngine.getInstance());
 *   export default eventStreamingEngine;
 */
export function lazySingleton<T extends object>(getInstance: () => T): T {
  let instance: T | null = null;
  const ensure = (): T => {
    if (!instance) instance = getInstance();
    return instance;
  };
  return new Proxy({} as T, {
    get(_target, prop, receiver) {
      const target = ensure();
      const value = Reflect.get(target, prop, receiver);
      return typeof value === 'function' ? value.bind(target) : value;
    },
    has(_target, prop) {
      return Reflect.has(ensure(), prop);
    },
    ownKeys() {
      return Reflect.ownKeys(ensure());
    },
    getOwnPropertyDescriptor(_target, prop) {
      return Reflect.getOwnPropertyDescriptor(ensure(), prop);
    },
  });
}
