export type Base = { [key: string]: object }
export type ComponentDetail<T extends Base> = { [P in keyof T]?: T[P] }
export type ComponentData<T> = { [P in keyof T]?: FiledData<T[P]> }
export type FiledData<T> = {
  fields: T
}

export interface IData {
  id?: string
  status?: number
  resource?: object
  type?: string
  [key: string]: any
}

export interface IComponentRenderDO<AllComponents> {
  id: keyof AllComponents
  n: string
  d: object
  childrens: (IComponentRenderDO<AllComponents>)[] | []
}

export type Structure<T> = { [P in keyof T]: Array<keyof T> }
export interface OBS_Schema<
  Components extends Base,
  AllComponents extends Base
> {
  data: ComponentData<AllComponents>
  endpoint?: {
    mode?: string
    pageCode?: string
    protocolVersion: string
  }
  hierarchy: {
    component?: Array<keyof AllComponents>
    componentDetail: ComponentDetail<Components>
    root: keyof AllComponents
    structure: Structure<AllComponents>
  }
}
