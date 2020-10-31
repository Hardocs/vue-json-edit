# Vue-Json-Edit

> Visual JSON Editor built as an vue component. Provides a basic GUI


</br>


## Local development of this module with Yarn
                                 
Note that this is a little different from some other modules, such as our habitat-client. These steps, though, accomplish the same expected result.

To set up:
- clone this repo to your local machine
- in its folder, run `yarn build`  
- also in its folder, run `yarn link`  
- in your app's folder, run `yarn link vue-json-editor`
- now you can start and work on your app, which will be using this local clone for vue-json-editor

When you change code in this module,
- simply run `yarn build` in its folder
- if your app is running in dev mode, it will restart, run now with the changed module
- or if you are building your app, build it to pick up the changed module automatically


## Getting Started
```
npm install vue-json-edit --save
```

</br>


## Usage

``` javascript
//import it in your project At your entry point

import Vue from 'vue'
import JsonEditor from 'vue-json-edit'
  
Vue.use(JsonEditor)
```
### Props

* objData: json data
* options
    * confirmText: strings of the confirm button
    * cancelText: strings of the cancel button


</br>

## Example
Single file component
``` html

<template>
    <JsonEditor
        :options="{
            confirmText: 'confirm',
            cancelText: 'cancel',
        }"
        :objData="jsonData" 
        v-model="jsonData" >
    </JsonEditor>
</template>
<script>
export default {
    ...
    data: function() {
        return {
            jsonData: {
                name: 'mike',
                age: 23,
                phone: '18552129932',
                address: ['AAA C1', 'BBB C2']
            }
        }
    }
}
</script> 
```

</br>



