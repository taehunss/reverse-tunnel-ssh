declare module "lodash.defaults" {
  function defaults<T, U>(object: T, source: U): T & U;
  function defaults<T, U, V>(object: T, source1: U, source2: V): T & U & V;
  function defaults<T, U, V, W>(
    object: T,
    source1: U,
    source2: V,
    source3: W
  ): T & U & V & W;
  function defaults(object: any, ...sources: any[]): any;

  export default defaults;
}
