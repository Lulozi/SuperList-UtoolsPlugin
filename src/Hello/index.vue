<script lang="ts" setup>
defineProps({
  enterAction: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="hello">
    <h1>欢迎使用超级任务清单！</h1>
    <p>请点击下面的按钮开始使用：</p>
    <button id="startButton">开始使用</button>
    <!-- <pre>
        {{ JSON.stringify(enterAction, undefined, 2) }}
      </pre> -->
    <p>如果你在使用过程中遇到任何问题，请随时联系我。</p>
    <p>祝你使用愉快！</p>
  </div>
</template>

<style>
.hello {
  padding: 10px 28px;
}
</style>
