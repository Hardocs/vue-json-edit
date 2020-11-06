<template>
  <div class="add-form pure-form">
    <div class="f-input">
<!--      <div id="templates"></div>-->
      <div v-if="insertComponent">
        <component :is="insertComponent" :templatesData="templatesData"></component>
      </div>
      <input
        type="text"
        v-model="keyName"
        v-if="needName"
        class="f-input-m"
        placeholder="name">
      <select v-model="formatSelected" class="f-input-m">
        <option
          v-for="(item, index) in formats"
          :value="item"
          :key="index">
          {{item}}
        </option>
      </select>
      <span class="f-input-m">
        <b>:</b>
      </span>

      <template v-if="formatSelected !='array' && formatSelected !='List'">
        <input
          type="text"
          v-model="valName"
          class="f-input-m"
          placeholder="value"
          v-if="formatSelected == 'string'"
        >
        <input
          type="number"
          v-model="valName"
          class="f-input-m"
          placeholder="value"
          v-if="formatSelected == 'number'"
          @change="dealNumber"
        >
        <select
          name="value"
          v-model="valName"
          class="f-input-m"
          v-if="formatSelected == 'boolean'"
          @change="dealBoolean"
        >
          <option :value="true">true</option>
          <option :value="false">false</option>
        </select>
      </template>
    </div>

    <div class="f-btns">
      <button
        class="pure-button f-confirm"
        @click="confirm">
        {{ this.formBtnText.confirmText }}
      </button>
      <button
        class="pure-button"
        @click="cancel">
        {{ this.formBtnText.cancelText }}
      </button>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'

export default {
  name: 'ItemAddForm',
  data () {
    return {
      insertComponent: null,
      formats: ['string', 'number', 'boolean', 'List', 'Reference' ],
      formatSelected: 'string',
      // --
      keyName: '',
      valName: ''
    };
  },
  mounted () {
    console.log('itemsAddForm:templatesData: ' +  JSON.stringify(this.templatesData))
    console.log('itemsAddForm:templatesInsert: ' +  JSON.stringify(this.templatesInsert))
    if (this.templatesInsert) {
      this.insertComponent = Vue.extend(this.templatesInsert)
    }

    // if (this.templatesInsert) {
    //   const holder = (new (Vue.extend(this.templatesInsert))).$mount('#templates')
    // }
  },
  props: {
    needName: {
      default: true
    },
    templatesInsert: {
      type: Object,
      required: false,
      default: null
    },
    templatesData: {
      type: Object,
      required: false,
      default: function () { return { what: 'me worry'}}
    }
  },
  inject: ['formBtnText'],
  methods: {
    confirm: function() {
      let val = null;
      if (this.formatSelected === 'array' || this.formatSelected ==='List') {
        val = [];
      } else {
        val = this.valName;
      }

      let objData = {
        key: this.needName ? this.keyName : null,
        val: val,
        type: this.formatSelected
      };

      this.$emit('confirm', objData);
      this.keyName = '';
      this.valName = '';
      this.formatSelected = 'string';
    },

    cancel: function() {
      this.$emit('cancel');
    },

    dealBoolean: function() {
      this.valName = Boolean(this.valName);
    },

    dealNumber: function() {
      this.valName = Number(this.valName);
    }
  }
};
</script>

<style lang="less" scoped>
.f-input,
.f-btns {
  display: inline-block;
}

.f-btns {
  display: inline-block;
  margin-top: 0.5em;
}

.f-confirm {
  color: #fff;
  background: #05a5d1;
}

.add-form {
  margin-bottom: 20px;
  font-size: 0.6em;
}
</style>
