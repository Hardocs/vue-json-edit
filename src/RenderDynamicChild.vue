<template>
  <div>
    <component :is="el">
      <slot />
    </component>
  </div>
</template>
<script>
export default {
  name: 'RenderDynamicChild',
  props: {
    el: {
      type: [String, Object],
      default: 'div',
    },
  },
}
</script>
