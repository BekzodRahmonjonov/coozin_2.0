<template>
  <div>
    <Loader :active="pending" />
    <div class="main-styles pb-8">
      <!--  Banner  -->
      <div class="container mx-auto py-8 xl:px-0 px-4 lg:block hidden">
        <div class="lg:flex lg:justify-center lg:gap-4">
          <banner-card
            :src="collections[0]?.banner?.url"
            add-style="card-1"
            :status="collections[0]?.name"
            status-style="text-cyan-600 bg-teal-50"
          />
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
              <banner-card
                :src="collections[1]?.banner?.url"
                add-style="card-2"
                :status="collections[1]?.name"
                status-style="text-red-600 bg-red-50"
              />
              <banner-card
                :src="collections[2]?.banner?.url"
                add-style="card-3"
                :status="collections[2]?.name"
                status-style="text-orange-600 bg-orange-50"
              />
            </div>
            <div class="flex items-center gap-4">
              <banner-card
                :src="collections[3]?.banner?.url"
                add-style="card-4"
                :status="collections[3]?.name"
                status-style="text-purple-600 bg-purple-50"
              />
              <banner-card
                :src="collections[4]?.banner?.url"
                add-style="card-5"
                :status="collections[4]?.name"
                status-style="text-green-600 bg-green-50"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="lg:hidden container mx-auto overflow-x-scroll sm:py-6 py-2 xl:px-0 sm:px-4 px-2 scroll-style">
        <div class="flex items-center sm:gap-4 gap-2 w-full">
          <banner-card
            v-for="item in collections"
            :key="item.id"
            :src="item?.banner?.url"
            :status="item.name"
            status-style="text-green-600 bg-green-50"
            add-style="rwd-card flex shrink-0"
          />
        </div>
      </div>

      <!--  Menu section  -->
      <div class="container mx-auto xl:px-0 sm:px-4 px-2 sm:py-8 py-4">
        <div class="flex items-center justify-between">
          <h2 id="menu" class="text-3xl font-semibold text-gray-800">
            <a href="#menu">{{ $t('menu') }}</a>
          </h2>
          <div class="flex items-center gap-1">
            <span class="font-normal text-orange-600 cursor-pointer">{{ $t('see-more') }}</span>
            <the-icon src="right-arrow" />
          </div>
        </div>
      </div>
      <div class="container mx-auto overflow-x-scroll scroll-style xl:px-0 sm:px-4 px-2">
        <div class="flex items-center sm:gap-3.5 gap-2">
          <div v-for="item in $store.state.days_list">
            <menu-card
              :date="item"
              :month="item.month"
              @onDates="onDatesFilter"
            />
          </div>
        </div>
      </div>
      <div class="container mx-auto overflow-x-scroll scroll-style my-3 xl:px-0 sm:px-4 px-2">
        <div class="flex items-center sm:gap-4 gap-2 w-full">
          <category-card
            v-for="item in categories"
            :key="item.id"
            :title="item.name"
            :id="item.id"
            @clickCategories="categoriesFilter"
          />
        </div>
      </div>

      <div class="container mx-auto xl:px-0 sm:px-4 px-2">
        <div class="flex flex-wrap justify-center items-center sm:gap-4 gap-2 w-full">
          <VendorCard
            v-for="(item, idx) in vendorData"
            :key="idx"
            :id="item.id"
            :src="item.src"
            :title="item?.user?.full_name"
            :product-img="item.productImg"
            :avatar="item?.avatar?.small_size_url"
            :rate="item?.ratings_avg"
            :deliveryPrice="item?.delivery_price"
            :count="idx + 1"
          />
        </div>
      </div>

      <button :disabled="isPageCount" @click="pageCount" class="mx-auto mt-3 block py-2 bg-white rounded-lg text-center cursor-pointer sm:w-96 w-72">
        <span class="text-sm text-gray-700">{{ $t('see-more') }}</span>
      </button>

      <!--  Blog section  -->
      <div class="container mx-auto xl:px-0 sm:px-4 px-2 sm:py-6 py-5">
        <div class="flex items-center justify-between">
          <h2 id="blog" class="text-3xl font-semibold text-gray-800">
            <a href="#menu">{{ $t('blog') }}</a>
          </h2>
          <div class="flex items-center gap-1">
            <nuxt-link class="font-normal text-orange-600 cursor-pointer" to="/blog">{{ $t('see-more') }}</nuxt-link>
            <the-icon src="right-arrow" />
          </div>
        </div>
      </div>
      <div class="container mx-auto overflow-x-scroll scroll-style sm:px-0 px-2">
        <div class="flex items-center gap-3.5">
          <div v-for="item in blogCard" :key="item.id">
            <blog-card
              :src="item?.media[0]?.url"
              :title="item.title"
              :avatar="item.vendor.avatar"
            />
          </div>
        </div>
      </div>

      <Loader :active="$store.state.loader" />
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
  export default {
    data() {
      return {
        location: false,
        more: false,
        pending: false,
        menuCard: [],
        vendorData: null,
        isPageCount: false,
        page: 2,
      list: {
          1: null,
          2: null
      },
        locations: null,
        blogCard: [],
        categories: [],
        vendors: [],
        collections: [],
        renderCount: 0,
        limit: 8
      }
    },
    watch: {
      '$route.query': async  function (val) {
        const today= this.$dayjs(new Date()).format('YYYY-MM-DD')
        if (val.day === today) {
          this.$routePush({...this.$route.query, day: undefined})
          await this.getVendors(1)
          await this.getVendors(2)
        }
        await this.getVendors(1)
      }
    },
    async fetch() {
      try {
        await this.getCollection()
        await this.getCategories()
        await this.getDate()
        await this.getVendors()
        await this.getBlogs()
      } catch (err) {
      }
    },
    methods: {
      async getCategories(){
        try {
       const {objects} = await this.$axios.get('categories')
          this.categories = objects;
          this.categories.unshift({id: 'all', name: 'All'})
        } catch (err) {
        }
      },
      async getCollection() {
        try {
          this.pending = true
          const { objects } = await this.$axios.get('collections')
          this.collections = objects
        } catch (err) {}
      },
    async  getVendors() {
      const {objects} = await this.$axios.get('vendors', {
          params: {
              limit: this.limit,
              page: 1,
              ...this.locations,
              day: this.$route.query.day ?? undefined,
              ...this.$route.query
            }
        });
      this.vendorData = objects

      return objects
      },
      async getBlogs() {
        try {
          const { objects } =  await this.$axios.get('reels');
          this.blogCard = objects
        } catch (e) {
        }
      },
      async onDatesFilter (item) {
        this.$routePush({...this.$route.query, day: item.day})
        this.getVendors()
      },
      async getDate () {
        return this.$store.dispatch('set_day').then(res => this.pending = false)
      },
      categoriesFilter (item) {
        console.log(item)
        if (item.category_id === 'all') {
          this.$routePush({...this.$route.query,category_id: undefined})
        } else {
          this.$routePush({...this.$route.query, ...item})
          this.getVendors()
        }
      },
     async pageCount () {
        this.isPageCount = true;
        this.limit += 4
       await this.getVendors()
       this.isPageCount = false;
      }
    },
    computed: {
      ...mapGetters(['get_days_list']),
    },
    mounted() {
      this.location = true;
      this.$bridge.$on('vendor_fetch', async (message) => {
        this.locations = message;
        await this.getVendors()

      })
    }
  }
