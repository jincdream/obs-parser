import {
  OBS_Schema,
  Structure,
  ComponentData,
  ComponentDetail,
  Base,
  FiledData,
  IData,
  IComponentRenderDO,
} from './index.d'

function getComponentName<AllComponents>(id: keyof AllComponents) {
  return id.toString().split('$')[0]
}
function getComponent<ComponentsData extends Base, AllComponents extends Base>(
  componentId: keyof AllComponents,
  structure: Structure<AllComponents>,
  componentDetail: ComponentDetail<ComponentsData>,
  cData: ComponentData<AllComponents>
): IComponentRenderDO<AllComponents> {
  let name = getComponentName<AllComponents>(componentId)
  let childrens = structure[componentId] || []
  let fieldData = (cData[componentId] || { fields: {} }) as FiledData<IData>
  let commonData = componentDetail[name]
  let { id: cid, status, resource, type, ..._componentData } = fieldData.fields

  let component: IComponentRenderDO<AllComponents> = {
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
