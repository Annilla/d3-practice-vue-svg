<template>
  <div class="hello">
    <ul>
      <li><router-link :to="{ name: 'LineChart' }">折線圖</router-link></li>
      <li><router-link :to="{ name: 'BarPChart' }">橫條圖</router-link></li>
      <li><router-link :to="{ name: 'BarVChart' }">直條圖</router-link></li>
      <li><router-link :to="{ name: 'DonutChart' }">甜甜圈圖</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="postcss">
.hello {
  ul {
    padding: 0;
    li {
      list-style: none;
      line-height: 1.5em;
      font-size: 30px;
    }
  }
}
</style>
