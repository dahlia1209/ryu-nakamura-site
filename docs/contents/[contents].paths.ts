import {contentsData} from '../src/data/contents'

export default {
    paths() {
        return contentsData.map(x=>x.titleNo).map(x=>{
            return { params: { contents: x.toString(),title:x.toString()}}
            })
    }
  }