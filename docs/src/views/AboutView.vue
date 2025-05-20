<script setup lang="ts">
import ContentsList from '../components/HomeContents.vue'
import HomeHeadline from '../components/HomeHeadline.vue'
import HomeTable from '../components/HomeTable.vue'
import {Headline} from '../models/page'
import { useContentStore } from '../stores/content';
import WorkItem from '../components/WorkItem.vue'
import ContentItem from '../components/ContentItem.vue';
import {ref} from 'vue'

const contentStore = useContentStore();

const utility=(()=>{
  const headlines=ref<Headline[]>([])
  const calculateAge=(birthDate: string)=>{
    const today: Date = new Date();
    const birth: Date = new Date(birthDate);
    let age: number = today.getFullYear() - birth.getFullYear();
    const monthDiff: number = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  const pushHeadline=(elem:Headline)=>{
    headlines.value.push(elem)
  }

  //返り値
  return{
    calculateAge,
    pushHeadline,
    headlines
  }
})()

</script>

<template>
  <div class="about">
    <HomeHeadline :headline="new Headline('owner','事業者情報')" @input-by="utility.pushHeadline" />
    <div class="description">
      <HomeTable />
    </div>
  </div>
</template>

<style scoped>
.about {
  flex-direction: column;
  padding: 0 30px;
  margin-bottom: 30px;
}

</style>