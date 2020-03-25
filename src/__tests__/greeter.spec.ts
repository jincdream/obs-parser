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

  it(`should greet`, () => {
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
