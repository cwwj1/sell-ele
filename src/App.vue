<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to='/goods'>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/ratings'>评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/seller'>商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import {urlParse} from './common/js/util'
  import header from './components/header/header.vue'

  const ERR_OK = 0

  export default {
    components: {
      'v-header': header
    },
    data () {
      return {
        seller: {
          id: (function () {
            let queryParam = urlParse()
            console.log(queryParam)
            return queryParam.id
          })()
        }
      }
    },
    created () {
      this.$http.get('/api/seller?id=' + this.seller.id).then(function (response) {
        response = response.body
        if (response.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data)
          console.log(this.seller.id)
        }
      })
    }
  }
</script>

<style>
#app .tab{
  display: flex;
  width:100%;
  height:40px;
  line-height:40px;
}
.tab .tab-item{
  flex:1;
  text-align: center;
}
.tab .tab-item a{
  display: block;
  font-size:14px;
  color: rgb(77, 85, 93);
}
.tab .tab-item .active{
  color: rgb(240, 20, 20);
}
</style>
