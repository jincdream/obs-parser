type Record<T extends object> = { [P in keyof T]: string }
export type Base = { [key: string]: object }
export type ComponentDetail<T extends Base> = { [P in keyof T]?: T[P] }
export type ComponentData<T> = {
  [P in keyof T]?: FiledData<T[P], EffectFields<T>, EffectFields<T>>
}
export type EffectHandle = {
  /**
   * onChnage
   */
  trigger?: string
  /**
   * $state.type === 'content'
   * $state：当前组件的state
   * $value：trigger的回调值
   */
  condition?: string
  handle?: {
    /**
     * uid
     */
    targetUid: string
    type: 'get' | 'set' | 'visible'
    value?: {
      /**
       * key: "$value"
       */
      [key: string]: string
    }
  }
}
export type Effect = {
  /**
   * componentId
   */
  uid?: string
  effects?: EffectHandle[]
}
export type FiledData<T, E, S> = {
  effect?: {
    enble: boolean
    handles?: EffectHandle[]
  }
  effectFields?: E
  scriptFields?: S
  fields?: T
}

export interface IData {
  id?: string
  status?: number
  resource?: object
  type?: string
  [key: string]: any
}

export type EffectFields<C> = { [P in keyof C[keyof C]]: string }
export interface IComponentRenderDO<
  AllComponents,
  ComponentsData extends { style?: object }
> {
  // componentName$id
  id: keyof AllComponents
  // componentName
  n: keyof ComponentsData
  e?: Effect
  // effect data
  l?: Linkages<keyof ComponentsData[keyof ComponentsData]>
  s?: EffectFields<ComponentsData>
  d: Partial<ComponentsData>
  childrens: (IComponentRenderDO<AllComponents, ComponentsData>)[] | []
}

export type Structure<T> = { [P in keyof T]: Array<keyof T> }
export type Linkages<U> = Array<{
  exp: string
  deps: Array<U>
  target: U
}>
export interface OBS_Schema<
  Components extends Base,
  AllComponents extends Base
> {
  data: ComponentData<AllComponents>
  endpoint?: {
    mode?: string
    pageCode?: string
    protocolVersion?: string
  }
  hierarchy: {
    component?: Array<keyof AllComponents>
    componentDetail?: ComponentDetail<Components>
    root: keyof AllComponents
    structure: Structure<AllComponents>
  }
}
// best
function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
function effectParser<O, U extends keyof O[keyof O]>(
  effectFields: EffectFields<O>
) {
  let linkages: Linkages<U> = []
  Object.keys(effectFields).forEach((target) => {
    let exp: string = prop<EffectFields<O>, any>(effectFields, target)
    let deps: Array<U> = []
    // 依赖提取
    exp.replace(/\$Context\.(\S*)/gim, (m, name: string) => {
      if (!!name) {
        deps.push(name.split('.')[0] as U)
      }
      return m
    })
    if (deps.length > 0) {
      linkages.push({
        exp,
        deps,
        target: target as U,
      })
    }
  })
  return linkages
}
function getComponentName<AllComponents>(id: keyof AllComponents) {
  return id.toString().split('$')[0]
}
function getComponent<ComponentsData extends Base, AllComponents extends Base>(
  componentId: keyof AllComponents,
  structure: Structure<AllComponents>,
  cData: ComponentData<AllComponents>,
  componentDetail?: ComponentDetail<ComponentsData>
): IComponentRenderDO<AllComponents, ComponentsData> {
  let name = getComponentName<AllComponents>(componentId)
  let childrens = structure[componentId] || []
  let fieldData = (cData[componentId] || { fields: {} }) as FiledData<
    IData,
    EffectFields<ComponentsData>,
    EffectFields<ComponentsData>
  >
  let commonData = componentDetail ? componentDetail[name] : {}
  let { effect, fields = {}, effectFields, scriptFields } = fieldData
  let { id: cid, status, resource, type, ..._componentData } = fields
  let component: IComponentRenderDO<AllComponents, ComponentsData> = {
    id: componentId,
    n: name,
    d: Object.assign({}, { ...commonData }, _componentData as Partial<
      ComponentsData
    >),
    childrens: childrens.map((c) =>
      getComponent<ComponentsData, AllComponents>(
        c,
        structure,
        cData,
        componentDetail
      )
    ),
  }
  if (effectFields) {
    component.l = effectParser<
      ComponentsData,
      keyof ComponentsData[keyof ComponentsData]
    >(effectFields)
  }
  if (scriptFields) {
    component.s = { ...scriptFields }
  }
  if (effect && effect.enble) {
    component.e = {
      uid: componentId as string,
      effects: effect.handles,
    }
  }
  return component
}
export default function OBS_DataParser<
  ComponentsData extends Base,
  AllComponents extends Base
>(schema: OBS_Schema<ComponentsData, AllComponents>) {
  let { hierarchy, data: cData } = schema
  let { root, structure, componentDetail } = hierarchy

  return [
    getComponent<ComponentsData, AllComponents>(
      root,
      structure,
      cData,
      componentDetail
    ),
  ]
}
