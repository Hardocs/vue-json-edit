<template>
  <div class="f-input">
    <h2 v-if="!template">{{ msg }}</h2>
    <div v-else>
      <h2>Template: {{ template.name }}</h2>
      <p>data: {{ JSON.stringify(template.data )}}</p>
    </div>
    <select @change="doSelect" v-model="templateSelected" class="f-input-m">
      <option
        v-for="(item, index) in templatesData.selections"
        :value="item"
        :key="index">
        {{ item }}
      </option>
    </select>

  </div>
</template>

<script>
export default {
  name: "TempInsert",
  props: {
    templatesData: {
      type: Object,
      required: false,
      default: () => {
        return {
          selections: [
            "no selections",
            'a selection'
          ],
        }
      }
    }
  },
  mounted: function () {
    this.templateSelected = this.templatesData.selections[0]
  },
  methods: {
    doSelect: function () {
/*
      console.log('selected: ' + this.templateSelected)
      console.log('store: ' + JSON.stringify(this.$store))
      console.log('passed store: ' + JSON.stringify(this.templatesData.store))
*/
      console.log('sel: '+ this.templateSelected + ', sels0: ' + this.templatesData.selections[0])
      if (this.templateSelected === this.templatesData.selections[0]) {
        // this.template = null
        this.$root.$emit('clear-template')
      } else {
        this.$root.$emit('template-selected', this.templateSelected)
      }
    }
  },
  watch: {
    'templatesData.template': function () {
      if(this.templatesData.template) {
        console.log('selected template: ' + JSON.stringify(this.templatesData.template))
        this.template = this.templatesData.template
      }
    }
  },
  data: function () {
    return {
      msg: 'TempInsert',
      templateSelected: 'No Template',
      template: null
    }
  }
}
</script>

<style scoped>

.f-input,
.f-btns {
  display: inline-block;
}

</style>
