/**
 * A function signiature which is used to compose a single property
 * on your mock data object. It returns an instance of the `Builder`
 * so that you can chain these function calls.
 *
 * @example
 * // The .firstName("Homer") & .lastName("Simpson") are two examples of a CompositionFunction
 * const mockPerson = PersonBuilder.firstName("Homer").lastName("Simpson").build();
 */
type CompositionFunction<T, K extends keyof T> = (arg: T[K]) => Builder<T>;

/**
 * An object signiature which is a collection of all `CompositionFunction`s for a given type.
 */
type CompositionFunctions<T> = Required<{ [K in keyof T]: CompositionFunction<T, K> }>;

type BuildManyFunction<T> = (arg: Partial<T>[] | number) => Array<Readonly<T>>;

type Builder<T> = CompositionFunctions<T> & {
  _obj: Readonly<T>;
  build: () => Readonly<T>;
  buildMany: BuildManyFunction<T>;
};

type CreateBuilderFunction = <T>(defaultValue: T) => Builder<T>;

function _createCompositionFunction<T, K extends keyof T>(
  builderFunc: CreateBuilderFunction,
  obj: T,
  keyName: K
): CompositionFunction<T, K> {
  return (arg: T[K]) => builderFunc<T>({ ...obj, [keyName]: arg });
}

function _createCompositionFunctions<T>(builderFunc: CreateBuilderFunction, obj: T): CompositionFunctions<T> {
  return (Object.keys(obj) as Array<keyof typeof obj>)
    .map((key: keyof typeof obj) => {
      return {
        [key]: _createCompositionFunction<T, keyof T>(builderFunc, obj, key),
      };
    })
    .reduce((prev, curr) => ({ ...prev, ...curr })) as CompositionFunctions<T>;
}

function _createBuildManyFunction<T>(obj: T): BuildManyFunction<T> {
  return function (arg: Partial<T>[] | number) {
    if (Array.isArray(arg)) {
      return arg.map((partialObj) => ({ ...obj, ...partialObj }));
    } else {
      return Array(arg).fill({ ...obj });
    }
  };
}

const createBuilder: CreateBuilderFunction = <T>(defaultValue: T): Builder<T> => {
  const _obj: Readonly<T> = defaultValue;
  return {
    _obj,
    build: () => _obj,
    buildMany: _createBuildManyFunction(_obj),
    ..._createCompositionFunctions(createBuilder, _obj),
  };
};

export { createBuilder, Builder, CreateBuilderFunction, CompositionFunctions, CompositionFunction };
