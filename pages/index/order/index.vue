<template>
  <div class="main-styles py-8 flex flex-col gap-7">
    <div class="container mx-auto flex items-center gap-3 px-4">
      <nuxt-link to="/">
        <the-icon src="home" />
      </nuxt-link>
      <the-icon src="right-arrow-black" />
      <span class="text-sm font-medium text-gray-500 cursor-pointer">Оформление заказа</span>
    </div>
    <div class="container mx-auto flex gap-9 xl:px-0 xl:flex-nowrap	flex-wrap px-2">
      <ValidationObserver class="w-full" ref="observer" v-slot="{ handleSubmit, invalid }">
      <form novalidate class="bg-white w-full p-6 rounded-2xl" @submit.prevent="handleSubmit(orderCreate)">
        <h1 class="font-semibold text-gray-800 text-2xl">Оформление заказа</h1>
        <div class="px-3 pt-5 flex xl:justify-between justify-center gap-4 lg:flex-nowrap flex-wrap">
          <div>
            <ValidationProvider
              v-slot='{ errors }'
              name='address'
              rules='required'
              mode='eager'
            >
              <div class="flex items-end sm:gap-2.5 gap-1.5 justify-between">
                <the-input
                  styles="flex flex-col gap-3 input-styles"
                  :label-styles="errors.length ? 'font-medium text-red-500' : 'font-medium text-gray-700' "
                  :input-styles="errors.length ? 'sm:w-80 w-64 border-red-500 border-2' : 'sm:w-80 w-64'"
                  type="text"
                  icon="location"
                  name="address"
                  :label="'Адрес доставки'"
                  placeholder="улица Матонат, 35"
                  :value="order.address"
                />
                <div class="map-card" @click="openMaps">
                  <the-icon src="map" />
                </div>
              </div>
            </ValidationProvider>
            <ValidationProvider
              v-slot='{ errors }'
              name='delivery_time'
              rules='required'
              mode='eager'
            >
              <div class="flex flex-col gap-3 input-styles sm:w-96 w-80 input-400 mt-6">

                <label for="dilevery-time" :class="errors.length ? 'text-red-500' : ''" class="font-medium text-gray-700">Время доставки</label>

                <div class="relative">
                  <select
                    class="bg-white w-full text-gray-500 border rounded-2xl border-gray-200 py-2.5 pr-2 pl-11 text-base h-12 outline-orange-600"
                    :class="{'border-red-500 border-2': errors.length, 'bg-gray-200': isAdders}"
                    id="dilevery-time"
                    name="dilevery-time"
                    :disabled="isAdders"
                    style="-webkit-appearance: none;"
                    v-model="order.delivery_time"
                  >
                    <option v-for="(item, index) in timeList" :value="item" :key="index">{{item}}</option>

                  </select>
                  <img class="absolute position" src="../../../assets/svg/clock-gray.svg" alt="Input icon" >
                  <img class="absolute position-rigth" src="../../../assets/svg/arrow-bottom.svg" alt="Arrow icon">
                </div>

              </div>
            </ValidationProvider>
            <ValidationProvider
              v-if="isCardOpen"
              v-slot='{ errors }'
              name='card_id'
              rules='required'
              mode='eager'
            >
              <div class="flex flex-col gap-3 input-styles sm:w-96 w-80 input-400 mt-6">
                <label for="payment_type" :class="errors.length ? 'text-red-500' : ''" class="font-medium text-gray-700">Мои карты</label>
               <div class="flex gap-2">
                 <div class="relative w-full">
                   <select
                     class="bg-white w-full text-gray-500 border rounded-2xl border-gray-200 py-2.5 pr-2 pl-11 text-base h-12 outline-orange-600"
                     id="payment_type"
                     :class="errors.length ? 'border-red-500 border-2' : ''"
                     name="payment_typee"
                     v-model="order.card_id"
                     style="-webkit-appearance: none;"
                   >
                     <option v-for="(item, ind) in cardList" :key="ind" :value="item.value">{{item.label}}</option>
                   </select>
                   <img class="absolute position" src="../../../assets/svg/cash.svg" alt="Input icon" >
                   <img class="absolute position-rigth" src="../../../assets/svg/arrow-bottom.svg" alt="Arrow icon">
                 </div>
                 <div class="map-card" @click="addCardModalOpen">
                   <the-icon src="plus" />
                 </div>
               </div>
              </div>
            </ValidationProvider>
