<template>
  <div class="f-input">
    <p v-if="templatesData.selections.length === 0">{{ msg }}</p>
    <select v-else @change="doSelect" v-model="templateSelected" class="f-input-m">
      <option
        v-for="(item, index) in allSelections"
        :value="item"
        :key="index">
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "TemplateInsert",
  props: {
    firstLine: {
      type: String,
      required: false,
      default: 'Choose Template'
    },
    templatesData: {
      type: Object,
      required: false,
      default: () => {
        return {
          selections: [],
        }
      }
    }
  },
  data: function () {
    return {
      msg: '(Please select a Standard)',
      templateSelected: 'No Template',
      selected: false
    }
  },
  mounted: function () {
    this.templateSelected = this.firstLine // initially, returned to after event
    // this.$root.$on('template-returned',
    //   (event) => {
    //     if (this.selected) {
    //       this.selected = false
    //       this.sendAddItem(event)
    //       this.templateSelected = this.firstLine
    //     }
    // })
  },
  computed: {
    allSelections: function () {
      return [ this.firstLine ].concat(this.templatesData.selections)
    }
  },
  methods: {
    sendAddItem: function (event) {
      this.$emit ('loadTemplate', event)
    },
    doSelect: function () {
      // n.b. this.selected is crucial to determine _which_ item's selection has
      // been chosen...otherwise all instances would react, show the template...
      this.selected = true
      if (this.templateSelected === this.firstLine) {
        this.$root.$emit('clear-template')
      } else {
        this.$emit('setSelected')
        this.$root.$emit('template-selected', this.templateSelected)
      }
    }
  }
}
</script>

<style scoped>

.f-input {
  display: inline-block;
}

</style>
