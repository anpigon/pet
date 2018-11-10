<template>
  <v-layout column>
    <v-subheader class='subheader title'>연구 중인 스팀잇 펫</v-subheader>
    <v-layout>
      <template v-for="pet in pets">
        <v-flex xs6 md6 lg4 :key="pet.id" class="pet-item">
          <PetPanel :pet="pet" :logPet="logPet" :appid="appid"></PetPanel>
        </v-flex>
      </template>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PetsPanel',
  props: ['logPet', 'appid'],
  components: {
    PetPanel: () => (import('@/components/panels/PetPanel')),
  },
  computed: {
    ...mapState('pets', ['pets']),
  },
};
</script>

<style>
.triangle-border {
  z-index: 1;
  height: 80px;
  position:relative;
  padding:15px;
  margin:1em 0 3em;
  border:5px solid #5a8f00;
  color:#333;
  background:#fff;
  /* css3 */
  -webkit-border-radius:10px;
  -moz-border-radius:10px;
  border-radius:10px;
}
.triangle-border:before {
  content:"";
  position:absolute;
  bottom:-20px; /* value = - border-top-width - border-bottom-width */
  left:40px; /* controls horizontal position */
  border-width:20px 20px 0;
  border-style:solid;
  border-color:#5a8f00 transparent;
  /* reduce the damage in FF3.0 */
  display:block;
  width:0;
}
.triangle-border:after {
  content:"";
  position:absolute;
  bottom:-13px; /* value = - border-top-width - border-bottom-width */
  left:47px; /* value = (:before left) + (:before border-left) - (:after border-left) */
  border-width:13px 13px 0;
  border-style:solid;
  border-color:#fff transparent;
  /* reduce the damage in FF3.0 */
  display:block;
  width:0;
}
.pet-image {
  margin-top: -30px;
  /* margin-bottom: -5px; */
  vertical-align: middle;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.pet-name {
  z-index: 10;
  color: white;
  font-weight: 900;
}
.pet-info .pet-image {
  position: relative;
}
.star {
  position: absolute;
  color: white;
  font-weight: 900;
  bottom: 10px;
  text-rendering: geometricPrecision;
  text-shadow: 2px 2px #333;
}
@keyframes fade-in {
  0% {opacity:0;}
  25% {opacity:0.25;}
  50% {opacity:0.5;}
  75% {opacity:0.75;}
  100% {opacity:1;}
}
@keyframes scale {
  from { transform: scale(0.9); }
  to { transform: scale(1); }
}
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
.scale-animaion {
  animation-name: scale;
  animation-duration: 0.1s;
  /* animation-iteration-count: infinite; */
  /* animation-direction: reverse; */
  animation-timing-function: linear;
  animation-fill-mode: none;
  animation-delay: 0s;
}
.shake-animaion {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@media (max-width: 1105px) {
  .pet-item:nth-child(3) {
    display: none;
  } 
}
</style>
