import type{  InferMiddlewareDataMap } from '.'
import { type TypeCheck, typeCheck } from '../test-utils/type-testers'

const middlewareMap = {
  syncMiddleware: (req: Request) => ({ sync: true }),
  asyncMiddleware: async (req: Request) => ({ async: true }),
}

// example inference
type Inferred = InferMiddlewareDataMap<typeof middlewareMap>

//  check that inffered is correct
const inferred: Inferred = {
  syncMiddleware: { sync: true },
  asyncMiddleware: { async: true },
}

// check satisfies
const satisfiesMap = {
  syncMiddleware: { sync: true },
  asyncMiddleware: { async: true },
} satisfies Inferred

// Compile-time checks
type TestSync = TypeCheck<Inferred['syncMiddleware'], { sync: true }>
type TestAsync = TypeCheck<Inferred['asyncMiddleware'], { async: true }>

typeCheck<TestSync>()
typeCheck<TestAsync>()

const middlewareMapDifferentReturns = {
  stringMiddleware: (req: Request) => 'stringValue',
  numberMiddleware: (req: Request) => 42,
  booleanMiddleware: (req: Request) => true,
}

type InferredDifferentReturns = InferMiddlewareDataMap<typeof middlewareMapDifferentReturns>

type TestString = TypeCheck<InferredDifferentReturns['stringMiddleware'], string>
type TestNumber = TypeCheck<InferredDifferentReturns['numberMiddleware'], number>
type TestBoolean = TypeCheck<InferredDifferentReturns['booleanMiddleware'], boolean>

typeCheck<TestString>()
typeCheck<TestNumber>()
typeCheck<TestBoolean>()

const middlewareMapNestedPromise = {
  nestedPromiseMiddleware: async (req: Request) => Promise.resolve(42),
}

type InferredNestedPromise = InferMiddlewareDataMap<typeof middlewareMapNestedPromise>

type TestNestedPromise = TypeCheck<InferredNestedPromise['nestedPromiseMiddleware'], number>

typeCheck<TestNestedPromise>()

class ComplexClass {
  prop: string
  constructor(prop: string) {
    this.prop = prop
  }
}

const middlewareMapComplexReturns = {
  complexReturnMiddleware: (req: Request) => new ComplexClass('value'),
}

type InferredComplexReturns = InferMiddlewareDataMap<typeof middlewareMapComplexReturns>

type TestComplexReturns = TypeCheck<InferredComplexReturns['complexReturnMiddleware'], ComplexClass>

typeCheck<TestComplexReturns>()

const middlewareMapFunctionReturn = {
  functionReturnMiddleware: (req: Request) => () => 'hello',
}

type InferredFunctionReturn = InferMiddlewareDataMap<typeof middlewareMapFunctionReturn>

type TestFunctionReturn = TypeCheck<InferredFunctionReturn['functionReturnMiddleware'], () => string>

typeCheck<TestFunctionReturn>()
