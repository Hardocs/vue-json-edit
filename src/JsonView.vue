<template>
  <div class="block_content">
    <draggable v-model="flowData" handle=".dragbar" @end="onDragEnd">
      <div
        v-for="(item, index) in flowData"
        :key="`${item.type}${index}`"
        :class="['block', 'clearfix', {'hide-block': hideMyBlock[index] == true}]"
      >
        <span class="json-key">
          <input
            type="text"
            v-model="item.name"
            class="key-input"
            v-if="typeof item.name == 'string'"
            @blur="keyInputBlur(item, $event)"
          />
          <i
            class="collapse-down v-json-edit-icon-arrow_drop_down"
            v-if="item.type =='List' || item.type == 'array'"
            @click="closeBlock(index, $event)"
          ></i>
          <i v-if="item.type =='List'" class="i-type">{{'{' + item.childParams.length + '}'}}</i>
          <i v-if="item.type == 'array'" class="i-type">{{'[' + item.childParams.length + ']'}}</i>
        </span>
        <span class="json-val">
          <template v-if="item.type =='List'">
            <json-view
              :templatesInsert="templatesInsert"
              :templates-data="templatesData"
              :parsedData="item.childParams"
              v-model="item.childParams"
            ></json-view>
          </template>

          <template v-else-if="item.type == 'array'">
            <array-view :parsedData="item.childParams" v-model="item.childParams"></array-view>
          </template>

          <template v-else>
            <span class="val">
              <input
                type="text"
                v-model="item.remark"
                class="val-input"
                v-if="item.type == 'string'"
              />
              <input
                type="number"
                v-model.number="item.remark"
                class="val-input"
                v-if="item.type == 'number'"
                @input="numberInputChange(item)"
              />
              <select
                name="value"
                v-model="item.remark"
                class="val-input"
                v-if="item.type == 'boolean'"
              >
                <option :value="true">true</option>
                <option :value="false">false</option>
              </select>
            </span>
          </template>
        </span>

        <div class="tools">
          <select v-model="item.type" class="tools-types" @change="itemTypeChange(item)">
            <option v-for="(type, index) in formats" :value="type" :key="index">{{type}}</option>
          </select>
          <i class="dragbar v-json-edit-icon-drag"></i>
          <i class="del-btn" @click="delItem(parsedData, item, index)">
            <i class="v-json-edit-icon-huishouzhan_huaban"></i>
          </i>
        </div>
      </div>
    </draggable>

    <item-add-form v-if="toAddItem"
                   :templatesInsert="templatesInsert"
                   :templatesData="templatesData"
                   @confirm="newItem"
                   @cancel="cancelNewItem"
    ></item-add-form>

<!-- *todo* tighten and size these apropos, center all vertically -->
    <div class="template-choices">
      <p class="templates-introducer">New Item</p>
    </div>
    <div class="block add-key" @click="addItem" v-if="!toAddItem">
      <i class="v-json-edit-icon-add"></i>
    </div>
    <div class="template-choices">
      <p class="templates-introducer">or</p>
    </div>
    <div class="template-choices templates-introducer">
      <temp-insert :templatesData="templatesData"></temp-insert>
    </div>
  </div>
</template>

<script>
import ItemAddForm from "./ItemAddForm.vue";
import TempInsert from './TempInsert.vue'

export default {
  name: "JsonView",
  props: {
    parsedData: {},
    templatesInsert: {
      type: Object,
      default: null, // function () { return TempInsert },
      required: false
    },
    templatesData: {
      type: Object,
      default: function () { return null },
      required: false
    }
  },
  data() {
    return {
      formats: ["string", "number", "boolean", "List", "Reference"],
      flowData: this.parsedData,
      toAddItem: false,
      hideMyBlock: {}
    };
  },
  created() {
    this.flowData = this.parsedData || {};
  },
  mounted () {
    // console.log('JsonView:templatesData: ' +  JSON.stringify(this.templatesData))
  },
  watch: {
    parsedData: {
      handler(newValue, oldValue) {
        this.flowData = this.parsedData;
      }
    }
  },
  components: {
    "item-add-form": ItemAddForm,
    "array-view": () => import("./ArrayView.vue"),
    TempInsert
  },
  methods: {
    delItem: function(parentDom, item, index) {
      this.flowData.splice(index, 1);
      if (this.hideMyBlock[index]) this.hideMyBlock[index] = false;
      this.$emit("input", this.flowData);
    },

    closeBlock: function(index, e) {
      this.$set(
        this.hideMyBlock,
        index,
        this.hideMyBlock[index] ? false : true
      );
    },

    addItem: function() {
      this.toAddItem = true;
    },

    cancelNewItem: function() {
      this.toAddItem = false;
    },

    newItem: function(obj) {
      let oj = {
        name: obj.key,
        type: obj.type
      };
      if (obj.type == "array" || obj.type == "List") {
        oj.childParams = obj.val;
        oj.remark = null;
      } else {
        oj.childParams = null;
        oj.remark = obj.val;
      }

      console.log('newItem:oj: ' + JSON.stringify(oj))
      console.log('newItem:flowData: ' + JSON.stringify(this.flowData))
      if (!oj.name) {
        alert("please must input a name!");
        return;
      } else {
        this.flowData.push(oj);
        console.log('newItem:flowData:after: ' + JSON.stringify(this.flowData))
        this.$emit("input", this.flowData);
        this.cancelNewItem();
      }
    },

    keyInputBlur: function(item, e) {
      if (item.name.length <= 0) {
        alert("please must input a name!");
        item.name = "null";
        e.target.focus();
      }
    },

    onDragEnd: function() {
      this.$emit("input", this.flowData);
    },

    itemTypeChange: function(item) {
      if (item.type === "array" || item.type === "List") {
        item.childParams = [];
        item.remark = null;
      }
      if (item.type === "boolean") {
        item.remark = true;
      }
      if (item.type === "string") {
        item.remark = "";
      }
      if (item.type === "number") {
        item.remark = 0;
      }
    },

    numberInputChange: function(item) {
      if (!item.remark) item.remark = 0;
    }
  }
};
</script>

<style scoped>
.template-choices {
  display: inline-block;
}
.templates-introducer {
  font-size: small;
}
</style>
