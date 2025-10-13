import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { BlockRequest,type Difficulty } from '../models/blockchain'
import { useBlockchainService } from '../services/blockchainService'

export const useBlockchainStore = defineStore('blockchain', {
    state: () => ({
      blockchainService:useBlockchainService(),
      block:new BlockRequest(
        1,
        "0000000000000000000000000000000000000000000000000000000000000000",
        Math.floor(Date.now() / 1000),
        "1f00ffff",
        0,
        "0000000000000000000000000000000000000000000000000000000000000000",
        ["0000000000000000000000000000000000000000000000000000000000000000"],
       ) ,
    }),
    getters: {
    //   getContentByTitleNo:(state)=>{
    //     return (id:number) =>state.contentItems.find(item => item.titleNo === id)
    //   },


    },
    actions: {
      // selectDifficulty(difficulty:Difficulty) {
      //   if (difficulty=="easy"){
      //     this.block.bits="1f0fffff"
      //   }else if(difficulty=="normal"){
      //     this.block.bits="1f00ffff"
      //   }else if(difficulty=="difficult"){
      //     this.block.bits="1e0fffff"
      //   }else if(difficulty=="very difficult"){
      //     this.block.bits="1e00ffff"
      //   }else if(difficulty=="impossible"){
      //     this.block.bits="1d00ffff"
      //   }else{
      //     this.block.bits="1f0fffff"
      //   }
      // },
      
    },
})