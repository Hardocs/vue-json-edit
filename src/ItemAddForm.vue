<template>
  <div class="add-form pure-form">
    <div class="f-input" @keyup.enter="confirm" @keyup.escape="cancel">
      <input
        type="text"
        v-model="keyName"
        class="f-input-m"
        placeholder="name"
        ref="nameadd"
      >
      <select v-model="formatSelected" class="f-input-m">-->
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

      <template v-if="formatSelected !='array' && formatSelected !='object'">
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

// import Vue from 'vue' // for some reason of webpack probably, we can't do this,
// thus TemplateInsert can't be added dynamically. So hard-coded in this vue-json-edit.
// It's quite possible now that the editor is so customized that this no longer matters

export default {
  name: 'ItemAddForm',
  data () {
    return {
      formats: ['string', 'number', 'boolean', 'object', 'array' ],
      formatSelected: 'string',
      // --
      keyName: '',
      valName: ''
    };
  },
  props: {
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
  mounted: function () {
    this.$refs.nameadd.focus()
  },
  methods: {
    confirm: function() {
      let val = null;
      if (this.formatSelected === 'array' || this.formatSelected ==='object') {
        val = [];
      } else {
        val = this.valName;
      }

      // *todo* temp until loss of focus on fail is fixed
      // *todo* might also point out we don't have an attempted duplicate names handling either
      if(this.keyName === '') {
        this.keyName = '(none)'
      }

      // *todo* this handling we might leave?
      if(val === '') {
        val = '(none)'
      }

      let objData = {
        key: this.keyName,
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
