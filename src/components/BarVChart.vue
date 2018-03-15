<template>
  <div class="barVChart">
    <h1>直條圖</h1>
    <div class="detail">高雄市不動產買賣統計(104年)</div>
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
          <text transform="rotate(-90)" class="axisYText" :x="axisYText[0]" :y="axisYText[1]" dy="1em" text-anchor="middle">件數</text>
          <!-- 直條 -->
          <!-- 為了初始有動畫，所以包了兩次 transition-group -->
          <transition-group tag="g" name="growBar">
            <transition-group tag="g" name="growBar" class="bar" v-for="(group, key) in bar" :key="`${key}${group.rect.height}${group.rect.x}`">
              <rect
                v-for="(r, k) in group.rect"
                :key="`${k}${r.height}${r.x}`"
                :fill="group.color"
                :x="r.x"
                :y="r.y"
                :width="r.width"
                :height="r.height"
                v-on:mouseover="showTooltip(key, k, $event)"
                v-on:mouseout="hiddenTooltip"
              ></rect>
            </transition-group>
          </transition-group>
          <!-- 直條文字 -->
          <transition-group tag="g" name="growText" class="barText">
            <text v-for="(text, key) in barText" :key="`${key}${text.x}${text.y}${text.number}`" fill="gray" font-size="12" text-anchor="middle" :x="text.x" :y="text.y">{{ text.number }}</text>
          </transition-group>
          <!-- 標籤 -->
          <g class="label" v-for="(la, key) in label" :key="key">
            <circle :cx="la.cx" :cy="la.cy" r="5" :fill="la.color"></circle>
            <text :x="la.x" :y="la.y">{{ la.name }}</text>
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
        paddingLeft: 60,
        gap: 40
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
      return this.data[0] ? this.data[0].value.length : 0;
    },
    // X軸設定
    xAxis() {
      let tickNum =
        this.valueLength < 3 ? this.valueLength + 1 : this.valueLength;

      return d3
        .axisBottom(this.xScale)
        .ticks(tickNum)
        .tickFormat((d, i) => {
          return this.xLabel[i];
        });
    },
    // Y軸設定
    yAxis() {
      return d3.axisLeft(this.yScale).tickSizeInner(-this.chart.height);
    },
    // X軸線性比例縮放
    xScale() {
      return d3
        .scaleLinear()
        .domain([0, this.data[0].value.length + 1])
        .range([0, this.chart.width]);
    },
    // Y軸線性比例縮放
    yScale() {
      let Ymin = 0;
      let Ymax;
      let newArray = [];

      this.data.forEach(group => {
        group.value.forEach(el => {
          newArray.push(el.number);
        });
      });
      Ymax = d3.max(newArray);

      return d3
        .scaleLinear()
        .domain([Ymin, Ymax])
        .range([this.chart.height, 0]);
    },
    // X軸標籤文字
    xLabel() {
      let tickLabels = [""];

      this.data[0].value.forEach(function(e) {
        tickLabels.push(e.month);
      });

      return tickLabels;
    },
    // Y軸文字座標
    axisYText() {
      let x = 0 - this.chart.height / 2;
      let y = 0 - this.chart.paddingLeft;
      return [x, y];
    },
    // 顏色函數
    color() {
      return d3.scaleOrdinal(d3.schemeCategory20c);
    },
    barWidth() {
      /* --------------------
      1. 把圖表寬度扣掉左右不放圖的間距
         this.chart.width / (this.valueLength + 1) * this.valueLength
      2. 扣掉長條圖中間的間隔
         - (this.chart.gap * this.data.length)
      3. 剩下的寬度分給所有長條
         / (this.valueLength * this.data.length)
      -------------------- */
      return (
        (this.chart.width / (this.valueLength + 1) * this.valueLength -
          this.chart.gap * this.data.length) /
        (this.valueLength * this.data.length)
      );
    },
    // 直條座標、顏色
    bar() {
      let rectArray = [];

      if (this.valueLength) {
        this.data.forEach((group, index) => {
          let rectGroup = [];

          group.value.forEach((e, i) => {
            rectGroup.push({
              /* --------------------
              1. 把群組直條往左推整體的一半
                 - this.barWidth * this.data.length / 2
              2. 依個別順序向右平移
                 + this.barWidth * index
              -------------------- */
              x:
                this.xScale(i + 1) -
                this.barWidth * this.data.length / 2 +
                this.barWidth * index,
              y: this.yScale(e.number),
              width: this.barWidth,
              height: this.chart.height - this.yScale(e.number)
            });
          });

          rectArray.push({
            rect: rectGroup,
            color: this.color(index)
          });
        });
      }

      return rectArray;
    },
    // 直條文字座標、內容
    barText() {
      let textArray = [];

      if (this.valueLength) {
        this.data.forEach((group, index) => {
          group.value.forEach((e, i) => {
            textArray.push({
              x:
                this.xScale(i + 1) -
                this.barWidth * this.data.length / 2 +
                this.barWidth / 2 +
                this.barWidth * index,
              y: this.yScale(e.number) - 8,
              number: e.number
            });
          });
        });
      }

      return textArray;
    },
    label() {
      let labelArray = [];

      this.data.forEach((e, i) => {
        labelArray.push({
          name: e.name,
          cx: i * 100,
          cy: this.chart.height + 45,
          color: this.color(i),
          x: i * 100 + 10,
          y: this.chart.height + 50
        });
      });

      return labelArray;
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
      let random = [
        {
          name: "鼓山區",
          value: []
        },
        {
          name: "左營區",
          value: []
        },
        {
          name: "楠梓區",
          value: []
        }
      ];

      // 隨機產生資料
      random.forEach(el => {
        for (let i = 0; i < month; i++) {
          el.value.push({
            month: `${i + 1}月`,
            number: Math.floor(Math.random() * (max - min + 1)) + min
          });
        }
      });

      this.data = random;

      //清除坐標軸
      document.querySelector(".chart .axisX").innerHTML = "";
      document.querySelector(".chart .axisY").innerHTML = "";

      // 插入X軸座標
      d3.select(".chart .axisX").call(this.xAxis);
      // 插入Y軸座標
      d3.select(".chart .axisY").call(this.yAxis);
    },
    showTooltip(index1, index2, event) {
      let mouseX = event.clientX + 20;
      let mouseY = event.clientY;

      // 設置位置
      document
        .querySelector(".tooltip")
        .setAttribute("style", `left: ${mouseX}px; top: ${mouseY}px;`);
      // 插入名稱
      document.querySelector(".tooltip .name").innerHTML = `${
        this.data[index1].name
      } / ${this.data[index1].value[index2].month}`;
      document.querySelector(".tooltip .value").innerHTML = `${
        this.data[index1].value[index2].number
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
.barVChart {
  /* 動畫 */
  .growBar-enter-active {
    transition: transform 0.7s, opacity 1s;
  }
  .growBar-enter {
    transform: scaleY(0.55) translateY(-12%);
    opacity: 0;
  }
  .growText-enter-active {
    transition: all 1s ease 1s;
  }
  .growText-enter {
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
        .axis.axisY {
          .tick {
            line {
              stroke: #efefef;
              transform: translateX(1px);
            }
            &:nth-child(2) {
              line {
                stroke: rgba(0, 0, 0, 0);
              }
            }
          }
        }
        .bar {
          transform-origin: 50% 100%;
          rect {
            transform-origin: 50% 100%;
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
