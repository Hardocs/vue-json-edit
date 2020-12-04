<template>
  <div class="block_content">
    <draggable v-model="flowData" handle=".dragbar" @end="onDragEnd">
      <div
        v-for="(item, index) in flowData"
        :key="`${item.type}${index}`"
        :class="['block', 'clearfix', {'hide-block': hideMyBlock[index] == true}]"
        v-if="item.name !== '|#fromTemplate#|'"
      >
        <span class="json-key">
          <input
            :readonly="isFromTemplate"
            type="text"
            v-model="item.name"
            class="key-input"
            v-if="typeof item.name == 'string'"
            @blur="keyInputBlur(item, $event)"
          />
          <i
            class="collapse-down v-json-edit-icon-arrow_drop_down"
            v-if="item.type =='object' || item.type == 'array'"
            @click="closeBlock(index, $event)"
          ></i>
          <i v-if="item.type =='object'" class="i-type">{{'{' + item.childParams.length + '}'}}</i>
          <i v-if="item.type == 'array'" class="i-type">{{'[' + item.childParams.length + ']'}}</i>
        </span>
        <span class="json-val">
          <template v-if="item.type =='object'">
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

        <div class="tools" v-if="!isFromTemplate">
          <!-- selects don't have readonly; only disabled, so that's why different... -->
          <select
            v-model="item.type"
            class="tools-types"
            @change="itemTypeChange(item)"
            :disabled="childrenFromTemplate"
          >
            <option v-for="(type, index) in formats" :value="type" :key="index">{{type}}</option>
          </select>
          <i class="dragbar v-json-edit-icon-drag"></i>
          <i class="del-btn" @click="delItem(parsedData, item, index)">
            <i class="v-json-edit-icon-huishouzhan_huaban"></i>
          </i>
        </div>
      </div>
    </draggable>

<!-- *todo* style: tighten and size these apropos, center all vertically -->
    <!--  this check makes from-Template items immutable, as we want...  -->
    <div v-if="!isFromTemplate">
      <item-add-form v-if="toAddItem"
                     :templatesInsert="templatesInsert"
                     :templatesData="templatesData"
                     @confirm="newItem"
                     @cancel="cancelNewItem"
      ></item-add-form>
      <div class="template-choices" v-if="fromTemplate">
        <button
          @click="anotherFromTemplate"
          type="button" class="template-add-another"
        >
          Another {{ fromTemplate }}
        </button>
        <p class="templates-introducer template-choices">or</p>
      </div>
      <div class="point-it in-line-block" @click="addItem">
        <div class="template-choices">
          <p class="templates-introducer">New Item</p>
        </div>
        <div class="block add-key">
          <i class="v-json-edit-icon-add"></i>
        </div>
      </div>
      <div class="template-choices">
        <p class="templates-introducer">or</p>
      </div>
      <div class="template-choices templates-introducer">
        <TemplateInsert
          @setSelected="setSelected"
          @loadTemplate="loadTemplate"
          :templatesData="templatesData">
        </TemplateInsert>
      </div>
    </div>
  </div>
</template>

<script>
import ItemAddForm from "./ItemAddForm.vue";
import TemplateInsert from './TemplateInsert.vue'

export default {
  name: "JsonView",
  props: {
    parsedData: {},
    templatesInsert: {
      type: Object,
      default: null,
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
      addCount: 1,
      fromTemplate: null,
      selected: false,
      formats: ["string", "number", "boolean", "object", "array"],
      flowData: this.parsedData,
      toAddItem: false,
      hideMyBlock: {}
    };
  },
  created() {
    this.flowData = this.parsedData || {};
  },
  mounted: function () {
    this.$root.$on('template-returned',
      (event) => {
        if (this.selected) {
          this.selected = false
          this.loadTemplate(event)
        }
      })
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
    TemplateInsert
  },
  computed: {
    isFromTemplate: function () {
      return this.parsedData.some(item => item.name === '|#fromTemplate#|')
    },
    childrenFromTemplate: function () {
      return this.parsedData[0]
        && this.parsedData[0].childParams
        && this.parsedData[0].childParams.some(item => item.name === '|#fromTemplate#|')
    }
  },
  methods: {
    setSelected: function () {
      this.selected = true
    },
    anotherFromTemplate: function () {
      this.selected = true
      this.$root.$emit('template-selected', this.fromTemplate)
    },
    loadTemplate: function (objData) {
      const newObj = {
        key: objData.name + this.addCount++,
        type: 'object',
        val: objData.data
      }
      this.fromTemplate = objData.name
      this.toAddItem = false // templates are immutable -  we decided, wisely...
      this.newItem(newObj, true)
    },
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

    newItem: function(obj, fromTemplate = false) {
      let oj = {
        name: obj.key,
        type: obj.type,
        fromTemplate: fromTemplate
      };
      if (obj.type == "array" || obj.type == "object") {
        oj.childParams = obj.val;
        oj.remark = fromTemplate // null;
      } else {
        oj.childParams = null;
        oj.remark = obj.val;
      }
      if (fromTemplate) {
        oj.childParams.push ({
          name: '|#fromTemplate#|',
          childParams: null,
          type: 'string',
          remark: 'template'
        })
      }

      if (!oj.name) {
        alert("Please input a name for the item!");
        return;
      } else {
        this.flowData.push(oj);
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
      if (item.type === "array" || item.type === "object") {
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
.template-add-another {
  cursor: pointer;
  height: 22px;
  border-color: blue;
  border-width: 2px;
  border-radius: 10px;
  padding: 0 2px;
  font-size: small;
}
.templates-introducer {
   font-size: small;
  /*display: inline-block;*/
}
.point-it {
  cursor: pointer;
}
.in-line-block {
  display: inline-block;
}
</style>
