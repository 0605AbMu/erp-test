export interface ThrottlerRouteOptions {
  limit: number | ((context: any) => number | Promise<number>);
  ttl: number | ((context: any) => number | Promise<number>);
  blockDuration?: number | ((context: any) => number | Promise<number>);
}

export function Throttle(options: Record<string, ThrottlerRouteOptions>) {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    const reflectionTarget = descriptor ? descriptor.value : target;
    for (const name in options) {
      Reflect.defineMetadata('THROTTLER:TTL' + name, options[name].ttl, reflectionTarget);
      Reflect.defineMetadata('THROTTLER:LIMIT' + name, options[name].limit, reflectionTarget);
      if (options[name].blockDuration !== undefined) {
        Reflect.defineMetadata('THROTTLER:BLOCK_DURATION' + name, options[name].blockDuration, reflectionTarget);
      }
    }
    return descriptor ?? target;
  };
}