</script>






<style scoped>
  .scroll-style::-webkit-scrollbar {
    height: 0;
    border-radius: 24px;
  }
  .scroll-style::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .scroll-style::-webkit-scrollbar-thumb {
    background: #888;
  }
  .scroll-style::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  .card-1 {
    width: 312px;
    height: 330px;
  }
  .card-2 {
    width: 384px;
    height: 154px;
  }
  .card-3 {
    width: 488px;
    height: 154px;
  }
  .card-4 {
    width: 472px;
    height: 160px;
  }
  .card-5 {
    width: 400px;
    height: 160px;
  }
  .rwd-card {
    width: 320px;
    height: 180px;
  }
  .main-styles {
    background: #F3F4F6;
  }

  @media screen and (max-width: 1280px) {
    .card-1 {
      width: 280px;
      height: 330px;
    }
    .card-2 {
      width: 360px;
      height: 154px;
    }
    .card-3 {
      width: 460px;
      height: 154px;
    }
    .card-4 {
      width: 450px;
      height: 160px;
    }
    .card-5 {
      width: 370px;
      height: 160px;
    }
  }
  @media screen and (max-width: 1150px) {
    .card-2 {
      width: 340px;
      height: 154px;
    }
    .card-3 {
      width: 440px;
      height: 154px;
    }
    .card-4 {
      width: 430px;
      height: 160px;
    }
    .card-5 {
      width: 350px;
      height: 160px;
    }
  }
  @media screen and (max-width: 1100px) {
    .card-2 {
      width: 330px;
      height: 154px;
    }
    .card-3 {
      width: 430px;
      height: 154px;
    }
    .card-4 {
      width: 420px;
      height: 160px;
    }
    .card-5 {
      width: 340px;
      height: 160px;
    }
  }
  @media screen and (max-width: 1080px) {
    .card-2 {
      width: 325px;
      height: 154px;
    }
    .card-3 {
      width: 415px;
      height: 154px;
    }
    .card-4 {
      width: 405px;
      height: 160px;
    }
    .card-5 {
      width: 325px;
      height: 160px;
    }
  }
  @media screen and (max-width: 1050px) {
    .card-2 {
      width: 315px;
      height: 154px;
    }
    .card-3 {
      width: 400px;
      height: 154px;
    }
    .card-4 {
      width: 390px;
      height: 160px;
    }
    .card-5 {
      width: 315px;
      height: 160px;
    }
  }
  @media screen and (max-width: 500px) {
    .rwd-card {
      width: 280px;
      height: 160px;
    }
  }
</style>
