<template>
  <div class="barpChart">
    <h1>橫條圖</h1>
    <div class="detail">高雄市鼓山區不動產買賣統計(104年)</div>
    <!-- 圖表 -->
    <div class="chartContain">
      <svg class="chart" :viewBox="viewBox" preserveAspectRatio="xMidYMin slice">
        <!-- 左上角起始點 -->
        <g class="chartWrap" :transform="startPoint">
          <!-- X軸座標 -->
          <g :transform="`translate(0, ${chart.height})`" class="axis axisX" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle"></g>
          <!-- Y軸座標 -->
          <g class="axis axisY" fill="none" font-size="10" font-family="sans-serif" text-anchor="end"></g>
          <!-- Y軸標籤 -->
          <text class="axisYText" :x="axisYText[0]" :y="axisYText[1]" dy="1em" text-anchor="middle">件數</text>
          <!-- 橫條 -->
          <transition-group tag="g" name="growBarp">
            <rect class="bar" v-for="(rect, key) in bar" :key="`${key}${rect.width}${rect.y}`" :fill="rect.color" :x="rect.x" :y="rect.y" :width="rect.width" :height="rect.height" v-on:mouseover="showTooltip(key, $event)" v-on:mouseout="hiddenTooltip"></rect>
          </transition-group>
          <!-- 橫條文字 -->
          <g class="barText" v-for="(text, key) in barText" :key="key">
            <text fill="white" text-anchor="middle" :x="text.x" :y="text.y">{{ text.number }}</text>
          </g>
        </g>
      </svg>
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

export default {
  data() {
    return {
      data: [], // From randomData()
      chart: {
        width: 500,
        height: 500,
        paddingTop: 30,
        paddingRight: 30,
        paddingBottom: 100,
        paddingLeft: 60
      },
      hideTooltip: true
    };
  },
  computed: {
    // 可視區域
    viewBox() {
      let viewW =
        this.chart.width + this.chart.paddingRight + this.chart.paddingLeft;
      let viewH =
        this.chart.height + this.chart.paddingTop + this.chart.paddingBottom;

      return `0 0 ${viewW} ${viewH}`;
    },
    // 畫圖起始點
    startPoint() {
      return `translate(${this.chart.paddingLeft}, ${this.chart.paddingTop})`;
    },
    valueLength() {
      return this.data.value ? this.data.value.length : 0;
    },
    // X軸設定
    xAxis() {
      return d3.axisBottom(this.xScale).tickSizeInner(-this.chart.width);
    },
    // Y軸設定
    yAxis() {
      let tickNum =
        this.valueLength < 3 ? this.valueLength + 1 : this.valueLength;

      return d3
        .axisLeft(this.yScale)
        .ticks(tickNum)
        .tickFormat((d, i) => {
          return this.yLabel[i];
        });
    },
    // X軸線性比例縮放
    xScale() {
      let Xmin = 0;
      let Xmax;
      let newArray = [];

      this.data.value.forEach(function(e) {
        newArray.push(e.number);
      });
      Xmax = d3.max(newArray);

      return d3
        .scaleLinear()
        .domain([Xmin, Xmax])
        .range([0, this.chart.width]);
    },
    // Y軸線性比例縮放
    yScale() {
      return d3
        .scaleLinear()
        .domain([0, this.data.value.length + 1])
        .range([this.chart.height, 0]);
    },
    // Y軸標籤文字
    yLabel() {
      let tickLabels = [""];

      this.data.value.forEach(function(e) {
        tickLabels.push(e.month);
      });

      return tickLabels;
    },
    // Y軸文字座標
    axisYText() {
      let x = this.chart.width / 2 - 15;
      let y = this.chart.height + 30;
      return [x, y];
    },
    // 顏色函數
    color() {
      return d3.scaleOrdinal(d3.schemeCategory10);
    },
    barWidth() {
      let gap = 20;
      return this.chart.height / (this.valueLength + 1) - gap;
    },
    // 橫條座標、顏色
    bar() {
      let rectArray = [];

      if (this.data.value) {
        this.data.value.forEach((e, i) => {
          rectArray.push({
            color: this.color(0),
            x: 0,
            y: this.yScale(i + 1) - this.barWidth / 2,
            width: this.xScale(e.number),
            height: this.barWidth
          });
        });
      }

      return rectArray;
    },
    // 橫條文字座標、內容
    barText() {
      let textArray = [];

      if (this.data.value) {
        this.data.value.forEach((e, i) => {
          textArray.push({
            x: this.xScale(e.number) - 20,
            y: this.yScale(i + 1) + 5,
            number: e.number
          });
        });
      }

      return textArray;
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
      let month = Math.floor(Math.random() * (12 - 1 + 1)) + 1; // 隨機挑選連續幾個月
      let random = {
        name: "鼓山區",
        value: []
      };

      // 隨機產生資料
      for (let i = 0; i < month; i++) {
        random.value.push({
          month: `${i + 1}月`,
          number: Math.floor(Math.random() * (max - min + 1)) + min
        });
      }

      this.data = random;

      //清除坐標軸
      document.querySelector(".chart .axisX").innerHTML = "";
      document.querySelector(".chart .axisY").innerHTML = "";

      // 插入X軸座標
      d3.select(".chart .axisX").call(this.xAxis);
      // 插入Y軸座標
      d3.select(".chart .axisY").call(this.yAxis);
    },
    showTooltip(index, event) {
      let mouseX = event.clientX + 20;
      let mouseY = event.clientY;

      // 設置位置
      document
        .querySelector(".tooltip")
        .setAttribute("style", `left: ${mouseX}px; top: ${mouseY}px;`);
      // 插入名稱
      document.querySelector(".tooltip .name").innerHTML = `${this.data
        .name} / ${this.data.value[index].month}`;
      document.querySelector(".tooltip .value").innerHTML = `${this.data.value[
        index
      ].number} 件`;

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
  /* 動畫 */
  .growBarp-enter-active {
    transition: all 1s;
  }
  .growBarp-enter {
    transform: scaleX(0);
    opacity: 0;
  }
  /* 說明 */
  .detail {
    color: gray;
  }
  /* 統計圖 */
  .chartContain {
    max-width: 600px;
    margin: 0 auto;
    .chart {
      width: 100%;
      padding-bottom: 100%;
      height: 1px;
      overflow: visible;
      .chartWrap {
        .axis.axisX {
          .domain {
            display: none;
          }
          .tick {
            line {
              stroke: #efefef;
              stroke-width: 2;
              stroke-dasharray: 1, 6;
              stroke-linecap: round;
            }
          }
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
