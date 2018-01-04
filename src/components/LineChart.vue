<template>
  <div class="lineChart">
    <h1>折線圖</h1>
    <div class="detail">Here is the chart.</div>
    <!-- 圖表 -->
    <div class="chartContain">
      <svg class="chart" :viewBox="viewBox" preserveAspectRatio="xMidYMin slice">
        <!-- 左上角起始點 -->
        <g class="chartWrap" :transform="startPoint">
          <text class="axisYText" :x="axisYText[0]" :y="axisYText[1]" dy="1em" transform="rotate(-90)">件數</text>
          <g class="line" v-for="(path, index) in line" :key="index">
            <path fill="none" :stroke="path.color" :d="path.d"></path>
          </g>
        </g>
      </svg>
    </div>
    <!-- <svg class="svg" viewBox="0 0 590 630" preserveAspectRatio="xMidYMin slice" style="width: 100%; padding-bottom: 100%; height: 1px; overflow: visible">
      <g transform="translate(60,30)">
        <g transform="translate(0, 500)" class="x axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle">
          <path class="domain" stroke="#000" d="M0.5,6V0.5H500.5V6"></path>
          <g class="tick" opacity="1" transform="translate(0.5,0)">
            <line stroke="#000" y2="6"></line>
            <text fill="#000" y="9" dy="0.71em"></text>
          </g>
          <g class="tick" opacity="1" transform="translate(100.5,0)">
            <line stroke="#000" y2="6"></line>
            <text fill="#000" y="9" dy="0.71em">6月</text>
          </g>
          <g class="tick" opacity="1" transform="translate(200.5,0)">
            <line stroke="#000" y2="6"></line>
            <text fill="#000" y="9" dy="0.71em">7月</text>
          </g>
          <g class="tick" opacity="1" transform="translate(300.5,0)">
            <line stroke="#000" y2="6"></line>
            <text fill="#000" y="9" dy="0.71em">8月</text>
          </g>
          <g class="tick" opacity="1" transform="translate(400.5,0)">
            <line stroke="#000" y2="6"></line>
            <text fill="#000" y="9" dy="0.71em">9月</text>
          </g>
          <g class="tick" opacity="1" transform="translate(500.5,0)">
            <line stroke="#000" y2="6"></line>
            <text fill="#000" y="9" dy="0.71em">10月</text>
          </g>
        </g>
        <g transform="translate(0, 0)" class="y axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="end">
          <path class="domain" stroke="#000" d="M-6,500.5H0.5V0.5H-6"></path>
          <g class="tick" opacity="1" transform="translate(0,500.5)">
            <line stroke="#000" x2="500"></line>
            <text fill="#000" x="-3" dy="0.32em">0</text>
          </g>
          <g class="tick" opacity="1" transform="translate(0,453.59568480300186)">
            <line stroke="#000" x2="500"></line>
            <text fill="#000" x="-3" dy="0.32em">50</text>
          </g>
          <g class="tick" opacity="1" transform="translate(0,406.6913696060038)">
            <line stroke="#000" x2="500"></line>
            <text fill="#000" x="-3" dy="0.32em">100</text>
          </g>
          <g class="tick" opacity="1" transform="translate(0,359.78705440900563)">
            <line stroke="#000" x2="500"></line>
            <text fill="#000" x="-3" dy="0.32em">150</text>
          </g>
          <g class="tick" opacity="1" transform="translate(0,312.88273921200755)">
            <line stroke="#000" x2="500"></line>
            <text fill="#000" x="-3" dy="0.32em">200</text>
          </g>
          <g class="tick" opacity="1" transform="translate(0,265.9784240150094)">
            <line stroke="#000" x2="500"></line>
            <text fill="#000" x="-3" dy="0.32em">250</text>
          </g>
          <g class="tick" opacity="1" transform="translate(0,219.07410881801127)">
            <line stroke="#000" x2="500"></line>
            <text fill="#000" x="-3" dy="0.32em">300</text>
          </g>
          <g class="tick" opacity="1" transform="translate(0,172.16979362101313)">
            <line stroke="#000" x2="500"></line>
            <text fill="#000" x="-3" dy="0.32em">350</text>
          </g>
          <g class="tick" opacity="1" transform="translate(0,125.26547842401504)">
            <line stroke="#000" x2="500"></line>
            <text fill="#000" x="-3" dy="0.32em">400</text>
          </g>
          <g class="tick" opacity="1" transform="translate(0,78.36116322701685)">
            <line stroke="#000" x2="500"></line>
            <text fill="#000" x="-3" dy="0.32em">450</text>
          </g>
          <g class="tick" opacity="1" transform="translate(0,31.45684803001876)">
            <line stroke="#000" x2="500"></line>
            <text fill="#000" x="-3" dy="0.32em">500</text>
          </g>
        </g>
        <text transform="rotate(-90)" y="-60" x="-250" dy="1em" style="text-anchor: middle;">件數</text>
        <g class="line">
          <path fill="none" stroke="#1f77b4" d="M100,281.42589118198873L200,113.50844277673542L300,0L400,249.53095684803L500,198.87429643527207"></path>
        </g>
        <g class="line">
          <path fill="none" stroke="#ff7f0e" d="M100,94.74671669793622L200,84.4277673545966L300,186.6791744840525L400,281.42589118198873L500,393.0581613508443"></path>
        </g>
        <g class="line">
          <path fill="none" stroke="#2ca02c" d="M100,291.7448405253283L200,187.6172607879925L300,86.30393996247653L400,60.97560975609758L500,145.40337711069418"></path>
        </g>
        <g class="dot">
          <circle class="circle" cx="100" cy="281.42589118198873" r="5" fill="#1f77b4" stroke="white"></circle>
          <circle class="circle" cx="200" cy="113.50844277673542" r="5" fill="#1f77b4" stroke="white"></circle>
          <circle class="circle" cx="300" cy="0" r="5" fill="#1f77b4" stroke="white"></circle>
          <circle class="circle" cx="400" cy="249.53095684803" r="5" fill="#1f77b4" stroke="white"></circle>
          <circle class="circle" cx="500" cy="198.87429643527207" r="5" fill="#1f77b4" stroke="white"></circle>
        </g>
        <g class="dot">
          <circle class="circle" cx="100" cy="94.74671669793622" r="5" fill="#ff7f0e" stroke="white"></circle>
          <circle class="circle" cx="200" cy="84.4277673545966" r="5" fill="#ff7f0e" stroke="white"></circle>
          <circle class="circle" cx="300" cy="186.6791744840525" r="5" fill="#ff7f0e" stroke="white"></circle>
          <circle class="circle" cx="400" cy="281.42589118198873" r="5" fill="#ff7f0e" stroke="white"></circle>
          <circle class="circle" cx="500" cy="393.0581613508443" r="5" fill="#ff7f0e" stroke="white"></circle>
        </g>
        <g class="dot">
          <circle class="circle" cx="100" cy="291.7448405253283" r="5" fill="#2ca02c" stroke="white"></circle>
          <circle class="circle" cx="200" cy="187.6172607879925" r="5" fill="#2ca02c" stroke="white"></circle>
          <circle class="circle" cx="300" cy="86.30393996247653" r="5" fill="#2ca02c" stroke="white"></circle>
          <circle class="circle" cx="400" cy="60.97560975609758" r="5" fill="#2ca02c" stroke="white"></circle>
          <circle class="circle" cx="500" cy="145.40337711069418" r="5" fill="#2ca02c" stroke="white"></circle>
        </g>
        <g class="label">
          <circle cx="0" cy="575" r="5" fill="#1f77b4"></circle>
          <text x="10" y="580">鼓山區</text>
        </g>
        <g class="label">
          <circle cx="100" cy="575" r="5" fill="#ff7f0e"></circle>
          <text x="110" y="580">左營區</text>
        </g>
        <g class="label">
          <circle cx="200" cy="575" r="5" fill="#2ca02c"></circle>
          <text x="210" y="580">楠梓區</text>
        </g>
      </g>
    </svg> -->
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  data() {
    return {
      data: [
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
      ],
      chart: {
        width: 500,
        height: 500,
        paddingTop: 30,
        paddingRight: 30,
        paddingBottom: 100,
        paddingLeft: 60
      }
    };
  },
  computed: {
    viewBox() {
      let viewW =
        this.chart.width + this.chart.paddingRight + this.chart.paddingLeft;
      let viewH =
        this.chart.height + this.chart.paddingTop + this.chart.paddingBottom;

      return `0 0 ${viewW} ${viewH}`;
    },
    startPoint() {
      return `translate(${this.chart.paddingLeft}, ${this.chart.paddingTop})`;
    },
    dataArray() {
      let arrayset = [];

      this.data.forEach(function(e, i) {
        let array = []; // 資料轉成陣列給之後畫線用

        e.value.forEach(function(ev) {
          array.push(ev.number);
        });
        
        arrayset.push(array);
      });

      return arrayset;
    },
    xAxis() {
      return d3
        .axisBottom(this.xScale)
        .ticks(5)
        .tickFormat((d, i) => {
          return this.xLabel[i];
        });
    },
    yAxis() {
      return d3.axisLeft(this.yScale).tickSizeInner(-this.chart.height);
    },
    xScale() {
      return d3
        .scaleLinear()
        .domain([0, this.data[0].value.length])
        .range([0, this.chart.width]);
    },
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
    xLabel() {
      let tickLabels = [""];
      this.data[0].value.forEach(function(e) {
        tickLabels.push(e.month);
      });
      return tickLabels;
    },
    axisYText() {
      let x = 0 - this.chart.height / 2;
      let y = 0 - this.chart.paddingLeft;
      return [x, y];
    },
    line() {
      let color = d3.scaleOrdinal(d3.schemeCategory10);
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

      this.dataArray.forEach(function(e, i) {
        pathArray.push({d: line(e), color: color(i)});
      });

      return pathArray;
    }
  },
  mounted() {
    // 插入X軸座標
    d3
      .select(".chart .chartWrap")
      .insert("g")
      .attr("transform", `translate(0, ${this.chart.height})`)
      .attr("class", "axis axisX")
      .call(this.xAxis);
    // 插入Y軸座標
    d3
      .select(".chart .chartWrap")
      .insert("g")
      .attr("class", "axis axisY")
      .call(this.yAxis);
  }
};
</script>

<style lang="postcss">
.lineChart {
  .detail {
    color: red;
  }
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
        .axisYText {
          text-anchor: middle;
        }
      }
    }
  }
}
</style>
