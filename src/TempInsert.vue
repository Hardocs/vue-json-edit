<template>
  <div class="f-input">
    <h2>{{ msg }}</h2>

    <select v-model="formatSelected" class="f-input-m">
      <option
        v-for="(item, index) in formats"
        :value="item"
        :key="index">
        {{item}}
      </option>
    </select>

  </div>
</template>

<script>
export default {
  name: "TempInsert",
  data: function () {
    return {
      msg: 'I\'m TempInsert',
      formats: ['Template1', 'Template2', 'Template3', 'Template4', 'No Template' ],
      formatSelected: 'Template1'
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
