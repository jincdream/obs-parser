// jest.mock('../environment.ts', () => ({
//   IS_DEV: true,
//   IS_PROD: false,
// }))

import Parser from '../index'

describe(`Parse`, () => {
  // let greeter: Greeter

  // beforeEach(() => {
  //   greeter = new Greeter('World')
  // })

  it(`simple`, () => {
    let data = Parser<{ a: object; b: object }, { a$1: object; b$2: object }>({
      data: {
        a$1: {
          fields: { a: 1 },
        },
        b$2: {
          fields: { b: 2 },
        },
      },
      hierarchy: {
        component: [],
        componentDetail: {
          b: {},
        },
        root: 'a$1',
        structure: {
          a$1: ['b$2'],
          b$2: [],
        },
      },
    })

    expect(data).toEqual([
      {
        id: 'a$1',
        n: 'a',
        d: { a: 1 },
        childrens: [
          {
            id: 'b$2',
            n: 'b',
            d: { b: 2 },
            childrens: [],
          },
        ],
      },
    ])
  })
  it(`effect`, () => {
    let data = Parser<
      { a: object; b: object; c: object },
      { c$1: object; a$1: object; b$2: object }
    >({
      data: {
        a$1: {
          effect: {
            enble: true,
          },
          fields: { a: 1 },
        },
        b$2: {
          effect: {
            enble: true,
            handles: [
              {
                trigger: 'onChange',
                condition: "$state.type === 'normal'",
                handle: {
                  targetUid: 'a$1',
                  type: 'set',
                  value: {
                    color: '$value',
                  },
                },
              },
            ],
          },
          fields: { b: 2 },
        },
      },
      hierarchy: {
        component: [],
        componentDetail: {
          b: {},
        },
        root: 'c$1',
        structure: {
          c$1: ['a$1', 'b$2'],
          a$1: [],
          b$2: [],
        },
      },
    })

    expect(data).toEqual([
      {
        id: 'c$1',
        n: 'c',
        d: {},
        childrens: [
          {
            id: 'a$1',
            n: 'a',
            e: { uid: 'a$1', effects: undefined },
            d: { a: 1 },
            childrens: [],
          },
          {
            id: 'b$2',
            n: 'b',
            e: {
              uid: 'b$2',
              effects: [
                {
                  trigger: 'onChange',
                  condition: "$state.type === 'normal'",
                  handle: {
                    targetUid: 'a$1',
                    type: 'set',
                    value: {
                      color: '$value',
                    },
                  },
                },
              ],
            },
            d: { b: 2 },
            childrens: [],
          },
        ],
      },
    ])
  })

  // it(`should greet and print deprecation message if in dev mode`, () => {
  //   const spyWarn = jest.spyOn(console, 'warn')
  //   const actual = greeter.greetMe()
  //   const expected = 'Hello, World!'

  //   expect(actual).toBe(expected)
  //   expect(spyWarn).toHaveBeenCalledWith(
  //     'this method is deprecated, use #greet instead'
  //   )
  // })
})
