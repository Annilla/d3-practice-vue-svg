<template>
  <div class="donutChart">
    <h1>甜甜圈圖</h1>
    <div class="detail">高雄市不動產買賣統計(104年6月)</div>
    <!-- 圖表 -->
    <div class="chartContain">
      <div class="chartWrap">
        <svg class="chart" :viewBox="`0 0 ${chart.outerRadius*2} ${chart.outerRadius*2}`" preserveAspectRatio="xMidYMin slice">
          <!-- 執行動畫的圓圈 -->
          <circle class="circle"
            v-for="(c, key) in donut"
            ref="circles"
            :key="`${key}${c.percentage}${c.offset}`"
            :r="radius"
            :cx="chart.outerRadius"
            :cy="chart.outerRadius"
            :stroke-width="chart.outerRadius - chart.innerRadius"
            :stroke-dashoffset="c.offset"
            :stroke="c.color"
            fill= "transparent"/>
          <!-- 滑鼠滑過的區塊 -->
          <g
            class="arc"
            v-for="(p, key) in pie"
            :key="`${key}${p.d}`"
            :transform="`translate(${chart.outerRadius},${chart.outerRadius}) rotate(90)`"
            v-on:mouseover="showTooltip(key, $event)" v-on:mouseout="hiddenTooltip">
            <path
              fill="transparent"
              :d="p.d">
            </path>
            <text
              :transform="`translate(${p.centroid})`"
              text-anchor="middle"
              fill="white">{{ p.percentage }}
            </text>
          </g>
        </svg>
      </div>
      <ul class="labelWrap">
        <li
          v-for="(p, key) in pie"
          :key="`${key}${p.d}`">
          <span class="color" :style="`background-color: ${donut[key].color};`"></span>
          <span class="region">{{ data[key].name }}</span>
          <span class="percentage">{{ p.percentage }}</span>
        </li>
      </ul>
      <div :class="{ tooltip: true, hidden: hideTooltip}">
        <div class="name">左營區 / 10%</div>
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
        innerRadius: 100, // 0 for PieChart
        outerRadius: 200
      },
      hideTooltip: true
    };
  },
  computed: {
    // Circle 半徑
    radius() {
      return (
        this.chart.outerRadius -
        (this.chart.outerRadius - this.chart.innerRadius) / 2
      );
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
    },
    pie() {
      let newArray = [];
      let format = d3.format(".0%"); // 百分比單位
      let pie = d3
        .pie()
        .sort(null)
        .value(function(d) {
          return d.value;
        })(this.data); // 準備好 arc 角度

      if (this.data.length) {
        this.data.forEach((e, i) => {
          // 準備好 arc 路徑
          let arc = d3
            .arc()
            .innerRadius(this.chart.innerRadius)
            .outerRadius(this.chart.outerRadius);

          // 新增陣列
          newArray.push({
            d: arc({
              startAngle: pie[i].startAngle,
              endAngle: pie[i].endAngle
            }),
            centroid: arc.centroid(pie[i]),
            percentage: format(e.value / this.totalSum)
          });
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
      let newRandom = [];
      random.forEach((el, index) => {
        if (Math.random() >= 0.5) {
          newRandom.push(el);
        }
      });

      // 隨機產生資料
      newRandom.forEach(el => {
        el.value = Math.floor(Math.random() * (max - min + 1)) + min;
      });

      this.data = newRandom;

      // 用 js 跑展開動畫
      this.$nextTick().then(() => {
        // DOM updated
        this.donut.forEach((el, index) => {
          let totalTime = 500; // 設定時間跑 css
          let stroke = this.dasharray(el.percentage);

          // 起始位置
          this.$refs.circles[index].style.cssText = `stroke-dasharray: 0 ${
            this.circum
          }; opacity: 0`;

          // 設定 Interval
          setTimeout(() => {
            this.$refs.circles[index].style.cssText = `stroke-dasharray: ${
              stroke.dash
            } ${stroke.gap}; opacity: 1`;
          }, totalTime);
        });
      });
    },
    dasharray(percentage) {
      let dash = this.circum / 100 * percentage; // percentage%
      let gap = this.circum / 100 * (100 - percentage);

      return { dash: dash, gap: gap };
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
        this.data[index].name
      } / ${this.pie[index].percentage}`;
      document.querySelector(".tooltip .value").innerHTML = `${
        this.data[index].value
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
.donutChart {
  /* 說明 */
  .detail {
    color: gray;
  }
  /* 統計圖 */
  .chartContain {
    max-width: 600px;
    margin: 15px auto;
    overflow: hidden;
    .chartWrap {
      width: 100%;
      @media screen and (min-width: 600px) {
        width: calc(100% - 200px);
        float: left;
      }
      .chart {
        width: 100%;
        padding-bottom: 100%;
        height: 1px;
        overflow: visible;
        transform: rotate(-90deg);
        .circle {
          transition: 1s;
        }
      }
    }
    ul.labelWrap {
      width: 100%;
      padding: 0;
      overflow: hidden;
      @media screen and (min-width: 600px) {
        width: 150px;
        padding-left: 50px;
        float: right;
      }
      li {
        list-style: none;
        display: block;
        overflow: hidden;
        margin: 15px 10px 0 0;
        float: left;
        .color {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin: 5px 5px 0 0;
          float: left;
        }
        .region {
          float: left;
          margin-right: 10px;
        }
        .percentage {
          float: left;
          color: rgba(0, 0, 0, 0.4);
        }
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
