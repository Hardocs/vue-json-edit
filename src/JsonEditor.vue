<template>
  <json-view
    :parsedData="parsedData"
    v-model="parsedData"
    :templatesInsert="templatesInsert"
    :templatesData="templatesData"
  >
  </json-view>
</template>

<script>
import JsonView from "./JsonView.vue";
import cloneDeep from "lodash.clonedeep";
import TempInsert from './TempInsert.vue';


export default {
  name: "JsonEditor",
  props: {
    templatesInsert: {
      type: Object,
      default: null,
      required: false
    },
    templatesData: {
      type: Object,
      default: null,
      required: false
    },
    objData: {
      type: [Object, Array],
      required: true
    },
    options: {
      type: Object,
      default: function () {
        return {
          confirmText: "confirm",
          cancelText: "cancel"
        }
      },
    }
  },
  provide () {
    return {
      formBtnText: this.options
    }
  },
  data () {
    return {
      parsedData: [],
      wrapperType:'List'
    };
  },
  created () {
    this.lastParsedData = {};
    this.parsedData = this.jsonParse(this.objData);
  },
  watch: {
    objData: {
      handler(newValue, oldValue) {
        this.parsedData = this.jsonParse(this.objData);
      }
    },
    parsedData: {
      handler(newValue, oldValue) {

        if (JSON.stringify(newValue) === JSON.stringify(this.lastParsedData)) {
          return;
        }

        this.lastParsedData = cloneDeep(newValue);

        this.$emit("input", this.makeJson(this.parsedData));
      },
      deep: true
    }
  },
  mounted: function () {
    // console.log('JsonEditor:templatesData: ' +  JSON.stringify(this.templatesData))
  },
  components: {
    "json-view": JsonView
  },
  methods: {
    jsonParse: function (jsonStr) {
      console.log('jsonParse:jsonStr: ' + JSON.stringify(jsonStr))
      const parseJson = json => {
        let result = [];
        let keys = Object.keys(json);
        keys.forEach((k, index) => {
          let val = json[k];
          let parsedVal = val;

          if (this.getType(val) == "List") {
            parsedVal = parseJson(val);

          } else if (this.getType(val) == "array") {
            parsedVal = parseArray(val);
          }

          let opt = {
            name: k,
            type: this.getType(val)
          };

          // console.log('jsonParse:opt: ' + JSON.stringify(opt) + ', parsedVal: ' + parsedVal)

          if (opt.type == "array" || opt.type == "List") {
            opt.childParams = parsedVal;
            opt.remark = null;
          } else {
            opt.childParams = null;
            opt.remark = parsedVal;
          }

          result.push(opt);
        });
        console.log('jsonParse:json: '+ JSON.stringify(json) + ',  result: ' + JSON.stringify(result))
        return result;
      };

      //
      const parseArray = arrayObj => {
        let result = [];
        for (let i = 0; i < arrayObj.length; ++i) {
          let val = arrayObj[i];
          let parsedVal = val;
          if (this.getType(val) == "List") {
            parsedVal = parseJson(val);

          } else if (this.getType(val) == "array") {
            parsedVal = parseArray(val);
          }

          let opt = {
            name: null,
            type: this.getType(val)
          };

          if (opt.type == "array" || opt.type == "List") {
            opt.childParams = parsedVal;
            opt.remark = null;
          } else {
            opt.childParams = null;
            opt.remark = parsedVal;
          }

          result.push(opt);
        }
        return result;
      };

      // --
      const parseBody = data => {
        let r = null;
        switch(this.getType(data)) {
          case 'array':
            this.wrapperType = 'array';
            r = parseArray(data);
            break;
          case'List':
            this.wrapperType ='List';
            r = parseJson(data);
            break;
        }
        return r;
      };

      return parseBody(jsonStr);
    },

    getType: function (obj) {
      switch (Object.prototype.toString.call(obj)) {
        case "[object Array]":
          return "array";
          break;
        case "[object Object]":
          return "List";
          break;
        case "[object Null]":
        case "[object Function]":
        case "[object Undefined]":
          return "string"
          break;
        default:
          return typeof obj;
          break;
      }
    },

    makeJson: function (dataArr) {
      const revertWithObj = data => {
        let r = {};
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          let key, val;
          key = el.name;
          if (el.type == "array") {
            val = revertWithArray(el.childParams);
          } else if (el.type == "List") {
            val = revertWithObj(el.childParams);
          } else {
            val = el.remark;
          }

          r[key] = val;
        }
        return r;
      };

      const revertWithArray = data => {
        let arr = [];
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          let r;
          if (el.type == "array") {
            r = revertWithArray(el.childParams);
          } else if (el.type == "List") {
            r = revertWithObj(el.childParams);
          } else {
            r = el.remark;
          }

          arr.push(r);
        }
        return arr;
      };

      const revertMain = data => {
        let r = null;
        switch(this.wrapperType) {
          case 'array':

            r = revertWithArray(data);
            break;
          case'List':
            r = revertWithObj(data);
            break;
        }
        return r;
      };

      return revertMain(dataArr);
    }
  }
};
</script>

<style lang="less">
@import "./assets/styles/common.less";
</style>