<!--            </form>-->


          </div>
          <div>
            <the-input
              styles="flex flex-col gap-3 w-full"
              label-styles="font-medium text-gray-700"
              input-styles="sm:w-96 w-80 input-400"
              type="text"
              icon="office"
              name="address"
              label="Ориентир"
              placeholder="улица Матонат, 35"
              :v-model="order.address_comment"
            />
            <ValidationProvider
            v-slot='{ errors }'
            name='payment_type'
            rules='required'
            mode='eager'
          >
            <div class="flex flex-col gap-3 input-styles sm:w-96 w-80 input-400 mt-6">
              <label for="payment_type" :class="errors.length ? 'text-red-500' : ''" class="font-medium text-gray-700">Способ оплаты</label>
              <div class="relative">
                <select
                  class="bg-white w-full text-gray-500 border rounded-2xl border-gray-200 py-2.5 pr-2 pl-11 text-base h-12 outline-orange-600"
                  id="payment_type"
                  :class="{'border-red-500 border-2': errors.length, 'bg-gray-200': isAdders}"
                  name="payment_typee"
                  :disabled="isAdders"
                  v-model="order.payment_type"
                  style="-webkit-appearance: none;"
                >
                  <option v-for="(item, ind) in paymentType" :key="ind" :value="item.value">{{$t(item.label)}}</option>
                </select>
                <img class="absolute position" src="../../../assets/svg/cash.svg" alt="Input icon" >
                <img class="absolute position-rigth" src="../../../assets/svg/arrow-bottom.svg" alt="Arrow icon">
              </div>
            </div>
            </ValidationProvider>

          </div>

        </div>
        <div class="px-3 pt-5 flex xl:justify-between justify-center gap-4 lg:flex-nowrap flex-wrap">
          <div class="flex items-center justify-between sm:w-96 w-80 input-400">
            <div class="flex items-center justify-center gap-3">
              <h3>Повторный заказ</h3>
              <the-icon src="information-circle" width="20" height="20" />
            </div>
            <div class="container-switch">
              <input type="checkbox" name="" id="switch">
              <label for="switch">
                <div class="switch">
                  <div class="bar"></div>
                </div>
              </label>
            </div>
          </div>
          <div class="max-w-sm overflow-x-scroll scroll-style">
            <div class="sm:flex hidden items-center gap-3.5">
              <div v-for="item in $store.state.days_list">
                <menu-card
                  :date="item"
                  @onDates="setDateSelect"
                />
              </div>
            </div>
            <div class="sm:hidden flex items-center gap-3.5">
              <div v-for="item in $store.state.days_list">
                <menu-card
                  :date="item"
                  :variant="true"
                  @onDates="setDateSelect"
                />
                <!--                {{$store.state.days_list}}-->
              </div>
            </div>
          </div>
        </div>
        <div class="sm:w-96 w-full xl:m-0 mx-auto my-2">
          <h3 class="text-lg font-semibold text-gray-700">К оплате</h3>
          <div class="flex justify-between">
            <h4 class="text-gray-600">Блюда</h4>
            <h4 class="font-medium text-gray-600">{{$store.state.cart.cartItem.total_price}} сум</h4>
          </div>
          <div class="flex justify-between my-2">
            <h4 class="text-gray-600">Доставка</h4>
            <h4 class="font-medium text-gray-600"> {{$store.state.cart?.cartItem?.delivery_price ? $store.state.cart.cartItem.delivery_price : ' 10 000 +' }} сум</h4>
          </div>
          <div class="flex justify-between">
            <h4 class="font-bold text-gray-600">Итого</h4>
            <h4 v-if="$store.state.cart?.cartItem?.delivery_price !== null" class="font-bold text-gray-600">{{Number($store.state.cart.cartItem.delivery_price)+Number($store.state.cart.cartItem.total_price) }} сум</h4>
            <h4 v-else class="font-bold text-gray-600">{{Number($store.state.cart.cartItem.total_price)+10000 +"+" }} сум</h4>
          </div>
        </div>
        <button type="submit" class="w-full bg-gray-300 h-12 rounded-3xl text-gray-400 font-semibold mt-12 cursor-pointer">Оплатить</button>
      </form>
      </ValidationObserver>
