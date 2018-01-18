<template>
  <div class="barpChart">
    <h1>甜甜圈圖</h1>
    <div class="detail">高雄市不動產買賣統計(104年6月)</div>
    <!-- 圖表 -->
    <div class="chartContain">
      <div class="chartWrap">
        <svg class="chart" :viewBox="`0 0 ${chart.outerRadius*2} ${chart.outerRadius*2}`" preserveAspectRatio="xMidYMin slice">
          <transition-group tag="g" name="growCircle">
            <circle class="circle"
              v-for="(c, key) in donut"
              :key="`${key}${c.percentage}${c.offset}`"
              :r="radius"
              :cx="chart.outerRadius"
              :cy="chart.outerRadius"
              :stroke-width="chart.outerRadius - chart.innerRadius"
              :stroke-dasharray="dasharray(c.percentage)"
              :stroke-dashoffset="c.offset"
              :stroke="c.color"
              fill= "transparent"/>
          </transition-group>
        </svg>
      </div>
      <div :class="{ tooltip: true, hidden: hideTooltip}">
        <div class="name">左營區 / 10月</div>
        <div class="value">214 件</div>
      </div>
    </div>
    <button @click="randomData">隨機資料</button>
  </div>
</template>

<script>
import * as d3 from "d3";

// Pie Chart Reference: https://medium.com/@heyoka/scratch-made-svg-donut-pie-charts-in-html5-2c587e935d72

export default {
  data() {
    return {
      data: [], // From randomData()
      chart: {
        innerRadius: 100,
        outerRadius: 200
      },
      hideTooltip: true
    };
  },
  computed: {
    // Circle 半徑
    radius () {
      return this.chart.outerRadius - (this.chart.outerRadius - this.chart.innerRadius)/2;
    },
    circum() {
      // circumference = 2 * pi * radius
      return 2 * Math.PI * this.radius;
    },
    // 顏色函數
    color() {
      return d3.scaleOrdinal(d3.schemeCategory20c);
    },
    totalSum() {
      let sum = 0;

      if (this.data.length) {
        this.data.forEach((e, i) => {
          sum = sum + e.value;
        });
      }

      return sum;
    },
    donut() {
      let newArray = [];
      let afterPer = 0; // 把前面的 percentage 累加 (0.xxx)

      if (this.data.length) {
        this.data.forEach((e, i) => {
          // 新增陣列
          newArray.push({
            percentage: e.value / this.totalSum * 100,
            offset: this.circum * (1 - afterPer),
            color: this.color(i)
          });

          // 把前面的 percentage 累加 (0.xxx)
          afterPer = afterPer + e.value / this.totalSum;
        });
      }

      return newArray;
    }
  },
  mounted() {
    // 隨機產生資料
    this.randomData();
  },
  methods: {
    randomData() {
      let min = 0;
      let max = 500;
      let random = [
        {
          name: "鼓山區",
          value: 233
        },
        {
          name: "左營區",
          value: 290
        },
        {
          name: "楠梓區",
          value: 355
        },
        {
          name: "三民區",
          value: 340
        },
        {
          name: "苓雅區",
          value: 173
        },
        {
          name: "前鎮區",
          value: 199
        },
        {
          name: "小港區",
          value: 145
        },
        {
          name: "鳳山區",
          value: 394
        },
        {
          name: "大寮區",
          value: 151
        },
        {
          name: "仁武區",
          value: 139
        },
        {
          name: "岡山區",
          value: 107
        }
      ];

      // 隨機砍掉區域
      // let newRandom = [];
      // random.forEach((el, index)=>{
      //   if(Math.random() >= 0.5) {
      //     newRandom.push(el);
      //   }
      // });
      // 隨機產生資料
      random.forEach((el)=>{
        el.value = Math.floor(Math.random() * (max - min + 1)) + min;
      });

      this.data = random;
    },
    dasharray(percentage) {
      let dash = this.circum / 100 * percentage; // percentage%
      let gap = this.circum / 100 * (100 - percentage);

      return `${dash} ${gap}`;
    },
    showTooltip(index, event) {
      let mouseX = event.clientX + 20;
      let mouseY = event.clientY;

      // 設置位置
      document
        .querySelector(".tooltip")
        .setAttribute("style", `left: ${mouseX}px; top: ${mouseY}px;`);
      // 插入名稱
      document.querySelector(".tooltip .name").innerHTML = `${
        this.data.name
      } / ${this.data.value[index].month}`;
      document.querySelector(".tooltip .value").innerHTML = `${
        this.data.value[index].number
      } 件`;

      // 顯示 tooltip
      this.hideTooltip = false;
    },
    hiddenTooltip() {
      this.hideTooltip = true;
    }
  }
};
</script>

<style lang="postcss">
.barpChart {
  /* 動畫
  .growCircle-enter-active {
    transition: all 2s;
    stroke-dashoffset: 0;
  }
  .growCircle-enter {
    stroke-dashoffset: 3000;
  } */
  /* 說明 */
  .detail {
    color: gray;
  }
  /* 統計圖 */
  .chartContain {
    max-width: 600px;
    margin: 0 auto;
    .chartWrap {
      width: 400px;
      .chart {
        width: 100%;
        padding-bottom: 100%;
        height: 1px;
        overflow: visible;
        transform: rotate(-90deg);
      }
    }
    .tooltip {
      min-width: 100px;
      background-color: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 10px;
      border-radius: 6px;
      position: absolute;
      text-align: left;
      line-height: 1.5em;
      z-index: 1;
      &.hidden {
        visibility: hidden;
      }
    }
  }
}
</style>
