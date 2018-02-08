<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image"/>
          <div class="back" @click="hide"></div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cart-control :food="food"></cart-control>
          </div>
          <div @click.stop.prevent="addFirst($event)" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
        </div>
        <spilt v-show="food.info"></spilt>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <spilt></spilt>
        <div class="rating">
          <div class="title">商品评价</div>
          <rating-select :select-type="selectType" :only-content="onlyContent"
                         :desc="desc" :ratings="food.ratings"
                         v-on:ratingtypeSelect="_ratingtypeSelect"
                         v-on:contentToggle="_contentToggle"></rating-select>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item">
              <div class="user">
                <span class="name">{{ rating.username }}</span>
                <img class="avatar" width="12" height="12" :src="rating.avatar">
              </div>
                <div class="time">
                  {{ rating.rateTime | formatDate }}
                </div>
                <p class="text">
                  <span :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></span>
                  {{ rating.text }}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import {formatDate} from '../../common/js/date'
  import cartControl from '../cartcontrol/cartcontrol.vue'
  import spilt from '../spilt/spilt.vue'
  import ratingSelect from '../ratingselect/ratingselect.vue'

  const ALL = 2

  export default {
    components: {
      cartControl,
      spilt,
      ratingSelect
    },
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    methods: {
      show () {
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = true
        this.$nextTick(function () {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide () {
        this.showFlag = false
      },
      addFirst (event) {
        if (!event._constructed) {
          return
        }
        Vue.set(this.food, 'count', 1)
      },
      _ratingtypeSelect (type) {
        this.selectType = type
        this.$nextTick(function () {
          this.scroll.refresh()
        })
      },
      _contentToggle (onlyContent) {
        this.onlyContent = !this.onlyContent
        this.$nextTick(function () {
          this.scroll.refresh()
        })
      },
      needShow (type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style>
  .food{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 20;
    width: 100%;
    background: #fff;
    transform: translate3d(0, 0, 0);
  }
  .move-enter-active, .move-leave-active {
    transition: all 0.2s linear;
  }
  .move-enter, .move-leave-active {
    transform: translate3d(100%, 0, 0);
  }
  .food .food-content .image-header{
    position: relative;
    width:100%;
    height:0;
    padding-top:100%;
  }
  .food .food-content .image-header img{
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height: 100%;
  }
  .food .food-content .image-header .back{
    position: absolute;
    top:10px;
    left:0;
    width: 20px;
    height: 20px;
    padding: 10px;
    background: url("back.png") center no-repeat;
    background-size: 20px 20px;
  }
  .food .food-content .content{
    position: relative;
    padding: 18px;
  }
  .food .food-content .content .title{
    line-height: 14px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 700;
    color: rgb(7, 17, 27);
  }
  .food .food-content .content .detail{
    margin-bottom: 18px;
    line-height: 10px;
    height: 10px;
    font-size: 0;
  }
  .food .food-content .content .detail .sell-count, .food .food-content .content .detail .rating{
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
  .food .food-content .content .detail .sell-count{
    margin-right: 12px
  }
  .food .food-content .content .price{
    font-weight: 700;
    line-height: 24px;
  }
  .food .food-content .content .price .now{
    margin-right: 8px;
    font-size: 14px;
    color: rgb(240, 20, 20);
  }
  .food .food-content .content .price .old{
    text-decoration: line-through;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .food .food-content .content .cartcontrol-wrapper{
    position: absolute;
    right: 12px;
    bottom: 12px;
  }

  .food .food-content .content .buy{
    position: absolute;
    right: 18px;
    bottom: 18px;
    z-index: 10;
    height: 24px;
    line-height: 24px;
    padding: 0 12px;
    box-sizing: border-box;
    border-radius: 12px;
    font-size: 10px;
    color: #fff;
    background: rgb(0, 160, 220);
  }
  .food .food-content .info{
    padding: 18px
  }
  .food .food-content .info .title{
    line-height: 14px;
    margin-bottom: 6px;
    font-size: 14px;
    color: rgb(7, 17, 27);
  }
  .food .food-content .info .text{
    line-height: 24px;
    padding: 0 8px;
    font-size: 12px;
    color: rgb(77, 85, 93);
  }
  .food .food-content .rating{
    padding-top: 18px;
  }
  .food .food-content .rating .title{
    line-height: 14px;
    margin-left: 18px;
    font-size: 14px;
    color: rgb(7, 17, 27);
  }
  .food .food-content .rating .rating-wrapper{
    padding: 0 18px;
  }
  .food .food-content .rating .rating-wrapper .rating-item{
    position: relative;
    padding: 16px 0;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  }
  .food .food-content .rating .rating-wrapper .rating-item .user{
    position: absolute;
    right: 0;
    top: 16px;
    line-height: 12px;
    font-size: 0;
  }
  .food .food-content .rating .rating-wrapper .rating-item .user .name{
    display: inline-block;
    margin-right: 6px;
    vertical-align: top;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
  .food .food-content .rating .rating-wrapper .rating-item .user .avatar{
    border-radius: 50%;
  }
  .food .food-content .rating .rating-wrapper .rating-item .time{
    margin-bottom: 6px;
    line-height: 12px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
  .food .food-content .rating .rating-wrapper .rating-item .text{
    line-height: 16px;
    font-size: 12px;
    color: rgb(7, 17, 27);
  }
  .food .food-content .rating .rating-wrapper .rating-item .text .icon-thumb_up,
  .food .food-content .rating .rating-wrapper .rating-item .text .icon-thumb_down{
    display: inline-block;
    width: 12px;
    height: 12px;
    background-size: 12px 12px;
  }
  .food .food-content .rating .rating-wrapper .rating-item .text .icon-thumb_up{
    background: url("up.png") center no-repeat;
  }
  .food .food-content .rating .rating-wrapper .rating-item .text .icon-thumb_down{
    background: url("down.png") center no-repeat;
  }

  .food .food-content .rating .rating-wrapper .no-rating{
    padding: 16px 0;
    font-size: 12px;
    color: rgb(147, 153, 159);
  }
</style>
