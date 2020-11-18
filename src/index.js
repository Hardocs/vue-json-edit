import JsonEditor from './JsonEditor.vue'
import JsonView from './JsonView.vue'
import ArrayView from './ArrayView.vue'
import draggable from 'vuedraggable'
import PackageFile from '../package.json'
// import TempInsert from './TemplateInsert.vue';

const VERSION = PackageFile.version

const install = (Vue) => {
  if (install.installed) return

  Vue.component('draggable', draggable)
  Vue.component('JsonEditor', JsonEditor)
  Vue.component('json-view', JsonView)
  Vue.component('array-view', ArrayView)
  // Vue.component('temp-insert', TempInsert)

}

export default install

export const components = {
  JsonEditor,
  VERSION
}
