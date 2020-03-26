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

export interface IComponentRenderDO<AllComponents, Components> {
  id: keyof AllComponents
  n: keyof Components
  d: {
    style?: object
    [key: string]: any
  }
  childrens: (IComponentRenderDO<AllComponents, Components>)[] | []
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

function getComponentName<AllComponents>(id: keyof AllComponents) {
  return id.toString().split('$')[0]
}
function getComponent<ComponentsData extends Base, AllComponents extends Base>(
  componentId: keyof AllComponents,
  structure: Structure<AllComponents>,
  componentDetail: ComponentDetail<ComponentsData>,
  cData: ComponentData<AllComponents>
): IComponentRenderDO<AllComponents, ComponentsData> {
  let name = getComponentName<AllComponents>(componentId)
  let childrens = structure[componentId] || []
  let fieldData = (cData[componentId] || { fields: {} }) as FiledData<IData>
  let commonData = componentDetail[name]
  let { id: cid, status, resource, type, ..._componentData } = fieldData.fields

  let component: IComponentRenderDO<AllComponents, ComponentsData> = {
    id: componentId,
    n: name,
    d: Object.assign({}, commonData, _componentData),
    childrens: childrens.map((c) =>
      getComponent<ComponentsData, AllComponents>(
        c,
        structure,
        componentDetail,
        cData
      )
    ),
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
      componentDetail,
      cData
    ),
  ]
}
