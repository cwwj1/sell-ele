<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods" class="menu-item" :class="{'current': currentIndex=== index}" @click="selectMenu(index, $event)">
          <span class="text">
            <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item">
              <div class="icon">
                <img width="57" height="57" :src="food.icon"/>
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shop-cart :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shop-cart>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import shopCart from '../shopcart/shopcart.vue'
  import cartControl from '../cartcontrol/cartcontrol.vue'
  import food from '../food/food.vue'

  const ERR_OK = 0
  export default{
    components: {
      shopCart,
      cartControl,
      food
    },
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

      this.$http.get('/api/goods').then(function (response) {
        response = response.body
        if (response.errno === ERR_OK) {
          this.goods = response.data
          this.$nextTick(function () {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      selectFoods () {
        let foods = []
        this.goods.forEach(function (good) {
          good.foods.forEach(function (food) {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    methods: {
      _initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        })

        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
        })

        this.foodsScroll.on('scroll', function (pos) {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight () {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectMenu (index, event) {
        if (!event._constructed) {
          return
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let el = foodList[index]
        this.foodsScroll.scrollToElement(el, 300)
      },
      selectFood (food, event) {
        if (!event._constructed) {
          return
        }
        this.selectedFood = food
        this.$refs.food.show()
      }
    }
  }
</script>

<style scoped>
  .goods{
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width:100%;
    overflow: hidden;
  }
  .goods .menu-wrapper{
    flex:0 0 80px;
    width: 80px;
    background: #f3f5f7;
  }
  .goods .menu-wrapper .menu-item{
    display: table;
    height: 54px;
    width: 56px;
    line-height: 14px;
    padding:0 12px;
  }
  .goods .menu-wrapper .current{
    position: relative;
    z-index: 10;
    margin-top: -1px;
    font-weight: 700;
    background: #fff;
  }
  .goods .menu-wrapper .current .text{
    border:none;
  }
  .goods .menu-wrapper .menu-item .text{
    display: table-cell;
    width: 56px;
    vertical-align: middle;
    font-size: 12px;
    border-bottom: 1px solid rgba(7,17,27,0.1);
  }
  .goods .menu-wrapper .menu-item .icon{
    display: inline-block;
    vertical-align: top;
    width: 12px;
    height: 12px;
    margin-right: 2px;
    background-size: 12px 12px;
    background-repeat: no-repeat;
  }
  .goods .menu-wrapper .menu-item .decrease{
    background-image: url("decrease_3@2x.png");
  }
  .goods .menu-wrapper .menu-item .discount{
    background-image: url("discount_3@2x.png");
  }
  .goods .menu-wrapper .menu-item .special{
    background-image: url("special_3@2x.png");
  }
  .goods .menu-wrapper .menu-item .invoice{
    background-image: url("invoice_3@2x.png");
  }
  .goods .menu-wrapper .menu-item .guarantee{
    background-image: url("guarantee_3@2x.png");
  }

  .goods .foods-wrapper{
    flex:1;
  }
  .goods .foods-wrapper .title{
    padding-left: 14px;
    height: 26px;
    line-height: 26px;
    border-left: 2px solid #d9dde1;
    font-size: 12px;
    color: rgb(147, 153, 159);
    background: #f3f5f7;
  }
  .goods .foods-wrapper .food-item{
    display: flex;
    margin: 18px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(7,17,27,0.1);
  }
  .goods .foods-wrapper .food-item:last-child{
    border-bottom: none;
    margin-bottom:0;
  }
  .goods .foods-wrapper .food-item .icon{
    flex:0 0 57px;
    margin-right: 10px;
  }
  .goods .foods-wrapper .food-item .content{
    position: relative;
    flex:1;
  }
  .goods .foods-wrapper .food-item .content .name{
    margin:2px 0 8px 0;
    height: 14px;
    line-height: 14px;
    font-size: 14px;
    color: rgb(7, 17, 27);
  }
  .goods .foods-wrapper .food-item .content .desc{
    margin-bottom: 8px;
    line-height: 12px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
  .goods .foods-wrapper .food-item .content .extra{
    line-height: 10px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
  .goods .foods-wrapper .food-item .content .extra .count{
    margin-right: 12px;
  }
  .goods .foods-wrapper .food-item .content .price{
    font-weight:700;
    line-height: 24px;
  }
  .goods .foods-wrapper .food-item .content .price .now{
    margin-right: 8px;
    font-size: 14px;
    color: rgb(240, 20, 20);
  }
  .goods .foods-wrapper .food-item .content .price .old{
    text-decoration: line-through;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
  .goods .foods-wrapper .food-item .content .cartcontrol-wrapper{
    position: absolute;
    right:0;
    bottom: -8px;
  }
</style>