<!--      my order list -->
      <div class="bg-white xl:w-80 w-full rounded-2xl px-2 py-4 flex flex-col gap-3 shrink-0">
        <h2 class="font-semibold text-gray-800 text-2xl mx-2">Ваш заказ</h2>
        <div class="flex flex-col gap-3 overflow-y-scroll scroll-style pl-2 pr-4" style="max-height: 516px;">
          <div v-for="item in $store.state.cart?.cartItem?.items">
            <div class="flex gap-4">
              <div class="w-24 h-24 overflow-hidden border border-gray-100 rounded-lg">
                <img class="w-full" src="../../../assets/img/img-1.jpg" alt="Food Image">
              </div>
              <div class="flex flex-col gap-1">
                <h4 class="font-normal text-gray-700">{{item.food.name}}</h4>
                <h4 class="font-bold text-gray-700">{{item.quantity}}х{{item.food.price}} сум</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <the-modal-maps @changePlice="changePlice"></the-modal-maps>
    <cards-form-modal :fetach="getMyCard" />
  </div>
</template>

<script>
import cardsFormModal from "@/components/card-modal/cards-form-modal";
export default {
  components: {
    cardsFormModal
  },
  data() {
    return {
      paymentType: [
        {value: 'cash', label: 'cash'},
        {value: 'card', label:'card'},
        {value: 'balance', label:'balance'},
      ],
      isAdders: true,
      timeList: [],
      order: {
        additional_name: this.$auth.state.user.full_name,
        additional_phone: this.$auth.state.user.phone,
        address: '',
        address_comment: "",
        comment: this.$route.query.comment_text ?? '',
        delivery_time: null,
        latitude: null,
        longitude: null,
        payment_type: "",
        card_id: null,
        user_address_id: null,
        promocode: null,
        voucher: null,
      },
      cardList: [],
      isCardOpen: false
    }
  },
  async fetch () {
    await this.getOrderItem()
    await this.getDate()
  },
 async mounted() {
    if(this.$store.state.location.longitude) {
      await this.orderTimeDelever()
    }
  },
  watch: {
    'order.payment_type': function (val) {
      if (val === 'card') {
        this.isCardOpen = true;
        this.getMyCard()
      }
    }
  },
  methods: {
   async changePlice(item) {
     this.order.address = item.fullName;
     this.order.latitude =item.getNames[0].latitude;
     this.order.longitude = item.getNames[0].longitude;
     await this.getOrderItem(item?.getNames[0]?.longitude,item?.getNames[0]?.latitude);
     await this.orderTimeDelever()
     this.isAdders = false;
    },
    addCardModalOpen () {
      this.$routePush({...this.$route.query, cardAdd: 'cardAdd'})
    },
    openMaps () {
      this.$routePush({...this.$route.query,maps: 'maps'})
      // this.$store.dispatch('yandex/mapModalOpen', true)
    },
   async orderCreate () {
     try {
       this.order['food'] = this.$store.state.cart?.cartItem?.items?.map(el => ({id: el.food.id, count: el.quantity}))
       const data = await this.$axios.post('orders', {...this.order})
       if (data.id) {
             this.$router.push({path: this.localePath('/my-orders')})
             this.$toast.success('new order create', {duration: 3000})
       } else {
         this.checkError(data)
       }
     } catch (err) {}
    },
    checkError(res) {
      const {delivery_time, address, geolocation} = res.errors;
      if (delivery_time) this.$toast.error(delivery_time[0], {duration: 4000})
      if (address) this.$toast.error(address[0], {duration: 3000})
      if (geolocation) this.$toast.error(geolocation[0], {duration: 3000})
    },
    async getDate () {
      return this.$store.dispatch('set_day')
    },
    setDateSelect (item) {
      console.log(item.day)
      this.orderTimeDelever(item.day)
      // this.order.delivery_time = item.date
    },
   async getMyCard () {
      try {
        try{
          await this.$store.dispatch('cards/getCards')
            .then(res => {
              this.cardList = res.map((el) => {
                return {
                  label: el.card_number,
                  value: el.id
                }
              })
            })
        } catch (err) {}
        // const {objects} = await this.$axios.get('cards');
      } catch (err) {
        console.log(err)
      }
   },
    async getOrderItem (longitude,latitude) {
      await this.$store.dispatch('cart/getCardItem',
        this.lotLang(longitude, latitude))
    },
    lotLang(longitude,latitude) {
    return   {id: this.$route.query.order_id,
        longitude: longitude ?? this.$store.state.location.longitude,
        latitude: latitude ?? this.$store.state.location.latitude}
    },
    async orderTimeDelever (date) {
      let data = {
        food: this.$store.state.cart?.cartItem?.items?.map(el => ({id: el.food.id, count: el.quantity})),
        latitude: this.order.latitude,
        longitude: this.order.longitude,
        date_calc: date
      }
      const getData = await this.$store.dispatch('orderCarzina/order_deleveriy_time', {...data})
      this.timeGenert(getData.preparation)
      this.order.delivery_time = getData.preparation;
    },
   timeGenert (arr) {
    this.timeList = [];
      this.timeList.push(arr)
      for (let i=0; i<5; i++) {
         this.timeList.push(this.$dayjs(this.timeList[this.timeList.length-1]).add(10,'m').format('YYYY-MM-DD HH:mm:ss'))
      };

    }
  }
}
</script>

