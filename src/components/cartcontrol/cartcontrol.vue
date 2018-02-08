<template>
  <div class="cartControl">
    <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart"></div>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart (event) {
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count ++
        }
        console.log('click')
        console.log(this.food.count)
      },
      decreaseCart (event) {
        if (!event._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count --
        }
      }
    }
  }
</script>

<style>
  .cartControl{
    font-size: 0;
  }
  .cartControl .cart-decrease{
    display: inline-block;
    width: 24px;
    height: 24px;
    padding: 6px;
    background: url(decrease.png) no-repeat center;
    background-size: 24px 24px;
  }
  .cartControl .cart-count{
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
  .cartControl .cart-add{
    display: inline-block;
    width: 24px;
    height: 24px;
    padding: 6px;
    background: url(add.png) no-repeat center;
    background-size: 24px 24px;
  }

</style>
