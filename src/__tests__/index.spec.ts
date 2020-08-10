import Parser from '../index'

describe(`Parse`, () => {
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
  it(`effectFields`, () => {
    let data = Parser<
      { a: object },
      {
        a$1: {
          visible: boolean
        }
        b$1: {
          count: number
        }
        c$1: {
          page: number
        }
      }
    >({
      data: {
        a$1: {
          effectFields: {
            visible: '$Context.b$1.count > $Context.c$1.page',
          },
        },
        b$1: {
          fields: {
            count: 0,
          },
        },
        c$1: {
          fields: {
            page: 0,
          },
        },
      },
      hierarchy: {
        root: 'a$1',
        structure: {
          a$1: ['b$1'],
          b$1: ['c$1'],
          c$1: [],
        },
      },
    })

    expect(data).toEqual([
      {
        id: 'a$1',
        n: 'a',
        d: {},
        l: [
          {
            exp: '$Context.b$1.count > $Context.c$1.page',
            deps: ['b$1', 'c$1'],
            target: 'visible',
          },
        ],
        childrens: [
          {
            id: 'b$1',
            n: 'b',
            d: { count: 0 },
            childrens: [
              {
                id: 'c$1',
                n: 'c',
                d: { page: 0 },
                childrens: [],
              },
            ],
          },
        ],
      },
    ])
  })
})