<style scoped>
  .scroll-style::-webkit-scrollbar {
    height: 0;
    width: 3px;
    border-radius: 24px;
  }
  .scroll-style::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .scroll-style::-webkit-scrollbar-thumb {
    background: #bcbcbc;
  }
  .scroll-style::-webkit-scrollbar-thumb:hover {
    background: #a4a4a4;
  }

  .main-styles {
    background: #F3F4F6;
  }
  .map-card {
    background: #FFFFFF;
    box-shadow: -3px -2px 20px -10px rgba(0, 0, 0, 0.19), 0px 4px 7px -1px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .position {
    top: 50%;
    transform: translate(0, -50%);
    left: 12px;
  }
  .position-rigth {
    top: 50%;
    transform: translate(0, -50%);
    right: 12px;
  }


  .container-switch input[type="checkbox"] {
    display: none;
  }

  .container-switch label .switch {
    background: linear-gradient(90deg, #fd9657 0%, #EA580C 100%);
    width: 36px;
    height: 20px;
    border-radius: 50px;
    padding: 1.5px;
    position: relative;
    border: 2px #fff solid;
  }

  .container-switch input[type="checkbox"] + label .bar {
    background: linear-gradient(90deg, #ffffff 0%, #ffffff 100%);
    height: 14px;
    width: 14px;
    border-radius: 50px;
    transition: all 0.3s ease-in-out;
  }
  .container-switch input[type="checkbox"]:checked + label .bar {
    background: linear-gradient(90deg, #ffffff 0%, #ffffff 100%);
    /* margin-left: auto; */
    transform: translateX(16px);
  }

  .container-switch label:active .bar {
    /* background-color: red; */
    box-shadow: 0px 0px 0px 15px rgba(0, 0, 0, 0.322);
  }

  @media screen and (max-width: 400px) {
    .input-400 {
      width: 300px !important;
    }
  }
</style>
