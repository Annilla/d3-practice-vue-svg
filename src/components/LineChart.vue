<template>
  <div class="lineChart">
    <h1>折線圖</h1>
    <div class="detail">高雄市不動產買賣統計(104年6-10月)</div>
    <!-- 圖表 -->
    <div class="chartContain">
      <svg class="chart" :viewBox="viewBox" preserveAspectRatio="xMidYMin slice">
        <!-- 左上角起始點 -->
        <g class="chartWrap" :transform="startPoint">
          <!-- X軸座標 -->
          <g :transform="`translate(0, ${chart.height})`" class="axis axisX" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle">
          </g>
          <!-- Y軸座標 -->
          <g class="axis axisY" fill="none" font-size="10" font-family="sans-serif" text-anchor="end">
          </g>
          <!-- Y軸標籤 -->
          <text class="axisYText" :x="axisYText[0]" :y="axisYText[1]" dy="1em" transform="rotate(-90)" text-anchor="middle">件數</text>
          <!-- 折線 -->
          <transition-group tag="g" name="growLine">
            <path class="line" v-for="(path, key) in line" :key="`${key}${path.d}`" fill="none" :stroke="path.color" :d="path.d"></path>
          </transition-group>
          <!-- 點 -->
          <g class="dot" v-for="(group, key) in dot" :key="key">
            <transition-group tag="g" name="growDot">
              <circle v-for="(c, k) in group.circle" :key="`${k}${c.cx}${c.cy}`" :cx="c.cx" :cy="c.cy" r="5" :fill="group.color" stroke="white" v-on:mouseover="showTooltip(key, k, $event)" v-on:mouseout="hiddenTooltip"></circle>
            </transition-group>
          </g>
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
    // 資料轉成陣列給之後畫線用
    dataArray() {
      let arrayset = [];

      this.data.forEach(function(e, i) {
        let array = [];

        e.value.forEach(function(ev) {
          array.push(ev.number);
        });
        
        arrayset.push(array);
      });

      return arrayset;
    },
    // X軸設定
    xAxis() {
      return d3
        .axisBottom(this.xScale)
        .ticks(5)
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
        .domain([0, this.data[0].value.length])
        .range([0, this.chart.width]);
    },
    // Y軸線性比例縮放
    yScale() {
      let Ymin = 0;
      let Ymax;
      let newArray = [];

      this.data.forEach(function(e, i) {
        e.value.forEach(function(ev) {
          newArray.push(ev.number);
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
      return d3.scaleOrdinal(d3.schemeCategory10);
    },
    // 折線座標、顏色
    line() {
      let line = d3
        .line()
        .x((d, i) => {
          //利用尺度運算資料索引，傳回x的位置
          return this.xScale(i + 1);
        })
        .y(d => {
          //利用尺度運算資料的值，傳回y的位置
          return this.yScale(d);
        });
      let pathArray = [];

      this.dataArray.forEach((e, i) => {
        pathArray.push({d: line(e), color: this.color(i)});
      });

      return pathArray;
    },
    // 折點座標、顏色
    dot() {
      let circleArray = [];

      this.dataArray.forEach((group, i) => {
        let circleGroup = [];

        group.forEach((number, index) => {
          circleGroup.push({
            cx: this.xScale(index + 1),
            cy: this.yScale(number),
          });
        });

        circleArray.push({
          circle: circleGroup,
          color: this.color(i)
        });
      });

      return circleArray;
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
      let random = [
        {
          name: "鼓山區",
          value: [
            {
              month: "6月",
              number: "233"
            },
            {
              month: "7月",
              number: "412"
            },
            {
              month: "8月",
              number: "533"
            },
            {
              month: "9月",
              number: "267"
            },
            {
              month: "10月",
              number: "321"
            }
          ]
        },
        {
          name: "左營區",
          value: [
            {
              month: "6月",
              number: "432"
            },
            {
              month: "7月",
              number: "443"
            },
            {
              month: "8月",
              number: "334"
            },
            {
              month: "9月",
              number: "233"
            },
            {
              month: "10月",
              number: "114"
            }
          ]
        },
        {
          name: "楠梓區",
          value: [
            {
              month: "6月",
              number: "222"
            },
            {
              month: "7月",
              number: "333"
            },
            {
              month: "8月",
              number: "441"
            },
            {
              month: "9月",
              number: "468"
            },
            {
              month: "10月",
              number: "378"
            }
          ]
        }
      ];

      // 隨機產生資料
      for (let i = 0; i < 3; i++) {
        random[i].value.forEach((e) => {
          e.number = Math.floor(Math.random() * (max - min + 1)) + min;
        });
      }

      this.data = random;
      
      //清除坐標軸
      document.querySelector('.chart .axisX').innerHTML = '';
      document.querySelector('.chart .axisY').innerHTML = '';

      // 插入X軸座標
      d3
        .select(".chart .axisX")
        .call(this.xAxis);
      // 插入Y軸座標
      d3
        .select(".chart .axisY")
        .call(this.yAxis);
    },
    showTooltip(index1, index2, event) {
      let mouseX = event.clientX + 20;
      let mouseY = event.clientY;

      // 設置位置
      document.querySelector('.tooltip').setAttribute('style', `left: ${mouseX}px; top: ${mouseY}px;`);
      // 插入名稱
      document.querySelector('.tooltip .name').innerHTML = `${this.data[index1].name} / ${this.data[index1].value[index2].month}`;
      document.querySelector('.tooltip .value').innerHTML = `${this.data[index1].value[index2].number} 件`;

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
.lineChart {
  /* 動畫 */
  .growLine-enter-active {
    transition: all 2s;
    stroke-dashoffset: 0;
  }
  .growLine-enter {
    stroke-dashoffset: 3000;
  }
  .growDot-enter-active {
    transition: all 1s;
  }
  .growDot-enter {
    opacity: 0;
    transform: scale(0);
    transform-origin: 50%;
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
                stroke: black;
              }
            }
          }
        }
        .line {
          stroke-dasharray: 3000;
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
