export  const state = () => ({
  cartList: null,
  cartItem: null,
  totalPrice: null
})
export const getters = {};
export const mutations = {
  SET_CART_LIST: (state, payload) => {
    state.cartList = payload
  },
  SET_TOTAL_PRICE: (state, payaload) => {
    state.totalPrice = payaload
  },
  SET_CART_ITEM: (state, payload) => {
    state.cartItem = payload
  }
};
export const actions = {
   async getCardList({commit,state}, payload) {
   const {limit} = payload;
  try {
    if (!limit) payload['limit'] = 10;
    const {objects} = await this.$axios.get('cart', {...payload})
    commit('SET_CART_LIST', objects)
    return objects;
  } catch (err) {
    return err;
  }
 },
   async getCardItem({commit}, payload) {
     const {id,latitude,longitude} = payload;
  try {
    const data = await this.$axios.get(`cart/${id}`, {params: {longitude, latitude}})
    commit('SET_CART_ITEM', data)
    return data;
  } catch (err) {
    return err;
  }
 },
   async newOrderCreate ({commit,state, dispatch}, payload) {
    try {
      const data = await this.$axios.post('cart', {...payload})
        await dispatch('getCardList',{limit: 10})
      this.$toast.success('new order item corzina add')
      return data;
    } catch (err) {
      this.$toast.error(err)
    }
  },
   async removeCart({commit,state, dispatch}, payload) {
   try {
     const data = await this.$axios.delete(`cart/${payload}`);
     this.$toast.success('order remove corzina ')
     return data;
   } catch (err) {
     this.$toast.error(err)
   }
   },
   async removeCartItem({commit,state, dispatch}, payload) {
   const {order_id, id, latitude,longitude} = payload;
   try {
     const data = await this.$axios.delete(`cart/item/${id}`);
     this.$toast.success('order item remove corzina ')
     dispatch('getCardItem', {id:order_id, latitude,longitude})
     return data;
   } catch (err) {
     this.$toast.error(err)
   }
   }
};
